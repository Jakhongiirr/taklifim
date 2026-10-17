import { Yeseva_One } from "next/font/google";

/** A soft, feminine display serif for names and headings; has Cyrillic. */
export const yeseva = Yeseva_One({
  weight: "400",
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
  preload: false,
});
