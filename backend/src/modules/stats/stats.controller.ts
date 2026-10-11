import { Controller, Get } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { StatsDto } from './dto/stats.dto';
import { StatsService } from './stats.service';

@ApiTags('stats')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Dashboard numbers and latest activity (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  get(): Promise<StatsDto> {
    return this.statsService.get();
  }
}
