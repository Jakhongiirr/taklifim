import { Yeseva_One } from "next/font/google";

// Not preloaded: every theme is in the invitation page's bundle, so preloading
// would fetch all themes' fonts. The browser loads the ones the page uses.

/** A soft, feminine display serif for names and headings; has Cyrillic. */
export const yeseva = Yeseva_One({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
