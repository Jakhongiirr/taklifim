export class MyGiftsDto {
  /** Unused free plov invitations. */
  available: number;

  /**
   * The plov design's theme id (uuid), for a new invitation in it; null
   * while the design isn't active.
   */
  themeId: string | null;
}
