import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dtos/create.dto';
import { UpdateProjectDto } from './dtos/update.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { Request } from 'express';
import { Client } from '../clients/entities/client.entity';
import { Role } from '../constants/roles';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('projects')
@UseGuards(AuthGuard('jwt'), RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req: Request) {
    const user = req.user as Client;

    if (
      user.role.includes(Role.Client) &&
      user.id !== createProjectDto.clientId
    ) {
      throw new ForbiddenException(
        'Clients can only create projects for themselves.',
      );
    }
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Req() req: Request) {
    const user = req.user as Client;
    return this.projectsService.findAllForUser(user);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const user = req.user as Client;

    const project = await this.projectsService.findOne(id);

    if (user.role.includes(Role.Client) && project.client.id !== user.id) {
      throw new ForbiddenException('Access to this project is forbidden.');
    }

    return project;
  }

  @Patch(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateProjectDto: UpdateProjectDto,
    @Req() req: Request,
  ) {
    const user = req.user as Client;
    const project = await this.projectsService.findOne(id);

    if (user.role.includes(Role.Client) && project.client.id !== user.id) {
      throw new ForbiddenException('Access to this project is forbidden.');
    }

    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.projectsService.remove(id);
  }
}
