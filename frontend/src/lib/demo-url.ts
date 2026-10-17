import { routing } from "@/i18n/routing";

// An invitation link, with or without a host and a locale prefix:
// "https://taklifim.uz/taklif/x", "/ru/taklif/x", "/taklif/x".
const INVITATION_URL = new RegExp(
  `^((?:https?://[^/]+)?)(?:/(?:${routing.locales.join("|")}))?(/taklif/.*)$`,
);

/**
 * A demo's link opened in the visitor's language. Demo links are typed in by
 * the admin, and a bare /taklif/ link would open in Uzbek (see proxy.ts), so
 * the locale prefix is set here. Links to anything else are left as they are.
 */
export function demoUrlFor(url: string, locale: string) {
  const match = INVITATION_URL.exec(url.trim());
  return match ? `${match[1]}/${locale}${match[2]}` : url;
}
