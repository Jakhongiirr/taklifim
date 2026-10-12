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
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import type { JwtPayload } from '../auth/auth.types';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '../users/role.enum';
import { CreateTaklifDto } from './dto/create-taklif.dto';
import { ListTaklifQueryDto } from './dto/list-taklif-query.dto';
import {
  AdminTaklifPageDto,
  PublicTaklifDto,
  TaklifDto,
} from './dto/taklif.dto';
import { UpdateTaklifStatusDto } from './dto/update-taklif-status.dto';
import { UpdateTaklifDto } from './dto/update-taklif.dto';
import { TaklifService } from './taklif.service';

@ApiTags('taklif')
@ApiBearerAuth()
@Controller('taklif')
export class TaklifController {
  constructor(private readonly taklifService: TaklifService) {}

  @Post()
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Create an invitation',
    description:
      'Starts as a draft with a generated slug. Upload photos via POST /files first.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body, inactive music/theme, or unusable photos',
  })
  @ApiConflictResponse({
    description:
      'A photo is used by another invitation, or the user already has 30 drafts',
  })
  create(
    @Body() dto: CreateTaklifDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifDto> {
    return this.taklifService.create(dto, user);
  }

  @Get('mine')
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: "The caller's invitations, newest first" })
  listMine(@CurrentUser() user: JwtPayload): Promise<TaklifDto[]> {
    return this.taklifService.listMine(user);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'All invitations, newest first, paginated (admin)',
  })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  listAll(@Query() query: ListTaklifQueryDto): Promise<AdminTaklifPageDto> {
    return this.taklifService.listAll(query);
  }

  @Get('preview/:slug')
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Preview an invitation in any status (owner or admin)',
    description: '404 for anyone else.',
  })
  @ApiNotFoundResponse()
  preview(
    @Param('slug') slug: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifDto> {
    return this.taklifService.previewBySlug(slug, user);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({
    summary: 'Public invitation page (no auth needed)',
    description:
      'Published only: drafts and unpublished invitations return 404 for everyone, including the owner and admins (use GET /taklif/preview/{slug}).',
  })
  @ApiNotFoundResponse()
  findPublishedBySlug(@Param('slug') slug: string): Promise<PublicTaklifDto> {
    return this.taklifService.findPublishedBySlug(slug);
  }

  @Patch(':id')
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Edit an invitation (owner or admin)',
    description:
      'Only the fields sent are changed; the status cannot be changed here. Photos removed from photoIds are deleted.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body, inactive music/theme, or unusable photos',
  })
  @ApiForbiddenResponse({ description: 'Not the owner' })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'A photo is used by another invitation' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaklifDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifDto> {
    return this.taklifService.update(id, dto, user);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Publish an invitation (owner or admin)',
    description:
      'Makes an unpublished invitation public again at GET /taklif/{slug}. Drafts are published after payment (402).',
  })
  @ApiResponse({
    status: HttpStatus.PAYMENT_REQUIRED,
    description: 'Still a draft: published after payment',
  })
  @ApiForbiddenResponse({ description: 'Not the owner' })
  @ApiNotFoundResponse()
  publish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifDto> {
    return this.taklifService.publish(id, user);
  }

  @Post(':id/unpublish')
  @HttpCode(HttpStatus.OK)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Unpublish an invitation (owner or admin)',
    description: 'Hides it from the public again. Publish it again any time.',
  })
  @ApiForbiddenResponse({ description: 'Not the owner' })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Still a draft' })
  unpublish(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifDto> {
    return this.taklifService.unpublish(id, user);
  }

  @Patch(':id/status')
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Set any status, including back to draft (admin)',
  })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  setStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateTaklifStatusDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<TaklifDto> {
    return this.taklifService.setStatus(id, dto.status, user);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Delete an invitation and its photos',
    description:
      'Owners can delete their own drafts; a published one (live or hidden) only an admin can delete. The replies go with it.',
  })
  @ApiNoContentResponse()
  @ApiForbiddenResponse({ description: 'Not the owner' })
  @ApiNotFoundResponse()
  @ApiConflictResponse({ description: 'Owner tried to delete a non-draft' })
  remove(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ): Promise<void> {
    return this.taklifService.remove(id, user);
  }
}
