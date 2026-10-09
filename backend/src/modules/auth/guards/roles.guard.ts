import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { Role } from '../../users/role.enum';
import type { JwtPayload } from '../auth.types';
import { ROLES_KEY } from '../decorators/roles.decorator';

/** Admins pass every role check: an admin is also a user. */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const required = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required?.length) return true;

    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    if (!user) return false;
    return user.role === Role.Admin || required.includes(user.role);
  }
}
