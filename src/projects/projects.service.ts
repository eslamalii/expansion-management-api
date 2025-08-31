import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { Client } from '../clients/entities/client.entity';
import { CreateProjectDto } from './dtos/create.dto';
import { UpdateProjectDto } from './dtos/update.dto';
import { Role } from '../constants/roles';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectsRepository: Repository<Project>,
    @InjectRepository(Client)
    private clientsRepository: Repository<Client>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const { clientId, ...projectData } = createProjectDto;

    const client = await this.clientsRepository.findOne({
      where: { id: clientId },
    });

    if (!client) {
      throw new NotFoundException(`Client with ID ${clientId} not found`);
    }

    const project = this.projectsRepository.create({
      ...projectData,
      client,
    });

    return this.projectsRepository.save(project);
  }

  findAllForUser(user: Client): Promise<Project[]> {
    if (user.role.includes(Role.Admin)) {
      return this.projectsRepository.find({ relations: ['client'] });
    }

    return this.projectsRepository.find({
      where: { client: { id: user.id } },
      relations: ['client'],
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectsRepository.findOne({
      where: { id },
      relations: ['client'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(
    id: number,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    const project = await this.projectsRepository.preload({
      id: id,
      ...updateProjectDto,
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return this.projectsRepository.save(project);
  }

  async remove(id: number): Promise<{ message: string }> {
    const project = await this.findOne(id);
    await this.projectsRepository.remove(project);
    return { message: `Project with ID ${id} has been removed` };
  }
}
