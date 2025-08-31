import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';

export class CreateProjectDto {
  @IsNotEmpty()
  @IsNumber()
  clientId: number;

  @IsNotEmpty()
  @IsString()
  country: string;

  @IsArray()
  @IsString({ each: true })
  services_needed: string[];

  @IsNumber()
  @IsPositive()
  budget: number;

  @IsEnum(ProjectStatus)
  status: ProjectStatus = ProjectStatus.ACTIVE;
}
