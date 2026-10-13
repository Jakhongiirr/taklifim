import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["uz", "ru", "en"],
  defaultLocale: "uz",
  // Pages declare their language versions in <head> (lib/seo.ts) instead
  // of the middleware's Link header, so there's one source for them.
  alternateLinks: false,
});
