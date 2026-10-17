import { IsOptional, IsUUID, ValidateIf } from 'class-validator';
import {
  CardNumber,
  EventAt,
  Latitude,
  LocationUrl,
  Longitude,
  OptionalPhone,
  PhotoIds,
  Text,
} from './taklif-fields';

const sent = (_: object, value: unknown) => value !== undefined; // null is rejected

/**
 * Only the fields sent are changed. `locationUrl`, `cardNumber` and `phone`
 * accept null to clear them; `latitude` and `longitude` are sent together
 * (both null removes the pin). `photoIds` replaces the whole list ([] removes all photos).
 */
export class UpdateTaklifDto {
  @ValidateIf(sent)
  @Text(100)
  brideName?: string;

  @ValidateIf(sent)
  @Text(100)
  groomName?: string;

  @ValidateIf(sent)
  @Text(100)
  hostName?: string;

  @ValidateIf(sent)
  @EventAt()
  eventAt?: string;

  @ValidateIf(sent)
  @Text(200)
  venueName?: string;

  @ValidateIf(sent)
  @Text(300)
  venueAddress?: string;

  @IsOptional()
  @LocationUrl()
  locationUrl?: string | null;

  @Latitude(true)
  latitude?: number | null;

  @Longitude(true)
  longitude?: number | null;

  @ValidateIf(sent)
  @PhotoIds()
  photoIds?: string[];

  @IsOptional()
  @CardNumber()
  cardNumber?: string | null;

  @IsOptional()
  @OptionalPhone()
  phone?: string | null;

  /** Send null to remove the music. */
  @IsOptional()
  @IsUUID()
  musicId?: string | null;

  @ValidateIf(sent)
  @IsUUID()
  themeId?: string;
}
