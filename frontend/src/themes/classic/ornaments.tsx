/** SVG ornaments of the "classic" theme: gold line art on ivory. */

const DRAW = "classic-draw";

/**
 * A botanical sprig for a corner: a curving stem with leaves. It draws
 * itself in when the invitation opens (classic.css). Flip it with
 * `-scale-x-100` / `-scale-y-100` for the other corners.
 */
export function FloralCorner({ className = "" }: { className?: string }) {
  const leaves = [
    "M34 92 C40 76 54 72 62 76 C56 88 44 94 34 92Z",
    "M58 64 C60 48 72 40 82 42 C80 56 70 64 58 64Z",
    "M90 44 C96 30 110 26 118 30 C112 42 100 46 90 44Z",
    "M26 70 C20 56 26 44 34 40 C40 52 36 64 26 70Z",
    "M64 36 C60 22 66 12 76 8 C80 20 74 32 64 36Z",
    "M124 26 C132 16 146 14 152 18 C144 28 132 30 124 26Z",
  ];
  return (
    <svg aria-hidden viewBox="0 0 180 130" className={className}>
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M4 126 C16 96 30 78 52 64 C80 46 110 30 176 8"
          pathLength={1}
          className={DRAW}
        />
        <path d="M18 100 C22 92 26 84 34 80" pathLength={1} className={DRAW} />
        {leaves.map((d) => (
          <path key={d} d={d} pathLength={1} className={DRAW} />
        ))}
        <circle cx="160" cy="12" r="2" fill="currentColor" stroke="none" />
        <circle cx="12" cy="112" r="1.6" fill="currentColor" stroke="none" />
      </g>
    </svg>
  );
}

/** A gold wax seal with the couple's initials. */
export function WaxSeal({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`relative flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d9b77a,#a8844f_55%,#7d5f33)] shadow-[0_6px_14px_-4px_rgba(80,55,20,0.55),inset_0_-3px_6px_rgba(0,0,0,0.25),inset_0_2px_4px_rgba(255,255,255,0.35)] ${className}`}
    >
      <span className="absolute inset-[12%] rounded-full border border-dashed border-[#f6e9cc]/60" />
      <span className="relative font-serif text-[#fbf3df] italic drop-shadow-[0_1px_0_rgba(0,0,0,0.25)]">
        {initials}
      </span>
    </span>
  );
}

const PETALS = [
  { left: "8%", size: 14, duration: 14, delay: 0, drift: 60 },
  { left: "22%", size: 10, duration: 18, delay: 4, drift: -40 },
  { left: "38%", size: 12, duration: 16, delay: 9, drift: 50 },
  { left: "55%", size: 9, duration: 20, delay: 2, drift: -30 },
  { left: "70%", size: 13, duration: 15, delay: 6, drift: 40 },
  { left: "86%", size: 11, duration: 19, delay: 11, drift: -50 },
];

/** A few rose petals drifting down slowly (motion allowed only). */
export function Petals() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {PETALS.map((p) => (
        <svg
          key={p.left}
          viewBox="0 0 20 24"
          className="classic-petal absolute -top-6"
          style={
            {
              left: p.left,
              width: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              "--drift": `${p.drift}px`,
            } as React.CSSProperties
          }
        >
          <path
            d="M10 0 C17 5 20 13 15 20 C13 23 7 23 5 20 C0 13 3 5 10 0Z"
            fill="#ecc9c1"
            opacity="0.9"
          />
          <path
            d="M10 3 C11 9 11 15 10 21"
            stroke="#d9aaa0"
            strokeWidth="0.8"
            fill="none"
          />
        </svg>
      ))}
    </div>
  );
}
