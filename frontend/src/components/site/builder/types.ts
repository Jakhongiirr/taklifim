import type { FileDto } from "@/lib/api-types";

/** A design to pick: a theme, shown with its demo's image when it has one. */
export interface Design {
  /** The backend theme's id (what an invitation stores). */
  id: string;
  /** The design's key, e.g. "plov" (the backend theme's `themeId`). */
  key: string;
  name: string;
  price: number;
  imageUrl: string | null;
  demoUrl: string | null;
}

/** A photo already on the invitation, or one picked but not yet uploaded. */
export type Photo =
  | { key: string; existing: FileDto }
  | { key: string; file: File; preview: string };

/** The couple's own music: already on the invitation, or picked but not yet uploaded. */
export type OwnMusic = { existing: FileDto } | { file: File; preview: string };

/** The music picker's value for the couple's own music (else a track id, or ""). */
export const OWN_MUSIC = "own";
