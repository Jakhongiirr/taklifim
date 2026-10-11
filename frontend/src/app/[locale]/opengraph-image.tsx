import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { formatSum } from "@/lib/format";
import {
  OG_FONT,
  OG_SIZE,
  ogFonts,
  ogLocale,
  ogLogo,
  ogNameFont,
  ogPublicImage,
} from "@/lib/og/assets";
import { getDemos } from "@/lib/server/demos";

// The site's link preview (home and every page without its own).
export const alt = "taklifim.uz";
export const size = OG_SIZE;
export const contentType = "image/png";

const INK = "#2a2723";
const SAGE = "#46523f";
const GOLD = "#a8844f";

// The designs fanned out on the right, drawn back to front: the side
// screens first, then the middle one, which carries the names.
const SHOWCASE = [
  { id: "dove", left: 655, top: 160, width: 200, height: 370, rotate: -8 },
  { id: "paris", left: 985, top: 160, width: 200, height: 370, rotate: 8 },
  { id: "aurora", left: 800, top: 92, width: 250, height: 460, rotate: 0 },
] as const;
const BEZEL = 7;

// Petals scattered around the fan: x, y, size, rotation, colour.
const PETALS: [number, number, number, number, string][] = [
  [640, 70, 26, -30, "#eeb0b0"],
  [1120, 110, 20, 40, "#e2c08a"],
  [700, 520, 22, 15, "#f4cbc4"],
  [1135, 470, 28, -50, "#e9a3a8"],
  [905, 28, 16, 70, "#e2c08a"],
  [560, 560, 18, -10, "#eeb0b0"],
];

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = ogLocale((await params).locale);
  const [t, fonts, logo, demos, script, ...art] = await Promise.all([
    getTranslations({ locale, namespace: "HomePage" }),
    ogFonts(),
    ogLogo(),
    getDemos(),
    ogNameFont("great-vibes"),
    ...SHOWCASE.map(({ id }) => ogPublicImage(`themes/${id}/opening-end.jpg`)),
  ]);
  // "Invite your guests with a <accent>beautiful invitation</accent>"
  const [before, accent = "", after = ""] = (
    t.raw("hero.title") as string
  ).split(/<\/?accent>/);
  const prices = demos.map((d) => d.theme.price).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background:
          "radial-gradient(circle at 78% 45%, #efe5d2 0%, #faf7f1 55%)",
        fontFamily: OG_FONT,
        color: INK,
        padding: "64px 72px",
        position: "relative",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 580,
          justifyContent: "center",
        }}
      >
        <img src={logo} width={267} height={60} alt="" />
        <div
          style={{
            marginTop: 48,
            fontSize: 18,
            letterSpacing: 4,
            color: GOLD,
            textTransform: "uppercase",
            fontWeight: 600,
          }}
        >
          {t("hero.eyebrow")}
        </div>
        <div
          style={{
            marginTop: 18,
            fontSize: 72,
            lineHeight: 1.04,
            fontWeight: 500,
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          {before}
          <span style={{ color: SAGE, fontStyle: "italic" }}>{accent}</span>
          {after}
        </div>
        {minPrice !== null && (
          <div style={{ display: "flex", marginTop: 36 }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                fontSize: 28,
                fontWeight: 600,
                padding: "10px 26px",
                borderRadius: 999,
                border: `2px solid ${GOLD}66`,
                background: "#ffffffaa",
              }}
            >
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: 10,
                  background: GOLD,
                }}
              />
              {t("hero.priceFrom", { price: formatSum(minPrice) })}
            </div>
          </div>
        )}
      </div>

      {PETALS.map(([x, y, size, rotate, color], i) => (
        <svg
          key={i}
          viewBox="0 0 20 20"
          width={size}
          height={size}
          style={{
            position: "absolute",
            left: x,
            top: y,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <path
            d="M10 19C3.5 14 2 8.5 4.5 4.5 6 2 8.5 2 10 4.5 11.5 2 14 2 15.5 4.5 18 8.5 16.5 14 10 19Z"
            fill={color}
            opacity={0.85}
          />
        </svg>
      ))}

      {/* Three of the designs, fanned out. */}
      {SHOWCASE.map(({ id, left, top, width, height, rotate }, i) => (
        <div
          key={id}
          style={{
            position: "absolute",
            left,
            top,
            width,
            height,
            display: "flex",
            borderRadius: 34,
            background: INK,
            boxShadow: "0 30px 60px -18px rgba(42,39,35,0.45)",
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <img
            src={art[i]}
            width={width - 2 * BEZEL}
            height={height - 2 * BEZEL}
            alt=""
            style={{
              position: "absolute",
              left: BEZEL,
              top: BEZEL,
              objectFit: "cover",
              borderRadius: 27,
            }}
          />
          {id === "aurora" && (
            <div
              style={{
                position: "absolute",
                left: BEZEL,
                bottom: BEZEL,
                width: width - 2 * BEZEL,
                height: 230,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "flex-end",
                paddingBottom: 26,
                borderRadius: "0 0 27px 27px",
                background:
                  "linear-gradient(to bottom, rgba(250,247,241,0) 0%, rgba(250,247,241,0.9) 40%, #faf7f1 100%)",
              }}
            >
              <div
                style={{
                  fontFamily: script.family,
                  fontSize: 50,
                  lineHeight: 1.05,
                  color: GOLD,
                }}
              >
                {t("mock.groom")}
              </div>
              <div style={{ fontSize: 18, color: GOLD }}>&</div>
              <div
                style={{
                  fontFamily: script.family,
                  fontSize: 50,
                  lineHeight: 1.05,
                  color: GOLD,
                }}
              >
                {t("mock.bride")}
              </div>
              <div
                style={{
                  marginTop: 10,
                  fontSize: 15,
                  letterSpacing: 3,
                  color: INK,
                  opacity: 0.75,
                }}
              >
                {`${t("mock.day")} · ${t("mock.month")} · ${t("mock.year")}`.toUpperCase()}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>,
    { ...size, fonts: [...fonts, ...script.fonts] },
  );
}
