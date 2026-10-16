import { Cormorant_Garamond } from "next/font/google";

/**
 * An old-style book serif for everything: italic for the names, small
 * spaced capitals for labels. Has Cyrillic for Russian names.
 */
export const cormorant = Cormorant_Garamond({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
