import type { ReactNode } from "react";
import type { NameFont } from "./assets";

// Decorations of the downloadable invitation card, per theme: the theme's
// art behind the card, its ornament (as SVG for next/og) and the names'
// typeface, like the theme's page.

export const CARD_WIDTH = 1080;
export const CARD_HEIGHT = 1920;

/** An SVG image for next/og, sized in px. */
export interface CardImage {
  src: string;
  width: number;
  height: number;
}

export interface CardDecor {
  /** The full-card layer behind the content. */
  layer?: CardImage;
  /**
   * The theme's art behind everything (a JPEG path in public/, like the
   * hero's), and the gradient over it that fades it into the palette's
   * background where the text sits.
   */
  art?: { path: string; fade: string };
  /** Between sections, in place of the plain divider. */
  divider: CardImage;
  /**
   * Drawn around the main photo; gets the photo frame's size. An array, not
   * a fragment: next/og lays a fragment out as a box of its own.
   */
  photo?: (width: number, height: number) => ReactNode[];
  /** Above the names when there's no photo. */
  emblem?: CardImage;
  /** The names' typeface (Cormorant italic without one) and its size. */
  names?: { font: NameFont; scale: number };
}

const svg = (width: number, height: number, body: string): CardImage => ({
  width,
  height,
  src: `data:image/svg+xml;base64,${Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">${body}</svg>`,
  ).toString("base64")}`,
});

/** An ornament drawn in a `viewBox` box, rendered at `width`. */
const ornament = (
  width: number,
  [vw, vh]: [number, number],
  body: string,
): CardImage => {
  const height = Math.round((width * vh) / vw);
  return {
    width,
    height,
    src: `data:image/svg+xml;base64,${Buffer.from(
      `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${vw} ${vh}">${body}</svg>`,
    ).toString("base64")}`,
  };
};

/** The palette's background, `alpha` (0–1) opaque, for gradients. */
const tint = (hex: string, alpha: number) => {
  const rgb = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${rgb.join(",")},${alpha})`;
};

/**
 * The art clear in the middle (around the photo), the background behind
 * the top lines and from the names down.
 */
const artFade = (bg: string) =>
  `linear-gradient(to bottom, ${tint(bg, 0.94)} 0%, ${tint(bg, 0.9)} 13%, ${tint(bg, 0)} 21%, ${tint(bg, 0)} 34%, ${tint(bg, 0.92)} 52%, ${tint(bg, 1)} 60%)`;

// ---------------------------------------------------------------- default

const GOLD = "#a8844f";

/** A thin frame and a diamond divider, for themes without their own. */
function defaultDecor(): CardDecor {
  const w = CARD_WIDTH;
  const h = CARD_HEIGHT;
  const layer = svg(
    w,
    h,
    `<rect x="66" y="66" width="${w - 132}" height="${h - 132}" rx="22" fill="none" stroke="${GOLD}" stroke-opacity="0.35" stroke-width="1"/>`,
  );
  const divider = svg(
    320,
    40,
    `<path d="M20 20 H145 M175 20 H300" stroke="${GOLD}" stroke-width="1.3"/>
    <path d="M160 13 L165 20 L160 27 L155 20Z" fill="${GOLD}"/>`,
  );
  return { layer, divider };
}

// ---------------------------------------------------------------- aurora
// The palace's staircase hall, a gold flourish, Great Vibes names.

const AURORA_FLOURISH = `<g fill="none" stroke="#b08a4e" stroke-width="0.8" stroke-linecap="round">
  <path d="M4 10 H78 M122 10 H196"/>
  <path d="M100 4 L106 10 L100 16 L94 10Z" fill="#b08a4e"/>
  <path d="M90 10 C84 4 78 4 74 8 C80 11 85 11 90 10Z"/>
  <path d="M110 10 C116 4 122 4 126 8 C120 11 115 11 110 10Z"/>
</g>`;

function auroraDecor(): CardDecor {
  return {
    art: { path: "/themes/aurora/opening-end.jpg", fade: artFade("#fbf6ec") },
    divider: ornament(380, [200, 20], AURORA_FLOURISH),
    emblem: ornament(560, [200, 20], AURORA_FLOURISH),
    names: { font: "great-vibes", scale: 1.15 },
  };
}

// ---------------------------------------------------------------- dove
// The lantern-lit aisle, a pair of doves, Comforter names.

const DOVE = `<path d="M8 30 L16 27 C24 31 36 32 44 27 C48 24 50 20 53 18 C55 17 57 17.5 58 19 L61 19.6 L58 20.8 C56 24 52 28 46 31 C36 35 22 34 8 30Z"/>
  <path d="M28 29 C25 21 26 12 33 5 C34 12 37 18 42 22 C40 15 41 9 46 4 C47 12 47 20 44 26"/>`;
const DOVE_PAIR = `<g fill="none" stroke="#c98b8b" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">
  <g>${DOVE}</g>
  <g transform="translate(140 0) scale(-1 1)">${DOVE}</g>
  <path d="M70 24 C67 21 64 22 64 25 C64 28 70 31 70 31 C70 31 76 28 76 25 C76 22 73 21 70 24Z" fill="#c98b8b" fill-opacity="0.25"/>
</g>`;

function doveDecor(): CardDecor {
  return {
    art: { path: "/themes/dove/opening-end.jpg", fade: artFade("#fbf3ee") },
    divider: ornament(260, [140, 40], DOVE_PAIR),
    emblem: ornament(420, [140, 40], DOVE_PAIR),
    names: { font: "parisienne", scale: 0.95 },
  };
}

// ---------------------------------------------------------------- haven
// The old palace in the rose garden, wrought-iron scrolls, Prata names.

const IRON_HALF = `<path d="M96 20 C80 20 70 20 58 20 C46 20 40 12 46 7 C51 3 58 8 54 13 C51 16 47 13 49 11"/>
  <path d="M58 20 C48 20 40 28 32 28 C22 28 20 18 27 16 C32 15 34 21 30 22"/>
  <path d="M32 28 C24 28 14 22 4 22"/>`;
const IRONWORK = `<g fill="none" stroke="#2b2a28" stroke-opacity="0.75" stroke-width="1.3" stroke-linecap="round">
  <g>${IRON_HALF}</g>
  <g transform="translate(200 0) scale(-1 1)">${IRON_HALF}</g>
</g>
<circle cx="100" cy="20" r="5.5" fill="#b5707a" fill-opacity="0.35" stroke="#b5707a"/>
<path d="M100 16.5 C102.5 17.5 102.5 21 100 22 C98 21 98 18.5 100.5 18.5" fill="none" stroke="#8a4f58"/>`;

function havenDecor(): CardDecor {
  return {
    art: { path: "/themes/haven/opening-end.jpg", fade: artFade("#f4efe6") },
    divider: ornament(380, [200, 40], IRONWORK),
    emblem: ornament(560, [200, 40], IRONWORK),
    names: { font: "prata", scale: 0.78 },
  };
}

// ---------------------------------------------------------------- arcade
// The balcony over the lake, a butterfly between sage lines, Yeseva names.

const BUTTERFLY = `<g fill="#f0b8c4" fill-opacity="0.85" stroke="#c9707f" stroke-width="0.8" stroke-linejoin="round">
  <path d="M20 15 C15 3 4 1 3 8 C2 14 10 17 20 15Z"/>
  <path d="M20 17 C13 17 6 22 8 27 C10 31 17 25 20 17Z"/>
  <path d="M20 15 C25 3 36 1 37 8 C38 14 30 17 20 15Z"/>
  <path d="M20 17 C27 17 34 22 32 27 C30 31 23 25 20 17Z"/>
</g>
<ellipse cx="20" cy="16.5" rx="1.1" ry="6" fill="#4d3a52"/>
<path d="M20 11 C19 7 17 5 15.5 4 M20 11 C21 7 23 5 24.5 4" fill="none" stroke="#4d3a52" stroke-width="0.7" stroke-linecap="round"/>`;
const BUTTERFLY_DIVIDER = `<path d="M8 16 H62 M98 16 H152" stroke="#7d9a7e" stroke-opacity="0.7" stroke-width="0.8"/>
<g transform="translate(60 0)">${BUTTERFLY}</g>`;

function arcadeDecor(): CardDecor {
  return {
    art: { path: "/themes/arcade/opening-end.jpg", fade: artFade("#fdf8f4") },
    divider: ornament(380, [160, 32], BUTTERFLY_DIVIDER),
    emblem: ornament(160, [40, 32], BUTTERFLY),
    names: { font: "yeseva-one", scale: 0.8 },
  };
}

// ---------------------------------------------------------------- violet
// The moonlit valley (the one dark card), a crescent between lilac lines,
// Marck Script names.

const CRESCENT = `<path d="M24 6 A15 15 0 1 0 34 30 A12 12 0 1 1 24 6Z" fill="#f5c27a"/>
<path d="M33 6 L34.2 9.3 L37.5 10.5 L34.2 11.7 L33 15 L31.8 11.7 L28.5 10.5 L31.8 9.3Z" fill="#fbe7c6"/>`;
const CRESCENT_DIVIDER = `<path d="M6 20 H62 M98 20 H154" stroke="#b79ce8" stroke-opacity="0.7" stroke-width="0.8"/>
<g transform="translate(60 0)">${CRESCENT}</g>`;

function violetDecor(): CardDecor {
  return {
    art: { path: "/themes/violet/opening-end.jpg", fade: artFade("#1b1430") },
    divider: ornament(380, [160, 40], CRESCENT_DIVIDER),
    emblem: ornament(160, [40, 40], CRESCENT),
    names: { font: "marck-script", scale: 1.05 },
  };
}

// ---------------------------------------------------------------- paris
// The tower over the river, a gold Eiffel Tower between rules, Playfair
// italic names.

const TOWER = `<g fill="none" stroke="#b8925a" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
  <path d="M20 1 V6"/>
  <path d="M20 6 L21.5 18 L24 32 L28 52 L37 78"/>
  <path d="M20 6 L18.5 18 L16 32 L12 52 L3 78"/>
  <path d="M18.4 18 H21.6 M15.6 32 H24.4 M11.6 52 H28.4"/>
  <path d="M10 66 C14 57 26 57 30 66"/>
  <path d="M16 32 L24 52 M24 32 L16 52" stroke-width="0.8"/>
</g>`;
const TOWER_DIVIDER = `<path d="M6 76 H66 M94 76 H154" stroke="#b8925a" stroke-opacity="0.7" stroke-width="1"/>
<g transform="translate(60 0)">${TOWER}</g>`;

function parisDecor(): CardDecor {
  return {
    art: { path: "/themes/paris/opening-end.jpg", fade: artFade("#fbf7f2") },
    divider: ornament(300, [160, 80], TOWER_DIVIDER),
    emblem: ornament(90, [40, 80], TOWER),
    names: { font: "playfair-display", scale: 0.85 },
  };
}

/** Per theme id; add an entry with each new theme. */
const DECOR: Record<string, () => CardDecor> = {
  aurora: auroraDecor,
  dove: doveDecor,
  haven: havenDecor,
  arcade: arcadeDecor,
  violet: violetDecor,
  paris: parisDecor,
};

/** The theme's card decorations; unknown themes get the default. */
export function cardDecor(themeId: string): CardDecor {
  return (DECOR[themeId] ?? defaultDecor)();
}
