import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * Only the admin panel and API are closed to crawlers. Login, cabinet and
 * invitation pages stay crawlable so search engines see their noindex; a
 * blocked URL can still be indexed from links to it.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: ["/admin", "/api/"] },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
