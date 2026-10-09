import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import { formatSum } from "@/lib/format";
import { OG_FONT, OG_SIZE, ogFonts, ogLocale, ogLogo } from "@/lib/og/assets";
import { getDemos } from "@/lib/server/demos";

// The site's link preview (home and every page without its own).
export const alt = "taklifim.uz";
export const size = OG_SIZE;
export const contentType = "image/png";

const INK = "#2a2723";
const SAGE = "#46523f";
const GOLD = "#a8844f";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = ogLocale((await params).locale);
  const [t, fonts, logo, demos] = await Promise.all([
    getTranslations({ locale, namespace: "HomePage" }),
    ogFonts(),
    ogLogo(),
    getDemos(),
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
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: 640,
          justifyContent: "center",
        }}
      >
        <img src={logo} width={267} height={60} alt="" />
        <div
          style={{
            marginTop: 48,
            fontSize: 22,
            letterSpacing: 5,
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

      {/* A sample invitation card, slightly tilted. */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 300,
            height: 430,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            background: "#f2ece1",
            borderRadius: 28,
            border: `1.5px solid ${GOLD}88`,
            boxShadow: "0 30px 60px -20px rgba(42,39,35,0.35)",
            transform: "rotate(4deg)",
            padding: 28,
          }}
        >
          <div
            style={{
              fontSize: 16,
              letterSpacing: 5,
              color: GOLD,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("mock.eyebrow")}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 54,
              fontStyle: "italic",
              lineHeight: 1,
            }}
          >
            {t("mock.groom")}
          </div>
          <div style={{ fontSize: 34, color: GOLD, margin: "6px 0" }}>&</div>
          <div style={{ fontSize: 54, fontStyle: "italic", lineHeight: 1 }}>
            {t("mock.bride")}
          </div>
          <div
            style={{
              marginTop: 26,
              width: 70,
              height: 1.5,
              background: `${GOLD}99`,
            }}
          />
          <div style={{ marginTop: 22, fontSize: 30, color: SAGE }}>
            {`${t("mock.day")} · ${t("mock.month")} · ${t("mock.year")}`}
          </div>
          <div style={{ marginTop: 8, fontSize: 22, opacity: 0.75 }}>
            {t("mock.venue")}
          </div>
        </div>
      </div>
    </div>,
    { ...size, fonts },
  );
}
