import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Mailer, NewMatchEmailData } from './email.service';

@Injectable()
export class NodemailerService implements Mailer {
  private readonly logger = new Logger(NodemailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private readonly configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<number>('SMTP_PORT') === 465,
      auth: {
        user: this.configService.get<string>('SMTP_USER'),
        pass: this.configService.get<string>('SMTP_PASS'),
      },
    });
  }

  async sendNewMatchEmail(data: NewMatchEmailData): Promise<void> {
    const { clientEmail, clientName, projectId, vendorName, matchScore } = data;
    const fromAddress = this.configService.get<string>('SMTP_FROM_EMAIL');

    this.logger.log(
      `Sending new match email to ${clientEmail} via Nodemailer...`,
    );

    try {
      await this.transporter.sendMail({
        from: `"Expansion Platform" <${fromAddress}>`,
        to: clientEmail,
        subject: `New High-Potential Vendor Match for Project #${projectId}!`,
        html: `
          <h1>New Vendor Match Found!</h1>
          <p>Hi ${clientName},</p>
          <p>We've found a new potential vendor for your project: <strong>#${projectId}</strong>.</p>
          <ul>
              <li><strong>Vendor:</strong> ${vendorName}</li>
              <li><strong>Match Score:</strong> ${matchScore}</li>
          </ul>
          <p>Log in to your dashboard to review the details.</p>
          <p>Thanks,<br>The Expansion Platform Team</p>
        `,
      });
      this.logger.log(`Email successfully sent to ${clientEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${clientEmail}`, error.stack);
      throw error;
    }
  }
}
