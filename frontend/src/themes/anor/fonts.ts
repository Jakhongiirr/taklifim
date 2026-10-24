import { Spectral, Viaoda_Libre } from "next/font/google";

/**
 * A tall display serif with soft, sap-like strokes for the names and big
 * words, in the spirit of old Eastern book titles. Has the Cyrillic of
 * Russian and Uzbek (ғ, қ, ҳ).
 */
export const viaoda = Viaoda_Libre({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  preload: false,
});

/** A calm book serif for the text; italic for the quiet lines. */
export const spectral = Spectral({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic", "cyrillic-ext"],
  display: "swap",
  preload: false,
});
