import type { routing } from "@/i18n/routing";
import type messages from "../messages/en.json";

// Type-checks locales and message keys in t() calls.
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof messages;
  }
}
