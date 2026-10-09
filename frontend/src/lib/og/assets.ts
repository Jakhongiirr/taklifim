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
  weight: 500 | 600;
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
