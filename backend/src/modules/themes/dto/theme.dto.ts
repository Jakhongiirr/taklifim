export class ThemeDto {
  id: string;

  /** @example "classic" */
  themeId: string;

  /**
   * Price in whole so'm (UZS).
   * @example 150000
   */
  price: number;

  /** Null while active. */
  archivedAt: Date | null;

  createdAt: Date;

  updatedAt: Date;
}
