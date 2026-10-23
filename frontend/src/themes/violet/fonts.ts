import { Marck_Script, Tenor_Sans } from "next/font/google";
import { sansExt, scriptExt } from "../shared/cyrillic-ext-fonts";

/** A dreamy hand for the names, glowing like moonlight; has Cyrillic. */
const marckFont = Marck_Script({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-violet-marck",
  // No system-font fallback in its stacks, so the ғ, қ, ҳ of Uzbek reach
  // the look-alikes after them.
  adjustFontFallback: false,
  fallback: [],
});

export const marck = {
  className: `${marckFont.variable} ${scriptExt.variable} [font-family:var(--font-violet-marck),var(--font-cyr-ext-script),cursive]`,
};

/** Airy, wide capitals for headings and small lines. */
const tenorFont = Tenor_Sans({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-violet-tenor",
  adjustFontFallback: false,
  fallback: [],
});

export const tenor = {
  className: `${tenorFont.variable} ${sansExt.variable} [font-family:var(--font-violet-tenor),var(--font-cyr-ext-sans),sans-serif]`,
};
