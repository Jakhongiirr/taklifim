// Gold ornaments in the spirit of Uzbek girih and islimi: eight-pointed
// stars, rosettes and rings of petals, all drawn as SVG.

const GOLD = "#b08a45";

/** Points of a star with `n` tips, as an SVG polygon. */
function star(n: number, outer: number, inner: number, cx = 50, cy = 50) {
  return Array.from({ length: n * 2 }, (_, i) => {
    const a = (i / (n * 2)) * Math.PI * 2 - Math.PI / 2;
    const r = i % 2 ? inner : outer;
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
}

/** `n` almond petals around the centre, between radii `from` and `to`. */
function petals(n: number, from: number, to: number, width: number) {
  const mid = (from + to) / 2;
  return Array.from({ length: n }, (_, i) => (
    <path
      key={i}
      transform={`rotate(${(i * 360) / n} 50 50)`}
      d={`M50 ${50 - from} Q${50 + width} ${50 - mid} 50 ${50 - to} Q${50 - width} ${50 - mid} 50 ${50 - from}Z`}
    />
  ));
}

/** An eight-pointed star in a double ring with petals: the theme's emblem. */
export function Rosette({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      stroke={GOLD}
      strokeWidth="0.9"
    >
      <circle cx="50" cy="50" r="47" />
      <circle cx="50" cy="50" r="44" strokeOpacity="0.5" />
      <g fill={GOLD} fillOpacity="0.16">
        {petals(16, 26, 43, 4.2)}
      </g>
      <polygon points={star(8, 26, 15)} fill="#fffaf0" />
      <polygon points={star(8, 20, 12)} fill={GOLD} fillOpacity="0.2" />
      <circle cx="50" cy="50" r="6" fill={GOLD} />
    </svg>
  );
}

/** A gold rule with a small eight-pointed star in the middle. */
export function StarRule({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 24"
      className={`mx-auto h-6 w-56 ${className}`}
      fill="none"
      stroke={GOLD}
      strokeWidth="0.9"
      strokeLinecap="round"
    >
      <path d="M8 12 H92 M128 12 H212" />
      <circle cx="86" cy="12" r="1.6" fill={GOLD} stroke="none" />
      <circle cx="134" cy="12" r="1.6" fill={GOLD} stroke="none" />
      <polygon
        points={star(8, 11, 6, 110, 12)}
        fill={GOLD}
        fillOpacity="0.25"
      />
      <circle cx="110" cy="12" r="2.4" fill={GOLD} stroke="none" />
    </svg>
  );
}

/**
 * The lagan's (serving platter's) wide ornamental rim, around the plov.
 * Sits over the photo: the middle is left clear.
 */
export function PlatterRim({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <defs>
        <mask id="plov-rim-hole">
          <rect width="100" height="100" fill="#fff" />
          <circle cx="50" cy="50" r="34" fill="#000" />
        </mask>
      </defs>
      <g mask="url(#plov-rim-hole)">
        <circle cx="50" cy="50" r="49.5" fill="#f7eedb" />
        <circle
          cx="50"
          cy="50"
          r="48.6"
          fill="none"
          stroke={GOLD}
          strokeWidth="1"
        />
        <circle
          cx="50"
          cy="50"
          r="46.8"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.35"
        />
        <g fill={GOLD} fillOpacity="0.55">
          {petals(24, 36.5, 45.5, 2.6)}
        </g>
        <g fill={GOLD}>
          {Array.from({ length: 24 }, (_, i) => (
            <circle
              key={i}
              cx="50"
              cy="9.8"
              r="0.7"
              transform={`rotate(${i * 15 + 7.5} 50 50)`}
            />
          ))}
        </g>
        <circle
          cx="50"
          cy="50"
          r="35.2"
          fill="none"
          stroke={GOLD}
          strokeWidth="0.8"
        />
      </g>
    </svg>
  );
}

/**
 * The domed lid over the platter, seen from above: ivory with a gold
 * star, rings of petals and a knob in the middle.
 */
export function Lid({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <defs>
        <radialGradient id="plov-lid" cx="42%" cy="36%" r="70%">
          <stop offset="0" stopColor="#fffdf6" />
          <stop offset="0.6" stopColor="#f3e6c9" />
          <stop offset="1" stopColor="#dcc394" />
        </radialGradient>
        <radialGradient id="plov-knob" cx="40%" cy="35%" r="70%">
          <stop offset="0" stopColor="#f3dca0" />
          <stop offset="0.6" stopColor="#c19a52" />
          <stop offset="1" stopColor="#8a6a2f" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="49" fill="url(#plov-lid)" />
      <g fill="none" stroke={GOLD}>
        <circle cx="50" cy="50" r="47.6" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="45.4" strokeWidth="0.35" />
        <circle cx="50" cy="50" r="30" strokeWidth="0.6" />
        <circle cx="50" cy="50" r="28.6" strokeWidth="0.3" />
      </g>
      <g fill={GOLD} fillOpacity="0.45">
        {petals(32, 31.5, 44, 1.9)}
      </g>
      <polygon
        points={star(8, 27, 16)}
        fill={GOLD}
        fillOpacity="0.14"
        stroke={GOLD}
        strokeWidth="0.5"
      />
      <polygon
        points={star(8, 19, 11)}
        fill="none"
        stroke={GOLD}
        strokeWidth="0.5"
      />
      <g fill={GOLD} fillOpacity="0.5">
        {petals(8, 10, 18, 2.4)}
      </g>
      <circle cx="50" cy="50" r="8.5" fill="url(#plov-knob)" />
      <circle
        cx="50"
        cy="50"
        r="8.5"
        fill="none"
        stroke="#7a5c25"
        strokeWidth="0.4"
      />
      <circle cx="47.6" cy="47.4" r="2.4" fill="#fff8e0" fillOpacity="0.7" />
    </svg>
  );
}
