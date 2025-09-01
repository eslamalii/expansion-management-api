import { InjectQueue } from '@nestjs/bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Client } from '../clients/entities/client.entity';
import { Match } from '../matches/entities/match.entity';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  constructor(
    @InjectQueue('notification-queue')
    private readonly notificationQueue: Queue,
  ) {}

  async queueNewMatchEmail(client: Client, match: Match): Promise<void> {
    const jobName = 'send-match-email-job';
    const payload = {
      clientEmail: client.contact_email,
      clientName: client.company_name,
      projectId: match.project.id,
      vendorName: match.vendor.name,
      matchScore: match.score,
    };

    this.logger.log(
      `Adding job '${jobName}' to queue for client: ${client.contact_email}`,
    );

    await this.notificationQueue.add(jobName, payload, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000,
      },
    });
  }
}
