import { Cormorant_SC, Prata } from "next/font/google";

// Not preloaded: every theme is in the invitation page's bundle, so preloading
// would fetch all themes' fonts. The browser loads the ones the page uses.

/** A high-contrast vintage serif for the names; has Cyrillic. */
export const prata = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
});

/** Old-style small capitals for headings and small lines. */
export const cormorantSc = Cormorant_SC({
  weight: ["500", "600"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
