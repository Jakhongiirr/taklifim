import { IsIn, IsOptional } from 'class-validator';

export const THEME_STATUSES = ['active', 'archived', 'all'] as const;
export type ThemeStatus = (typeof THEME_STATUSES)[number];

export class ListThemesQueryDto {
  /** `archived` and `all` are admin only. */
  @IsOptional()
  @IsIn(THEME_STATUSES)
  status: ThemeStatus = 'active';
}
