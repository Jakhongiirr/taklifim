import "server-only";
import type { NextResponse } from "next/server";
import type { ApiBody, AuthTokens, User } from "@/lib/api-types";

export const API_URL = process.env.API_URL ?? "http://localhost:3000";

// Proves to the backend that a request comes from this server, so it rate
// limits per visitor (X-Client-IP) instead of per server, and doesn't limit
// the server's own cached fetches. Same value as the backend's.
const INTERNAL_API_SECRET = process.env.INTERNAL_API_SECRET;
// Reverse proxies in front of this server that append to X-Forwarded-For.
const TRUSTED_PROXY_COUNT = Math.max(
  1,
  parseInt(process.env.TRUSTED_PROXY_COUNT ?? "1", 10) || 1,
);

/**
 * The visitor's IP: the X-Forwarded-For entry added by the outermost of our
 * TRUSTED_PROXY_COUNT proxies. Entries further left were sent by the client
 * and can be made up. Without a proxy, Next.js itself sets the header to the
 * connection's address (only when the client sent none, which is why
 * production must run behind a proxy that appends to it).
 */
export function clientIpFrom(forwardedFor: string | null) {
  const hops = (forwardedFor ?? "")
    .split(",")
    .map((hop) => hop.trim())
    .filter(Boolean);
  if (!hops.length) return null;
  const ip = hops[Math.max(0, hops.length - TRUSTED_PROXY_COUNT)];
  return ip.replace(/^::ffff:/, "");
}

/**
 * Headers identifying this server, and the visitor if there is one. The
 * request ID (from Caddy) puts the backend's log lines under the same ID.
 */
export function internalHeaders(
  clientIp?: string | null,
  requestId?: string | null,
) {
  const headers: Record<string, string> = {};
  if (INTERNAL_API_SECRET) headers["X-Internal-Secret"] = INTERNAL_API_SECRET;
  if (clientIp) headers["X-Client-IP"] = clientIp;
  if (requestId) headers["X-Request-Id"] = requestId;
  return headers;
}

export const ACCESS_COOKIE = "access_token";
export const REFRESH_COOKIE = "refresh_token";

// Renew the access token a little before the backend rejects it.
const ACCESS_EARLY_EXPIRY_SECONDS = 30;

/** Seconds until the JWT's `exp` (no signature check; the backend verifies). */
function secondsLeft(jwt: string): number {
  try {
    const payload = JSON.parse(
      Buffer.from(jwt.split(".")[1], "base64url").toString(),
    ) as { exp?: number };
    return Math.max(0, (payload.exp ?? 0) - Math.floor(Date.now() / 1000));
  } catch {
    return 0;
  }
}

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

type CookieJar = Pick<NextResponse["cookies"], "set" | "delete">;

export function setSessionCookies(jar: CookieJar, tokens: AuthTokens) {
  jar.set(ACCESS_COOKIE, tokens.accessToken, {
    ...cookieOptions,
    maxAge: Math.max(
      1,
      secondsLeft(tokens.accessToken) - ACCESS_EARLY_EXPIRY_SECONDS,
    ),
  });
  jar.set(REFRESH_COOKIE, tokens.refreshToken, {
    ...cookieOptions,
    maxAge: secondsLeft(tokens.refreshToken),
  });
}

export function clearSessionCookies(jar: CookieJar) {
  jar.delete(ACCESS_COOKIE);
  jar.delete(REFRESH_COOKIE);
}

// The backend rotates refresh tokens, so a second refresh with the same token
// fails and would log the user out. Parallel requests right after the access
// token expired (prefetches, several tabs) share one refresh per token; the
// result is kept briefly for requests still carrying the old cookie.
const REFRESH_SHARE_MS = 10_000;
const refreshes = new Map<string, Promise<AuthTokens | null>>();

/** Exchanges a refresh token for a new pair; null if it was rejected. */
export function refreshTokens(
  refreshToken: string,
  clientIp?: string | null,
): Promise<AuthTokens | null> {
  let refresh = refreshes.get(refreshToken);
  if (!refresh) {
    refresh = requestRefresh(refreshToken, clientIp);
    refreshes.set(refreshToken, refresh);
    void refresh.finally(() =>
      setTimeout(() => refreshes.delete(refreshToken), REFRESH_SHARE_MS),
    );
  }
  return refresh;
}

async function requestRefresh(
  refreshToken: string,
  clientIp?: string | null,
): Promise<AuthTokens | null> {
  try {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...internalHeaders(clientIp),
      },
      body: JSON.stringify({ refreshToken }),
      cache: "no-store",
    });
    const body = (await res.json()) as ApiBody<AuthTokens>;
    return body.success ? body.data : null;
  } catch {
    return null;
  }
}

/** Revokes the refresh token on the backend; failures are ignored. */
export async function revokeRefreshToken(
  refreshToken: string,
  clientIp?: string | null,
) {
  await fetch(`${API_URL}/auth/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...internalHeaders(clientIp),
    },
    body: JSON.stringify({ refreshToken }),
    cache: "no-store",
  }).catch(() => undefined);
}

/** Headers for a backend call made for the visitor, with their token. */
export function backendHeaders(accessToken: string, clientIp?: string | null) {
  return {
    Authorization: `Bearer ${accessToken}`,
    ...internalHeaders(clientIp),
  };
}

/** The logged-in user, or null when there is no valid access token. */
export async function fetchCurrentUser(
  accessToken: string | undefined,
  clientIp?: string | null,
): Promise<User | null> {
  if (!accessToken) return null;
  const res = await fetch(`${API_URL}/users/me`, {
    headers: backendHeaders(accessToken, clientIp),
    cache: "no-store",
  });
  if (res.status === 401) return null;
  const body = (await res.json()) as ApiBody<User>;
  if (!body.success) throw new Error(body.error.message);
  return body.data;
}
