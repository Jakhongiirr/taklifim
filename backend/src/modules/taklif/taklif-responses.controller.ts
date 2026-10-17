import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiTooManyRequestsResponse,
} from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateTaklifResponseDto,
  TaklifResponseDto,
  TaklifResponsesDto,
  UpdateTaklifResponseDto,
} from './dto/taklif-response.dto';
import { TaklifResponsesService } from './taklif-responses.service';

@ApiTags('taklif responses')
@Controller('taklif')
export class TaklifResponsesController {
  constructor(private readonly service: TaklifResponsesService) {}

  @Post(':slug/responses')
  @Public()
  @HttpCode(HttpStatus.CREATED)
  // A guest answers once or twice; a few per 10 minutes per visitor is plenty.
  @Throttle({ default: { limit: 5, ttl: 10 * 60_000 } })
  @ApiOperation({
    summary: 'RSVP to a published invitation (guests, no login)',
    description:
      'Name, attendance, guest count and an optional wish (no links). Private to the owner, who also gets it in Telegram. Spam-protected: honeypot field, minimum fill time, rate limit, duplicate check and a per-invitation cap.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body, or a link in the wish' })
  @ApiNotFoundResponse({ description: 'No published invitation' })
  @ApiConflictResponse({ description: 'Too many responses on this invitation' })
  @ApiTooManyRequestsResponse()
  create(
    @Param('slug') slug: string,
    @Body() dto: CreateTaklifResponseDto,
  ): Promise<{ ok: boolean }> {
    return this.service.create(slug, dto);
  }

  @Get(':id/responses')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'All responses with totals (owner or admin)' })
  @ApiNotFoundResponse()
  listForOwner(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifResponsesDto> {
    return this.service.listForOwner(id, user);
  }

  @Patch(':id/responses/:responseId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Like or unlike a wish (owner or admin)' })
  @ApiNotFoundResponse()
  setLiked(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('responseId', ParseUUIDPipe) responseId: string,
    @Body() dto: UpdateTaklifResponseDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifResponseDto> {
    return this.service.setLiked(id, responseId, dto.liked, user);
  }

  @Delete(':id/responses/:responseId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a response (owner or admin)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('responseId', ParseUUIDPipe) responseId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.service.remove(id, responseId, user);
  }
}
