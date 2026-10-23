import type { PublicTaklif } from "@/lib/api-types";

/**
 * Own words up to this long (line breaks counted as below) keep the letter's
 * type size: about the default wording's length, which fills a letter frame.
 */
const FITS = 220;
/** A line break leaves about this much of a line empty. */
const BREAK = 22;
/** Never smaller than this share of the letter's type size. */
const MIN_SCALE = 0.72;

/**
 * The letter's words: the owner's own, as they wrote them (line breaks kept,
 * in every language), or else the occasion's `fallback` wording. Themes whose
 * letter sits in a fixed frame pass `fit`: longer own words are then set
 * smaller, as a block with its own size so the line spacing follows it.
 */
export default function LetterWords({
  taklif,
  fallback,
  fit = false,
}: {
  taklif: Pick<PublicTaklif, "letterText">;
  fallback: string;
  fit?: boolean;
}) {
  const own = taklif.letterText?.trim();
  if (!own) return fallback;
  const breaks = own.split("\n").length - 1;
  const weight = own.length + breaks * BREAK;
  const scale = fit
    ? Math.max(MIN_SCALE, Math.min(1, Math.sqrt(FITS / weight)))
    : 1;
  return (
    <span
      className="block whitespace-pre-line"
      style={scale < 1 ? { fontSize: `${scale.toFixed(3)}em` } : undefined}
    >
      {own}
    </span>
  );
}
