import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class AutomationService implements OnModuleInit {
  constructor(
    @InjectQueue('automation-queue') private readonly automationQueue: Queue,
  ) {}

  async onModuleInit() {
    const jobName = 'refresh-all-matches-job';
    const repeatOptions = {
      pattern: '0 */12 * * *', // Every 12 hours
    };
    const jobId = 'daily-match-refresh';

    // NOTE: removeRepeatable() is deprecated in newer BullMQ version
    // Keeping current implementation for compatibility
    // BullMq uses removeJobScheduler
    const removed = await this.automationQueue.removeRepeatable(
      jobName,
      repeatOptions,
      jobId,
    );

    if (removed) {
      console.log('Removed old repeatable job to prevent duplicates.');
    }

    await this.automationQueue.add(
      jobName,
      {},
      {
        repeat: repeatOptions,
        jobId: jobId,
      },
    );
  }
}
