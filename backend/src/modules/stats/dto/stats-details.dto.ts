import { Type } from 'class-transformer';
import { IsIn, IsOptional } from 'class-validator';

export const STATS_PERIODS = [30, 90, 365] as const;

export class StatsDetailsQueryDto {
  /** The trend charts' range: days back from today (365 is shown by month). */
  @IsOptional()
  @Type(() => Number)
  @IsIn(STATS_PERIODS)
  days: (typeof STATS_PERIODS)[number] = 30;
}

/** One bucket of the trend charts (a day, or a month for a year). */
export class TrendPointDto {
  /** The bucket's start, YYYY-MM-DD (Tashkent). */
  date: string;
  invitations: number;
  paid: number;
  /** So'm. */
  revenue: number;
  users: number;
  replies: number;
}

export class ThemeUsageDto {
  id: string;
  /** @example "aurora" */
  themeId: string;
  /** Current price, so'm. */
  price: number;
  archived: boolean;
  /** Invitations in any status. */
  total: number;
  published: number;
  paid: number;
  /** Paid orders for it, so'm. */
  revenue: number;
}

export class MusicUsageDto {
  /** Null: invitations without music. */
  id: string | null;
  title: string | null;
  artist: string | null;
  archived: boolean;
  invitations: number;
}

export class FunnelDto {
  users: number;
  /** Users with at least one invitation. */
  created: number;
  /** ...with one that was published. */
  published: number;
  /** ...with one paid for. */
  paid: number;
}

export class FeatureUsageDto {
  /** All invitations (the percentages' base). */
  total: number;
  withPhotos: number;
  /** Average photos per invitation that has any. */
  avgPhotos: number;
  withMusic: number;
  withMap: number;
  withCard: number;
  withPhone: number;
}

export class GuestStatsDto {
  /** Invitations that are or were public (published or hidden). */
  invitations: number;
  /** Of those, how many got at least one reply. */
  withReplies: number;
  replies: number;
  attending: number;
  /** People coming, guests included. */
  guests: number;
  wishes: number;
  liked: number;
}

export class CheckoutStatsDto {
  /** Orders started with "Pay and publish". */
  orders: number;
  paid: number;
  /** Payme transactions cancelled before payment (any reason). */
  cancelled: number;
  /** Of those, cancelled by Payme's 12-hour timeout. */
  timedOut: number;
}

/** A distribution over a fixed set of keys (weekday 1–7, hour 0–23, month 1–12). */
export class CountByDto {
  key: number;
  count: number;
}

export class StatsDetailsDto {
  days: number;
  /** "day" up to 90 days, "month" for a year. */
  unit: 'day' | 'month';
  trend: TrendPointDto[];
  themes: ThemeUsageDto[];
  music: MusicUsageDto[];
  funnel: FunnelDto;
  features: FeatureUsageDto;
  guests: GuestStatsDto;
  checkout: CheckoutStatsDto;
  /** When weddings are held (Tashkent time), all invitations. */
  eventWeekdays: CountByDto[];
  eventHours: CountByDto[];
  eventMonths: CountByDto[];
}
