import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentSchema, ResearchDocument } from './schemas/document.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ResearchDocument.name, schema: DocumentSchema },
    ]),
    TypeOrmModule.forFeature([Project]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
})
export class DocumentsModule {}
