import "server-only";
import type { ApiBody, Demo } from "@/lib/api-types";
import { API_URL, internalHeaders } from "./session";

/**
 * Active demos for the public site, newest first. Cached for 5 minutes, so
 * visitors don't each hit the backend; once stale, the cached list is still
 * served while it's refetched, and kept if the refetch fails.
 * Returns [] if the backend is down and nothing is cached yet; the page shows
 * an empty state for that visit only (failed answers aren't cached).
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
