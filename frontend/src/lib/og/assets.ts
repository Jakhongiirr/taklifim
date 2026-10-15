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
 * The names' script, Great Vibes (WOFF, in assets/fonts/great-vibes), one
 * family name per subset like Cormorant's.
 */
const NAME_FONT = {
  key: "great-vibes",
  name: "GreatVibes",
  subsets: ["latin", "latin-ext", "cyrillic"],
} as const;

let nameFonts: Promise<OgFont[]> | undefined;

/**
 * The names' script: its fonts (add them to `ogFonts()`'s) and the
 * `fontFamily` to use, falling back to Cormorant for missing letters.
 */
export async function ogNameFont(): Promise<{
  fonts: OgFont[];
  family: string;
}> {
  const { key, name, subsets } = NAME_FONT;
  const family = subsets.map((subset) => `${name}-${subset}`);
  nameFonts ??= Promise.all(
    subsets.map(async (subset, i) => ({
      name: family[i],
      data: await readFile(
        join(
          process.cwd(),
          `assets/fonts/${key}/${key}-${subset}-400-normal.woff`,
        ),
      ),
      weight: 400 as const,
      style: "normal" as const,
    })),
  );
  return { fonts: await nameFonts, family: [...family, OG_FONT].join(", ") };
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

export const OG_SIZE = { width: 1200, height: 630 };

/** The route's locale, narrowed for typed translations. */
export function ogLocale(locale: string) {
  return hasLocale(routing.locales, locale) ? locale : routing.defaultLocale;
}
