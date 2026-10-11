import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import type { JwtPayload } from '../auth/auth.types';
import { AdminUserDto } from './dto/admin-user.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { Role } from './role.enum';
import { User } from './user.entity';
import { UsersService } from './users.service';

@ApiTags('users')
@ApiBearerAuth()
@ApiUnauthorizedResponse({ description: 'Missing or invalid access token' })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Current user' })
  me(@CurrentUser() user: JwtPayload): Promise<User> {
    return this.usersService.findById(user.sub);
  }

  @Get()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'List all users with invitation counts (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  findAll(): Promise<AdminUserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'One user with invitation counts (admin)' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<AdminUserDto> {
    return this.usersService.findOneForAdmin(id);
  }

  @Patch(':id/role')
  @Roles(Role.Admin)
  @ApiOperation({
    summary: 'Make a user an admin or a regular user (admin)',
    description:
      "Admins can't change their own role. Takes effect on the user's next token refresh.",
  })
  @ApiBadRequestResponse({ description: 'Changing your own role' })
  @ApiForbiddenResponse({ description: 'Not an admin' })
  @ApiNotFoundResponse()
  setRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateRoleDto,
    @CurrentUser() user: JwtPayload,
  ): Promise<AdminUserDto> {
    return this.usersService.setRole(id, dto.role, user.sub);
  }
}
