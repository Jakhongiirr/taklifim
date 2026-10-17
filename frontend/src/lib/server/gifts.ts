import "server-only";
import type { ApiBody, MyGifts } from "@/lib/api-types";
import { clientIp, getAccessToken } from "./current-user";
import { API_URL, backendHeaders } from "./session";

/** The logged-in user's free plov invitations; null if loading failed. */
export async function getMyGifts(): Promise<MyGifts | null> {
  const accessToken = await getAccessToken();
  if (!accessToken) return null;
  try {
    const res = await fetch(`${API_URL}/gifts/me`, {
      headers: backendHeaders(accessToken, await clientIp()),
      cache: "no-store",
    });
    const body = (await res.json()) as ApiBody<MyGifts>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

/** The design a gift publishes for free (its theme's `themeId`). */
export const GIFT_THEME_ID = "plov";
