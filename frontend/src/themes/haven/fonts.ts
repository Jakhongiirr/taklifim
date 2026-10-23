import { Cormorant_SC, Prata } from "next/font/google";
import { serifExt } from "../shared/cyrillic-ext-fonts";

/** A high-contrast vintage serif for the names; has Cyrillic. */
const prataFont = Prata({
  weight: "400",
  subsets: ["latin", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-haven-prata",
  // No system-font fallback in its stack, so ҳ (Uzbek) reaches Playfair.
  adjustFontFallback: false,
  fallback: [],
});

export const prata = {
  className: `${prataFont.variable} ${serifExt.variable} [font-family:var(--font-haven-prata),var(--font-cyr-ext-serif),serif]`,
};

/** Old-style small capitals for headings and small lines. */
export const cormorantSc = Cormorant_SC({
  weight: ["500", "600"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
