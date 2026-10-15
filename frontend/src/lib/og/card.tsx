import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactNode } from "react";
import { OG_FONT, ogFont, ogFonts, ogLogo } from "./assets";

// The invitation's generated images — the link preview, the downloadable
// card and the QR card — share one background (assets/og: a palace
// colonnade with olive drapes, gold scrollwork and roses), one palette and
// typography, whatever the theme, and end with a small taklifim.uz ad. The
// art is shown as is: the text sits in its plain cream middle.

/** Picked from the background: the drapes' olive, the scrollwork's gold. */
const INK = "#3b3424";
const OLIVE = "#3f4b2c";
const GOLD = "#8a672c";
const ROSE = "#94474f";
const MUTED = "#665b43";

/** The background's size; it covers each card around a focus point. */
const BG = { width: 1086, height: 1448 };

let background: Promise<string> | undefined;

/** The background as a data URI. */
function ogBackground() {
  background ??= readFile(join(process.cwd(), "assets/og/background.jpg")).then(
    (data) => `data:image/jpeg;base64,${data.toString("base64")}`,
  );
  return background;
}

/** Everything a card renders with: fonts (pass to ImageResponse) and images. */
export async function cardAssets() {
  const [base, names, caps, bg, logo] = await Promise.all([
    ogFonts(),
    // Pinyon Script is Latin only: Cyrillic names get Great Vibes.
    ogFont("pinyon-script", "great-vibes"),
    ogFont("forum"),
    ogBackground(),
    ogLogo(),
  ]);
  return {
    fonts: [...base, ...names.fonts, ...caps.fonts],
    nameFamily: names.family,
    capsFamily: caps.family,
    bg,
    logo,
  };
}

type Assets = Awaited<ReturnType<typeof cardAssets>>;

/**
 * The full-size frame: the background covering it, `zoom` times closer,
 * cropped at `focusY` (0 = its top, 1 = its bottom).
 */
function Frame({
  assets,
  width,
  height,
  zoom = 1,
  focusY = 0.5,
  children,
}: {
  assets: Assets;
  width: number;
  height: number;
  zoom?: number;
  focusY?: number;
  children: ReactNode;
}) {
  const scale = zoom * Math.max(width / BG.width, height / BG.height);
  const w = Math.ceil(BG.width * scale);
  const h = Math.ceil(BG.height * scale);
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
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
      <img
        src={assets.bg}
        alt=""
        width={w}
        height={h}
        style={{
          position: "absolute",
          left: Math.round((width - w) / 2),
          top: Math.round((height - h) * focusY),
        }}
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
        color: OLIVE,
      }}
    >
      <span>{groom}</span>
      <span
        style={{
          fontFamily: assets.capsFamily,
          fontSize: size * 0.32,
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
  spacing = 0.22,
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

/** The ad at the bottom: the logo and a line of text. */
function Ad({
  assets,
  text,
  scale = 1,
  bottom,
}: {
  assets: Assets;
  text: string;
  scale?: number;
  bottom: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        bottom,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
      <img
        src={assets.logo}
        alt=""
        width={Math.round(267 * scale)}
        height={Math.round(60 * scale)}
      />
      <div
        style={{
          display: "flex",
          marginTop: 6 * scale,
          fontSize: 28 * scale,
          fontWeight: 600,
          color: INK,
        }}
      >
        {text}
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
  /** The ad's line. */
  ad: string;
}

export const PREVIEW_SIZE = { width: 1200, height: 630 };

/** The link preview guests see in Telegram before opening the invitation. */
export function PreviewCard({
  assets,
  ...text
}: CardText & { assets: Assets }) {
  const { width, height } = PREVIEW_SIZE;
  // Short couples on one line, longer ones stacked.
  const inline = text.groom.length + text.bride.length <= 20;
  return (
    // The upper middle: the plain wall between the scrollwork and the roses.
    <Frame assets={assets} width={width} height={height} focusY={0.26}>
      <Content top={50} height={470}>
        <Names
          assets={assets}
          groom={text.groom}
          bride={text.bride}
          size={inline ? 100 : 74}
          inline={inline}
        />
        <div style={{ marginTop: 14, display: "flex" }}>
          <Divider />
        </div>
        <Caps
          assets={assets}
          size={34}
          color={ROSE}
          spacing={0.12}
          style={{ marginTop: 22 }}
        >
          {text.date}
        </Caps>
        <div
          style={{
            display: "flex",
            marginTop: 10,
            fontSize: 34,
            fontWeight: 600,
            maxWidth: 700,
            justifyContent: "center",
          }}
        >
          {text.venue}
        </div>
      </Content>
      <Ad assets={assets} text={text.ad} scale={0.6} bottom={34} />
    </Frame>
  );
}

export const STORY_SIZE = { width: 1080, height: 1920 };

/** The invitation as a phone-screen PNG the owner can send anywhere. */
export function StoryCard({
  assets,
  invite,
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
  invite: string;
  weekday: string;
  day: number;
  month: string;
  year: number;
  time: string;
  address: string;
  signature: string;
}) {
  const { width, height } = STORY_SIZE;
  // Weekday and time either side of the day, between thin gold rules.
  const side: CSSProperties = {
    width: 230,
    justifyContent: "center",
    padding: "12px 0",
    borderTop: `1.5px solid ${GOLD}`,
    borderBottom: `1.5px solid ${GOLD}`,
  };
  return (
    // Closer in, so the plain wall spans the width; the steps at the bottom.
    <Frame
      assets={assets}
      width={width}
      height={height}
      zoom={1.15}
      focusY={0.6}
    >
      {/* Under the scrollwork, down to the garden behind the balustrade. */}
      <Content top={320} height={790}>
        <Caps assets={assets} size={30} color={ROSE}>
          {invite}
        </Caps>
        <div style={{ marginTop: 18, display: "flex" }}>
          <Names
            assets={assets}
            groom={text.groom}
            bride={text.bride}
            size={nameSize(text.groom, text.bride, [136, 112, 94])}
          />
        </div>
        <div style={{ marginTop: 20, display: "flex" }}>
          <Divider width={110} />
        </div>
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            gap: 30,
          }}
        >
          <Caps assets={assets} size={30} color={INK} style={side}>
            {weekday}
          </Caps>
          <div
            style={{
              display: "flex",
              fontFamily: assets.capsFamily,
              fontSize: 108,
              lineHeight: 1,
              color: ROSE,
            }}
          >
            {day}
          </div>
          <Caps assets={assets} size={30} color={INK} style={side}>
            {time}
          </Caps>
        </div>
        <Caps assets={assets} size={32} style={{ marginTop: 10 }}>
          {`${month} ${year}`}
        </Caps>
        <div
          style={{
            display: "flex",
            marginTop: 22,
            maxWidth: 680,
            fontSize: 44,
            fontWeight: 600,
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
            marginTop: 6,
            maxWidth: 640,
            fontSize: 31,
            fontWeight: 600,
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
            marginTop: 18,
            fontFamily: assets.nameFamily,
            fontSize: 50,
            color: OLIVE,
          }}
        >
          {signature}
        </div>
      </Content>
      {/* In the pale arch under the balustrade. */}
      <Ad assets={assets} text={text.ad} scale={0.85} bottom={330} />
    </Frame>
  );
}

export const QR_CARD_SIZE = { width: 1080, height: 1350 };
const QR_SIZE = 440;

/** The invitation's QR code, to print or put on a screen. */
export function QrCard({
  assets,
  qr,
  scan,
  ...text
}: Omit<CardText, "venue"> & {
  assets: Assets;
  /** The code as an SVG string. */
  qr: string;
  scan: string;
}) {
  const { width, height } = QR_CARD_SIZE;
  const names = `${text.groom} & ${text.bride}`;
  return (
    // Bottom-aligned, so the ad stands on the steps.
    <Frame assets={assets} width={width} height={height} focusY={1}>
      <Content top={190} height={820}>
        <Names
          assets={assets}
          groom={text.groom}
          bride={text.bride}
          size={names.length > 26 ? 56 : names.length > 18 ? 68 : 80}
          inline
        />
        <Caps
          assets={assets}
          size={32}
          color={ROSE}
          spacing={0.12}
          style={{ marginTop: 8 }}
        >
          {text.date}
        </Caps>
        <Caps
          assets={assets}
          size={22}
          spacing={0.14}
          style={{ marginTop: 22 }}
        >
          {scan}
        </Caps>
        {/* The code, on white with a quiet zone around it. */}
        <div
          style={{
            marginTop: 20,
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
      <Ad assets={assets} text={text.ad} scale={0.8} bottom={16} />
    </Frame>
  );
}
