import { ImageResponse } from "next/og";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { coupleNames } from "@/lib/format";
import {
  OG_FONT,
  OG_SIZE,
  ogFonts,
  ogImageData,
  ogLocale,
} from "@/lib/og/assets";
import { OgDivider, ogPalette } from "@/lib/og/palettes";
import { getPublishedTaklif } from "@/lib/server/taklif";
import { tashkentParts } from "@/lib/tashkent-date";

// The invitation's link preview (what guests see in Telegram before opening
// it): names, date and venue in the theme's colors, with the main photo.
// Published invitations only, like the page.
export const alt = "taklifim.uz";
export const size = OG_SIZE;
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale = ogLocale(raw);
  const taklif = await getPublishedTaklif(slug);
  if (!taklif) notFound();

  const c = ogPalette(taklif.theme.themeId);
  const [t, tDates, fonts, photo] = await Promise.all([
    getTranslations({ locale, namespace: "Invitation" }),
    getTranslations({ locale, namespace: "Dates" }),
    ogFonts(),
    taklif.photos[0] ? ogImageData(taklif.photos[0].url) : null,
  ]);
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);
  const date = tDates("dateTime", { day, month: months[month], year, time });
  const eyebrow = t("cover.eyebrow");
  // Long names get a smaller size so two lines always fit.
  const longest = Math.max(taklif.groomName.length, taklif.brideName.length);
  const nameSize = longest > 16 ? 58 : longest > 11 ? 70 : 84;

  const text = (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "0 40px",
      }}
    >
      <OgDivider color={c.gold} />
      <div
        style={{
          marginTop: 22,
          fontSize: 22,
          letterSpacing: 6,
          color: c.gold,
          textTransform: "uppercase",
          fontWeight: 600,
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          marginTop: 22,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          fontStyle: "italic",
          fontSize: nameSize,
          lineHeight: 1.02,
          color: c.names,
        }}
      >
        <span>{taklif.groomName}</span>
        <span
          style={{
            fontStyle: "normal",
            fontSize: nameSize * 0.5,
            color: c.gold,
            margin: "6px 0",
          }}
        >
          &
        </span>
        <span>{taklif.brideName}</span>
      </div>
      <div style={{ marginTop: 28, fontSize: 32, color: c.accent }}>{date}</div>
      <div
        style={{
          marginTop: 8,
          fontSize: 26,
          color: c.muted,
          maxWidth: 560,
          display: "flex",
          justifyContent: "center",
        }}
      >
        {taklif.venueName}
      </div>
      <div style={{ marginTop: 22, display: "flex" }}>
        <OgDivider color={c.gold} />
      </div>
    </div>
  );

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        background: c.background,
        fontFamily: OG_FONT,
        color: c.ink,
        padding: 40,
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          border: `1.5px solid ${c.gold}66`,
          borderRadius: 28,
          padding: photo ? 28 : 0,
        }}
      >
        {photo && (
          <div
            style={{
              width: 380,
              display: "flex",
              padding: 6,
              border: `1.5px solid ${c.gold}aa`,
              borderRadius: c.photoRadius,
            }}
          >
            <img
              src={photo}
              alt=""
              width={366}
              height={450}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: c.photoRadius,
              }}
            />
          </div>
        )}
        {text}
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 14,
          right: 0,
          left: 0,
          display: "flex",
          justifyContent: "center",
          fontSize: 18,
          letterSpacing: 2,
          color: c.muted,
        }}
      >
        {`taklifim.uz · ${coupleNames(taklif)}`}
      </div>
    </div>,
    { ...size, fonts },
  );
}
