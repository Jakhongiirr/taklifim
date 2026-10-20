import { IsOptional, Matches } from 'class-validator';

export class RecordVisitDto {
  /**
   * A random id the browser keeps for this visitor.
   * @example "k2f8a0c4e1b94d7f9e3a"
   */
  @Matches(/^[A-Za-z0-9_-]{8,64}$/)
  visitorId: string;

  /** The invitation open on the page, if any. @example "k7m2xq9p" */
  @IsOptional()
  @Matches(/^[a-z0-9]{1,16}$/)
  slug?: string;
}
