import { Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Match } from '../matches/entities/match.entity';
import { Project } from '../projects/entities/project.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { DocumentSchema } from '../documents/schemas/document.schema';

@Module({
  imports: [
    TypeOrmModule.forFeature([Match, Project]),
    MongooseModule.forFeature([
      {
        name: Document.name,
        schema: DocumentSchema,
      },
    ]),
  ],
  providers: [AnalyticsService],
  controllers: [AnalyticsController],
})
export class AnalyticsModule {}
