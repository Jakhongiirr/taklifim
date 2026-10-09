import { Transform } from 'class-transformer';
import { IsInt, IsString, Matches, Max, MaxLength, Min } from 'class-validator';

/** Lowercase letters, digits and single hyphens: `classic`, `spring-2026`. */
export const THEME_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Fits Postgres `integer`. */
export const MAX_PRICE = 1_000_000_000;

export const normalizeThemeId = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim().toLowerCase() : value;

export class CreateThemeDto {
  /**
   * Unique key. Lowercase letters, digits and hyphens.
   * @example "classic"
   */
  @Transform(normalizeThemeId)
  @IsString()
  @MaxLength(50)
  @Matches(THEME_ID_PATTERN, {
    message: 'themeId may only contain lowercase letters, digits and hyphens',
  })
  themeId: string;

  /**
   * Price in whole so'm (UZS). 0 means free.
   * @example 150000
   */
  @IsInt()
  @Min(0)
  @Max(MAX_PRICE)
  price: number;
}
