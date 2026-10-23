import { Great_Vibes } from "next/font/google";
import { scriptExt } from "../shared/cyrillic-ext-fonts";

/** Calligraphy for the couple's names; has Cyrillic for Russian names. */
const greatVibesFont = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-aurora-script",
  // No system-font fallback in its stack, so ғ, қ, ҳ reach Bad Script.
  adjustFontFallback: false,
  fallback: [],
});

export const greatVibes = {
  className: `${greatVibesFont.variable} ${scriptExt.variable} [font-family:var(--font-aurora-script),var(--font-cyr-ext-script),cursive]`,
};
