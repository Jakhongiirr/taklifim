import { Great_Vibes } from "next/font/google";

/** Calligraphy for the couple's names; has Cyrillic for Russian names. */
export const greatVibes = Great_Vibes({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
