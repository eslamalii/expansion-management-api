import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateDocumentDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  @IsNotEmpty()
  projectId: string;
}
