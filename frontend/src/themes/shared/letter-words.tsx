import type { PublicTaklif } from "@/lib/api-types";

/**
 * Words up to this long (breaks counted as below) keep the letter's type
 * size; the default wordings, two paragraphs, come out at about 0.9.
 */
const FITS = 300;
/** A line or paragraph break leaves about this much of a line empty. */
const BREAK = 22;
/** Never smaller than this share of the letter's type size. */
const MIN_SCALE = 0.72;
/** "tight": a shorter frame (haven's parchment between the watch and books). */
const TIGHT = { fits: 220, min: 0.6 };

/**
 * The letter's words: the owner's own, as they wrote them (line breaks kept,
 * in every language), or else the occasion's `fallback` wording. Paragraphs
 * (split at blank lines) get a small gap rather than a whole empty line.
 * Themes whose letter sits in a fixed frame pass `fit`: longer words are then
 * set smaller, as a block with its own size so the line spacing follows it;
 * `fit="tight"` shrinks sooner and further, for a shorter frame.
 */
export default function LetterWords({
  taklif,
  fallback,
  fit = false,
}: {
  taklif: Pick<PublicTaklif, "letterText">;
  fallback: string;
  fit?: boolean | "tight";
}) {
  const words = taklif.letterText?.trim() || fallback;
  const paragraphs = words.split(/\n\s*\n/);
  const breaks = words.split("\n").length - 1;
  const weight = words.length + breaks * BREAK;
  const { fits, min } =
    fit === "tight" ? TIGHT : { fits: FITS, min: MIN_SCALE };
  const scale = fit ? Math.max(min, Math.min(1, Math.sqrt(fits / weight))) : 1;
  if (paragraphs.length === 1 && scale === 1 && !words.includes("\n")) {
    return words;
  }
  return (
    <span
      className="block whitespace-pre-line"
      style={scale < 1 ? { fontSize: `${scale.toFixed(3)}em` } : undefined}
    >
      {paragraphs.map((paragraph, i) => (
        <span key={i} className={i ? "mt-[0.6em] block" : "block"}>
          {paragraph}
        </span>
      ))}
    </span>
  );
}
