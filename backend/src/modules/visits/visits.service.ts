import { Inject, Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import Redis from 'ioredis';
import { DataSource } from 'typeorm';
import { REDIS_CLIENT } from '../../redis/redis.constants';
import type { JwtPayload } from '../auth/auth.types';
import { TaklifStatus } from '../taklif/taklif-status.enum';
import { Role } from '../users/role.enum';
import { RecordVisitDto } from './dto/record-visit.dto';

// Seen-today markers outlive the day they're for, whatever the time zone.
const SEEN_TTL_SECONDS = 2 * 24 * 60 * 60;

/** Today's date in Tashkent, YYYY-MM-DD. */
export function tashkentDay(now = new Date()) {
  return now.toLocaleDateString('en-CA', { timeZone: 'Asia/Tashkent' });
}

/**
 * Counts site visitors and invitation views, once per visitor per day (the
 * "seen" marker is in Redis; the counts are in Postgres). The owner and
 * admins opening an invitation don't add views.
 */
@Injectable()
export class VisitsService {
  constructor(
    @InjectDataSource() private readonly db: DataSource,
    @Inject(REDIS_CLIENT) private readonly redis: Redis,
  ) {}

  async record(dto: RecordVisitDto, user?: JwtPayload) {
    const day = tashkentDay();
    if (await this.firstToday(`site:${day}:${dto.visitorId}`)) {
      await this.bump(day, 'visitors');
    }
    if (!dto.slug) return;

    const [taklif] = await this.db.query<{ id: string; userId: string }[]>(
      `SELECT id, "userId" FROM taklif WHERE slug = $1 AND status = $2`,
      [dto.slug, TaklifStatus.Published],
    );
    if (!taklif) return;
    if (user && (user.sub === taklif.userId || user.role === Role.Admin)) {
      return;
    }
    if (await this.firstToday(`view:${taklif.id}:${day}:${dto.visitorId}`)) {
      // Plain SQL so `updatedAt` stays the owner's last edit.
      await this.db.query(
        `UPDATE taklif SET "viewCount" = "viewCount" + 1 WHERE id = $1`,
        [taklif.id],
      );
      await this.bump(day, 'invitationViews');
    }
  }

  /** True the first time this key is seen (within SEEN_TTL_SECONDS). */
  private async firstToday(key: string) {
    const set = await this.redis.set(
      `visits:${key}`,
      '1',
      'EX',
      SEEN_TTL_SECONDS,
      'NX',
    );
    return set === 'OK';
  }

  private bump(day: string, column: 'visitors' | 'invitationViews') {
    return this.db.query(
      `INSERT INTO daily_visits (day, "${column}") VALUES ($1, 1)
       ON CONFLICT (day) DO UPDATE
       SET "${column}" = daily_visits."${column}" + 1`,
      [day],
    );
  }
}
