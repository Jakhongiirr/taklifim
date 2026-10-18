import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactNode } from "react";
import { OG_FONT, ogFont, ogFonts, type OgFont } from "./assets";

// The invitation's generated images — the downloadable card and the QR
// card — share one background (assets/og: cream paper in a thin gold arch
// frame, white flowers in the top-left and bottom-right corners), one
// palette and typography, whatever the theme, and end with the site's
// "Taklifim.uz orqali yaratildi" credit. The text sits on the plain paper
// inside the frame, clear of the flowers.

/** Dark tones picked from the background: the leaves' green, the gilding. */
const INK = "#2b2a22";
const GREEN = "#334330";
const GOLD = "#7a5520";
const MUTED = "#4d4638";

/** Both cards: a phone screen, the background's own shape (736×1307). */
const CARD_SIZE = { width: 1080, height: 1920 };

let background: Promise<string> | undefined;

/** The background as a data URI. */
function ogBackground() {
  background ??= readFile(join(process.cwd(), "assets/og/background.jpg")).then(
    (data) => `data:image/jpeg;base64,${data.toString("base64")}`,
  );
  return background;
}

/** The credit's logo mark, its two tones (ink, accent) in `color`. */
function creditMark(color: string) {
  return Promise.all(
    ["ink", "accent"].map((tone) =>
      readFile(
        join(process.cwd(), `public/brand/logo-mark-${tone}.svg`),
        "utf8",
      ).then(
        (svg) =>
          `data:image/svg+xml;base64,${Buffer.from(
            svg.replace(/fill="[^"]*"/g, `fill="${color}"`),
          ).toString("base64")}`,
      ),
    ),
  );
}

const CREDIT_FONT = "GeistSans";

let credit: Promise<{ fonts: OgFont[]; mark: string[] }> | undefined;

/** The credit's plain sans (Geist, as on the site) and its logo mark. */
function creditAssets() {
  credit ??= Promise.all([
    Promise.all(
      ([400, 600] as const).map(async (weight) => ({
        name: CREDIT_FONT,
        data: await readFile(
          join(
            process.cwd(),
            `assets/fonts/geist/geist-sans-latin-${weight}-normal.woff`,
          ),
        ),
        weight,
        style: "normal" as const,
      })),
    ),
    creditMark(GOLD),
  ]).then(([fonts, mark]) => ({ fonts, mark }));
  return credit;
}

/** Everything a card renders with: fonts (pass to ImageResponse) and images. */
export async function cardAssets() {
  const [base, names, caps, bg, extra] = await Promise.all([
    ogFonts(),
    ogFont("great-vibes"),
    ogFont("forum"),
    ogBackground(),
    creditAssets(),
  ]);
  return {
    fonts: [...base, ...names.fonts, ...caps.fonts, ...extra.fonts],
    nameFamily: names.family,
    capsFamily: caps.family,
    bg,
    mark: extra.mark,
  };
}

type Assets = Awaited<ReturnType<typeof cardAssets>>;

/** The background across the whole card, the text on top. */
function Frame({ assets, children }: { assets: Assets; children: ReactNode }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        fontFamily: OG_FONT,
        color: INK,
        textAlign: "center",
        // A soft paper-coloured halo where a letter meets a leaf or the gilding.
        textShadow: "0 0 6px rgba(249,243,231,0.9)",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
      <img
        src={assets.bg}
        alt=""
        width={CARD_SIZE.width}
        height={CARD_SIZE.height}
        style={{ position: "absolute", left: 0, top: 0 }}
      />
      {children}
    </div>
  );
}

/** The text block, placed over the background's plain middle. */
function Content({
  top,
  height,
  children,
}: {
  top: number;
  height: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top,
        height,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 90px",
      }}
    >
      {children}
    </div>
  );
}

/** Groom & bride in the script, stacked or on one line. */
function Names({
  assets,
  groom,
  bride,
  size,
  inline = false,
}: {
  assets: Assets;
  groom: string;
  bride: string;
  size: number;
  inline?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: inline ? "row" : "column",
        alignItems: "center",
        fontFamily: assets.nameFamily,
        fontSize: size,
        lineHeight: 1.1,
        color: GREEN,
      }}
    >
      <span>{groom}</span>
      <span
        style={{
          fontFamily: assets.capsFamily,
          fontSize: size * 0.42,
          color: GOLD,
          margin: inline ? "0 0.5em" : "0",
        }}
      >
        &
      </span>
      <span>{bride}</span>
    </div>
  );
}

/** Thin gold lines with a small diamond, like the scrollwork's gilding. */
function Divider({ width = 90 }: { width?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
      <div style={{ width, height: 1.5, background: GOLD }} />
      <div
        style={{
          width: 10,
          height: 10,
          border: `1.5px solid ${GOLD}`,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ width, height: 1.5, background: GOLD }} />
    </div>
  );
}

/** Spaced capitals in Forum. */
function Caps({
  assets,
  size,
  color = GOLD,
  spacing = 0.14,
  style,
  children,
}: {
  assets: Assets;
  size: number;
  color?: string;
  spacing?: number;
  style?: CSSProperties;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
        fontFamily: assets.capsFamily,
        fontSize: size,
        letterSpacing: size * spacing,
        textTransform: "uppercase",
        color,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

/**
 * The closing credit, as on the guest page (themes/shared/made-with): the
 * logo mark and "Taklifim.uz orqali yaratildi" in a plain sans, in a thin
 * rounded outline. The same words in every locale. It sits on the frame's
 * bottom rule, centred over its diamond and clear of the flowers.
 */
function Credit({ assets }: { assets: Assets }) {
  const size = 28;
  return (
    // The diamond is at x 470: a box twice that wide centres the pill on it.
    <div
      style={{
        position: "absolute",
        left: 0,
        width: 940,
        bottom: 116,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          padding: "14px 26px",
          borderRadius: 999,
          border: "2px solid rgba(122,85,32,0.35)",
          background: "rgba(249,243,231,0.85)",
          fontFamily: CREDIT_FONT,
          fontSize: size,
          lineHeight: 1,
          color: GOLD,
          textShadow: "none",
        }}
      >
        <div
          style={{
            display: "flex",
            position: "relative",
            width: 40,
            height: 40,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
          <img
            src={assets.mark[1]}
            alt=""
            width={40}
            height={40}
            style={{ position: "absolute", opacity: 0.45 }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
          <img
            src={assets.mark[0]}
            alt=""
            width={40}
            height={40}
            style={{ position: "absolute" }}
          />
        </div>
        <div style={{ display: "flex" }}>
          <span style={{ fontWeight: 600 }}>Taklifim.uz</span>
          <span>&nbsp;orqali yaratildi</span>
        </div>
      </div>
    </div>
  );
}

/** Long names get a smaller size. */
function nameSize(
  groom: string,
  bride: string,
  sizes: [number, number, number],
) {
  const longest = Math.max(groom.length, bride.length);
  return longest > 16 ? sizes[2] : longest > 11 ? sizes[1] : sizes[0];
}

export interface CardText {
  groom: string;
  bride: string;
  /** The formatted date and time. */
  date: string;
  venue: string;
}

export const STORY_SIZE = CARD_SIZE;

/** The invitation as a phone-screen PNG the owner can send anywhere. */
export function StoryCard({
  assets,
  weekday,
  day,
  month,
  year,
  time,
  address,
  signature,
  ...text
}: Omit<CardText, "date"> & {
  assets: Assets;
  weekday: string;
  day: number;
  month: string;
  year: number;
  time: string;
  address: string;
  signature: string;
}) {
  // Weekday and time either side of the day, between thin gold rules.
  const side: CSSProperties = {
    width: 230,
    justifyContent: "center",
    padding: "12px 0",
    borderTop: `1.5px solid ${GOLD}`,
    borderBottom: `1.5px solid ${GOLD}`,
  };
  return (
    <Frame assets={assets}>
      {/* Below the arch and the top flowers, above the bottom ones. */}
      <Content top={340} height={1140}>
        <div style={{ display: "flex" }}>
          <Names
            assets={assets}
            groom={text.groom}
            bride={text.bride}
            size={nameSize(text.groom, text.bride, [140, 118, 90])}
          />
        </div>
        <div style={{ marginTop: 34, display: "flex" }}>
          <Divider width={110} />
        </div>
        <div
          style={{
            marginTop: 34,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Caps assets={assets} size={36} color={INK} style={side}>
            {weekday}
          </Caps>
          <div
            style={{
              display: "flex",
              fontFamily: assets.capsFamily,
              fontSize: 108,
              lineHeight: 1,
              color: GOLD,
            }}
          >
            {day}
          </div>
          <Caps assets={assets} size={36} color={INK} style={side}>
            {time}
          </Caps>
        </div>
        <Caps assets={assets} size={42} style={{ marginTop: 14 }}>
          {`${month} ${year}`}
        </Caps>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            maxWidth: 660,
            fontSize: 56,
            fontWeight: 700,
            lineHeight: 1.15,
            color: INK,
            justifyContent: "center",
          }}
        >
          {text.venue}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 8,
            maxWidth: 620,
            fontSize: 40,
            fontWeight: 700,
            lineHeight: 1.25,
            color: MUTED,
            justifyContent: "center",
          }}
        >
          {address}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 36,
            fontSize: 50,
            fontWeight: 600,
            fontStyle: "italic",
            color: GREEN,
          }}
        >
          {signature}
        </div>
      </Content>
      <Credit assets={assets} />
    </Frame>
  );
}

export const QR_CARD_SIZE = CARD_SIZE;
const QR_SIZE = 520;

/** The invitation's QR code, to print or put on a screen. */
export function QrCard({
  assets,
  qr,
  ...text
}: Omit<CardText, "venue"> & {
  assets: Assets;
  /** The code as an SVG string. */
  qr: string;
}) {
  const names = `${text.groom} & ${text.bride}`;
  return (
    <Frame assets={assets}>
      <Content top={340} height={1120}>
        <div style={{ display: "flex" }}>
          <Names
            assets={assets}
            groom={text.groom}
            bride={text.bride}
            size={names.length > 26 ? 72 : names.length > 18 ? 84 : 100}
            inline={names.length <= 18}
          />
        </div>
        <Caps
          assets={assets}
          size={40}
          color={GOLD}
          spacing={0.08}
          style={{ marginTop: 16 }}
        >
          {text.date}
        </Caps>
        {/* The code, on white with a quiet zone around it. */}
        <div
          style={{
            marginTop: 56,
            display: "flex",
            padding: 30,
            background: "#ffffff",
            borderRadius: 24,
            border: `2px solid ${GOLD}`,
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
          <img
            src={`data:image/svg+xml;utf8,${encodeURIComponent(qr)}`}
            alt=""
            width={QR_SIZE}
            height={QR_SIZE}
          />
        </div>
      </Content>
      <Credit assets={assets} />
    </Frame>
  );
}
