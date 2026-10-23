import { Playfair_Display, Poiret_One } from "next/font/google";
import { serifExt, thinSansExt } from "../shared/cyrillic-ext-fonts";

/** Fashion-magazine italic for the names; has Cyrillic. */
const playfairFont = Playfair_Display({
  weight: ["400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-paris-playfair",
  // No system-font fallback in its stacks, so the ғ, қ, ҳ of Uzbek reach
  // the look-alikes after them.
  adjustFontFallback: false,
  fallback: [],
});

export const playfair = {
  className: `${playfairFont.variable} ${serifExt.variable} [font-family:var(--font-paris-playfair),var(--font-cyr-ext-serif),serif]`,
};

/** Thin Art Deco capitals, like old Parisian signage, for small lines. */
const poiretFont = Poiret_One({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-paris-poiret",
  adjustFontFallback: false,
  fallback: [],
});

export const poiret = {
  className: `${poiretFont.variable} ${thinSansExt.variable} [font-family:var(--font-paris-poiret),var(--font-cyr-ext-thin),sans-serif]`,
};
