import type { CSSProperties } from "react";

// The anor theme's drawings: a ripe pomegranate, its seeds, leaves and
// blossoms, drawn once as SVG symbols (AnorDefs) and placed with <use>, so
// the theme has no art files to load. Colours: garnet fruit, ruby seeds,
// sage leaves, a flame-red blossom and thin antique-gold lines.

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
        <radialGradient id="anor-skin" cx="36%" cy="38%" r="70%">
          <stop offset="0" stopColor="#f2747a" />
          <stop offset="0.35" stopColor="#cf3a4a" />
          <stop offset="0.75" stopColor="#951f30" />
          <stop offset="1" stopColor="#5e111d" />
        </radialGradient>
        <linearGradient id="anor-crown" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#c23a48" />
          <stop offset="1" stopColor="#7a1626" />
        </linearGradient>
        <radialGradient id="anor-shine" cx="50%" cy="50%" r="50%">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="anor-aril" cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#ff7a86" />
          <stop offset="0.45" stopColor="#d22a43" />
          <stop offset="1" stopColor="#7d0c22" />
        </radialGradient>
        <radialGradient id="anor-pith" cx="50%" cy="45%" r="60%">
          <stop offset="0" stopColor="#fbe9d6" />
          <stop offset="1" stopColor="#efcfae" />
        </radialGradient>
        <linearGradient id="anor-leaf-fill" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#3f5a37" />
          <stop offset="1" stopColor="#7d9a68" />
        </linearGradient>
        <linearGradient id="anor-petal" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0" stopColor="#b8321f" />
          <stop offset="1" stopColor="#f0703f" />
        </linearGradient>

        {/* A whole pomegranate with its crown, 100 × 110. */}
        <symbol id="anor-fruit" viewBox="0 0 100 110">
          {/* Two leaves from behind the crown. */}
          <use
            href="#anor-leaf"
            x="50"
            y="16"
            width="34"
            height="14"
            transform="rotate(-24 50 23)"
          />
          <use
            href="#anor-leaf"
            x="50"
            y="16"
            width="34"
            height="14"
            transform="rotate(-150 50 23)"
          />
          <path
            d="M40 31 L37.5 19 L31 10.5 L41.5 14.5 L44.5 5.5 L50 13 L55.5 5.5 L58.5 14.5 L69 10.5 L62.5 19 L60 31Z"
            fill="url(#anor-crown)"
          />
          <ellipse cx="50" cy="15.5" rx="7" ry="2.2" fill="#3b0a13" />
          <path
            d="M50 27 C25 27 8 45 8 66 C8 90 27 106 50 106 C73 106 92 90 92 66 C92 45 75 27 50 27Z"
            fill="url(#anor-skin)"
          />
          <path
            d="M50 30 C42 48 40 80 46 104 M50 30 C60 50 62 80 56 104 M50 30 C30 44 22 74 30 98 M50 30 C70 44 78 74 70 98"
            fill="none"
            stroke="#3b0a13"
            strokeOpacity="0.12"
            strokeWidth="1"
          />
          <ellipse
            cx="33"
            cy="54"
            rx="11"
            ry="17"
            transform="rotate(-28 33 54)"
            fill="url(#anor-shine)"
          />
          <path
            d="M40 31 C44 33 56 33 60 31"
            fill="none"
            stroke="#3b0a13"
            strokeOpacity="0.35"
            strokeWidth="1.2"
          />
        </symbol>

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

/** A whole pomegranate (100 × 110 units); size it with `className`. */
export function Fruit({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 100 110" className={className}>
      <use href="#anor-fruit" width="100" height="110" />
    </svg>
  );
}

/**
 * A pomegranate bough: a curved twig with leaves, two blossoms and a ripe
 * fruit hanging in the middle. Mirrored left and right.
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
      <use href="#anor-fruit" x="128" y="54" width="60" height="66" />
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

/** The open fruit's heart: ruby seeds packed in creamy pith (100 × 110). */
export function FruitHeart({ className = "" }: { className?: string }) {
  const seeds: { x: number; y: number; r: number }[] = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const x = 18 + col * 9 + (row % 2) * 4.5;
      const y = 36 + row * 8.6;
      // Keep to the pith's ellipse.
      if (((x - 50) / 36) ** 2 + ((y - 67) / 34) ** 2 > 1) continue;
      seeds.push({ x, y, r: ((row * 7 + col * 13) % 40) - 20 });
    }
  }
  return (
    <svg aria-hidden viewBox="0 0 100 110" className={className}>
      <ellipse cx="50" cy="67" rx="40" ry="38" fill="url(#anor-pith)" />
      {seeds.map(({ x, y, r }) => (
        <use
          key={`${x}-${y}`}
          href="#anor-seed"
          x={x - 4}
          y={y - 5}
          width="8"
          height="10"
          transform={`rotate(${r} ${x} ${y})`}
        />
      ))}
    </svg>
  );
}
