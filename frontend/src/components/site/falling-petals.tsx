import type { CSSProperties } from "react";

// Fixed, hand-spread values so the server render is stable (no hydration
// mismatch) and the petals never bunch up: left %, size px, fall seconds,
// delay seconds, sideways drift px, colour.
const PETALS: [number, number, number, number, number, string][] = [
  [4, 20, 13, -2, 60, "#eeb0b0"],
  [12, 15, 16, -9, -40, "#e2c08a"],
  [21, 24, 14, -5, 80, "#f4cbc4"],
  [30, 17, 18, -13, -60, "#e9a3a8"],
  [39, 21, 15, -1, 50, "#f1dcc0"],
  [47, 14, 17, -7, -30, "#e2c08a"],
  [55, 22, 13, -11, 70, "#eeb0b0"],
  [63, 18, 19, -4, -70, "#f4cbc4"],
  [71, 16, 14, -15, 40, "#e9a3a8"],
  [79, 25, 16, -8, -50, "#f1dcc0"],
  [87, 17, 15, -3, 60, "#e2c08a"],
  [95, 20, 18, -12, -40, "#eeb0b0"],
];

/** Petals drifting down behind a section's content; purely decorative. */
export default function FallingPetals({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-clip motion-reduce:hidden ${className}`}
    >
      {PETALS.map(([left, size, duration, delay, drift, color], i) => (
        <span
          key={i}
          className="petal absolute -top-8 block"
          style={
            {
              left: `${left}%`,
              "--drift": `${drift}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            } as CSSProperties
          }
        >
          <svg
            viewBox="0 0 20 20"
            width={size}
            height={size}
            className="petal-spin block"
            style={{ animationDuration: `${duration / 3}s` }}
          >
            <path
              d="M10 19C3.5 14 2 8.5 4.5 4.5 6 2 8.5 2 10 4.5 11.5 2 14 2 15.5 4.5 18 8.5 16.5 14 10 19Z"
              fill={color}
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
