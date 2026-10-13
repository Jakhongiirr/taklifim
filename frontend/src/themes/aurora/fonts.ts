import { Great_Vibes } from "next/font/google";

// Not preloaded: every theme is in the invitation page's bundle, so preloading
// would fetch all themes' fonts. The browser loads the ones the page uses.

/** Calligraphy for the couple's names; has Cyrillic for Russian names. */
export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
