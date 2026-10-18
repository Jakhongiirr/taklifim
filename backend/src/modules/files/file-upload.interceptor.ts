import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Request } from 'express';
import type { JwtPayload } from '../auth/auth.types';
import { Role } from '../users/role.enum';
import { UploadLimits } from './upload-limits';

/**
 * Receives the `file` field into memory, stopping early at a size based on
 * the caller's role: users can upload images and their own music, so they are
 * cut off at the larger of those limits; admins may send up to the largest. The exact per-type
 * limit is enforced after the type is detected (FilesService.upload).
 */
@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
  private readonly forUser: NestInterceptor;
  private readonly forAdmin: NestInterceptor;

  constructor(limits: UploadLimits) {
    const create = (fileSize: number): NestInterceptor =>
      new (FileInterceptor('file', { limits: { fileSize, files: 1 } }))();
    this.forUser = create(Math.max(limits.image, limits.userAudio));
    this.forAdmin = create(Math.max(limits.image, limits.audio));
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const { user } = context
      .switchToHttp()
      .getRequest<Request & { user?: JwtPayload }>();
    const interceptor =
      user?.role === Role.Admin ? this.forAdmin : this.forUser;
    return interceptor.intercept(context, next);
  }
}
