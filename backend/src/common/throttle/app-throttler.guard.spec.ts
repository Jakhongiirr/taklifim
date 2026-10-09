import { ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import type { ThrottlerStorage } from '@nestjs/throttler';
import type { Request } from 'express';
import { AppThrottlerGuard } from './app-throttler.guard';

// @nestjs/config ships as an ES module, which Jest here can't load; the guard
// only needs the class as an injection token.
jest.mock('@nestjs/config', () => ({ ConfigService: class {} }));

const SECRET = 'x'.repeat(40);

function guard(secret?: string) {
  const config = { get: () => secret } as unknown as ConfigService;
  return new AppThrottlerGuard(
    { throttlers: [] },
    {} as ThrottlerStorage,
    new Reflector(),
    config,
  ) as unknown as {
    getTracker(req: Request): Promise<string>;
    shouldSkip(context: ExecutionContext): Promise<boolean>;
  };
}

const request = (headers: Record<string, string>, ip = '10.0.0.5') =>
  ({ headers, ip }) as unknown as Request;
const context = (req: Request) =>
  ({ switchToHttp: () => ({ getRequest: () => req }) }) as ExecutionContext;

describe('AppThrottlerGuard', () => {
  it('limits the Next.js server by the visitor it names', async () => {
    const req = request({
      'x-internal-secret': SECRET,
      'x-client-ip': '203.0.113.7',
    });
    expect(await guard(SECRET).getTracker(req)).toBe('203.0.113.7');
    expect(await guard(SECRET).shouldSkip(context(req))).toBe(false);
  });

  it("doesn't limit the server's own requests (no visitor named)", async () => {
    const req = request({ 'x-internal-secret': SECRET });
    expect(await guard(SECRET).shouldSkip(context(req))).toBe(true);
  });

  it('ignores X-Client-IP without the right secret', async () => {
    const cases: Record<string, string>[] = [
      { 'x-client-ip': '203.0.113.7' },
      { 'x-internal-secret': 'wrong', 'x-client-ip': '203.0.113.7' },
    ];
    for (const headers of cases) {
      const req = request(headers);
      expect(await guard(SECRET).getTracker(req)).toBe('10.0.0.5');
      expect(await guard(SECRET).shouldSkip(context(req))).toBe(false);
    }
  });

  it('trusts no one when no secret is configured', async () => {
    const req = request({ 'x-internal-secret': '', 'x-client-ip': '1.2.3.4' });
    expect(await guard(undefined).getTracker(req)).toBe('10.0.0.5');
    expect(await guard(undefined).shouldSkip(context(req))).toBe(false);
  });

  it('ignores an X-Client-IP that is not an IP', async () => {
    const req = request({
      'x-internal-secret': SECRET,
      'x-client-ip': 'not-an-ip',
    });
    // Not a visitor: treated as the server's own request.
    expect(await guard(SECRET).shouldSkip(context(req))).toBe(true);
  });
});
