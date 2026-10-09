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
  /** Latest eventAt the owner may set (30 days after it at first publish). */
  eventAtLimit: string | null;
  venueName: string;
  venueAddress: string;
  locationUrl: string;
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
  locationUrl: string;
  /** In display order. */
  photos: { id: string; url: string }[];
  cardNumber: string | null;
  phone: string | null;
  music: { title: string; artist: string | null; file: { url: string } } | null;
  theme: { themeId: string };
}

export interface AdminTaklif extends Taklif {
  owner: { id: string; phone: string };
}

export interface Page<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}

export interface OtpRequested {
  expiresIn: number;
  retryAfter: number;
}

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
