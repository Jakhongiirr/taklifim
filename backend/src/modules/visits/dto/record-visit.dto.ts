import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

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

  /**
   * `document.referrer` when it's another site (or app).
   * @example "https://www.google.com/"
   */
  @IsOptional()
  @IsString()
  @MaxLength(512)
  referrer?: string;

  /** The page's `utm_source` (or `ref`) query parameter. @example "instagram" */
  @IsOptional()
  @IsString()
  @MaxLength(64)
  utm?: string;
}
