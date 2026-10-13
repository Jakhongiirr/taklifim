// Theme colors for the generated invitation images (link preview and the
// downloadable card), matching each theme's page.

export interface OgPalette {
  background: string;
  ink: string;
  names: string;
  accent: string;
  gold: string;
  muted: string;
  photoRadius: string;
}

/**
 * Per theme id; add an entry with each new theme. Unknown themes get the
 * default, like the page.
 */
const PALETTES: Record<string, OgPalette> = {
  aurora: {
    background: "radial-gradient(circle at 50% 30%, #fffaf0 0%, #f3e7d3 75%)",
    ink: "#5c4325",
    names: "#7a5a2c",
    accent: "#7a5a2c",
    gold: "#b08a4e",
    muted: "#8a7457",
    photoRadius: "28px",
  },
  dove: {
    background: "radial-gradient(circle at 50% 30%, #fff7f2 0%, #f6e2d8 75%)",
    ink: "#5a3e45",
    names: "#6b3f4a",
    accent: "#6f8597",
    gold: "#c98b8b",
    muted: "#8a6f73",
    photoRadius: "28px",
  },
  haven: {
    background: "radial-gradient(circle at 50% 30%, #fbf6ee 0%, #ebe3d4 75%)",
    ink: "#2f3a2c",
    names: "#2f3a2c",
    accent: "#8a4f58",
    gold: "#b5707a",
    muted: "#6d7262",
    photoRadius: "10px",
  },
  violet: {
    background: "radial-gradient(circle at 50% 30%, #3a2a63 0%, #1b1430 75%)",
    ink: "#f1ecfa",
    names: "#f7f2ff",
    accent: "#e6dcfa",
    gold: "#f5c27a",
    muted: "#b9aed3",
    photoRadius: "28px",
  },
  paris: {
    background: "radial-gradient(circle at 50% 30%, #ffffff 0%, #fbf7f2 70%)",
    ink: "#2c3550",
    names: "#2c3550",
    accent: "#23407a",
    gold: "#b8925a",
    muted: "#6b7088",
    photoRadius: "16px",
  },
  arcade: {
    background: "radial-gradient(circle at 50% 30%, #fffaf6 0%, #f3d9dc 80%)",
    ink: "#4d3a52",
    names: "#4d3a52",
    accent: "#7d9a7e",
    gold: "#d27f93",
    muted: "#8a6f84",
    photoRadius: "28px",
  },
};

const DEFAULT_PALETTE: OgPalette = {
  background: "radial-gradient(circle at 70% 40%, #f2ece1 0%, #faf7f1 60%)",
  ink: "#2a2723",
  names: "#2a2723",
  accent: "#46523f",
  gold: "#a8844f",
  muted: "#6f675d",
  photoRadius: "28px",
};

/** The theme's palette. */
export function ogPalette(themeId: string): OgPalette {
  return PALETTES[themeId] ?? DEFAULT_PALETTE;
}

/** Thin lines with a small diamond, like the themes' ornaments. */
export function OgDivider({
  color,
  width = 70,
}: {
  color: string;
  width?: number;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width, height: 1.5, background: color }} />
      <div
        style={{
          width: 10,
          height: 10,
          border: `1.5px solid ${color}`,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ width, height: 1.5, background: color }} />
    </div>
  );
}
