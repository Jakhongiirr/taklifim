/** SVG ornaments of the "islamic" theme. Gold lines on emerald or ivory. */

/** Rub el Hizb: an 8-point star made of two squares. */
export function Star8({
  className = "",
  strokeWidth = 1,
}: {
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <g fill="none" stroke="currentColor" strokeWidth={strokeWidth}>
        <rect x="20" y="20" width="60" height="60" />
        <rect
          x="20"
          y="20"
          width="60"
          height="60"
          transform="rotate(45 50 50)"
        />
        <circle cx="50" cy="50" r="14" />
      </g>
    </svg>
  );
}

/** A tiled field of small 8-point stars (background texture). */
export function StarPattern({
  id,
  className = "",
}: {
  /** Unique per page: SVG pattern ids are global. */
  id: string;
  className?: string;
}) {
  return (
    <svg aria-hidden className={`absolute inset-0 size-full ${className}`}>
      <defs>
        <pattern id={id} width="56" height="56" patternUnits="userSpaceOnUse">
          <g
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            transform="translate(28 28)"
          >
            <rect x="-9" y="-9" width="18" height="18" />
            <rect x="-9" y="-9" width="18" height="18" transform="rotate(45)" />
          </g>
          <circle cx="0" cy="0" r="1.2" fill="currentColor" />
          <circle cx="56" cy="56" r="1.2" fill="currentColor" />
          <circle cx="56" cy="0" r="1.2" fill="currentColor" />
          <circle cx="0" cy="56" r="1.2" fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/**
 * A pointed (mihrab) arch outline for a 2:3 box. `draw` makes it
 * draw itself in when the invitation opens (see islamic.css).
 */
export function Arch({
  className = "",
  draw = false,
}: {
  className?: string;
  draw?: boolean;
}) {
  return (
    // The box is 2:3 like the viewBox, so the stroke scales evenly. (No
    // vector-effect: with it Chrome ignores pathLength and the draw-in
    // animation stops short.)
    <svg aria-hidden viewBox="0 0 200 300" className={className}>
      <path
        d="M2 298 V120 C2 62 60 30 100 2 C140 30 198 62 198 120 V298"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
        pathLength={1}
        className={draw ? "islamic-draw" : undefined}
      />
    </svg>
  );
}

/** A divider: lines with a small star in the middle. */
export function StarDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-current" />
      <Star8 className="size-4" strokeWidth={4} />
      <span className="h-px w-14 bg-gradient-to-l from-transparent to-current" />
    </div>
  );
}

/** A four-pointed sparkle that twinkles. */
export function Sparkle({
  className = "",
  delay = "0s",
}: {
  className?: string;
  delay?: string;
}) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 20 20"
      className={`islamic-twinkle absolute ${className}`}
      style={{ animationDelay: delay }}
    >
      <path
        d="M10 0 C11 7 13 9 20 10 C13 11 11 13 10 20 C9 13 7 11 0 10 C7 9 9 7 10 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
