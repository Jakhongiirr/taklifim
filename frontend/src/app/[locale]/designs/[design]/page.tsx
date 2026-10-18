import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import DesignCard from "@/components/site/designs/design-card";
import { DESIGN_NAME_FONT } from "@/components/site/designs/design-fonts";
import DesignVideo from "@/components/site/designs/design-video";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { DESIGN_COPY, DESIGN_IDS, designName } from "@/content/designs";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { demoUrlFor } from "@/lib/demo-url";
import { formatSum } from "@/lib/format";
import { localeAlternates, OG_IMAGES, SITE_URL } from "@/lib/seo";
import { getDesignOffers } from "@/lib/server/designs";

/** What every design comes with (the home page's feature names). */
const INCLUDED = [
  "video",
  "photos",
  "music",
  "countdown",
  "map",
  "rsvp",
  "wishes",
  "gift",
  "card",
  "languages",
] as const;

/** Only the designs with copy have a page. */
const hasPage = (id: string) => DESIGN_IDS.includes(id);

const copyFor = (id: string, locale: string) =>
  DESIGN_COPY[id][locale] ?? DESIGN_COPY[id][routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/designs/[design]">): Promise<Metadata> {
  const { locale, design } = await params;
  if (!hasPage(design)) notFound();
  const t = await getTranslations("Designs");
  const title = t("metaTitle", { name: designName(design) });
  const description = copyFor(design, locale).tagline;
  return {
    title,
    description,
    alternates: localeAlternates(locale, `/designs/${design}`),
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
export default async function DesignPage({
  params,
}: PageProps<"/[locale]/designs/[design]">) {
  await connection();
  const { locale, design } = await params;
  if (!hasPage(design)) notFound();
  const [t, tFeatures, offerFor] = await Promise.all([
    getTranslations("Designs"),
    getTranslations("HomePage.features"),
    getDesignOffers(),
  ]);
  const offer = offerFor(design);
  if (!offer) notFound();
  const { theme, demo } = offer;
  const copy = copyFor(design, locale);
  const name = designName(design);
  const price =
    theme &&
    (theme.price === 0
      ? t("free")
      : t("price", { price: formatSum(theme.price) }));
  const others = DESIGN_IDS.filter((id) => id !== design && offerFor(id));
  const url = `${SITE_URL}/${locale}/designs/${design}`;

  // The design as a product with its price, and the breadcrumb trail.
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: t("productName", { name }),
        description: copy.about.join(" "),
        image: [
          `${SITE_URL}/themes/${design}/opening-end.jpg`,
          `${SITE_URL}/themes/${design}/backdrop.jpg`,
        ],
        url,
        brand: { "@type": "Brand", name: "Taklifim" },
        ...(theme && {
          offers: {
            "@type": "Offer",
            price: theme.price,
            priceCurrency: "UZS",
            availability: "https://schema.org/InStock",
            url,
          },
        }),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: t("home"), item: `${SITE_URL}/${locale}` },
          { name: t("index.title"), item: `${SITE_URL}/${locale}/designs` },
          { name, item: url },
        ].map((crumb, i) => ({
          "@type": "ListItem",
          position: i + 1,
          ...crumb,
        })),
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
      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pt-8 sm:px-6 sm:pt-12">
          <nav aria-label={t("breadcrumbs")} className="text-sm text-muted">
            <Link href="/" className="hover:text-ink">
              {t("home")}
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <Link href="/designs" className="hover:text-ink">
              {t("index.title")}
            </Link>
            <span aria-hidden className="mx-2">
              /
            </span>
            <span className="text-ink">{name}</span>
          </nav>
        </div>

        {/* Name, tagline, price and the opening video */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 pt-8 pb-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-12 md:pb-24">
          <div>
            <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
              {t("eyebrow")}
            </p>
            <h1 className="mt-3 text-ink">
              <span
                className={`block text-6xl leading-tight sm:text-7xl ${DESIGN_NAME_FONT[design] ?? "font-serif"}`}
              >
                {name}
              </span>
              <span className="mt-2 block font-serif text-2xl font-medium text-muted sm:text-3xl">
                {t("subtitle")}
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
              {copy.tagline}
            </p>
            {price && (
              <p className="mt-5 font-serif text-3xl text-ink">{price}</p>
            )}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Link
                href={
                  theme
                    ? { pathname: "/cabinet/new", query: { theme: theme.id } }
                    : "/cabinet/new"
                }
                className="inline-flex h-12 items-center justify-center rounded-full bg-sage px-7 font-medium text-paper transition-colors hover:bg-sage-dark"
              >
                {t("choose")}
              </Link>
              {demo && (
                <a
                  href={demoUrlFor(demo.demoUrl, locale)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-line px-7 font-medium text-ink transition-colors hover:border-ink/40"
                >
                  {t("demo")}
                  <span aria-hidden>↗</span>
                </a>
              )}
            </div>
            <p className="mt-4 text-sm text-muted">{t("note")}</p>
          </div>
          <DesignVideo
            themeId={design}
            label={t("videoLabel", { name })}
            replayLabel={t("replay")}
          />
        </section>

        {/* About the design, over its backdrop art */}
        <section className="border-y border-line bg-cream/50 py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 md:grid-cols-2 md:gap-14">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] ring-1 ring-line">
              <Image
                src={`/themes/${design}/backdrop.jpg`}
                alt={t("backdropAlt", { name })}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="font-serif text-4xl font-medium text-ink sm:text-5xl">
                {t("aboutTitle", { name })}
              </h2>
              <div className="mt-5 space-y-4 leading-relaxed text-ink/85">
                {copy.about.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              <ul className="mt-7 space-y-3">
                {copy.highlights.map((item) => (
                  <li key={item} className="flex gap-3 text-ink/85">
                    <span
                      aria-hidden
                      className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* What comes with it */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
          <h2 className="text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
            {t("includedTitle")}
          </h2>
          <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
            {INCLUDED.map((key) => (
              <li
                key={key}
                className="reveal rounded-2xl border border-line bg-paper p-4"
              >
                <h3 className="font-medium text-ink">
                  {tFeatures(`${key}.title`)}
                </h3>
                <p className="mt-1 text-sm text-muted">
                  {tFeatures(`${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* The other designs */}
        {others.length > 0 && (
          <section className="border-t border-line bg-cream/50 py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-4 sm:px-6">
              <h2 className="text-center font-serif text-4xl font-medium text-ink sm:text-5xl">
                {t("othersTitle")}
              </h2>
              <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
                {others.map((id) => (
                  <li key={id} className="reveal">
                    <DesignCard
                      id={id}
                      tagline={copyFor(id, locale).tagline}
                      price={offerFor(id)?.theme?.price ?? null}
                    />
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </>
  );
}
