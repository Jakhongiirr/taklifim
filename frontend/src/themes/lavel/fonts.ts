import { Comforter, Lora } from "next/font/google";

/** A light, flowing script for the names and the big words. */
export const comforter = Comforter({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

/** A soft book serif for the text; italic for the quiet lines. */
export const lora = Lora({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
