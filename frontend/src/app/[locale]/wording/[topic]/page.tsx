import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import SampleCard from "@/components/site/wording/sample-card";
import WordingCta from "@/components/site/wording/wording-cta";
import { WORDING, WORDING_TOPICS } from "@/content/wording";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { localeAlternates, OG_IMAGES, SITE_URL } from "@/lib/seo";

// Only the topics in content/wording.ts have a page.
export const dynamicParams = false;

export function generateStaticParams() {
  return WORDING_TOPICS.map((topic) => ({ topic }));
}

const topicFor = (id: string, locale: string) =>
  WORDING[id][locale] ?? WORDING[id][routing.defaultLocale];

export async function generateMetadata({
  params,
}: PageProps<"/[locale]/wording/[topic]">): Promise<Metadata> {
  const { locale, topic: id } = await params;
  const topic = topicFor(id, locale);
  return {
    title: topic.metaTitle,
    description: topic.metaDescription,
    alternates: localeAlternates(locale, `/wording/${id}`),
    openGraph: {
      title: topic.metaTitle,
      description: topic.metaDescription,
      siteName: "taklifim.uz",
      type: "article",
      images: OG_IMAGES,
    },
  };
}

export default async function WordingTopicPage({
  params,
}: PageProps<"/[locale]/wording/[topic]">) {
  const { locale, topic: id } = await params;
  const t = await getTranslations("Wording");
  const topic = topicFor(id, locale);
  const url = `${SITE_URL}/${locale}/wording/${id}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: topic.title,
        description: topic.metaDescription,
        inLanguage: locale,
        url,
        mainEntityOfPage: url,
        author: { "@id": `${SITE_URL}/#organization` },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { name: t("home"), item: `${SITE_URL}/${locale}` },
          { name: t("index.title"), item: `${SITE_URL}/${locale}/wording` },
          { name: topic.name, item: url },
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
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-8 pb-20 sm:px-6 sm:pt-12">
        <nav aria-label={t("breadcrumbs")} className="text-sm text-muted">
          <Link href="/" className="hover:text-ink">
            {t("home")}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <Link href="/wording" className="hover:text-ink">
            {t("index.title")}
          </Link>
          <span aria-hidden className="mx-2">
            /
          </span>
          <span className="text-ink">{topic.name}</span>
        </nav>

        <header className="mt-8 max-w-3xl">
          <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
            {t("count", { count: topic.samples.length })}
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">
            {topic.title}
          </h1>
          <div className="mt-5 space-y-3 leading-relaxed text-ink/85">
            {topic.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </header>

        <section className="mt-10 rounded-3xl bg-cream/70 p-6 ring-1 ring-line sm:p-7">
          <h2 className="font-serif text-2xl font-medium text-ink">
            {t("tipsTitle")}
          </h2>
          <ul className="mt-4 space-y-2.5">
            {topic.tips.map((tip) => (
              <li key={tip} className="flex gap-3 text-ink/85">
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-gold"
                />
                {tip}
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
            {t("samplesTitle")}
          </h2>
          <p className="mt-2 text-sm text-muted">{t("samplesHint")}</p>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {topic.samples.map((sample) => (
              <li key={sample.title}>
                <SampleCard
                  sample={sample}
                  copyLabel={t("copy")}
                  copiedLabel={t("copied")}
                />
              </li>
            ))}
          </ul>
        </section>

        <WordingCta />

        <section className="mt-16">
          <h2 className="font-serif text-3xl font-medium text-ink">
            {t("othersTitle")}
          </h2>
          <ul className="mt-5 flex flex-wrap gap-2">
            {WORDING_TOPICS.filter((other) => other !== id).map((other) => (
              <li key={other}>
                <Link
                  href={`/wording/${other}`}
                  className="inline-flex h-10 items-center rounded-full bg-white px-4 text-sm text-ink ring-1 ring-line transition-colors hover:ring-ink/30"
                >
                  {topicFor(other, locale).name}
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
