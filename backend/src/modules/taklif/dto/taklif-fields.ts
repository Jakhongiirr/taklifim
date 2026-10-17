import { applyDecorators } from '@nestjs/common';
import { Transform } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayUnique,
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsString,
  IsUrl,
  IsNumber,
  IsUUID,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export const MAX_PHOTOS = 6;

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

/** Required (or, in PATCH, non-null) trimmed text. */
export const Text = (maxLength: number) =>
  applyDecorators(
    Transform(trim),
    IsString(),
    IsNotEmpty(),
    MaxLength(maxLength),
  );

/**
 * ISO 8601 with a time zone, so the moment is unambiguous:
 * "2026-10-20T18:00:00+05:00" or "2026-10-20T13:00:00Z".
 */
export const EventAt = () =>
  applyDecorators(
    IsISO8601(
      { strict: true, strictSeparator: true },
      { message: 'eventAt must be an ISO 8601 date-time' },
    ),
    Matches(/T\d{2}:\d{2}(:\d{2}(\.\d+)?)?(Z|[+-]\d{2}:?\d{2})$/i, {
      message: 'eventAt must include a time and a time zone, e.g. +05:00',
    }),
  );

export const LocationUrl = () =>
  applyDecorators(
    Transform(trim),
    IsUrl(
      { require_protocol: true, protocols: ['http', 'https'] },
      { message: 'locationUrl must be an http(s) URL' },
    ),
    MaxLength(500),
  );

type Point = { latitude?: number | null; longitude?: number | null };

/**
 * The venue's map pin: `latitude` and `longitude` come together. In POST both
 * or neither; in PATCH both, or both null to remove the pin (one alone fails).
 */
const Coordinate = (limit: number, clearable: boolean) =>
  applyDecorators(
    ValidateIf(
      ({ latitude, longitude }: Point) =>
        (latitude !== undefined || longitude !== undefined) &&
        !(clearable && latitude === null && longitude === null),
    ),
    IsNumber({ allowNaN: false, allowInfinity: false }),
    Min(-limit),
    Max(limit),
  );
export const Latitude = (clearable = false) => Coordinate(90, clearable);
export const Longitude = (clearable = false) => Coordinate(180, clearable);

export const PhotoIds = () =>
  applyDecorators(
    IsArray(),
    ArrayMaxSize(MAX_PHOTOS),
    ArrayUnique(),
    IsUUID('all', { each: true }),
  );

/**
 * Spaces and hyphens are removed, so "8600 1234 5678 9012" is accepted.
 * null passes through (clears it in PATCH).
 */
export const CardNumber = () =>
  applyDecorators(
    Transform(({ value }: { value: unknown }) =>
      typeof value === 'string' ? value.replace(/[\s-]/g, '') : value,
    ),
    IsString(),
    Matches(/^\d{16}$/, { message: 'cardNumber must be 16 digits' }),
  );

/**
 * Normalized to E.164; numbers without a country code are treated as Uzbek.
 * An invalid number becomes "" so it fails validation instead of being
 * mistaken for "not sent". null passes through (clears it in PATCH).
 */
export const OptionalPhone = () =>
  applyDecorators(
    Transform(({ value }: { value: unknown }) => {
      if (value === null || value === undefined) return value;
      if (typeof value !== 'string') return '';
      const parsed = parsePhoneNumberFromString(value, 'UZ');
      return parsed?.isValid() ? parsed.number : '';
    }),
    IsString({ message: 'phone must be a valid phone number' }),
    IsNotEmpty({ message: 'phone must be a valid phone number' }),
  );
