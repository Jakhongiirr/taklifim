import Image from "next/image";

// The gold monogram (cut out of the brand artwork) and the traced wordmark,
// both in public/brand/. Sizes are the files' own.
const MARK = { src: "/brand/logo-mark.webp", width: 320, height: 240 };
const WORDMARK = { src: "/brand/logo-wordmark.svg", width: 1771, height: 325 };

/**
 * The taklifim.uz logo. `compact` shows just the monogram on phones, where
 * the header has no room for the wordmark; from `sm` the full logo shows.
 */
export default function Logo({
  compact = false,
  className = "h-9",
}: {
  compact?: boolean;
  /** Sets the height (the width follows). */
  className?: string;
}) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Image
        {...MARK}
        alt="taklifim.uz"
        unoptimized
        priority
        className="h-full w-auto"
      />
      <Image
        {...WORDMARK}
        alt=""
        unoptimized
        priority
        className={`h-[58%] w-auto ${compact ? "hidden sm:block" : ""}`}
      />
    </span>
  );
}
