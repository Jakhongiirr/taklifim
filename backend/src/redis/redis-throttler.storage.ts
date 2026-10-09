import { ThrottlerStorage } from '@nestjs/throttler';
import Redis from 'ioredis';

/**
 * Fixed-window counter, atomic so concurrent requests across instances
 * can't slip past the limit.
 * KEYS: hits, block. ARGV: ttl ms, limit, block duration ms.
 * Returns: [totalHits, hits ttl ms, isBlocked (0|1), block ttl ms].
 */
const INCREMENT_SCRIPT = `
local blockTtl = redis.call('PTTL', KEYS[2])
if blockTtl > 0 then
  local total = tonumber(redis.call('GET', KEYS[1]) or '0')
  return {total, redis.call('PTTL', KEYS[1]), 1, blockTtl}
end
local total = redis.call('INCR', KEYS[1])
if total == 1 then redis.call('PEXPIRE', KEYS[1], ARGV[1]) end
local ttl = redis.call('PTTL', KEYS[1])
if total > tonumber(ARGV[2]) then
  redis.call('SET', KEYS[2], '1', 'PX', ARGV[3])
  return {total, ttl, 1, tonumber(ARGV[3])}
end
return {total, ttl, 0, 0}
`;

const toSeconds = (ms: number) => Math.max(0, Math.ceil(ms / 1000));

export class RedisThrottlerStorage implements ThrottlerStorage {
  constructor(
    private readonly redis: Redis,
    private readonly prefix = 'throttle',
  ) {}

  async increment(
    key: string,
    ttl: number,
    limit: number,
    blockDuration: number,
    throttlerName: string,
  ) {
    const base = `${this.prefix}:${throttlerName}:${key}`;
    const [totalHits, hitsTtl, isBlocked, blockTtl] = (await this.redis.eval(
      INCREMENT_SCRIPT,
      2,
      `${base}:hits`,
      `${base}:block`,
      ttl,
      limit,
      blockDuration,
    )) as [number, number, number, number];

    return {
      totalHits,
      timeToExpire: toSeconds(hitsTtl),
      isBlocked: isBlocked === 1,
      timeToBlockExpire: toSeconds(blockTtl),
    };
  }
}
