import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  CheckoutStatsDto,
  CountByDto,
  FeatureUsageDto,
  FunnelDto,
  GuestStatsDto,
  MusicUsageDto,
  StatsDetailsDto,
  ThemeUsageDto,
  TrendPointDto,
} from './dto/stats-details.dto';

const TZ = 'Asia/Tashkent';

/** Bigint sums come back as text. */
type Raw<T> = { [K in keyof T]: T[K] extends number ? number | string : T[K] };

/**
 * The admin Statistics page: trends over a period, what's used most (themes,
 * music, optional fields), the funnel from sign-up to payment, guests'
 * replies, checkout and when weddings are held. Read-only SQL in parallel;
 * dates are bucketed in Tashkent time.
 */
@Injectable()
export class StatsDetailsService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async get(days: number): Promise<StatsDetailsDto> {
    const unit = days > 90 ? 'month' : 'day';
    const [
      trend,
      themes,
      music,
      noMusic,
      [funnel],
      [features],
      [guests],
      [checkout],
      weekdays,
      hours,
      months,
    ] = await Promise.all([
      this.trend(unit, days),
      this.db.query<Raw<ThemeUsageDto>[]>(`
        SELECT th.id, th."themeId", th.price, th."archivedAt" IS NOT NULL AS archived,
          COUNT(t.id)::int AS total,
          COUNT(t.id) FILTER (WHERE t.status = 'published')::int AS published,
          (SELECT COUNT(*) FROM orders o WHERE o."themeId" = th.id AND o.status = 'paid')::int AS paid,
          (SELECT COALESCE(SUM(o.amount), 0) FROM orders o WHERE o."themeId" = th.id AND o.status = 'paid')::bigint AS revenue
        FROM themes th LEFT JOIN taklif t ON t."themeId" = th.id
        GROUP BY th.id
        ORDER BY total DESC, revenue DESC, th."themeId"`),
      this.db.query<MusicUsageDto[]>(`
        SELECT m.id, m.title, m.artist, m."archivedAt" IS NOT NULL AS archived,
          COUNT(t.id)::int AS invitations
        FROM music m LEFT JOIN taklif t ON t."musicId" = m.id
        GROUP BY m.id`),
      this.db.query<{ count: number }[]>(
        `SELECT COUNT(*)::int AS count FROM taklif WHERE "musicId" IS NULL`,
      ),
      this.db.query<FunnelDto[]>(`
        SELECT (SELECT COUNT(*) FROM users)::int AS users,
          (SELECT COUNT(DISTINCT "userId") FROM taklif)::int AS created,
          (SELECT COUNT(DISTINCT "userId") FROM taklif WHERE status <> 'draft')::int AS published,
          (SELECT COUNT(DISTINCT "userId") FROM orders WHERE status = 'paid' AND "userId" IS NOT NULL)::int AS paid`),
      this.db.query<FeatureUsageDto[]>(`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE photos > 0)::int AS "withPhotos",
          COALESCE(AVG(photos) FILTER (WHERE photos > 0), 0)::float AS "avgPhotos",
          COUNT(*) FILTER (WHERE "musicId" IS NOT NULL)::int AS "withMusic",
          COUNT(*) FILTER (WHERE "locationUrl" IS NOT NULL)::int AS "withMap",
          COUNT(*) FILTER (WHERE "cardNumber" IS NOT NULL)::int AS "withCard",
          COUNT(*) FILTER (WHERE phone IS NOT NULL)::int AS "withPhone"
        FROM (
          SELECT t.*, (SELECT COUNT(*) FROM taklif_photos p WHERE p."taklifId" = t.id) AS photos
          FROM taklif t
        ) x`),
      this.db.query<GuestStatsDto[]>(`
        SELECT (SELECT COUNT(*) FROM taklif WHERE status <> 'draft')::int AS invitations,
          COUNT(DISTINCT "taklifId")::int AS "withReplies",
          COUNT(*)::int AS replies,
          COUNT(*) FILTER (WHERE attending)::int AS attending,
          COALESCE(SUM(guests) FILTER (WHERE attending), 0)::int AS guests,
          COUNT(*) FILTER (WHERE message IS NOT NULL)::int AS wishes,
          COUNT(*) FILTER (WHERE "likedAt" IS NOT NULL)::int AS liked
        FROM taklif_responses`),
      this.db.query<CheckoutStatsDto[]>(`
        SELECT (SELECT COUNT(*) FROM orders WHERE amount > 0)::int AS orders,
          (SELECT COUNT(*) FROM orders WHERE amount > 0 AND status = 'paid')::int AS paid,
          (SELECT COUNT(*) FROM payme_transactions WHERE state = -1)::int AS cancelled,
          (SELECT COUNT(*) FROM payme_transactions WHERE state = -1 AND reason = 4)::int AS "timedOut"`),
      this.countBy('ISODOW'),
      this.countBy('HOUR'),
      this.countBy('MONTH'),
    ]);

    return {
      days,
      unit,
      trend,
      themes: themes.map((t) => ({
        ...t,
        price: Number(t.price),
        total: Number(t.total),
        published: Number(t.published),
        paid: Number(t.paid),
        revenue: Number(t.revenue),
      })),
      // Most used first; "no music" is a row of its own.
      music: [
        ...music,
        {
          id: null,
          title: null,
          artist: null,
          archived: false,
          invitations: noMusic[0].count,
        },
      ].sort((a, b) => b.invitations - a.invitations),
      funnel,
      features,
      guests,
      checkout,
      eventWeekdays: fill(weekdays, 1, 7),
      eventHours: fill(hours, 0, 23),
      eventMonths: fill(months, 1, 12),
    };
  }

  /** Per bucket: new invitations, paid orders, revenue, new users, replies. */
  private async trend(unit: 'day' | 'month', days: number) {
    const bucket = (column: string) =>
      `date_trunc($1, ${column} AT TIME ZONE '${TZ}') = b`;
    const rows = await this.db.query<Raw<TrendPointDto>[]>(
      `WITH buckets AS (
        SELECT generate_series(
          date_trunc($1, (now() AT TIME ZONE '${TZ}') - make_interval(days => $2 - 1)),
          date_trunc($1, now() AT TIME ZONE '${TZ}'),
          ('1 ' || $1)::interval
        ) AS b
      )
      SELECT to_char(b, 'YYYY-MM-DD') AS date,
        (SELECT COUNT(*) FROM taklif t WHERE ${bucket('t."createdAt"')})::int AS invitations,
        (SELECT COUNT(*) FROM orders o WHERE o.status = 'paid' AND ${bucket('o."paidAt"')})::int AS paid,
        (SELECT COALESCE(SUM(o.amount), 0) FROM orders o WHERE o.status = 'paid' AND ${bucket('o."paidAt"')})::bigint AS revenue,
        (SELECT COUNT(*) FROM users u WHERE ${bucket('u."createdAt"')})::int AS users,
        (SELECT COUNT(*) FROM taklif_responses r WHERE ${bucket('r."createdAt"')})::int AS replies
      FROM buckets ORDER BY b`,
      [unit, days],
    );
    return rows.map((r) => ({
      date: r.date,
      invitations: Number(r.invitations),
      paid: Number(r.paid),
      revenue: Number(r.revenue),
      users: Number(r.users),
      replies: Number(r.replies),
    }));
  }

  /** How many invitations' events fall on each weekday / hour / month. */
  private countBy(field: 'ISODOW' | 'HOUR' | 'MONTH') {
    return this.db.query<CountByDto[]>(`
      SELECT EXTRACT(${field} FROM "eventAt" AT TIME ZONE '${TZ}')::int AS key,
        COUNT(*)::int AS count
      FROM taklif GROUP BY 1`);
  }
}

/** Every key from..to, zero where nothing was counted. */
function fill(rows: CountByDto[], from: number, to: number): CountByDto[] {
  const counts = new Map(rows.map((r) => [r.key, r.count]));
  return Array.from({ length: to - from + 1 }, (_, i) => ({
    key: from + i,
    count: counts.get(from + i) ?? 0,
  }));
}
