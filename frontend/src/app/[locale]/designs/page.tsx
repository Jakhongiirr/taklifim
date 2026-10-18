import type { Metadata } from "next";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import DesignCard from "@/components/site/designs/design-card";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { DESIGN_COPY, DESIGN_IDS, designName } from "@/content/designs";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeAlternates, OG_IMAGES, SITE_URL } from "@/lib/seo";
import { getDesignOffers } from "@/lib/server/designs";

const copyFor = (id: string, locale: string) =>
  DESIGN_COPY[id][locale] ?? DESIGN_COPY[id][routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/designs">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Designs");
  const title = t("index.metaTitle");
  const description = t("index.metaDescription");
  return {
    title,
    description,
    alternates: localeAlternates(locale, "/designs"),
    openGraph: {
      title,
      description,
      siteName: "taklifim.uz",
      type: "website",
      images: OG_IMAGES,
    },
  };
}

// Rendered per visit, not built ahead: the build can't reach the backend, so
// a prebuilt page would show no prices until it was rebuilt. The catalog
// fetch itself is still cached for 5 minutes.
export default async function DesignsPage({
  params,
}: PageProps<"/[locale]/designs">) {
  await connection();
  const { locale } = await params;
  const [t, offerFor] = await Promise.all([
    getTranslations("Designs"),
    getDesignOffers(),
  ]);
  const designs = DESIGN_IDS.flatMap((id) => {
    const offer = offerFor(id);
    return offer ? [{ id, offer }] : [];
  });

  // The list of designs, and where this page sits on the site.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: t("index.title"),
        url: `${SITE_URL}/${locale}/designs`,
        inLanguage: locale,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: designs.map(({ id }, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: designName(id),
            url: `${SITE_URL}/${locale}/designs/${id}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: t("home"),
            item: `${SITE_URL}/${locale}`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: t("index.title"),
            item: `${SITE_URL}/${locale}/designs`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <SiteHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
        <nav aria-label={t("breadcrumbs")} className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            {t("home")}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-ink">{t("index.title")}</span>
        </nav>

        <div className="mx-auto mt-8 max-w-2xl text-center">
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
            {t("index.eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">
            {t("index.title")}
          </h1>
          <p className="mt-4 text-muted">{t("index.text")}</p>
        </div>

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {designs.map(({ id, offer }) => (
            <li key={id} className="reveal">
              <DesignCard
                id={id}
                tagline={copyFor(id, locale).tagline}
                price={offer.theme?.price ?? null}
              />
            </li>
          ))}
        </ul>

        <div className="mt-16 rounded-[2rem] bg-cream px-6 py-12 text-center ring-1 ring-line">
          <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
            {t("cta.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">{t("cta.text")}</p>
          <Link
            href="/cabinet/new"
            className="mt-7 inline-flex h-12 items-center justify-center rounded-full bg-sage px-8 font-medium text-paper transition-colors hover:bg-sage-dark"
          >
            {t("cta.button")}
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
