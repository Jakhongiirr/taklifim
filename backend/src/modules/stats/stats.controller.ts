import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { StatsDetailsDto, StatsDetailsQueryDto } from './dto/stats-details.dto';
import { StatsDto } from './dto/stats.dto';
import { StatsDetailsService } from './stats-details.service';
import { StatsService } from './stats.service';

@ApiTags('stats')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('stats')
export class StatsController {
  constructor(
    private readonly statsService: StatsService,
    private readonly detailsService: StatsDetailsService,
  ) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Dashboard numbers and latest activity (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  get(): Promise<StatsDto> {
    return this.statsService.get();
  }

  @Get('details')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'The Statistics page: trends, usage, funnel, guests (admin)',
  })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  details(@Query() query: StatsDetailsQueryDto): Promise<StatsDetailsDto> {
    return this.detailsService.get(query.days);
  }
}
