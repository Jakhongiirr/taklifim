import { Marck_Script, Tenor_Sans } from "next/font/google";

// Not preloaded: every theme is in the invitation page's bundle, so preloading
// would fetch all themes' fonts. The browser loads the ones the page uses.

/** A dreamy hand for the names, glowing like moonlight; has Cyrillic. */
export const marck = Marck_Script({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});

/** Airy, wide capitals for headings and small lines. */
export const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
