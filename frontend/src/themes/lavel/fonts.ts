import { Alex_Brush, EB_Garamond, Great_Vibes } from "next/font/google";
import { scriptExt } from "../shared/cyrillic-ext-fonts";

/** A graceful calligraphic script for the names and big words (Latin only). */
const alexBrush = Alex_Brush({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--font-lavel-script",
  // No system-font fallback in its stack, so Cyrillic reaches Great Vibes.
  adjustFontFallback: false,
  fallback: [],
});

/** Cyrillic falls back to the closest elegant script that has it. */
const greatVibesCyrillic = Great_Vibes({
  weight: "400",
  subsets: ["cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-lavel-script-cyr",
  // Nor in this one, so the ғ, қ, ҳ of Uzbek reach Bad Script.
  adjustFontFallback: false,
  fallback: [],
});

/**
 * Classes for the script: Alex Brush, Great Vibes for Cyrillic, Bad Script
 * for the ғ, қ, ҳ of Uzbek.
 */
export const lavelScript = `${alexBrush.variable} ${greatVibesCyrillic.variable} ${scriptExt.variable} [font-family:var(--font-lavel-script),var(--font-lavel-script-cyr),var(--font-cyr-ext-script),cursive]`;

/** A classic book serif for the text; italic for the quiet lines. */
export const garamond = EB_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
