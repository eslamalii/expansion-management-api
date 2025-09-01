import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentDocument, ResearchDocument } from './schemas/document.schema';
import { FilterQuery, Model } from 'mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { Repository } from 'typeorm';
import { CreateDocumentDto } from './dtos/create.dto';
import { QueryDocumentDto } from './dtos/query.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(ResearchDocument.name)
    private documentModel: Model<ResearchDocument>,
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(
    createDocumentDto: CreateDocumentDto,
  ): Promise<ResearchDocument> {
    const projectExists = await this.projectRepository.findOne({
      where: { id: Number(createDocumentDto.projectId) },
    });

    if (!projectExists) {
      throw new NotFoundException('Project not found');
    }

    const newDocument = new this.documentModel(createDocumentDto);
    return newDocument.save();
  }

  async search(queryDto: QueryDocumentDto): Promise<ResearchDocument[]> {
    const filter: FilterQuery<DocumentDocument> = {};

    if (queryDto.projectId) {
      filter.projectId = queryDto.projectId;
    }

    if (queryDto.tag) {
      filter.tags = { $in: [queryDto.tag] };
    }

    if (queryDto.text) {
      filter.$text = { $search: queryDto.text };
    }

    return this.documentModel.find(filter).exec();
  }
}
