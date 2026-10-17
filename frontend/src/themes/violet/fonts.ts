import { Marck_Script, Tenor_Sans } from "next/font/google";

/** A dreamy hand for the names, glowing like moonlight; has Cyrillic. */
export const marck = Marck_Script({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});

/** Airy, wide capitals for headings and small lines. */
export const tenor = Tenor_Sans({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
