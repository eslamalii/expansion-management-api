import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { Vendor } from '../vendors/entities/vendor.entity';
import { Repository, DataSource } from 'typeorm';
import { Match } from './entities/match.entity';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class MatchesService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    @InjectRepository(Match)
    private readonly matchRepository: Repository<Match>,
    private dataSource: DataSource,
    private readonly notificationService: NotificationsService,
  ) {}

  async rebuildMatchesForProject(projectId: number): Promise<Match[]> {
    const project = await this.projectRepository.findOne({
      where: { id: projectId },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException('Project not found');
    }

    const potentialVendors = await this.vendorRepository
      .createQueryBuilder('vendor')
      .where('JSON_CONTAINS(vendor.countries_supported, :country)', {
        country: JSON.stringify(project.country),
      })
      .getMany();

    const newMatches: Partial<Match>[] = [];
    for (const vendor of potentialVendors) {
      const servicesOverlapCount = this.calculateServicesOverlap(
        project.services_needed,
        vendor.services_offered,
      );

      if (servicesOverlapCount > 0) {
        const score = this.calculateScore(
          servicesOverlapCount,
          vendor.rating,
          vendor.response_sla_hours,
        );

        newMatches.push({
          project: project,
          vendor: vendor,
          score: score,
        });
      }
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.manager.delete(Match, { project: { id: projectId } });
      const savedMatches = await queryRunner.manager.save(Match, newMatches);
      await queryRunner.commitTransaction();

      if (project.client) {
        for (const match of savedMatches) {
          await this.notificationService.queueNewMatchEmail(
            project.client,
            match,
          );
        }
      }
      return savedMatches;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private calculateServicesOverlap(
    needed: string[],
    offered: string[],
  ): number {
    const neededSet = new Set(needed);
    return offered.filter((service) => neededSet.has(service)).length;
  }

  private calculateScore(
    servicesOverLap: number,
    rating: number,
    slaHours: number,
  ): number {
    const slaWeight = this.getSlaWeight(slaHours);
    return servicesOverLap * 2 + rating + slaWeight;
  }

  private getSlaWeight(slaHours: number): number {
    if (slaHours <= 12) return 3;
    if (slaHours <= 24) return 2;
    if (slaHours <= 48) return 1;
    return 0;
  }

  async findMatchesByProject(projectId: number): Promise<Match[]> {
    return this.matchRepository.find({
      where: { project: { id: projectId } },
      relations: ['vendor'],
      order: { score: 'DESC' },
    });
  }
}
