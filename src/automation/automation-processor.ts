import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { In, Not, Repository } from 'typeorm';
import { MatchesService } from '../matches/matches.service';
import { Job } from 'bullmq';
import { Vendor, VendorStatus } from '../vendors/entities/vendor.entity';
import { MatchStatus } from '../matches/entities/match.entity';

@Processor('automation-queue')
export class AutomationProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    @InjectRepository(Vendor)
    private readonly vendorRepository: Repository<Vendor>,
    private readonly matchesService: MatchesService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'refresh-all-matches-job':
        await this.handleRefreshAllMatches();
        await this.handleSlaMonitoring();
      default:
        console.warn(`No handler for job type: ${job.name}`);
        return null;
    }
  }

  private async handleRefreshAllMatches() {
    console.log(
      'Starting daily job: Refreshing matches for all active projects...',
    );

    const activeProjects = await this.projectRepository.find({
      where: { status: ProjectStatus.ACTIVE },
    });

    if (activeProjects.length === 0) {
      console.log('No active projects found. Job complete.');
      return;
    }

    console.log(`Found ${activeProjects.length} active projects to process.`);

    for (const project of activeProjects) {
      try {
        console.log(`Rebuilding matches for project #${project.id}...`);
        await this.matchesService.rebuildMatchesForProject(project.id);
        console.log(`Successfully rebuilt matches for project #${project.id}.`);
      } catch (error) {
        console.error(
          `Failed to rebuild matches for project #${project.id}`,
          error,
        );
      }
    }

    console.log('Daily match refresh job finished.');
  }

  private async handleSlaMonitoring() {
    const overdueVendorIdsQuery = this.vendorRepository
      .createQueryBuilder('vendor')
      .select('DISTINCT vendor.id', 'id')
      .innerJoin('vendor.matches', 'match')
      .where('match.status = :status', { status: MatchStatus.PENDING })
      .andWhere(
        'match.create_at <= DATE_SUB(NOW()) - INTERVAL vendor.response_sla_hours HOUR',
      );

    const overDueVendors = await overdueVendorIdsQuery.getRawMany();
    const overdueVendorIds = overDueVendors.map((v) => v.id);

    if (overdueVendorIds.length > 0) {
      await this.vendorRepository.update(
        { id: In(overdueVendorIds) },
        { status: VendorStatus.FLAGGED },
      );
    }

    await this.vendorRepository.update(
      {
        status: VendorStatus.FLAGGED,
        id: Not(In(overdueVendorIds.length > 0 ? overdueVendorIds : [0])),
      },
      {
        status: VendorStatus.ACTIVE,
      },
    );
  }
}
