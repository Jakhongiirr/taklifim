import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { languageUrls, PUBLIC_PATHS, SITE_URL } from "@/lib/seo";

/** The public pages in every language, each listing its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) =>
    routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      priority: path === "" ? 1 : 0.3,
      alternates: { languages: languageUrls(path, SITE_URL) },
    })),
  );
}
