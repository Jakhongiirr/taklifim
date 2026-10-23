import { Bad_Script, Playfair, Raleway, Ysabeau_Office } from "next/font/google";

// Some theme fonts have Russian's Cyrillic but not the ғ, қ, ҳ of Uzbek in
// Cyrillic. These close look-alikes come after them in the font stack, so
// only those letters use them (only their Cyrillic Extended file loads).

/** For scripts (Great Vibes, Marck Script). */
export const scriptExt = Bad_Script({
  weight: "400",
  subsets: ["cyrillic-ext"],
  display: "swap",
  preload: false,
  variable: "--font-cyr-ext-script",
});

/** For high-contrast serifs (Playfair Display, Prata, Old Standard). */
export const serifExt = Playfair({
  style: ["normal", "italic"],
  subsets: ["cyrillic-ext"],
  display: "swap",
  preload: false,
  variable: "--font-cyr-ext-serif",
});

/** For the heavy Yeseva One: its only weight, used for any. */
export const heavySerifExt = Playfair({
  weight: "900",
  subsets: ["cyrillic-ext"],
  display: "swap",
  preload: false,
  variable: "--font-cyr-ext-heavy",
});

/** For the airy capitals of Tenor Sans. */
export const sansExt = Ysabeau_Office({
  weight: "400",
  subsets: ["cyrillic-ext"],
  display: "swap",
  preload: false,
  variable: "--font-cyr-ext-sans",
});

/** For the thin Art Deco Poiret One: its only weight, used for any. */
export const thinSansExt = Raleway({
  weight: "300",
  subsets: ["cyrillic-ext"],
  display: "swap",
  preload: false,
  variable: "--font-cyr-ext-thin",
});
