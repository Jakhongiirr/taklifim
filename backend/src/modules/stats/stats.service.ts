import { Injectable } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  RecentResponseDto,
  RecentTaklifDto,
  ResponseStatsDto,
  SourceStatsDto,
  StatsDto,
  TaklifStatsDto,
  ThemeStatsDto,
  UpcomingTaklifDto,
  UserStatsDto,
  VisitStatsDto,
} from './dto/stats.dto';

type VisitRow = VisitStatsDto & {
  views: number;
  viewsToday: number;
  viewsWeek: number;
};

const RECENT = 6;
const UPCOMING = 8;
const SOURCES = 25;

/** Read-only numbers for the admin dashboard (plain SQL, run in parallel). */
@Injectable()
export class StatsService {
  constructor(@InjectDataSource() private readonly db: DataSource) {}

  async get(): Promise<StatsDto> {
    const [
      [users],
      [invitations],
      [responses],
      [revenue],
      [visits],
      sources,
      themes,
      upcoming,
      recentInvitations,
      recentResponses,
    ] = await Promise.all([
      this.db.query<UserStatsDto[]>(`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE role = 'admin')::int AS admins,
          COUNT(*) FILTER (WHERE "createdAt" > now() - interval '7 days')::int AS "new7d",
          COUNT(*) FILTER (WHERE "lastLoginAt" > now() - interval '7 days')::int AS "active7d"
        FROM users`),
      this.db.query<TaklifStatsDto[]>(`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE status = 'draft')::int AS draft,
          COUNT(*) FILTER (WHERE status = 'published')::int AS published,
          COUNT(*) FILTER (WHERE status = 'unpublished')::int AS unpublished,
          COUNT(*) FILTER (WHERE "createdAt" > now() - interval '7 days')::int AS "new7d"
        FROM taklif`),
      this.db.query<ResponseStatsDto[]>(`
        SELECT COUNT(*)::int AS total,
          COUNT(*) FILTER (WHERE "createdAt" > now() - interval '7 days')::int AS "new7d",
          COALESCE(SUM(guests) FILTER (WHERE attending), 0)::int AS guests
        FROM taklif_responses`),
      this.db.query<{ total: string; week: string; orders: number }[]>(`
        SELECT COALESCE(SUM(amount), 0)::bigint AS total,
          COALESCE(SUM(amount) FILTER (WHERE "paidAt" > now() - interval '7 days'), 0)::bigint AS week,
          COUNT(*)::int AS orders
        FROM orders WHERE status = 'paid'`),
      // Days are Tashkent dates, as recorded by VisitsService.
      this.db.query<VisitRow[]>(`
        WITH today AS (SELECT (now() AT TIME ZONE 'Asia/Tashkent')::date AS d)
        SELECT
          COALESCE(SUM(visitors) FILTER (WHERE day = (SELECT d FROM today)), 0)::int AS today,
          COALESCE(SUM(visitors) FILTER (WHERE day > (SELECT d FROM today) - 7), 0)::int AS week,
          COALESCE(SUM(visitors) FILTER (WHERE day > (SELECT d FROM today) - 30), 0)::int AS month,
          COALESCE(SUM("invitationViews") FILTER (WHERE day = (SELECT d FROM today)), 0)::int AS "viewsToday",
          COALESCE(SUM("invitationViews") FILTER (WHERE day > (SELECT d FROM today) - 7), 0)::int AS "viewsWeek",
          COALESCE(SUM("invitationViews"), 0)::int AS views
        FROM daily_visits`),
      this.db.query<SourceStatsDto[]>(
        `WITH today AS (SELECT (now() AT TIME ZONE 'Asia/Tashkent')::date AS d)
        SELECT source,
          SUM(site)::int AS site,
          SUM(invitation)::int AS invitation,
          COALESCE(SUM(site + invitation) FILTER (WHERE day > (SELECT d FROM today) - 7), 0)::int AS week
        FROM daily_sources
        WHERE day > (SELECT d FROM today) - 30
        GROUP BY source
        ORDER BY SUM(site + invitation) DESC, source LIMIT $1`,
        [SOURCES],
      ),
      this.db.query<ThemeStatsDto[]>(`
        SELECT th.id, th."themeId",
          COUNT(t.id)::int AS total,
          COUNT(t.id) FILTER (WHERE t.status = 'published')::int AS published
        FROM themes th LEFT JOIN taklif t ON t."themeId" = th.id
        WHERE th."archivedAt" IS NULL
        GROUP BY th.id
        ORDER BY total DESC, th."themeId"`),
      this.db.query<UpcomingTaklifDto[]>(
        `SELECT t.id, t.slug, t."groomName", t."brideName", t."eventAt", th."themeId",
          (SELECT COUNT(*)::int FROM taklif_responses r WHERE r."taklifId" = t.id) AS "responseCount"
        FROM taklif t JOIN themes th ON th.id = t."themeId"
        WHERE t.status = 'published' AND t."eventAt" BETWEEN now() AND now() + interval '30 days'
        ORDER BY t."eventAt" LIMIT $1`,
        [UPCOMING],
      ),
      this.db.query<RecentTaklifDto[]>(
        `SELECT t.id, t.slug, t."groomName", t."brideName", t.status, t."createdAt",
          th."themeId", u.id AS "ownerId", u.phone AS "ownerPhone"
        FROM taklif t JOIN themes th ON th.id = t."themeId" JOIN users u ON u.id = t."userId"
        ORDER BY t."createdAt" DESC LIMIT $1`,
        [RECENT],
      ),
      this.db.query<RecentResponseDto[]>(
        `SELECT r.id, r.name, r.attending, r.guests, r.message, r."createdAt",
          t.id AS "taklifId", t.slug, t."groomName", t."brideName"
        FROM taklif_responses r JOIN taklif t ON t.id = r."taklifId"
        ORDER BY r."createdAt" DESC LIMIT $1`,
        [RECENT],
      ),
    ]);
    return {
      users,
      invitations,
      responses,
      revenue: {
        total: Number(revenue.total),
        week: Number(revenue.week),
        orders: revenue.orders,
      },
      visits: { today: visits.today, week: visits.week, month: visits.month },
      views: {
        total: visits.views,
        today: visits.viewsToday,
        week: visits.viewsWeek,
      },
      sources,
      themes,
      upcoming,
      recentInvitations,
      recentResponses,
    };
  }
}
