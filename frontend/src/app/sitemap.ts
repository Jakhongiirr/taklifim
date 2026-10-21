import type { MetadataRoute } from "next";
import { ARTICLES } from "@/content/articles";
import { routing } from "@/i18n/routing";
import { languageUrls, PUBLIC_PATHS, SITE_URL } from "@/lib/seo";

/** The public pages in every language, each listing its translations. */
export default function sitemap(): MetadataRoute.Sitemap {
  return PUBLIC_PATHS.flatMap((path) => {
    const article = /^\/articles\/(.+)$/.exec(path)?.[1];
    return routing.locales.map((locale) => ({
      url: `${SITE_URL}/${locale}${path}`,
      ...(article && { lastModified: ARTICLES[article].published }),
      priority:
        path === ""
          ? 1
          : /^\/(designs|wording|articles)/.test(path)
            ? 0.8
            : 0.3,
      alternates: { languages: languageUrls(path, SITE_URL) },
    }));
  });
}
