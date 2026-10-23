import { Forum, Great_Vibes, Parisienne } from "next/font/google";
import { scriptExt } from "../shared/cyrillic-ext-fonts";

/** A romantic, flowing script for the names (Latin only). */
const parisienne = Parisienne({
  weight: "400",
  subsets: ["latin", "latin-ext"],
  display: "swap",
  preload: false,
  variable: "--font-dove-script",
  // No system-font fallback in its stack: it has Cyrillic, so Cyrillic
  // names would use it instead of reaching Great Vibes below.
  adjustFontFallback: false,
  fallback: [],
});

/** Cyrillic names fall back to the closest elegant script that has it. */
const greatVibesCyrillic = Great_Vibes({
  weight: "400",
  subsets: ["cyrillic"],
  display: "swap",
  preload: false,
  variable: "--font-dove-script-cyr",
  // Nor in this one, so the ғ, қ, ҳ of Uzbek reach Bad Script.
  adjustFontFallback: false,
  fallback: [],
});

/**
 * Classes for the names' script: Parisienne, Great Vibes for Cyrillic, Bad
 * Script for the ғ, қ, ҳ of Uzbek.
 */
export const doveScript = `${parisienne.variable} ${greatVibesCyrillic.variable} ${scriptExt.variable} [font-family:var(--font-dove-script),var(--font-dove-script-cyr),var(--font-cyr-ext-script),cursive]`;

/** Classical capitals, like the arches' inscriptions, for headings. */
export const forum = Forum({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
