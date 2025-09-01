import { Module } from '@nestjs/common';
import { AutomationService } from './automation.service';
import { BullModule } from '@nestjs/bullmq';
import { AutomationProcessor } from './automation-processor';
import { MatchesModule } from '../matches/matches.module';
import { ProjectsModule } from '../projects/projects.module';
import { VendorsModule } from '../vendors/vendors.module';

@Module({
  imports: [
    BullModule.registerQueue({ name: 'automation-queue' }),
    MatchesModule,
    ProjectsModule,
    VendorsModule,
  ],
  providers: [AutomationService, AutomationProcessor],
})
export class AutomationModule {}
