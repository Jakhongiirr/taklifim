import { FileDto } from '../../files/dto/file.dto';
import { MusicDto } from '../../music/dto/music.dto';
import { ThemeDto } from '../../themes/dto/theme.dto';
import { TaklifStatus } from '../taklif-status.enum';

export class TaklifDto {
  id: string;

  /**
   * Public identifier: GET /taklif/{slug}.
   * @example "k7m2xq9p"
   */
  slug: string;

  status: TaklifStatus;

  /** Owner's user id. */
  userId: string;

  /** @example "Madina" */
  brideName: string;

  /** @example "Jasur" */
  groomName: string;

  /** @example "Karimovlar oilasi" */
  hostName: string;

  /** When the wedding starts (UTC). */
  eventAt: Date;

  /**
   * Latest `eventAt` the owner may set: 30 days after the date it had when
   * first published. Null until then (and admins aren't limited).
   */
  eventAtLimit: Date | null;

  /**
   * When it was paid for; null while unpaid. Once paid it can be published
   * and hidden freely, but its theme can't change.
   */
  paidAt: Date | null;

  /** @example "Navruz to'yxonasi" */
  venueName: string;

  /** @example "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi 1" */
  venueAddress: string;

  /** Null without one. @example "https://maps.app.goo.gl/abc123" */
  locationUrl: string | null;

  /** In display order. */
  photos: FileDto[];

  /** @example "8600123456789012" */
  cardNumber: string | null;

  /** @example "+998901234567" */
  phone: string | null;

  /** Null when the invitation has no music. */
  music: MusicDto | null;

  theme: ThemeDto;

  createdAt: Date;

  updatedAt: Date;
}

export class TaklifOwnerDto {
  id: string;

  /** @example "+998901234567" */
  phone: string;
}

/** Admin list item: adds the owner's phone and the guests' reply count. */
export class AdminTaklifDto extends TaklifDto {
  owner: TaklifOwnerDto;

  /** @example 12 */
  responseCount: number;
}

export class AdminTaklifPageDto {
  /** Newest first. */
  items: AdminTaklifDto[];

  /**
   * Matching invitations across all pages.
   * @example 53
   */
  total: number;

  /** @example 1 */
  page: number;

  /** @example 20 */
  limit: number;
}

export class PublicFileDto {
  /**
   * Public URL of the file.
   * @example "http://localhost:9000/taklifim/uploads/2026/10/0b5e2f4e.jpg"
   */
  url: string;
}

export class PublicPhotoDto extends PublicFileDto {
  id: string;
}

export class PublicMusicDto {
  /** @example "Perfect" */
  title: string;

  /** @example "Ed Sheeran" */
  artist: string | null;

  file: PublicFileDto;
}

export class PublicThemeDto {
  /** Which design to render. @example "classic" */
  themeId: string;
}

/**
 * A published invitation as its guests get it: only what the page shows. No
 * owner, status, internal ids, file uploaders or original filenames.
 */
export class PublicTaklifDto {
  /** @example "k7m2xq9p" */
  slug: string;

  /** @example "Madina" */
  brideName: string;

  /** @example "Jasur" */
  groomName: string;

  /** @example "Karimovlar oilasi" */
  hostName: string;

  /** When the wedding starts (UTC). */
  eventAt: Date;

  /** @example "Navruz to'yxonasi" */
  venueName: string;

  /** @example "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi 1" */
  venueAddress: string;

  /** Null without one. @example "https://maps.app.goo.gl/abc123" */
  locationUrl: string | null;

  /** In display order. */
  photos: PublicPhotoDto[];

  /** @example "8600123456789012" */
  cardNumber: string | null;

  /** @example "+998901234567" */
  phone: string | null;

  music: PublicMusicDto | null;

  theme: PublicThemeDto;
}
