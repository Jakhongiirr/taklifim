// Shapes returned by the backend (see backend README, "Responses").

export type Role = "user" | "admin";

export interface User {
  id: string;
  phone: string;
  role: Role;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface FileDto {
  id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  uploadedById: string | null;
  createdAt: string;
}

export interface Music {
  id: string;
  title: string;
  artist: string | null;
  file: FileDto;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type MusicStatus = "active" | "archived" | "all";

export interface Theme {
  id: string;
  themeId: string;
  /** Whole so'm (UZS). */
  price: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ThemeStatus = "active" | "archived" | "all";

export interface Demo {
  id: string;
  title: string;
  text: string;
  demoUrl: string;
  image: FileDto;
  theme: Theme;
  /** Order on the site: lower comes first. */
  position: number;
  archivedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export type DemoStatus = "active" | "archived" | "all";

export type TaklifStatus = "draft" | "published" | "unpublished";

/** An invitation. */
export interface Taklif {
  id: string;
  slug: string;
  status: TaklifStatus;
  userId: string;
  brideName: string;
  groomName: string;
  hostName: string;
  /** ISO 8601, UTC. */
  eventAt: string;
  /**
   * How many more times the owner may change eventAt (5 in all once
   * published); null before the first publish.
   */
  eventAtChangesLeft: number | null;
  /**
   * When it was paid for; null while unpaid. Paid invitations are published
   * and hidden freely, but their design can't change.
   */
  paidAt: string | null;
  venueName: string;
  venueAddress: string;
  /** Null without one. */
  locationUrl: string | null;
  /** In display order. */
  photos: FileDto[];
  cardNumber: string | null;
  phone: string | null;
  /** Null when the invitation has no music. */
  music: Music | null;
  theme: Theme;
  createdAt: string;
  updatedAt: string;
}

/** A published invitation as guests get it (GET /taklif/:slug). */
export interface PublicTaklif {
  slug: string;
  brideName: string;
  groomName: string;
  hostName: string;
  /** ISO 8601, UTC. */
  eventAt: string;
  venueName: string;
  venueAddress: string;
  /** Null without one. */
  locationUrl: string | null;
  /** In display order. */
  photos: { id: string; url: string }[];
  cardNumber: string | null;
  phone: string | null;
  music: { title: string; artist: string | null; file: { url: string } } | null;
  theme: { themeId: string };
}

export interface AdminTaklif extends Taklif {
  owner: { id: string; phone: string };
  responseCount: number;
}

/** A user as admins see it (GET /users, /users/:id). */
export interface AdminUser {
  id: string;
  phone: string;
  role: Role;
  lastLoginAt: string | null;
  createdAt: string;
  /** Invitations in any status. */
  taklifCount: number;
  publishedCount: number;
}

export type OrderStatus = "pending" | "paid";

/** Payme's transaction states: created, performed, cancelled before/after. */
export type PaymeState = 1 | 2 | -1 | -2;

/** An order as admins see it (GET /payments). */
export interface AdminOrder {
  id: string;
  title: string;
  /** Whole so'm. */
  amount: number;
  status: OrderStatus;
  paidAt: string | null;
  createdAt: string;
  /** Null once the invitation is deleted. */
  taklif: { id: string; slug: string } | null;
  /** Null once the user is deleted. */
  user: { id: string; phone: string } | null;
  themeId: string | null;
  /** The newest Payme transaction, if any. */
  payme: { id: string; state: PaymeState; reason: number | null } | null;
}

/** The admin dashboard (GET /stats). */
export interface Stats {
  users: { total: number; admins: number; new7d: number; active7d: number };
  invitations: {
    total: number;
    draft: number;
    published: number;
    unpublished: number;
    new7d: number;
  };
  responses: { total: number; new7d: number; guests: number };
  /** Paid orders, in so'm. */
  revenue: { total: number; week: number; orders: number };
  /** Most used first. */
  themes: { id: string; themeId: string; total: number; published: number }[];
  upcoming: {
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    eventAt: string;
    themeId: string;
    responseCount: number;
  }[];
  recentInvitations: {
    id: string;
    slug: string;
    groomName: string;
    brideName: string;
    status: TaklifStatus;
    createdAt: string;
    themeId: string;
    ownerId: string;
    ownerPhone: string;
  }[];
  recentResponses: {
    id: string;
    name: string;
    attending: boolean;
    guests: number;
    message: string | null;
    createdAt: string;
    taklifId: string;
    slug: string;
    groomName: string;
    brideName: string;
  }[];
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

/** A login through the Telegram bot, as the site's own API returns it. */
export interface TelegramLoginStarted {
  /** The bot link to open. */
  url: string;
  /** Seconds the link stays usable. */
  expiresIn: number;
}

export type TelegramLoginStatus =
  { status: "pending" | "expired" } | { status: "done"; user: User };

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export interface ApiErrorBody {
  success: false;
  error: {
    statusCode: number;
    code: string;
    message: string;
    details?: unknown;
  };
}

export type ApiBody<T> = { success: true; data: T } | ApiErrorBody;

/** A wish on a published invitation (GET /taklif/:slug/wishes). */
export interface PublicWish {
  id: string;
  name: string;
  message: string;
  /** The couple liked it. */
  liked: boolean;
  createdAt: string;
}

/** A guest's reply, as the owner sees it. */
export interface TaklifResponse {
  id: string;
  name: string;
  attending: boolean;
  /** People coming including the guest. */
  guests: number;
  message: string | null;
  liked: boolean;
  createdAt: string;
}

export interface TaklifResponses {
  items: TaklifResponse[];
  attending: number;
  declined: number;
  /** People coming in total. */
  guests: number;
}

/** The admin Statistics page (GET /stats/details). */
export interface StatsDetails {
  days: 30 | 90 | 365;
  /** "day" up to 90 days, "month" for a year. */
  unit: "day" | "month";
  trend: {
    /** Bucket start, YYYY-MM-DD (Tashkent). */
    date: string;
    invitations: number;
    paid: number;
    /** So'm. */
    revenue: number;
    users: number;
    replies: number;
  }[];
  themes: {
    id: string;
    themeId: string;
    price: number;
    archived: boolean;
    total: number;
    published: number;
    paid: number;
    revenue: number;
  }[];
  /** `id` null: invitations without music. */
  music: {
    id: string | null;
    title: string | null;
    artist: string | null;
    archived: boolean;
    invitations: number;
  }[];
  funnel: { users: number; created: number; published: number; paid: number };
  features: {
    total: number;
    withPhotos: number;
    avgPhotos: number;
    withMusic: number;
    withMap: number;
    withCard: number;
    withPhone: number;
  };
  guests: {
    invitations: number;
    withReplies: number;
    replies: number;
    attending: number;
    guests: number;
    wishes: number;
    liked: number;
  };
  checkout: {
    orders: number;
    paid: number;
    cancelled: number;
    timedOut: number;
  };
  eventWeekdays: { key: number; count: number }[];
  eventHours: { key: number; count: number }[];
  eventMonths: { key: number; count: number }[];
}
