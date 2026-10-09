import "server-only";
import type { ApiBody, PublicTaklif, Taklif } from "@/lib/api-types";
import { clientIp, getAccessToken } from "./current-user";
import { API_URL, backendHeaders, internalHeaders } from "./session";

/** The logged-in user's invitations, newest first; null if loading failed. */
export async function getMyTaklifs(): Promise<Taklif[] | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  try {
    const res = await fetch(`${API_URL}/taklif/mine`, {
      headers: backendHeaders(accessToken, await clientIp()),
      cache: "no-store",
    });
    const body = (await res.json()) as ApiBody<Taklif[]>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

/**
 * A published invitation for its guests; null if there is none (or it isn't
 * published). Cached for a minute per slug, so one link shared with hundreds
 * of guests barely reaches the backend.
 */
export async function getPublishedTaklif(
  slug: string,
): Promise<PublicTaklif | null> {
  try {
    const res = await fetch(`${API_URL}/taklif/${encodeURIComponent(slug)}`, {
      headers: internalHeaders(),
      next: { revalidate: 60 },
    });
    const body = (await res.json()) as ApiBody<PublicTaklif>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

/** Any status, for its owner (or an admin); null otherwise. Never cached. */
export async function getTaklifPreview(slug: string): Promise<Taklif | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  try {
    const res = await fetch(
      `${API_URL}/taklif/preview/${encodeURIComponent(slug)}`,
      {
        headers: backendHeaders(accessToken, await clientIp()),
        cache: "no-store",
      },
    );
    const body = (await res.json()) as ApiBody<Taklif>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}
