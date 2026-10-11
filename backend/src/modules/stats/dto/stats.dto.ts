import { TaklifStatus } from '../../taklif/taklif-status.enum';

export class UserStatsDto {
  total: number;
  admins: number;
  /** Joined in the last 7 days. */
  new7d: number;
  /** Logged in during the last 7 days. */
  active7d: number;
}

export class TaklifStatsDto {
  total: number;
  draft: number;
  published: number;
  unpublished: number;
  /** Created in the last 7 days. */
  new7d: number;
}

export class ResponseStatsDto {
  total: number;
  /** Sent in the last 7 days. */
  new7d: number;
  /** People coming, guests included, across all replies. */
  guests: number;
}

export class RevenueStatsDto {
  /** All paid orders. */
  total: number;
  /** Paid in the last 7 days. */
  week: number;
  /** How many orders were paid (free designs included). */
  orders: number;
}

export class ThemeStatsDto {
  /** The theme row's id. */
  id: string;
  /** @example "aurora" */
  themeId: string;
  /** Invitations in any status. */
  total: number;
  published: number;
}

export class UpcomingTaklifDto {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  eventAt: Date;
  /** @example "aurora" */
  themeId: string;
  responseCount: number;
}

export class RecentTaklifDto {
  id: string;
  slug: string;
  groomName: string;
  brideName: string;
  status: TaklifStatus;
  createdAt: Date;
  /** @example "aurora" */
  themeId: string;
  ownerId: string;
  ownerPhone: string;
}

export class RecentResponseDto {
  id: string;
  name: string;
  attending: boolean;
  guests: number;
  message: string | null;
  createdAt: Date;
  taklifId: string;
  slug: string;
  groomName: string;
  brideName: string;
}

/** The admin dashboard: counts, theme popularity and the latest activity. */
export class StatsDto {
  users: UserStatsDto;
  invitations: TaklifStatsDto;
  responses: ResponseStatsDto;
  /** Paid orders, in so'm. */
  revenue: RevenueStatsDto;
  /** Most used first. */
  themes: ThemeStatsDto[];
  /** Published invitations with an event in the next 30 days, soonest first. */
  upcoming: UpcomingTaklifDto[];
  recentInvitations: RecentTaklifDto[];
  recentResponses: RecentResponseDto[];
}
