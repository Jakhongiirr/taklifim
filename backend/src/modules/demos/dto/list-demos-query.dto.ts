import { IsIn, IsOptional } from 'class-validator';

export const DEMO_STATUSES = ['active', 'archived', 'all'] as const;
export type DemoStatus = (typeof DEMO_STATUSES)[number];

export class ListDemosQueryDto {
  /** `archived` and `all` are admin only. */
  @IsOptional()
  @IsIn(DEMO_STATUSES)
  status: DemoStatus = 'active';
}
