import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { RecordVisitDto } from './dto/record-visit.dto';
import { VisitsService } from './visits.service';

@ApiTags('visits')
@Controller('visits')
export class VisitsController {
  constructor(private readonly visitsService: VisitsService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.NO_CONTENT)
  // One per page load; generous for someone clicking around the site.
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({
    summary: 'Count a page load (no login)',
    description:
      'Sent by the site on every page. Counts the visitor once a day, and with `slug` a view of that published invitation once a day per visitor (not when the owner or an admin opens it).',
  })
  @ApiNoContentResponse()
  @ApiBadRequestResponse({ description: 'Invalid visitor id or slug' })
  record(
    @Body() dto: RecordVisitDto,
    @CurrentUser() user?: JwtPayload,
  ): Promise<void> {
    return this.visitsService.record(dto, user);
  }
}
