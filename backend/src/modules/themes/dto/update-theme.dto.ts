import { Transform } from 'class-transformer';
import {
  IsInt,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
} from 'class-validator';
import {
  MAX_PRICE,
  normalizeThemeId,
  THEME_ID_PATTERN,
} from './create-theme.dto';

/** Only the fields sent are changed. */
export class UpdateThemeDto {
  /** @example "classic" */
  @Transform(normalizeThemeId)
  @ValidateIf((_, value) => value !== undefined) // null is rejected
  @IsString()
  @MaxLength(50)
  @Matches(THEME_ID_PATTERN, {
    message: 'themeId may only contain lowercase letters, digits and hyphens',
  })
  themeId?: string;

  /**
   * Price in whole so'm (UZS).
   * @example 150000
   */
  @ValidateIf((_, value) => value !== undefined) // null is rejected
  @IsInt()
  @Min(0)
  @Max(MAX_PRICE)
  price?: number;
}
