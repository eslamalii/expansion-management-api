import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MatchesService } from './matches.service';

@Controller('matches')
@UseGuards(AuthGuard('jwt'))
export class MatchesController {
  constructor(private readonly matchesService: MatchesService) {}

  @Post('/project/:projectId/rebuild')
  rebuildMatches(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.matchesService.rebuildMatchesForProject(projectId);
  }

  @Get('/project/:projectId')
  getMatches(@Param('projectId', ParseIntPipe) projectId: number) {
    return this.matchesService.findMatchesByProject(projectId);
  }
}
