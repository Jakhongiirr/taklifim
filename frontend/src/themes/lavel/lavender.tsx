// Lavender drawn in SVG: sprigs, a bouquet, a divider and a wreath. Plain
// shapes in the theme's lilacs and sage, so nothing is loaded and the art
// stays sharp at any size.

const BUDS = ["#6f58a8", "#8a73c0", "#a690d4", "#bfaee3"];
const STEM = "#7f8f6c";

/**
 * One lavender sprig standing in a 40×160 box: a curved stem with paired
 * buds getting smaller towards the tip, and two leaves at the foot.
 */
function SprigShapes({ bend = 0 }: { bend?: number }) {
  // The stem: from the foot (20,160) to the tip, leaning by `bend`.
  const tipX = 20 + bend;
  const at = (t: number) => {
    // A quadratic curve; t = 0 at the foot, 1 at the tip.
    const cx = 20 + bend * 0.2;
    const x = (1 - t) ** 2 * 20 + 2 * (1 - t) * t * cx + t ** 2 * tipX;
    const y = 160 - t * 152;
    return { x, y };
  };
  const buds = Array.from({ length: 11 }, (_, i) => {
    const t = 0.38 + i * 0.058;
    const { x, y } = at(t);
    const s = 1 - i * 0.055;
    return { x, y, s, i };
  });

  return (
    <>
      <path
        d={`M20 160 Q${20 + bend * 0.2} 84 ${tipX} 8`}
        fill="none"
        stroke={STEM}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
      <path
        d="M20 150 C10 132 8 118 11 104 C15 118 18 132 20 150Z"
        fill={STEM}
        opacity="0.85"
      />
      <path
        d="M20 142 C30 126 32 114 30 100 C25 113 22 126 20 142Z"
        fill={STEM}
        opacity="0.7"
      />
      {buds.map(({ x, y, s, i }) => (
        <g key={i} transform={`translate(${x.toFixed(2)} ${y.toFixed(2)})`}>
          <ellipse
            cx={-3.6 * s}
            cy="0"
            rx={2.6 * s}
            ry={4.6 * s}
            transform={`rotate(-32 ${-3.6 * s} 0)`}
            fill={BUDS[i % 2]}
          />
          <ellipse
            cx={3.6 * s}
            cy="0"
            rx={2.6 * s}
            ry={4.6 * s}
            transform={`rotate(32 ${3.6 * s} 0)`}
            fill={BUDS[(i + 1) % 2]}
          />
          <ellipse
            cx="0"
            cy={-2.4 * s}
            rx={2.2 * s}
            ry={4 * s}
            fill={BUDS[2 + (i % 2)]}
          />
        </g>
      ))}
    </>
  );
}

/** A single sprig. */
export function Sprig({
  className = "",
  bend = 0,
}: {
  className?: string;
  bend?: number;
}) {
  return (
    <svg aria-hidden viewBox="0 0 40 160" className={className}>
      <SprigShapes bend={bend} />
    </svg>
  );
}

/**
 * Five sprigs fanned out from one point, tied with a lilac ribbon. The
 * box is 120×170, the knot at the bottom centre.
 */
export function Bouquet({ className = "" }: { className?: string }) {
  const stems = [
    { a: -34, bend: -6, y: 12 },
    { a: -16, bend: -3, y: 0 },
    { a: 0, bend: 2, y: -8 },
    { a: 16, bend: 4, y: 0 },
    { a: 34, bend: 7, y: 12 },
  ];
  return (
    <svg aria-hidden viewBox="0 0 120 170" className={className}>
      {stems.map(({ a, bend, y }) => (
        <g key={a} transform={`rotate(${a} 60 160) translate(40 ${y - 4})`}>
          <SprigShapes bend={bend} />
        </g>
      ))}
      {/* The bow. */}
      <g fill="#c9b8e6" stroke="#8a73c0" strokeWidth="0.6">
        <path d="M60 140 C48 128 38 132 40 140 C42 147 52 146 60 140Z" />
        <path d="M60 140 C72 128 82 132 80 140 C78 147 68 146 60 140Z" />
        <path d="M58 141 L48 166 L53 163 L56 168 L60 143Z" />
        <path d="M62 141 L72 166 L67 163 L64 168 L60 143Z" />
        <circle cx="60" cy="140.5" r="3" />
      </g>
    </svg>
  );
}

/** A thin rule with two small sprigs lying towards a heart. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 28"
      className={`mx-auto h-7 w-56 ${className}`}
    >
      <path
        d="M4 14 H70 M150 14 H216"
        stroke="#a690d4"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <g transform="translate(70 17.5) rotate(-90) scale(0.17)">
        <SprigShapes bend={-4} />
      </g>
      <g transform="translate(150 10.5) rotate(90) scale(0.17)">
        <SprigShapes bend={-4} />
      </g>
      <path
        d="M110 21 C104 17 101 14 101 11.5 C101 9.5 103 8 105 8 C107 8 109 9.5 110 11 C111 9.5 113 8 115 8 C117 8 119 9.5 119 11.5 C119 14 116 17 110 21Z"
        fill="#8a73c0"
      />
    </svg>
  );
}

/**
 * A ring of small lavender buds, e.g. around a calendar day or the
 * initials. `r` is its radius in a 100×100 box.
 */
export function Wreath({
  className = "",
  r = 40,
  count = 22,
}: {
  className?: string;
  r?: number;
  count?: number;
}) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={STEM}
        strokeWidth="0.8"
        strokeOpacity="0.8"
      />
      {Array.from({ length: count }, (_, i) => {
        const deg = (i / count) * 360;
        // Leave a gap at the bottom, like a wreath tied there.
        if (deg > 160 && deg < 200) return null;
        const a = ((deg - 90) * Math.PI) / 180;
        const x = 50 + r * Math.cos(a);
        const y = 50 + r * Math.sin(a);
        return (
          <ellipse
            key={i}
            cx={x.toFixed(2)}
            cy={y.toFixed(2)}
            rx="2.2"
            ry="4.2"
            transform={`rotate(${(deg + (i % 2 ? 28 : -28)).toFixed(1)} ${x.toFixed(2)} ${y.toFixed(2)})`}
            fill={BUDS[i % 3]}
          />
        );
      })}
    </svg>
  );
}
