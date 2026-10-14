import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { CreateMusicDto } from './dto/create-music.dto';
import { ListMusicQueryDto } from './dto/list-music-query.dto';
import { UpdateMusicDto } from './dto/update-music.dto';
import { MusicDto } from './dto/music.dto';
import { MusicService } from './music.service';
import { ReorderMusicDto } from './dto/reorder-music.dto';

@ApiTags('music')
@ApiBearerAuth()
@Controller('music')
export class MusicController {
  constructor(private readonly musicService: MusicService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List music (no auth needed)',
    description:
      'In the admin-set order. Everyone sees active tracks; admins (with a token) can pass status=archived|all.',
  })
  @ApiForbiddenResponse({ description: 'Non-admin asked for archived music' })
  list(
    @Query() query: ListMusicQueryDto,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<MusicDto[]> {
    return this.musicService.list(query, user);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get a track (no auth needed; archived: admin only)',
  })
  @ApiNotFoundResponse()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<MusicDto> {
    return this.musicService.findOne(id, user);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Add a track (admin)',
    description: 'Upload the audio via POST /files first, then pass its id.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body, or file is not audio' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiConflictResponse({ description: 'File already used by another track' })
  create(@Body() dto: CreateMusicDto): Promise<MusicDto> {
    return this.musicService.create(dto);
  }

  @Patch('order')
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Set the order of music in the list (admin)',
    description:
      'Pass all track ids, first to last. Tracks left out go after the listed ones.',
  })
  @ApiBadRequestResponse({ description: 'Unknown or duplicate ids' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  reorder(@Body() dto: ReorderMusicDto): Promise<MusicDto[]> {
    return this.musicService.reorder(dto.ids);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Edit a track (admin)',
    description:
      'Only the fields sent are changed. Archived tracks can be edited too.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body, or file is not audio' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'File already used by another track' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateMusicDto,
  ): Promise<MusicDto> {
    return this.musicService.update(id, dto);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Archive a track (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  archive(@Param('id', ParseUUIDPipe) id: string): Promise<MusicDto> {
    return this.musicService.archive(id);
  }

  @Post(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Restore an archived track (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  unarchive(@Param('id', ParseUUIDPipe) id: string): Promise<MusicDto> {
    return this.musicService.unarchive(id);
  }
}
