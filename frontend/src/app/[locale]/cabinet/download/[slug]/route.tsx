import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import {
  OG_FONT,
  ogFonts,
  ogImageData,
  ogLocale,
  ogNameFont,
  ogPublicImage,
} from "@/lib/og/assets";
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  type CardImage,
  cardDecor,
} from "@/lib/og/card-decor";
import { ogPalette } from "@/lib/og/palettes";
import { getTaklifPreview } from "@/lib/server/taklif";
import { tashkentParts } from "@/lib/tashkent-date";

// The invitation as a PNG the owner can save and send anywhere (a story or
// phone-screen size): names, date, venue, host and the main photo, in the
// theme's colors and the page's language. Published only, owner or admin;
// the proxy renews the session for /cabinet paths. Decorated like the
// theme (lib/og/card-decor.tsx): its art behind, its ornament, the names in
// its typeface.

/** The photo, plus its padding and border (the frame decorations hug). */
const PHOTO = { width: 500, height: 610 };
const FRAME = { width: PHOTO.width + 24, height: PHOTO.height + 24 };

export async function GET(
  _request: Request,
  ctx: RouteContext<"/[locale]/cabinet/download/[slug]">,
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
  const [t, tDates, baseFonts, photo, art, nameFont] = await Promise.all([
    getTranslations({ locale, namespace: "Invitation" }),
    getTranslations({ locale, namespace: "Dates" }),
    ogFonts(),
    taklif.photos[0] ? ogImageData(taklif.photos[0].url) : null,
    decor.art ? ogPublicImage(decor.art.path) : null,
    decor.names ? ogNameFont(decor.names.font) : null,
  ]);
  const fonts = nameFont ? [...baseFonts, ...nameFont.fonts] : baseFonts;
  const months = tDates.raw("months") as string[];
  const weekdays = tDates.raw("weekdays") as string[];
  const { year, month, day, weekday, time } = tashkentParts(taklif.eventAt);
  const date = tDates("dateTime", { day, month: months[month], year, time });
  // Long names get a smaller size so each fits on one line.
  const longest = Math.max(taklif.groomName.length, taklif.brideName.length);
  const nameSize =
    (longest > 16 ? 92 : longest > 11 ? 110 : 132) *
    (photo ? 1 : 1.15) *
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
        padding: 48,
        position: "relative",
      }}
    >
      {art && decor.art && (
        // eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser
        <img
          src={art}
          alt=""
          width={CARD_WIDTH}
          height={CARD_HEIGHT}
          style={{ position: "absolute", left: 0, top: 0, objectFit: "cover" }}
        />
      )}
      {decor.art && (
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            width: CARD_WIDTH,
            height: CARD_HEIGHT,
            backgroundImage: decor.art.fade,
          }}
        />
      )}
      {decor.layer && (
        <Picture
          image={decor.layer}
          style={{ position: "absolute", left: 0, top: 0 }}
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
          padding: "64px 56px 48px",
        }}
      >
        {/* Top: the occasion. */}
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
              marginTop: 28,
              fontSize: 32,
              letterSpacing: 9,
              color: c.gold,
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            {t("cover.eyebrow")}
          </div>
          <div
            style={{
              marginTop: 14,
              fontSize: 38,
              fontStyle: "italic",
              color: c.accent,
            }}
          >
            {t("cover.invite")}
          </div>
        </div>

        {photo ? (
          <div style={{ position: "relative", display: "flex" }}>
            <div
              style={{
                display: "flex",
                padding: 10,
                border: `2px solid ${c.gold}aa`,
                borderRadius: c.photoRadius,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
              <img
                src={photo}
                alt=""
                width={PHOTO.width}
                height={PHOTO.height}
                style={{ objectFit: "cover", borderRadius: c.photoRadius }}
              />
            </div>
            {decor.photo?.(FRAME.width, FRAME.height)}
          </div>
        ) : (
          decor.emblem && <Picture image={decor.emblem} />
        )}

        {/* The couple. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily: nameFont?.family ?? OG_FONT,
            fontStyle: nameFont ? "normal" : "italic",
            fontSize: nameSize,
            lineHeight: 1.02,
            color: c.names,
          }}
        >
          <span>{taklif.groomName}</span>
          <span
            style={{
              fontFamily: OG_FONT,
              fontStyle: "normal",
              fontSize: nameSize * 0.45,
              color: c.gold,
              margin: "4px 0",
            }}
          >
            &
          </span>
          <span>{taklif.brideName}</span>
        </div>

        {/* When and where. */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxWidth: 860,
          }}
        >
          <Picture image={decor.divider} />
          <div
            style={{
              marginTop: 24,
              fontSize: 30,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: c.gold,
              fontWeight: 600,
            }}
          >
            {weekdays[weekday]}
          </div>
          <div style={{ marginTop: 8, fontSize: 50, color: c.accent }}>
            {date}
          </div>
          <div
            style={{
              marginTop: 24,
              fontSize: 42,
              fontWeight: 600,
              color: c.ink,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {taklif.venueName}
          </div>
          <div
            style={{
              marginTop: 6,
              fontSize: 32,
              color: c.muted,
              display: "flex",
              justifyContent: "center",
            }}
          >
            {taklif.venueAddress}
          </div>
          <div
            style={{
              marginTop: 28,
              fontSize: 34,
              fontStyle: "italic",
              color: c.accent,
            }}
          >
            {t("signature", { host: taklif.hostName })}
          </div>
        </div>

        {/* The brand, small at the bottom. */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 2,
            color: c.muted,
          }}
        >
          {t("cardMadeWith")}
        </div>
      </div>
    </div>,
    { width: CARD_WIDTH, height: CARD_HEIGHT, fonts },
  );

  const headers = new Headers(image.headers);
  headers.set(
    "Content-Disposition",
    `attachment; filename="taklifim-${taklif.slug}.png"`,
  );
  // Personal and changes with every edit.
  headers.set("Cache-Control", "private, no-store");
  return new Response(image.body, { status: image.status, headers });
}

/** A decoration image (an SVG drawn at its own size). */
function Picture({
  image,
  style,
}: {
  image: CardImage;
  style?: React.CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser
    <img
      src={image.src}
      width={image.width}
      height={image.height}
      alt=""
      style={style}
    />
  );
}
