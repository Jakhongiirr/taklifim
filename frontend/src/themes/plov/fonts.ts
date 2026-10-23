import { Lora, Old_Standard_TT } from "next/font/google";
import { serifExt } from "../shared/cyrillic-ext-fonts";

/**
 * A 19th-century book face for the names and headings: its italic recalls
 * hand-lettered invitations. Has Cyrillic for Russian names.
 */
const oldStandardFont = Old_Standard_TT({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-plov-old-standard",
  // No system-font fallback in its stack, so ҳ (Uzbek) reaches Playfair.
  adjustFontFallback: false,
  fallback: [],
});

export const oldStandard = {
  className: `${oldStandardFont.variable} ${serifExt.variable} [font-family:var(--font-plov-old-standard),var(--font-cyr-ext-serif),serif]`,
};

/** A warm, readable serif for the text. */
export const lora = Lora({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
