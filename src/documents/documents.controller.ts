import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dtos/create.dto';
import { QueryDocumentDto } from './dtos/query.dto';

@Controller('documents')
@UseGuards(AuthGuard('jwt'))
export class DocumentsController {
  constructor(private readonly documentService: DocumentsService) {}

  @Post('upload')
  upload(@Body() createDocumentDto: CreateDocumentDto) {
    return this.documentService.create(createDocumentDto);
  }

  @Get('search')
  search(@Query() queryDto: QueryDocumentDto) {
    return this.documentService.search(queryDto);
  }
}
