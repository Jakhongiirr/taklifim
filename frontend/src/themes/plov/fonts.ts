import { Lora, Old_Standard_TT } from "next/font/google";

/**
 * A 19th-century book face for the names and headings: its italic recalls
 * hand-lettered invitations. Has Cyrillic for Russian names.
 */
export const oldStandard = Old_Standard_TT({
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});

/** A warm, readable serif for the text. */
export const lora = Lora({
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  subsets: ["latin", "latin-ext", "cyrillic"],
  display: "swap",
});
