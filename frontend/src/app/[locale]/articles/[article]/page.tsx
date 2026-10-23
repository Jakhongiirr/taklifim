import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ArticleCta from "@/components/site/articles/article-cta";
import RichText from "@/components/site/articles/rich-text";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import { ARTICLE_IDS, ARTICLES, readingMinutes } from "@/content/articles";
import { Link } from "@/i18n/navigation";
import { localeAlternates, OG_IMAGES, SITE_URL } from "@/lib/seo";
import { inLocale } from "@/lib/uz-cyrillic";

// Only the articles in content/articles.ts have a page.
export const dynamicParams = false;

export function generateStaticParams() {
  return ARTICLE_IDS.map((article) => ({ article }));
}

const articleFor = (id: string, locale: string) =>
  inLocale(ARTICLES[id].text, locale);

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/articles/[article]">): Promise<Metadata> {
  const { locale, article: id } = await params;
  const article = articleFor(id, locale);
  return {
    title: article.metaTitle,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: localeAlternates(locale, `/articles/${id}`),
    openGraph: {
      title: article.metaTitle,
      description: article.metaDescription,
      siteName: "taklifim.uz",
      type: "article",
      publishedTime: ARTICLES[id].published,
      images: OG_IMAGES,
    },
  };
}

export default async function ArticlePage({
  params,
}: PageProps<"/[locale]/articles/[article]">) {
  const { locale, article: id } = await params;
  const t = await getTranslations("Articles");
  const article = articleFor(id, locale);
  const url = `${SITE_URL}/${locale}/articles/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        keywords: article.keywords.join(", "),
        inLanguage: locale,
        datePublished: ARTICLES[id].published,
        url,
        mainEntityOfPage: url,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faq.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: t("home"), item: `${SITE_URL}/${locale}` },
          { name: t("index.title"), item: `${SITE_URL}/${locale}/articles` },
          { name: article.name, item: url },
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
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
        <nav aria-label={t("breadcrumbs")} className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            {t("home")}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <Link href="/articles" className="hover:text-ink">
            {t("index.title")}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-ink">{article.name}</span>
        </nav>

        <article>
          <header className="mt-8">
            <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
              {t("minutes", { count: readingMinutes(article) })}
            </p>
            <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/85">
              {article.lead}
            </p>
          </header>

          {article.sections.map((section) => (
            <section key={section.heading} className="mt-10">
              <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
                {section.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
                {section.paragraphs.map((p) => (
                  <p key={p}>
                    <RichText text={p} />
                  </p>
                ))}
              </div>
              {section.list && (
                <ul className="mt-4 space-y-2.5">
                  {section.list.map((item) => (
                    <li key={item} className="flex gap-3 text-ink/85">
                      <span
                        aria-hidden
                        className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold"
                      />
                      <span>
                        <RichText text={item} />
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="mt-12 rounded-3xl bg-cream/70 p-6 ring-1 ring-line sm:p-7">
            <h2 className="font-serif text-2xl font-medium text-ink">
              {t("faqTitle")}
            </h2>
            <dl className="mt-4 space-y-5">
              {article.faq.map(({ q, a }) => (
                <div key={q}>
                  <dt className="font-medium text-ink">{q}</dt>
                  <dd className="mt-1.5 leading-relaxed text-ink/80">{a}</dd>
                </div>
              ))}
            </dl>
          </section>
        </article>

        <ArticleCta />

        <section className="mt-16">
          <h2 className="font-serif text-3xl font-medium text-ink">
            {t("othersTitle")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {ARTICLE_IDS.filter((other) => other !== id).map((other) => (
              <li key={other}>
                <Link
                  href={`/articles/${other}`}
                  className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
                >
                  {articleFor(other, locale).name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
