/**
 * The letter's main text. Paragraphs are split at blank lines; a text with
 * several (the fotiha letter) is set a little smaller, so it stays inside the
 * themes' painted frames.
 */
export default function LetterText({ text }: { text: string }) {
  const paragraphs = text.split(/\n\s*\n/);
  if (paragraphs.length === 1) return text;
  return (
    <span className="block text-[0.9em]">
      {paragraphs.map((paragraph, i) => (
        <span key={i} className={i ? "mt-[0.6em] block" : "block"}>
          {paragraph}
        </span>
      ))}
    </span>
  );
}
