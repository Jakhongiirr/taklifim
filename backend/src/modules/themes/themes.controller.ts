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
import { CreateThemeDto } from './dto/create-theme.dto';
import { ListThemesQueryDto } from './dto/list-themes-query.dto';
import { ThemeDto } from './dto/theme.dto';
import { UpdateThemeDto } from './dto/update-theme.dto';
import { ThemesService } from './themes.service';

@ApiTags('themes')
@ApiBearerAuth()
@Controller('themes')
export class ThemesController {
  constructor(private readonly themesService: ThemesService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List themes (no auth needed)',
    description:
      'Newest first. Everyone sees active themes; admins (with a token) can pass status=archived|all.',
  })
  @ApiForbiddenResponse({ description: 'Non-admin asked for archived themes' })
  list(
    @Query() query: ListThemesQueryDto,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<ThemeDto[]> {
    return this.themesService.list(query, user);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get a theme (no auth needed; archived: admin only)',
  })
  @ApiNotFoundResponse()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<ThemeDto> {
    return this.themesService.findOne(id, user);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Create a theme (admin)',
    description: "Price is in whole so'm (UZS).",
  })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiConflictResponse({ description: 'themeId already taken' })
  create(@Body() dto: CreateThemeDto): Promise<ThemeDto> {
    return this.themesService.create(dto);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Edit a theme (admin)',
    description:
      'Only the fields sent are changed. Archived themes can be edited too.',
  })
  @ApiBadRequestResponse({ description: 'Invalid body' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'themeId already taken' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateThemeDto,
  ): Promise<ThemeDto> {
    return this.themesService.update(id, dto);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Archive a theme (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  archive(@Param('id', ParseUUIDPipe) id: string): Promise<ThemeDto> {
    return this.themesService.archive(id);
  }

  @Post(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Restore an archived theme (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  unarchive(@Param('id', ParseUUIDPipe) id: string): Promise<ThemeDto> {
    return this.themesService.unarchive(id);
  }
}
