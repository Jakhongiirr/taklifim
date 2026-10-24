import type { CSSProperties } from "react";

// The anor theme's drawings: pomegranate seeds, leaves and blossoms (never
// the fruit itself), drawn once as SVG symbols (AnorDefs) and placed with
// <use>, so the theme has no art files to load. Colours: ruby seeds, sage
// leaves, a flame-red blossom, a garnet wax seal and thin antique gold.

/** Golden lines and small marks. */
export const GOLD = "#b08a45";

/**
 * The shared gradients and symbols. Rendered once at the top of the theme
 * (also used by the client cover). Not `display: none`, which would drop
 * the gradients in some browsers.
 */
export function AnorDefs() {
  return (
    <svg aria-hidden width="0" height="0" className="absolute">
      <defs>
        <radialGradient id="anor-wax" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#c8404f" />
          <stop offset="0.55" stopColor="#951f30" />
          <stop offset="1" stopColor="#5e111d" />
        </radialGradient>
        <radialGradient id="anor-aril" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ff7a86" />
          <stop offset="0.45" stopColor="#d22a43" />
          <stop offset="1" stopColor="#7d0c22" />
        </radialGradient>
        <linearGradient id="anor-leaf-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f5a37" />
          <stop offset="1" stopColor="#7d9a68" />
        </linearGradient>
        <linearGradient id="anor-petal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#b8321f" />
          <stop offset="1" stopColor="#f0703f" />
        </linearGradient>

        {/* One aril (seed), 10 × 12. */}
        <symbol id="anor-seed" viewBox="0 0 10 12">
          <path
            d="M5 0.6 C8 1.6 9.4 4 9.2 7 C9 10 7.2 11.4 5 11.4 C2.8 11.4 1 10 0.8 7 C0.6 4 2 1.6 5 0.6Z"
            fill="url(#anor-aril)"
          />
          <ellipse
            cx="3.6"
            cy="4.2"
            rx="1.3"
            ry="1.9"
            fill="#fff"
            fillOpacity="0.6"
          />
        </symbol>

        {/* A leaf pointing right from its base at (0, 6), 30 × 12. */}
        <symbol id="anor-leaf" viewBox="0 0 30 12" overflow="visible">
          <path
            d="M0 6 C7 -0.5 20 -1 30 6 C20 13 7 12.5 0 6Z"
            fill="url(#anor-leaf-fill)"
          />
          <path
            d="M1 6 C10 5 20 5.4 28 6"
            fill="none"
            stroke="#f3e7cf"
            strokeOpacity="0.45"
            strokeWidth="0.6"
          />
        </symbol>

        {/* A pomegranate blossom, opening upwards, 24 × 28. */}
        <symbol id="anor-blossom" viewBox="0 0 24 28">
          <path
            d="M7 27 C6 21 6.5 17 8 15 L16 15 C17.5 17 18 21 17 27Z"
            fill="#8e2a22"
          />
          <path
            d="M12 15 C5 15 1 10 2 3 C5 6 7 5 8 1 C9.5 4.5 10.5 5 12 3 C13.5 5 14.5 4.5 16 1 C17 5 19 6 22 3 C23 10 19 15 12 15Z"
            fill="url(#anor-petal)"
          />
          <path
            d="M9 13 C10 9 11 7 12 5 M15 13 C14 9 13 7 12 5"
            fill="none"
            stroke="#ffd3a0"
            strokeOpacity="0.6"
            strokeWidth="0.6"
          />
        </symbol>
      </defs>
    </svg>
  );
}

/**
 * A pomegranate bough: a curved twig with leaves and blossoms, the largest
 * blossom hanging in the middle. Mirrored left and right.
 */
export function Bough({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const leaves = [
    { x: 30, y: 52, r: -160 },
    { x: 52, y: 58, r: 150 },
    { x: 78, y: 58, r: -150 },
    { x: 104, y: 62, r: 160 },
    { x: 124, y: 58, r: -125 },
  ];
  const side = (
    <>
      <path
        d="M8 46 C40 60 90 66 160 50"
        fill="none"
        stroke="#6b4a32"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {leaves.map(({ x, y, r }) => (
        <use
          key={`${x}`}
          href="#anor-leaf"
          x={x}
          y={y - 6}
          width="30"
          height="12"
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
      <use
        href="#anor-blossom"
        x="88"
        y="62"
        width="15"
        height="18"
        transform="rotate(170 95 70)"
      />
    </>
  );
  return (
    <svg aria-hidden viewBox="0 0 320 120" className={className} style={style}>
      {side}
      <g transform="matrix(-1 0 0 1 320 0)">{side}</g>
      <use
        href="#anor-leaf"
        x="160"
        y="44"
        width="34"
        height="14"
        transform="rotate(-62 160 50)"
      />
      <use
        href="#anor-leaf"
        x="160"
        y="44"
        width="34"
        height="14"
        transform="rotate(-118 160 50)"
      />
      <path
        d="M160 50 C160 54 159 57 158 60"
        stroke="#6b4a32"
        strokeWidth="1.6"
        fill="none"
      />
      <use
        href="#anor-blossom"
        x="149"
        y="57"
        width="22"
        height="26"
        transform="rotate(180 160 70)"
      />
    </svg>
  );
}

/** A thin gold rule with three seeds in the middle. */
export function SeedRule({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 220 20"
      className={`mx-auto h-5 w-52 ${className}`}
    >
      <path
        d="M6 10 H88 M132 10 H214"
        stroke={GOLD}
        strokeWidth="0.9"
        strokeLinecap="round"
      />
      <circle cx="92" cy="10" r="1.3" fill={GOLD} />
      <circle cx="128" cy="10" r="1.3" fill={GOLD} />
      <use
        href="#anor-seed"
        x="98"
        y="5"
        width="8"
        height="10"
        transform="rotate(-25 102 10)"
      />
      <use href="#anor-seed" x="105.5" y="3.5" width="9" height="12" />
      <use
        href="#anor-seed"
        x="114"
        y="5"
        width="8"
        height="10"
        transform="rotate(25 118 10)"
      />
    </svg>
  );
}

/**
 * Seeds scattered in a ring (for the cover's burst): where each flies to,
 * in % of its own size from the centre, with a turn and a size (% of the
 * box) each.
 */
export const BURST = Array.from({ length: 22 }, (_, i) => {
  const a = (i / 22) * Math.PI * 2 + (i % 2) * 0.35;
  const d = 0.62 + ((i * 37) % 10) / 22;
  return {
    // Rounded, so server and browser print the same CSS values.
    x: Math.round(Math.cos(a) * d * 700),
    y: Math.round(Math.sin(a) * d * 700),
    turn: ((i * 53) % 90) - 45,
    size: 8 + ((i * 29) % 5),
  };
});

/** A pomegranate blossom (24 × 28 units); size it with `className`. */
export function Blossom({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 24 28" className={className}>
      <use href="#anor-blossom" width="24" height="28" />
    </svg>
  );
}

/**
 * A garnet wax seal with a scalloped rim, a gold ring, a wreath of seeds
 * and the couple's initials (100 × 100 units).
 */
export function WaxSeal({
  initials,
  className = "",
}: {
  initials: string;
  className?: string;
}) {
  // A rim of 16 soft bumps around the disc.
  const rim = Array.from({ length: 32 }, (_, i) => {
    const a = (i / 32) * Math.PI * 2;
    const r = i % 2 ? 46 : 49;
    return `${(50 + r * Math.cos(a)).toFixed(2)},${(50 + r * Math.sin(a)).toFixed(2)}`;
  }).join(" ");
  const seeds = Array.from({ length: 12 }, (_, i) => (i / 12) * 360);
  return (
    <svg aria-hidden viewBox="0 0 100 100" className={className}>
      <polygon
        points={rim}
        fill="url(#anor-wax)"
        stroke="#e0bd78"
        strokeOpacity="0.55"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />
      <circle
        cx="50"
        cy="50"
        r="36"
        fill="none"
        stroke="#e0bd78"
        strokeOpacity="0.8"
        strokeWidth="1"
      />
      <circle
        cx="50"
        cy="50"
        r="22"
        fill="none"
        stroke="#e0bd78"
        strokeOpacity="0.45"
        strokeWidth="0.6"
      />
      {seeds.map((turn) => (
        <use
          key={turn}
          href="#anor-seed"
          x="47.5"
          y="17"
          width="5"
          height="6"
          transform={`rotate(${turn} 50 50)`}
        />
      ))}
      <text
        x="50"
        y="51"
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#f6e4d3"
        fontSize="17"
        fontFamily="inherit"
      >
        {initials}
      </text>
    </svg>
  );
}
