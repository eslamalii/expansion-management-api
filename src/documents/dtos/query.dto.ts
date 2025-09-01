import { IsOptional, IsString } from 'class-validator';

export class QueryDocumentDto {
  @IsOptional()
  @IsString()
  tag?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  text?: string;
}
