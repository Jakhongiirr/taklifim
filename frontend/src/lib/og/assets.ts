import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

// Shared pieces of the generated link previews (Open Graph images):
// Cormorant Garamond (WOFF: next/og can't read WOFF2) and the brand logo.

const FONT_DIR = join(process.cwd(), "assets/fonts/cormorant");
// One family name per subset: the renderer takes a single file per
// name/weight/style, so the subsets are listed as a font stack (OG_FONT).
const SUBSETS = [
  { file: "latin", name: "Cormorant" },
  { file: "latin-ext", name: "CormorantExt" },
  { file: "cyrillic", name: "CormorantCyr" },
] as const;

/** `fontFamily` for preview images: all Cormorant subsets in order. */
export const OG_FONT = SUBSETS.map((subset) => subset.name).join(", ");
const VARIANTS = [
  { file: "500-normal", weight: 500, style: "normal" },
  { file: "500-italic", weight: 500, style: "italic" },
  { file: "600-normal", weight: 600, style: "normal" },
] as const;

type OgFont = {
  name: string;
  data: Buffer;
  weight: 400 | 500 | 600;
  style: "normal" | "italic";
};

let fonts: Promise<OgFont[]> | undefined;

/** The preview fonts; use them with `fontFamily: OG_FONT`. */
export function ogFonts() {
  fonts ??= Promise.all(
    VARIANTS.flatMap((variant) =>
      SUBSETS.map(async (subset) => ({
        name: subset.name,
        data: await readFile(
          join(
            FONT_DIR,
            `cormorant-garamond-${subset.file}-${variant.file}.woff`,
          ),
        ),
        weight: variant.weight,
        style: variant.style,
      })),
    ),
  );
  return fonts;
}

/**
 * The themes' typefaces for the couple's names (WOFF, in assets/fonts/<key>),
 * one family name per subset like Cormorant's.
 */
const NAME_FONTS = {
  "great-vibes": {
    name: "GreatVibes",
    subsets: ["latin", "latin-ext", "cyrillic"],
  },
  // Latin only: Cyrillic names fall back to Great Vibes, like the page.
  parisienne: {
    name: "Parisienne",
    subsets: ["latin", "latin-ext"],
    fallback: "great-vibes",
  },
  "marck-script": {
    name: "MarckScript",
    subsets: ["latin", "latin-ext", "cyrillic"],
  },
  "playfair-display": {
    name: "PlayfairItalic",
    subsets: ["latin", "latin-ext", "cyrillic"],
    variant: "400-italic",
  },
  "yeseva-one": {
    name: "YesevaOne",
    subsets: ["latin", "latin-ext", "cyrillic"],
  },
  // No Latin Extended: Uzbek ʻ falls back to Cormorant.
  prata: { name: "Prata", subsets: ["latin", "cyrillic"] },
} as const;

export type NameFont = keyof typeof NAME_FONTS;

const nameFonts = new Map<NameFont, Promise<OgFont[]>>();

/**
 * A theme's name typeface: its fonts (add them to `ogFonts()`'s) and the
 * `fontFamily` to use, falling back to Cormorant for missing letters.
 */
export async function ogNameFont(
  key: NameFont,
): Promise<{ fonts: OgFont[]; family: string }> {
  const font: {
    name: string;
    subsets: readonly string[];
    variant?: string;
    fallback?: NameFont;
  } = NAME_FONTS[key];
  const { name, subsets, variant = "400-normal", fallback } = font;
  const family = subsets.map((subset) => `${name}-${subset}`);
  if (!nameFonts.has(key)) {
    nameFonts.set(
      key,
      Promise.all(
        subsets.map(async (subset, i) => ({
          name: family[i],
          data: await readFile(
            join(
              process.cwd(),
              `assets/fonts/${key}/${key}-${subset}-${variant}.woff`,
            ),
          ),
          weight: 400 as const,
          style: "normal" as const,
        })),
      ),
    );
  }
  const own = await nameFonts.get(key)!;
  // A Latin-only script borrows another one's Cyrillic, then Cormorant.
  const extra = fallback ? await ogNameFont(fallback) : null;
  return {
    fonts: extra ? [...own, ...extra.fonts] : own,
    family: [...family, extra?.family ?? OG_FONT].join(", "),
  };
}

const publicImages = new Map<string, Promise<string>>();

/** A JPEG from public/ (e.g. a theme's art) as a data URI. */
export function ogPublicImage(path: string) {
  if (!publicImages.has(path)) {
    publicImages.set(
      path,
      readFile(join(process.cwd(), "public", path)).then(
        (data) => `data:image/jpeg;base64,${data.toString("base64")}`,
      ),
    );
  }
  return publicImages.get(path)!;
}

let logo: Promise<string> | undefined;

/** The horizontal logo as a data URI (logo-horizontal.svg is 2425×545). */
export function ogLogo() {
  logo ??= readFile(
    join(process.cwd(), "public/brand/logo-horizontal.svg"),
  ).then((svg) => `data:image/svg+xml;base64,${svg.toString("base64")}`);
  return logo;
}

/**
 * A remote image as a data URI, or null if it can't be fetched quickly
 * (the preview then renders without it rather than failing). JPEG and PNG
 * only: the renderer does not reliably decode WebP.
 */
export async function ogImageData(url: string): Promise<string | null> {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/^image\/(jpeg|png)/.test(type)) return null;
    const data = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${data.toString("base64")}`;
  } catch {
    return null;
  }
}

export const OG_SIZE = { width: 1200, height: 630 };

/** The route's locale, narrowed for typed translations. */
export function ogLocale(locale: string) {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
