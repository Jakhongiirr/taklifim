import { Yeseva_One } from "next/font/google";
import { heavySerifExt } from "../shared/cyrillic-ext-fonts";

/** A soft, feminine display serif for names and headings; has Cyrillic. */
const yesevaFont = Yeseva_One({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-arcade-yeseva",
  // No system-font fallback in its stack, so ҳ (Uzbek) reaches Playfair.
  adjustFontFallback: false,
  fallback: [],
});

export const yeseva = {
  className: `${yesevaFont.variable} ${heavySerifExt.variable} [font-family:var(--font-arcade-yeseva),var(--font-cyr-ext-heavy),serif]`,
};
