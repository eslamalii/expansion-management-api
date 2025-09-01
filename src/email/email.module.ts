import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MAILER_TOKEN } from './email.service';
import { NodemailerService } from './nodemailer.service';

@Module({
  providers: [
    {
      provide: MAILER_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const provider = configService.get<string>(
          'EMAIL_PROVIDER',
          'nodemailer',
        );

        switch (provider) {
          case 'nodemailer':
            return new NodemailerService(configService);
          default:
            throw new Error(`Unsupported email provider: ${provider}`);
        }
      },
    },
  ],
  exports: [MAILER_TOKEN],
})
export class EmailModule {}
