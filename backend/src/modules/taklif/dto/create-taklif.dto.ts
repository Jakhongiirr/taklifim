import { IsOptional, IsUUID } from 'class-validator';
import {
  CardNumber,
  EventAt,
  LocationUrl,
  OptionalPhone,
  PhotoIds,
  Text,
} from './taklif-fields';

export class CreateTaklifDto {
  /** @example "Madina" */
  @Text(100)
  brideName: string;

  /** @example "Jasur" */
  @Text(100)
  groomName: string;

  /** @example "Karimovlar oilasi" */
  @Text(100)
  hostName: string;

  /**
   * When the wedding starts, with a time zone.
   * @example "2026-10-20T18:00:00+05:00"
   */
  @EventAt()
  eventAt: string;

  /** @example "Navruz to'yxonasi" */
  @Text(200)
  venueName: string;

  /** @example "Toshkent, Chilonzor tumani, Bunyodkor ko'chasi 1" */
  @Text(300)
  venueAddress: string;

  /** @example "https://maps.app.goo.gl/abc123" */
  @LocationUrl()
  locationUrl: string;

  /**
   * Up to 6 image ids from POST /files, in display order. Users can only use
   * images they uploaded.
   */
  @IsOptional()
  @PhotoIds()
  photoIds?: string[];

  /** @example "8600123456789012" */
  @IsOptional()
  @CardNumber()
  cardNumber?: string;

  /** @example "+998901234567" */
  @IsOptional()
  @OptionalPhone()
  phone?: string;

  /** Optional. An active track from GET /music. */
  @IsOptional()
  @IsUUID()
  musicId?: string;

  /** An active theme's `id` from GET /themes. */
  @IsUUID()
  themeId: string;
}
