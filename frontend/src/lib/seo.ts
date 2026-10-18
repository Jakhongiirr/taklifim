import type { Metadata } from "next";
import { DESIGN_IDS } from "@/content/designs";
import { WORDING_TOPICS } from "@/content/wording";
import { routing } from "@/i18n/routing";

/**
 * The public site's origin, for absolute URLs (link previews, sitemap).
 * Static pages, robots.txt and the sitemap are rendered during the build,
 * so the image gets it as a build argument too.
 */
export const SITE_URL = process.env.SITE_URL ?? "http://localhost:3001";

/** Pages search engines should find, without the locale ("" is the home page). */
export const PUBLIC_PATHS = [
  "",
  "/designs",
  ...DESIGN_IDS.map((id) => `/designs/${id}`),
  "/wording",
  ...WORDING_TOPICS.map((id) => `/wording/${id}`),
  "/privacy",
  "/terms",
];

/** Each locale's URL of a page, plus x-default (Uzbek) for other languages. */
export function languageUrls(path: string, origin = "") {
  return {
    ...Object.fromEntries(
      routing.locales.map((locale) => [locale, `${origin}/${locale}${path}`]),
    ),
    "x-default": `${origin}/${routing.defaultLocale}${path}`,
  };
}

/** Canonical URL and language versions of a public page, relative to metadataBase. */
export function localeAlternates(
  locale: string,
  path: string,
): Metadata["alternates"] {
  return { canonical: `/${locale}${path}`, languages: languageUrls(path) };
}

/**
 * The one link preview image every page shares (public/og.jpg), with no text
 * on it. Bump ?v= when the file changes so messengers fetch the new one.
 */
export const OG_IMAGES = [
  { url: "/og.jpg?v=3", width: 1200, height: 630, alt: "taklifim.uz" },
];
