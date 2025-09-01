import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { Mailer, MAILER_TOKEN } from '../email/email.service';

@Processor('notification-queue')
export class NotificationProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationProcessor.name);

  constructor(@Inject(MAILER_TOKEN) private readonly mailer: Mailer) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`🔄 Processing job: ${job.name} (ID: ${job.id})`);

    switch (job.name) {
      case 'send-match-email-job':
        return this.mailer.sendNewMatchEmail(job.data);
      default:
        this.logger.warn(`No handler for job name: ${job.name}`);
    }
  }
}
