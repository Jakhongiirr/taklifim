import { yeseva } from "@/themes/arcade/fonts";
import { greatVibes } from "@/themes/aurora/fonts";
import { cormorant } from "@/themes/classic/fonts";
import { doveScript } from "@/themes/dove/fonts";
import { prata } from "@/themes/haven/fonts";
import { lavelScript } from "@/themes/lavel/fonts";
import { playfair } from "@/themes/paris/fonts";
import { oldStandard } from "@/themes/plov/fonts";
import { marck } from "@/themes/violet/fonts";

/** Each design's name typeface (the one its invitation uses for names). */
export const DESIGN_NAME_FONT: Record<string, string> = {
  aurora: greatVibes.className,
  dove: doveScript,
  haven: prata.className,
  arcade: yeseva.className,
  violet: marck.className,
  paris: `${playfair.className} italic`,
  classic: `${cormorant.className} italic`,
  lavel: lavelScript,
  plov: `${oldStandard.className} italic`,
};
