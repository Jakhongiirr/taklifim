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
import { CreateDemoDto } from './dto/create-demo.dto';
import { DemoDto } from './dto/demo.dto';
import { ReorderDemosDto } from './dto/reorder-demos.dto';
import { ListDemosQueryDto } from './dto/list-demos-query.dto';
import { UpdateDemoDto } from './dto/update-demo.dto';
import { DemosService } from './demos.service';

@ApiTags('demos')
@ApiBearerAuth()
@Controller('demos')
export class DemosController {
  constructor(private readonly demosService: DemosService) {}

  @Get()
  @Public()
  @ApiOperation({
    summary: 'List demos (no auth needed)',
    description:
      'In the order set by admins (PATCH /demos/order), then newest first. Everyone sees active demos; admins (with a token) can pass status=archived|all.',
  })
  @ApiForbiddenResponse({ description: 'Non-admin asked for archived demos' })
  list(
    @Query() query: ListDemosQueryDto,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<DemoDto[]> {
    return this.demosService.list(query, user);
  }

  @Get(':id')
  @Public()
  @ApiOperation({
    summary: 'Get a demo (no auth needed; archived: admin only)',
  })
  @ApiNotFoundResponse()
  findOne(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload | undefined,
  ): Promise<DemoDto> {
    return this.demosService.findOne(id, user);
  }

  @Post()
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Create a demo (admin)',
    description: 'Upload the image via POST /files first, then pass its id.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body, image is not an image, or theme is not active',
  })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  create(@Body() dto: CreateDemoDto): Promise<DemoDto> {
    return this.demosService.create(dto);
  }

  @Patch('order')
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Set the order of demos on the site (admin)',
    description:
      'Pass all demo ids, first to last. Demos left out go after the listed ones.',
  })
  @ApiBadRequestResponse({ description: 'Unknown or duplicate ids' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  reorder(@Body() dto: ReorderDemosDto): Promise<DemoDto[]> {
    return this.demosService.reorder(dto.ids);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({
    summary: 'Edit a demo (admin)',
    description:
      'Only the fields sent are changed. Archived demos can be edited too.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid body, image is not an image, or theme is not active',
  })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateDemoDto,
  ): Promise<DemoDto> {
    return this.demosService.update(id, dto);
  }

  @Post(':id/archive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Archive a demo (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  archive(@Param('id', ParseUUIDPipe) id: string): Promise<DemoDto> {
    return this.demosService.archive(id);
  }

  @Post(':id/unarchive')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.Admin)
  @ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
  @ApiOperation({ summary: 'Restore an archived demo (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  unarchive(@Param('id', ParseUUIDPipe) id: string): Promise<DemoDto> {
    return this.demosService.unarchive(id);
  }
}
