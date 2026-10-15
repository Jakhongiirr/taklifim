import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import DemoChrome from "@/components/site/designs/demo-chrome";
import { demoInvitation, demoWishes } from "@/content/demo-invitation";
import { DESIGN_IDS, designName } from "@/content/designs";
import { getMusic } from "@/lib/server/catalog";
import { getDesignOffers } from "@/lib/server/designs";
import { ThemedInvitation } from "@/themes";
import { DemoProvider } from "@/themes/shared/demo";

// Rebuilt in the background at most every 5 minutes, like the catalog fetch
// (and so the sample date keeps moving ahead).
export const revalidate = 300;
// Only the designs with copy have a demo, like their pages.
export const dynamicParams = false;

export function generateStaticParams() {
  return DESIGN_IDS.map((design) => ({ design }));
}

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/designs/[design]/demo">): Promise<Metadata> {
  const { design } = await params;
  const t = await getTranslations("Designs");
  return {
    title: t("demoPage.metaTitle", { name: designName(design) }),
    // The design's own page is the one to find; this is a sample.
    robots: { index: false, follow: true },
  };
}

/**
 * A design's built-in demo: the sample invitation in it, with the first
 * music track. Works without an admin-made demo, so every design has one.
 */
export default async function DesignDemoPage({
  params,
}: PageProps<"/[locale]/designs/[design]/demo">) {
  const { locale, design } = await params;
  const [offerFor, music] = await Promise.all([getDesignOffers(), getMusic()]);
  const offer = offerFor(design);
  if (!offer) notFound();
  return (
    <>
      <DemoChrome design={design} themeId={offer.theme?.id ?? null} />
      <DemoProvider wishes={demoWishes(locale)}>
        <ThemedInvitation
          taklif={demoInvitation(design, locale, music[0] ?? null)}
        />
      </DemoProvider>
    </>
  );
}
