import { Processor, WorkerHost } from '@nestjs/bullmq';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, ProjectStatus } from '../projects/entities/project.entity';
import { Repository } from 'typeorm';
import { MatchesService } from '../matches/matches.service';
import { Job } from 'bullmq';

@Processor('automation-queue')
export class AutomationProcessor extends WorkerHost {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
    private readonly matchesService: MatchesService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    console.log(`Processing job ${job.id} of type ${job.name}`);

    switch (job.name) {
      case 'refresh-all-matches-job':
        return this.handleRefreshAllMatches();
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
}
