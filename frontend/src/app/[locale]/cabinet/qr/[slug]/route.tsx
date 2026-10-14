import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import QRCode from "qrcode";
import {
  OG_FONT,
  ogFonts,
  ogLocale,
  ogNameFont,
  ogPublicImage,
} from "@/lib/og/assets";
import { type CardImage, cardDecor } from "@/lib/og/card-decor";
import { ogPalette } from "@/lib/og/palettes";
import { SITE_URL } from "@/lib/seo";
import { getTaklifPreview } from "@/lib/server/taklif";
import { tashkentParts } from "@/lib/tashkent-date";

// The invitation's QR code as a PNG the owner can print or put on a screen:
// the names and date in the theme's colors around a code that opens the
// invitation in the page's language. Published only (the only ones the link
// opens), owner or admin, like the card (../../download).

const WIDTH = 1080;
const HEIGHT = 1350;
const QR_SIZE = 600;
/** Dark on white whatever the theme, so every phone camera reads it. */
const QR_DARK = "#1c1917";

export async function GET(
  _request: Request,
  ctx: RouteContext<"/[locale]/cabinet/qr/[slug]">,
) {
  const { locale: raw, slug } = await ctx.params;
  const locale = ogLocale(raw);
  const taklif = await getTaklifPreview(slug);
  if (!taklif) return new Response("Not found", { status: 404 });
  // Paying publishes: no image of an unpaid draft or a withdrawn invitation.
  if (taklif.status !== "published") {
    return new Response("Not published", { status: 403 });
  }

  const c = ogPalette(taklif.theme.themeId);
  const decor = cardDecor(taklif.theme.themeId);
  const url = `${SITE_URL}/${locale}/taklif/${taklif.slug}`;
  const [t, tDates, baseFonts, art, nameFont, qr] = await Promise.all([
    getTranslations({ locale, namespace: "Invitation" }),
    getTranslations({ locale, namespace: "Dates" }),
    ogFonts(),
    decor.art ? ogPublicImage(decor.art.path) : null,
    decor.names ? ogNameFont(decor.names.font) : null,
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 0,
      color: { dark: QR_DARK, light: "#ffffff" },
    }),
  ]);
  const fonts = nameFont ? [...baseFonts, ...nameFont.fonts] : baseFonts;
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);
  const date = tDates("dateTime", { day, month: months[month], year, time });
  const names = `${taklif.groomName} & ${taklif.brideName}`;
  // Both names on one line: long ones get a smaller size.
  const nameSize =
    (names.length > 26 ? 64 : names.length > 18 ? 78 : 92) *
    (decor.names?.scale ?? 1);

  const image = new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: c.background,
        fontFamily: OG_FONT,
        color: c.ink,
        padding: 40,
        position: "relative",
      }}
    >
      {art && decor.art && (
        // eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser
        <img
          src={art}
          alt=""
          width={WIDTH}
          height={HEIGHT}
          style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }}
        />
      )}
      {decor.art && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: WIDTH,
            height: HEIGHT,
            backgroundImage: decor.art.fade,
          }}
        />
      )}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          textAlign: "center",
          border: `2px solid ${c.gold}66`,
          borderRadius: 36,
          padding: "52px 48px 40px",
        }}
      >
        {/* The couple and the day. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Picture image={decor.divider} />
          <div
            style={{
              marginTop: 20,
              fontFamily: nameFont?.family ?? OG_FONT,
              fontStyle: nameFont ? "normal" : "italic",
              fontSize: nameSize,
              lineHeight: 1.1,
              color: c.names,
            }}
          >
            {names}
          </div>
          <div style={{ marginTop: 10, fontSize: 40, color: c.accent }}>
            {date}
          </div>
        </div>

        {/* The code, on white with a quiet zone around it. */}
        <div
          style={{
            display: "flex",
            padding: 40,
            background: "#ffffff",
            borderRadius: 32,
            border: `2px solid ${c.gold}aa`,
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
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              fontSize: 28,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: c.gold,
              fontWeight: 600,
            }}
          >
            {t("qrScan")}
          </div>
          <div
            style={{
              marginTop: 18,
              fontSize: 24,
              letterSpacing: 2,
              color: c.muted,
            }}
          >
            {t("cardMadeWith")}
          </div>
        </div>
      </div>
    </div>,
    { width: WIDTH, height: HEIGHT, fonts },
  );

  const headers = new Headers(image.headers);
  headers.set(
    "Content-Disposition",
    `attachment; filename="taklifim-${taklif.slug}-qr.png"`,
  );
  // Personal and changes with every edit.
  headers.set("Cache-Control", "private, no-store");
  return new Response(image.body, { status: image.status, headers });
}

/** A decoration image (an SVG drawn at its own size). */
function Picture({ image }: { image: CardImage }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser
    <img src={image.src} width={image.width} height={image.height} alt="" />
  );
}
