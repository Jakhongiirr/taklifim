import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import {
  CreateTaklifGuestsDto,
  PublicTaklifGuestDto,
  TaklifGuestDto,
} from './dto/taklif-guest.dto';
import { TaklifGuestsService } from './taklif-guests.service';

@ApiTags('taklif guests')
@Controller('taklif')
export class TaklifGuestsController {
  constructor(private readonly service: TaklifGuestsService) {}

  @Get(':slug/guests/:token')
  @Public()
  @ApiOperation({
    summary: "A personal link's guest (no login)",
    description: 'Published invitations only.',
  })
  @ApiNotFoundResponse()
  findPublic(
    @Param('slug') slug: string,
    @Param('token') token: string,
  ): Promise<PublicTaklifGuestDto> {
    return this.service.findPublic(slug, token);
  }

  @Get(':id/guests')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Named guests with their replies (owner or admin)' })
  @ApiNotFoundResponse()
  list(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifGuestDto[]> {
    return this.service.list(id, user);
  }

  @Post(':id/guests')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Add named guests (owner or admin)',
    description:
      'Each gets a personal link, /{locale}/taklif/{slug}/{token}, that greets them by name.',
  })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Over 500 named guests' })
  add(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateTaklifGuestsDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifGuestDto[]> {
    return this.service.add(id, dto.names, user);
  }

  @Delete(':id/guests/:guestId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove a named guest (owner or admin)' })
  @ApiNoContentResponse()
  @ApiNotFoundResponse()
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @Param('guestId', ParseUUIDPipe) guestId: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.service.remove(id, guestId, user);
  }
}
