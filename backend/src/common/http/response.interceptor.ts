import {
  CallHandler,
  ExecutionContext,
  HttpStatus,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import type { Response } from 'express';
import { map, Observable } from 'rxjs';
import type { ApiSuccess } from './api-response';

/** Wraps handler results as `{ success: true, data }`; 204 stays empty. */
@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiSuccess<T> | undefined
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiSuccess<T> | undefined> {
    const response = context.switchToHttp().getResponse<Response>();
    return next
      .handle()
      .pipe(
        map((data) =>
          response.statusCode === Number(HttpStatus.NO_CONTENT)
            ? undefined
            : { success: true as const, data: data ?? (null as T) },
        ),
      );
  }
}
