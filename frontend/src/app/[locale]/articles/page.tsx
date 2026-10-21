import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ArticleCta from "@/components/site/articles/article-cta";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { ARTICLE_IDS, ARTICLES, readingMinutes } from "@/content/articles";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeAlternates, OG_IMAGES, SITE_URL } from "@/lib/seo";

const articleFor = (id: string, locale: string) =>
  ARTICLES[id].text[locale] ?? ARTICLES[id].text[routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations("Articles");
  const title = t("index.metaTitle");
  const description = t("index.metaDescription");
  return {
    title,
    description,
    keywords: ARTICLE_IDS.flatMap((id) => articleFor(id, locale).keywords),
    alternates: localeAlternates(locale, "/articles"),
    openGraph: {
      title,
      description,
      siteName: "taklifim.uz",
      type: "website",
      images: OG_IMAGES,
    },
  };
}

export default async function ArticlesPage({
  params,
}: PageProps<"/[locale]/articles">) {
  const { locale } = await params;
  const t = await getTranslations("Articles");

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: t("index.title"),
        url: `${SITE_URL}/${locale}/articles`,
        inLanguage: locale,
        mainEntity: {
          "@type": "ItemList",
          itemListElement: ARTICLE_IDS.map((id, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: articleFor(id, locale).title,
            url: `${SITE_URL}/${locale}/articles/${id}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: t("home"), item: `${SITE_URL}/${locale}` },
          { name: t("index.title"), item: `${SITE_URL}/${locale}/articles` },
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
            {t("eyebrow")}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">
            {t("index.title")}
          </h1>
          <p className="mt-4 text-muted">{t("index.text")}</p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {ARTICLE_IDS.map((id) => {
            const article = articleFor(id, locale);
            return (
              <li key={id} className="reveal">
                <Link
                  href={`/articles/${id}`}
                  className="group flex h-full flex-col rounded-3xl bg-white p-6 ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_22px_45px_-20px_rgba(42,39,35,0.4)]"
                >
                  <span className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
                    {t("minutes", { count: readingMinutes(article) })}
                  </span>
                  <span className="mt-2 font-serif text-2xl text-ink">
                    {article.name}
                  </span>
                  <span className="mt-3 line-clamp-4 flex-1 text-sm leading-relaxed text-muted">
                    {article.lead}
                  </span>
                  <span className="mt-5 text-sm font-medium text-sage">
                    {t("read")} <span aria-hidden>→</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        <ArticleCta />
      </main>
      <SiteFooter />
    </>
  );
}
