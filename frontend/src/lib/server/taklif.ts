import "server-only";
import type {
  ApiBody,
  PublicTaklif,
  Taklif,
  TaklifGuest,
  TaklifResponses,
} from "@/lib/api-types";
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

/**
 * The guest a personal link is for, on a published invitation; null if the
 * link is unknown (or the guest was removed). Cached like the invitation.
 */
export async function getInvitedGuest(
  slug: string,
  token: string,
): Promise<{ name: string } | null> {
  try {
    const res = await fetch(
      `${API_URL}/taklif/${encodeURIComponent(slug)}/guests/${encodeURIComponent(token)}`,
      { headers: internalHeaders(), next: { revalidate: 60 } },
    );
    const body = (await res.json()) as ApiBody<{ name: string }>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

/** The owner's named guests with their replies; null if loading failed. */
export async function getTaklifGuests(
  id: string,
): Promise<TaklifGuest[] | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  try {
    const res = await fetch(`${API_URL}/taklif/${id}/guests`, {
      headers: backendHeaders(accessToken, await clientIp()),
      cache: "no-store",
    });
    const body = (await res.json()) as ApiBody<TaklifGuest[]>;
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

/** Guests' replies to the owner's invitation; null if loading failed. */
export async function getTaklifResponses(
  id: string,
): Promise<TaklifResponses | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  try {
    const res = await fetch(`${API_URL}/taklif/${id}/responses`, {
      headers: backendHeaders(accessToken, await clientIp()),
      cache: "no-store",
    });
    const body = (await res.json()) as ApiBody<TaklifResponses>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}
