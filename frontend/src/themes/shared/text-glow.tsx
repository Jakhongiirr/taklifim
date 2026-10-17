/**
 * A soft patch of the theme's paper colour behind a block of text, so the
 * words stay legible over a busy video frame without veiling the whole
 * picture. Put it first inside a `relative isolate` wrapper; `className`
 * can carry the theme's entrance animation so it rises with the words.
 */
export default function TextGlow({
  tone,
  className = "",
}: {
  /** Its colour, e.g. "bg-[#fbf6ec]/75". */
  tone: string;
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute -inset-x-8 -inset-y-10 -z-10 ${className}`}
    >
      <div className={`size-full rounded-[50%] blur-2xl ${tone}`} />
    </div>
  );
}
