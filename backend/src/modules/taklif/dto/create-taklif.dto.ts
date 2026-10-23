import { IsEnum, IsOptional, IsUUID } from 'class-validator';
import { TaklifOccasion } from '../taklif-occasion.enum';
import {
  CardNumber,
  EventAt,
  Latitude,
  LetterText,
  LocationUrl,
  Longitude,
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

  /** Optional; "wedding" by default. Changes the wording, not the design. */
  @IsOptional()
  @IsEnum(TaklifOccasion)
  occasion?: TaklifOccasion;

  /**
   * Optional: the owner's own words for the letter after the cover, instead
   * of the occasion's default wording. Shown as written in every language.
   */
  @IsOptional()
  @LetterText()
  letterText?: string | null;

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

  /** Optional. @example "https://maps.app.goo.gl/abc123" */
  @IsOptional()
  @LocationUrl()
  locationUrl?: string;

  /** The venue's pin on the map; sent with `longitude`. @example 41.311081 */
  @Latitude()
  latitude?: number;

  /** @example 69.240562 */
  @Longitude()
  longitude?: number;

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

  /**
   * Optional, instead of `musicId`: the couple's own music, an audio file id
   * from POST /files. Users can only use audio they uploaded.
   */
  @IsOptional()
  @IsUUID()
  customMusicId?: string;

  /** An active theme's `id` from GET /themes. */
  @IsUUID()
  themeId: string;
}
