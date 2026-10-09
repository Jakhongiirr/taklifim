import "server-only";
import type { ApiBody, Demo } from "@/lib/api-types";
import { API_URL, internalHeaders } from "./session";

/**
 * Active demos for the public site, newest first. Cached for 5 minutes, so
 * visitors don't each hit the backend.
 * Returns [] if the backend is down; the page shows an empty state.
 */
export async function getDemos(): Promise<Demo[]> {
  try {
    const res = await fetch(`${API_URL}/demos`, {
      headers: internalHeaders(),
      next: { revalidate: 300 },
    });
    const body = (await res.json()) as ApiBody<Demo[]>;
    return body.success ? body.data : [];
  } catch {
    return [];
  }
}
