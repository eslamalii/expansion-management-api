import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Document, Model } from 'mongoose';
import { Match } from '../matches/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { Repository } from 'typeorm';
import { AnalyticsResultDto } from './dtos/analyticsResult.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectModel(Document.name)
    private readonly documentModel: Model<Document>,
  ) {}

  async getTopVendorsByCountry(): Promise<AnalyticsResultDto[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const topVendorsData: any[] = await this.matchRepository.query(
      `
      SELECT
        RankedVendors.vendorId,
        RankedVendors.vendorName,
        RankedVendors.country,
        RankedVendors.averageScore
      FROM (
          SELECT
              v.id AS vendorId,
              v.name AS vendorName,
              p.country,
              AVG(m.score) AS averageScore,
              ROW_NUMBER() OVER (PARTITION BY p.country ORDER BY AVG(m.score) DESC) AS vendor_rank
          FROM \`match\` m
          INNER JOIN \`vendor\` v ON v.id = m.vendorId
          INNER JOIN \`project\` p ON p.id = m.projectId
          WHERE m.create_at >= ?
          GROUP BY v.id, v.name, p.country
      ) AS RankedVendors
      WHERE RankedVendors.vendor_rank <= 3;
    `,
      [thirtyDaysAgo],
    );
    if (topVendorsData.length === 0) {
      return [];
    }

    const countries = [...new Set(topVendorsData.map((data) => data.country))];

    const projectsInCountries = await this.projectRepository
      .createQueryBuilder('project')
      .where('project.country IN (:...countries)', { countries })
      .getMany();

    const projectIds = projectsInCountries.map((project) => project.id);
    const projectIdToCountryMap = new Map<number, string>();

    const docCountsPerProject = await this.documentModel.aggregate([
      { $match: { projectId: { $in: projectIds } } },
      { $group: { _id: '$projectId', docCount: { $sum: 1 } } },
    ]);

    const docCountsByCountry = new Map<string, number>();
    for (const docCount of docCountsPerProject) {
      const projectId = docCount._id;
      const country = projectIdToCountryMap.get(projectId);
      if (country) {
        const currentCount = docCountsByCountry.get(country) || 0;
        docCountsByCountry.set(country, currentCount + docCount.docCount);
      }
    }

    const analyticsMap = new Map<string, AnalyticsResultDto>();

    for (const vendor of topVendorsData) {
      const country = vendor.country;
      if (!analyticsMap.has(country)) {
        analyticsMap.set(country, {
          country,
          researchDocumentsCount: docCountsByCountry.get(country) || 0,
          topVendors: [],
        });
      }

      const countryAnalytics = analyticsMap.get(country);
      if (countryAnalytics) {
        countryAnalytics.topVendors.push({
          vendorId: vendor.vendorId,
          vendorName: vendor.vendorName,
          averageScore: parseFloat(vendor.averageScore),
        });
      }
    }
    return Array.from(analyticsMap.values());
  }
}
