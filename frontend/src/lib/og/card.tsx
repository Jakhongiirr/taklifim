import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactNode } from "react";
import { OG_FONT, ogFonts, ogLogo, ogNameFont } from "./assets";

// The invitation's generated images — the link preview, the downloadable
// card and the QR card — share one floral background (assets/og), one
// palette and the names in Great Vibes, whatever the theme, and end with a
// small taklifim.uz ad.

/** Warm browns and rose, picked from the background. */
const INK = "#4b4026";
const NAMES = "#6e5426";
const ROSE = "#a3566a";
const GOLD = "#a8844f";
const MUTED = "#7a6e55";
const CREAM = "248, 243, 229";

let background: Promise<string> | undefined;

/** The background (736×1331, portrait) as a data URI. */
function ogBackground() {
  background ??= readFile(join(process.cwd(), "assets/og/background.jpg")).then(
    (data) => `data:image/jpeg;base64,${data.toString("base64")}`,
  );
  return background;
}

/** Everything a card renders with: fonts (pass to ImageResponse) and images. */
export async function cardAssets() {
  const [base, names, bg, logo] = await Promise.all([
    ogFonts(),
    ogNameFont(),
    ogBackground(),
    ogLogo(),
  ]);
  return {
    fonts: [...base, ...names.fonts],
    nameFamily: names.family,
    bg,
    logo,
  };
}

type Assets = Awaited<ReturnType<typeof cardAssets>>;

/** The full-size frame: the background, covering, and a cream glow. */
function Frame({
  assets,
  width,
  height,
  glow,
  band,
  children,
}: {
  assets: Assets;
  width: number;
  height: number;
  /** How far the glow behind the text reaches, in % of the frame. */
  glow: number;
  /** A cream band behind the text, from and to (in % of the height). */
  band?: [number, number];
  children: ReactNode;
}) {
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
        width={width}
        height={height}
        style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }}
      />
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width,
          height,
          backgroundImage: `radial-gradient(circle at 50% 50%, rgba(${CREAM}, 0.9) 0%, rgba(${CREAM}, 0.75) ${glow * 0.6}%, rgba(${CREAM}, 0) ${glow}%)`,
        }}
      />
      {band && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width,
            height,
            backgroundImage: `linear-gradient(to bottom, rgba(${CREAM}, 0) ${band[0]}%, rgba(${CREAM}, 0.88) ${band[0] + 7}%, rgba(${CREAM}, 0.88) ${band[1] - 7}%, rgba(${CREAM}, 0) ${band[1]}%)`,
          }}
        />
      )}
      {children}
    </div>
  );
}

/** Groom & bride in Great Vibes, stacked or on one line. */
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
  const amp = (
    <span
      style={{
        fontFamily: OG_FONT,
        fontStyle: "italic",
        fontSize: size * 0.42,
        color: GOLD,
        margin: inline ? "0 0.4em" : "2px 0",
      }}
    >
      &
    </span>
  );
  return (
    <div
      style={{
        display: "flex",
        flexDirection: inline ? "row" : "column",
        alignItems: "center",
        fontFamily: assets.nameFamily,
        fontSize: size,
        lineHeight: 1.05,
        color: NAMES,
      }}
    >
      <span>{groom}</span>
      {amp}
      <span>{bride}</span>
    </div>
  );
}

/** Thin lines with a small diamond. */
function Divider({ width = 90 }: { width?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
      <div style={{ width, height: 2, background: GOLD }} />
      <div
        style={{
          width: 12,
          height: 12,
          border: `2px solid ${GOLD}`,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ width, height: 2, background: GOLD }} />
    </div>
  );
}

/** The ad at the bottom: a line of text and the logo on a cream pill. */
function Ad({
  assets,
  text,
  scale = 1,
  style,
}: {
  assets: Assets;
  text: string;
  scale?: number;
  style?: CSSProperties;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `${18 * scale}px ${40 * scale}px`,
        borderRadius: 999,
        background: `rgba(${CREAM}, 0.92)`,
        border: `2px solid ${GOLD}55`,
        ...style,
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
          marginTop: 8 * scale,
          fontSize: 26 * scale,
          letterSpacing: 1,
          color: MUTED,
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
  return (
    <Frame assets={assets} width={width} height={height} glow={55}>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 40,
        }}
      >
        <Names
          assets={assets}
          groom={text.groom}
          bride={text.bride}
          size={nameSize(text.groom, text.bride, [104, 88, 70])}
          inline
        />
        <div style={{ marginTop: 18, display: "flex" }}>
          <Divider />
        </div>
        <div style={{ marginTop: 18, fontSize: 38, color: ROSE }}>
          {text.date}
        </div>
        <div
          style={{
            marginTop: 6,
            fontSize: 30,
            color: MUTED,
            maxWidth: 900,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text.venue}
        </div>
      </div>
      <Ad
        assets={assets}
        text={text.ad}
        scale={0.7}
        style={{ position: "absolute", bottom: 22 }}
      />
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
    width: 250,
    display: "flex",
    justifyContent: "center",
    padding: "14px 0",
    borderTop: `2px solid ${GOLD}`,
    borderBottom: `2px solid ${GOLD}`,
    fontSize: 36,
    letterSpacing: 5,
    textTransform: "uppercase",
    color: INK,
    fontWeight: 600,
  };
  return (
    <Frame
      assets={assets}
      width={width}
      height={height}
      glow={46}
      band={[11, 85]}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 70px 90px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 34,
            letterSpacing: 7,
            textTransform: "uppercase",
            color: ROSE,
            fontWeight: 600,
          }}
        >
          {invite}
        </div>
        <div style={{ marginTop: 24, display: "flex" }}>
          <Names
            assets={assets}
            groom={text.groom}
            bride={text.bride}
            size={nameSize(text.groom, text.bride, [196, 160, 128])}
          />
        </div>
        <div style={{ marginTop: 28, display: "flex" }}>
          <Divider width={130} />
        </div>
        <div
          style={{
            marginTop: 40,
            display: "flex",
            alignItems: "center",
            gap: 34,
          }}
        >
          <div style={side}>{weekday}</div>
          <div
            style={{
              display: "flex",
              fontSize: 150,
              lineHeight: 1,
              color: ROSE,
              fontWeight: 500,
            }}
          >
            {day}
          </div>
          <div style={side}>{time}</div>
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 14,
            fontSize: 40,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
          }}
        >
          {`${month} ${year}`}
        </div>
        <div
          style={{
            marginTop: 44,
            fontSize: 58,
            fontWeight: 600,
            color: INK,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {text.venue}
        </div>
        <div
          style={{
            marginTop: 8,
            fontSize: 38,
            lineHeight: 1.25,
            color: MUTED,
            display: "flex",
            justifyContent: "center",
          }}
        >
          {address}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontFamily: assets.nameFamily,
            fontSize: 64,
            color: NAMES,
          }}
        >
          {signature}
        </div>
      </div>
      <Ad
        assets={assets}
        text={text.ad}
        style={{ position: "absolute", bottom: 80 }}
      />
    </Frame>
  );
}

export const QR_CARD_SIZE = { width: 1080, height: 1350 };
const QR_SIZE = 520;

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
    <Frame
      assets={assets}
      width={width}
      height={height}
      glow={50}
      band={[8, 86]}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 150,
        }}
      >
        <Names
          assets={assets}
          groom={text.groom}
          bride={text.bride}
          size={names.length > 26 ? 66 : names.length > 18 ? 80 : 94}
          inline
        />
        <div style={{ marginTop: 6, fontSize: 40, color: ROSE }}>
          {text.date}
        </div>
        {/* The code, on white with a quiet zone around it. */}
        <div
          style={{
            marginTop: 36,
            display: "flex",
            padding: 36,
            background: "#ffffff",
            borderRadius: 32,
            border: `2px solid ${GOLD}aa`,
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
        <div
          style={{
            marginTop: 28,
            fontSize: 30,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: GOLD,
            fontWeight: 600,
          }}
        >
          {scan}
        </div>
      </div>
      <Ad
        assets={assets}
        text={text.ad}
        scale={0.8}
        style={{ position: "absolute", bottom: 50 }}
      />
    </Frame>
  );
}
