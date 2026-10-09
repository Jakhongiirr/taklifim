import {
  ArgumentsHost,
  BadRequestException,
  HttpException,
  HttpStatus,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AllExceptionsFilter } from './all-exceptions.filter';
import type { ApiError } from './api-response';

function run(exception: unknown) {
  const response = {
    headersSent: false,
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const host = {
    switchToHttp: () => ({
      getRequest: () => ({ method: 'GET', originalUrl: '/x' }),
      getResponse: () => response,
    }),
  } as unknown as ArgumentsHost;
  new AllExceptionsFilter().catch(exception, host);
  const [[status]] = response.status.mock.calls as [[number]];
  const [[body]] = response.json.mock.calls as [[ApiError]];
  return { status, body };
}

describe('AllExceptionsFilter', () => {
  beforeAll(() => jest.spyOn(Logger.prototype, 'error').mockImplementation());

  it('maps HttpException', () => {
    const { status, body } = run(new NotFoundException('Music not found'));
    expect(status).toBe(404);
    expect(body).toMatchObject({
      success: false,
      error: { statusCode: 404, code: 'NOT_FOUND', message: 'Music not found' },
      path: '/x',
    });
    expect(body.error.details).toBeUndefined();
  });

  it('maps ValidationPipe errors', () => {
    const { body } = run(new BadRequestException(['a is bad', 'b is bad']));
    expect(body.error).toEqual({
      statusCode: 400,
      code: 'VALIDATION_FAILED',
      message: 'Validation failed',
      details: ['a is bad', 'b is bad'],
    });
  });

  it('keeps extra fields as details', () => {
    const { body } = run(
      new HttpException(
        { message: 'Wait', retryAfter: 42 },
        HttpStatus.TOO_MANY_REQUESTS,
      ),
    );
    expect(body.error).toEqual({
      statusCode: 429,
      code: 'TOO_MANY_REQUESTS',
      message: 'Wait',
      details: { retryAfter: 42 },
    });
  });

  it('hides unknown errors behind a 500', () => {
    const { status, body } = run(new Error('connection string leaked'));
    expect(status).toBe(500);
    expect(body.error).toEqual({
      statusCode: 500,
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    });
  });

  it('uses the status of middleware errors', () => {
    const err = Object.assign(new SyntaxError('Unexpected token'), {
      status: 400,
    });
    const { status, body } = run(err);
    expect(status).toBe(400);
    expect(body.error.message).toBe('Unexpected token');
  });
});
