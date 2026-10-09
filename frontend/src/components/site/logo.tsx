import Image from "next/image";

// Traced from the brand artwork (public/brand/). Sizes are the viewBoxes.
const HORIZONTAL = {
  src: "/brand/logo-horizontal.svg",
  width: 2425,
  height: 545,
};
const MARK = { src: "/brand/logo-mark.svg", width: 852, height: 843 };

/**
 * The taklifim.uz logo. `compact` shows just the emblem on phones, where the
 * header has no room for the wordmark; from `sm` the full logo shows.
 */
export default function Logo({
  compact = false,
  className = "h-9",
}: {
  compact?: boolean;
  /** Sets the height (the width follows). */
  className?: string;
}) {
  const full = (
    <Image
      {...HORIZONTAL}
      alt="taklifim.uz"
      unoptimized
      priority
      className={`w-auto ${className} ${compact ? "hidden sm:block" : ""}`}
    />
  );
  if (!compact) return full;
  return (
    <>
      <Image
        {...MARK}
        alt="taklifim.uz"
        unoptimized
        priority
        className={`w-auto sm:hidden ${className}`}
      />
      {full}
    </>
  );
}
