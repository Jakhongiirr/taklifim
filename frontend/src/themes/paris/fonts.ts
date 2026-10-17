import { Playfair_Display, Poiret_One } from "next/font/google";

/** Fashion-magazine italic for the names; has Cyrillic. */
export const playfair = Playfair_Display({
  weight: ["400", "500"],
  style: ["italic", "normal"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});

/** Thin Art Deco capitals, like old Parisian signage, for small lines. */
export const poiret = Poiret_One({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
