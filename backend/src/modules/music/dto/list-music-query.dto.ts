import { IsIn, IsOptional } from 'class-validator';

export const MUSIC_STATUSES = ['active', 'archived', 'all'] as const;
export type MusicStatus = (typeof MUSIC_STATUSES)[number];

export class ListMusicQueryDto {
  /** `archived` and `all` are admin only. */
  @IsOptional()
  @IsIn(MUSIC_STATUSES)
  status: MusicStatus = 'active';
}
