import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { SITE_URL } from "@/lib/seo";

const CLOSED = ["/admin", "/api/"];

/** Guests' invitations, short (/taklif/…) and in every language. */
const INVITATIONS = [
  "/taklif/",
  ...routing.locales.map((locale) => `/${locale}/taklif/`),
];

/**
 * Search engines index the public site but not people's invitations (their
 * pages are noindex as well), the admin panel or the API. Link preview bots
 * may still read invitations: a shared link shows its picture and title
 * only if they can fetch the page.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", disallow: [...CLOSED, ...INVITATIONS] },
      {
        userAgent: [
          "TelegramBot",
          "facebookexternalhit",
          "WhatsApp",
          "Twitterbot",
          "LinkedInBot",
          "Slackbot",
          "Discordbot",
        ],
        disallow: CLOSED,
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
