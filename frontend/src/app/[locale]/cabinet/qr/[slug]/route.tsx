import { ImageResponse } from "next/og";
import { getTranslations } from "next-intl/server";
import QRCode from "qrcode";
import { ogLocale } from "@/lib/og/assets";
import { cardAssets, QR_CARD_SIZE, QrCard } from "@/lib/og/card";
import { SITE_URL } from "@/lib/seo";
import { getTaklifPreview } from "@/lib/server/taklif";
import { tashkentParts } from "@/lib/tashkent-date";

// The invitation's QR code as a PNG the owner can print or put on a screen:
// the names and date on the shared card background (lib/og/card) around a
// code that opens the invitation (guests pick its language there). Published only (the
// only ones the link opens), owner or admin, like the card (../../download).

/** Dark on white, so every phone camera reads it. */
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

  // The short link: guests pick the language on the invitation.
  const url = `${SITE_URL}/taklif/${taklif.slug}`;
  const [tDates, assets, qr] = await Promise.all([
    getTranslations({ locale, namespace: "Dates" }),
    cardAssets(),
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "M",
      margin: 0,
      color: { dark: QR_DARK, light: "#ffffff" },
    }),
  ]);
  const months = tDates.raw("months") as string[];
  const { year, month, day, time } = tashkentParts(taklif.eventAt);

  const image = new ImageResponse(
    <QrCard
      assets={assets}
      groom={taklif.groomName}
      bride={taklif.brideName}
      date={tDates("dateTime", { day, month: months[month], year, time })}
      qr={qr}
    />,
    { ...QR_CARD_SIZE, fonts: assets.fonts },
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
