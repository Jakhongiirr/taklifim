import { Transform, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsUUID,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { TaklifStatus } from '../taklif-status.enum';

export class ListTaklifQueryDto {
  /** Omit for all statuses. */
  @IsOptional()
  @IsEnum(TaklifStatus)
  status?: TaklifStatus;

  /**
   * Find by id or slug: a full UUID matches the id exactly; anything else
   * matches slugs starting with it (case-insensitive).
   * @example "k7m2"
   */
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() || undefined : value,
  )
  @IsOptional()
  @IsString()
  @MaxLength(64)
  q?: string;

  /** Only this user's invitations. */
  @IsOptional()
  @IsUUID()
  userId?: string;

  /** Only invitations in this theme (the theme row's id). */
  @IsOptional()
  @IsUUID()
  themeId?: string;

  /** 1-based. */
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit: number = 20;
}
