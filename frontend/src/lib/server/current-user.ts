import "server-only";
import { cookies, headers } from "next/headers";
import type { User } from "@/lib/api-types";
import { routing } from "@/i18n/routing";
import { ACCESS_COOKIE, clientIpFrom, fetchCurrentUser } from "./session";

/** The visitor's IP, for backend calls made for them. */
export async function clientIp() {
  return clientIpFrom((await headers()).get("x-forwarded-for"));
}

/** The access token from the session cookie (server components only). */
export async function getAccessToken() {
  return (await cookies()).get(ACCESS_COOKIE)?.value;
}

/** The logged-in user for this request (server components only). */
export async function getCurrentUser(): Promise<User | null> {
  return fetchCurrentUser(await getAccessToken(), await clientIp());
}

/** Only same-site admin paths, to avoid open redirects via ?next=. */
export function safeAdminPath(next: string | string[] | undefined) {
  return typeof next === "string" &&
    next.startsWith("/admin/") &&
    !next.startsWith("//")
    ? next
    : "/admin";
}

/**
 * Only paths inside the public site's locale (e.g. /uz/cabinet), to avoid
 * open redirects via ?next=. Falls back to the cabinet.
 */
export function safeSitePath(
  next: string | string[] | undefined,
  locale: string,
) {
  const fallback = `/${locale}/cabinet`;
  if (typeof next !== "string" || next.startsWith("//")) return fallback;
  const inSite = routing.locales.some(
    (l) => next === `/${l}` || next.startsWith(`/${l}/`),
  );
  return inSite ? next : fallback;
}
