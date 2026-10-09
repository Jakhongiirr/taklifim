import "server-only";
import type { ApiBody, Music, Theme } from "@/lib/api-types";
import { API_URL, internalHeaders } from "./session";

/** A public, cached catalog list; [] if the backend is down. */
async function getList<T>(path: string): Promise<T[]> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: internalHeaders(),
      next: { revalidate: 300 },
    });
    const body = (await res.json()) as ApiBody<T[]>;
    return body.success ? body.data : [];
  } catch {
    return [];
  }
}

/** Active themes, newest first. */
export const getThemes = () => getList<Theme>("/themes");

/** Active music tracks, newest first. */
export const getMusic = () => getList<Music>("/music");
