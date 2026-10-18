import "server-only";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { CSSProperties, ReactNode } from "react";
import { OG_FONT, ogFont, ogFonts, ogLogo } from "./assets";

// The invitation's generated images — the downloadable card and the QR
// card — share one background (assets/og: a dusty blue
// panel in a cream frame with roses in the corners), one palette and
// typography, whatever the theme, and end with a small taklifim.uz ad. The
// text sits in the blue panel.

/** Picked from the background: the panel's deep blue, the roses' bronze. */
const INK = "#101d33";
const NAVY = "#10213c";
const BRONZE = "#4a300c";
const MUTED = "#1c2d47";

/** The background's size. */
const BG = { width: 720, height: 1011 };

/**
 * The background's bands along each axis, in its pixels: the corners and
 * the centre ornaments keep their shape, the plain stretches between them
 * (`true`) give or take the rest of the card's size.
 */
type Band = readonly [from: number, to: number, stretch?: boolean];
const BANDS_X: Band[] = [
  [0, 240],
  [240, 330, true],
  [330, 395],
  [395, 440, true],
  [440, 720],
];
const BANDS_Y: Band[] = [
  [0, 250],
  [250, 440, true],
  [440, 540],
  [540, 690, true],
  [690, 1011],
];

/** Where each band lands on a card `length` long at `scale`. */
function place(bands: Band[], scale: number, length: number) {
  const fixed = bands.reduce(
    (sum, [from, to, stretch]) => (stretch ? sum : sum + (to - from) * scale),
    0,
  );
  const loose = bands.reduce(
    (sum, [from, to, stretch]) => (stretch ? sum + to - from : sum),
    0,
  );
  const k = (length - fixed) / loose;
  let at = 0;
  return bands.map(([from, to, stretch]) => {
    const start = Math.round(at);
    at += (to - from) * (stretch ? k : scale);
    const size = Math.round(at) - start;
    // Much longer than drawn: repeat it instead of smearing it, every other
    // copy mirrored so the seams meet; an odd count, so both ends still
    // meet the neighbouring bands.
    const copies = stretch
      ? Math.max(1, 2 * Math.round((k / scale - 1) / 2) + 1)
      : 1;
    return { from, to, start, size, copies };
  });
}

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
    ogFont("great-vibes"),
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
 * The full-size frame: the background drawn at `scale`, its plain bands
 * stretched (or repeated) to fill the card.
 */
function Frame({
  assets,
  width,
  height,
  scale,
  children,
}: {
  assets: Assets;
  width: number;
  height: number;
  scale: number;
  children: ReactNode;
}) {
  const xs = place(BANDS_X, scale, width);
  const ys = place(BANDS_Y, scale, height);
  const tiles = xs.flatMap((x) =>
    ys.flatMap((y) =>
      Array.from({ length: x.copies * y.copies }, (_, i) => {
        const cx = i % x.copies;
        const cy = Math.floor(i / x.copies);
        const left = x.start + Math.round((x.size * cx) / x.copies);
        const top = y.start + Math.round((y.size * cy) / y.copies);
        return {
          key: `${x.from}-${y.from}-${i}`,
          left,
          top,
          width: x.start + Math.round((x.size * (cx + 1)) / x.copies) - left,
          height: y.start + Math.round((y.size * (cy + 1)) / y.copies) - top,
          x,
          y,
          flip: [cx % 2 === 1 ? -1 : 1, cy % 2 === 1 ? -1 : 1],
        };
      }),
    ),
  );
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
        // A soft light halo lifts the text off the mottled blue.
        textShadow:
          "0 0 6px rgba(240,245,250,0.9), 0 0 18px rgba(236,242,248,0.85)",
      }}
    >
      {tiles.map(({ key, left, top, width: w, height: h, x, y, flip }) => {
        const kx = w / (x.to - x.from);
        const ky = h / (y.to - y.from);
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              left,
              top,
              width: w,
              height: h,
              display: "flex",
              overflow: "hidden",
              transform: `scale(${flip[0]}, ${flip[1]})`,
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
            <img
              src={assets.bg}
              alt=""
              width={BG.width * kx}
              height={BG.height * ky}
              style={{
                position: "absolute",
                left: -x.from * kx,
                top: -y.from * ky,
              }}
            />
          </div>
        );
      })}
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
        color: NAVY,
      }}
    >
      <span>{groom}</span>
      <span
        style={{
          fontFamily: assets.capsFamily,
          fontSize: size * 0.42,
          color: BRONZE,
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
      <div style={{ width, height: 1.5, background: BRONZE }} />
      <div
        style={{
          width: 10,
          height: 10,
          border: `1.5px solid ${BRONZE}`,
          transform: "rotate(45deg)",
        }}
      />
      <div style={{ width, height: 1.5, background: BRONZE }} />
    </div>
  );
}

/** Spaced capitals in Forum. */
function Caps({
  assets,
  size,
  color = BRONZE,
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

/** The guest greeting: a line in italics, then the invitation itself. */
function Greeting({
  greeting,
  size,
  width,
}: {
  greeting: CardGreeting;
  size: number;
  width: number;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxWidth: width,
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: size * 1.15,
          fontWeight: 600,
          fontStyle: "italic",
          color: NAVY,
        }}
      >
        {greeting.title}
      </div>
      <div
        style={{
          display: "flex",
          marginTop: size * 0.3,
          fontSize: size,
          fontWeight: 600,
          lineHeight: 1.3,
          color: INK,
          justifyContent: "center",
        }}
      >
        {greeting.text}
      </div>
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
          fontSize: 32 * scale,
          fontWeight: 700,
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

/** The greeting to the guest on the PNG and QR cards. */
export interface CardGreeting {
  title: string;
  text: string;
}

export const STORY_SIZE = { width: 1080, height: 1920 };

/** The invitation as a phone-screen PNG the owner can send anywhere. */
export function StoryCard({
  assets,
  greeting,
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
  greeting: CardGreeting;
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
    borderTop: `1.5px solid ${BRONZE}`,
    borderBottom: `1.5px solid ${BRONZE}`,
  };
  return (
    // The frame across the full width, its plain sides drawn out.
    <Frame assets={assets} width={width} height={height} scale={1.5}>
      {/* The panel, between the corner roses. */}
      <Content top={250} height={1220}>
        <Greeting greeting={greeting} size={34} width={780} />
        <div style={{ marginTop: 30, display: "flex" }}>
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
              color: BRONZE,
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
            color: NAVY,
          }}
        >
          {signature}
        </div>
      </Content>
      {/* Inside the frame, just above its bottom ornament. */}
      <Ad assets={assets} text={text.ad} scale={0.85} bottom={210} />
    </Frame>
  );
}

export const QR_CARD_SIZE = { width: 1080, height: 1350 };
const QR_SIZE = 360;

/** The invitation's QR code, to print or put on a screen. */
export function QrCard({
  assets,
  greeting,
  qr,
  scan,
  ...text
}: Omit<CardText, "venue"> & {
  assets: Assets;
  greeting: CardGreeting;
  /** The code as an SVG string. */
  qr: string;
  scan: string;
}) {
  const { width, height } = QR_CARD_SIZE;
  const names = `${text.groom} & ${text.bride}`;
  return (
    // The frame a little smaller, so the code fits between the roses.
    <Frame assets={assets} width={width} height={height} scale={1.3}>
      <Content top={170} height={890}>
        <Greeting greeting={greeting} size={26} width={780} />
        <div style={{ marginTop: 14, display: "flex" }}>
          <Names
            assets={assets}
            groom={text.groom}
            bride={text.bride}
            size={names.length > 26 ? 60 : names.length > 18 ? 72 : 84}
            inline={names.length <= 26}
          />
        </div>
        <Caps
          assets={assets}
          size={40}
          color={BRONZE}
          spacing={0.08}
          style={{ marginTop: 8 }}
        >
          {text.date}
        </Caps>
        <Caps
          assets={assets}
          size={30}
          spacing={0.08}
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
            border: `2px solid ${BRONZE}`,
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
      {/* Inside the frame, just above its bottom ornament. */}
      <Ad assets={assets} text={text.ad} scale={0.8} bottom={180} />
    </Frame>
  );
}
