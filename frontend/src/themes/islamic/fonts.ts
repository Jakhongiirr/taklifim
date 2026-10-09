import { Amiri } from "next/font/google";

/** Arabic calligraphic face for the Bismillah, the verse and the dua. */
export const amiri = Amiri({
  weight: ["400", "700"],
  subsets: ["arabic"],
  display: "swap",
});
