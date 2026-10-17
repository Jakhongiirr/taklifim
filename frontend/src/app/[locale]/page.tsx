import type { Metadata } from "next";
import type { CSSProperties, ReactNode } from "react";
import { connection } from "next/server";
import { getTranslations } from "next-intl/server";
import PhoneMockup from "@/components/site/phone-mockup";
import FallingPetals from "@/components/site/falling-petals";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import TemplateCard from "@/components/site/template-card";
import { TELEGRAM_URL } from "@/content/legal/operator";
import { Link } from "@/i18n/navigation";
import { localeAlternates, SITE_URL } from "@/lib/seo";
import { getDemos } from "@/lib/server/demos";

const FEATURES = [
  "designsMusic",
  "plovGift",
  "rsvp",
  "card",
  "qr",
  "map",
] as const;

/**
 * Of `options`, the column count whose last row is fullest (6 → 3, 10 → 5,
 * 11 → 4); `preferred` wins ties, then the larger count. Fewer items than
 * the smallest option just sit in one row.
 */
function evenColumns(count: number, options: number[], preferred: number) {
  const gaps = (cols: number) => (cols - (count % cols)) % cols;
  return options.reduce((best, cols) => {
    if (cols > count && best <= count) return best;
    const better =
      gaps(cols) < gaps(best) ||
      (gaps(cols) === gaps(best) &&
        (cols === preferred || (best !== preferred && cols > best)));
    return better ? cols : best;
  }, preferred);
}
const STEPS = ["s1", "s2", "s3"] as const;
const QUESTIONS = ["q1", "q2", "q3", "q4", "q5"] as const;

export async function generateMetadata({
  params,
}: PageProps<"/[locale]">): Promise<Metadata> {
  return { alternates: localeAlternates((await params).locale, "") };
}

// Rendered per visit, not built ahead: the build can't reach the backend, so
// a prebuilt page would show no demos until it was rebuilt. The demos
// fetch itself is still cached for 5 minutes.
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  await connection();
  const [{ locale }, t, demos, tMeta] = await Promise.all([
    params,
    getTranslations("HomePage"),
    getDemos(),
    getTranslations("Metadata"),
  ]);
  // Tells search engines the site's name and logo (shown next to results).
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: "Taklifim",
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo-stacked.png`,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        name: "Taklifim",
        url: `${SITE_URL}/${locale}`,
        description: tMeta("description"),
        inLanguage: locale,
        publisher: { "@id": `${SITE_URL}/#organization` },
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
      <main id="top" className="flex-1">
        {/* Hero */}
        <div className="relative">
          <FallingPetals />
          <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-20 md:pb-24">
            <div>
              <Eyebrow>{t("hero.eyebrow")}</Eyebrow>
              <h1 className="mt-4 font-serif text-[2.6rem] leading-[1.05] font-medium text-ink sm:text-6xl">
                {t.rich("hero.title", {
                  accent: (chunks) => (
                    <em className="text-sage italic">{chunks}</em>
                  ),
                })}
              </h1>
              <p className="mt-5 max-w-md text-base text-muted sm:text-lg">
                {t("hero.subtitle")}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/cabinet/new"
                  className="inline-flex h-12 items-center justify-center rounded-full bg-sage px-7 font-medium text-paper transition-colors hover:bg-sage-dark"
                >
                  {t("hero.primary")}
                </Link>
                <a
                  href="#templates"
                  className="inline-flex h-12 items-center justify-center rounded-full border border-line px-7 font-medium text-ink transition-colors hover:border-ink/40"
                >
                  {t("hero.secondary")}
                </a>
              </div>
              <p className="mt-4 text-sm text-muted">{t("hero.note")}</p>
            </div>
            <PhoneMockup />
          </section>
        </div>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 border-y border-line bg-cream/50 py-16 md:py-24"
        >
          <SectionHeading
            eyebrow={t("features.eyebrow")}
            title={t("features.title")}
            subtitle={t("features.subtitle")}
          />
          <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 px-4 sm:grid-cols-3 sm:gap-4 sm:px-6">
            {FEATURES.map((key) => (
              <li
                key={key}
                className="reveal flex flex-col gap-2 rounded-2xl border border-line bg-paper p-4 transition-[translate,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_30px_-12px_rgb(0_0_0/0.15)] sm:p-5"
              >
                <span className="flex size-10 items-center justify-center rounded-full bg-sage/10 text-sage">
                  <FeatureIcon name={key} />
                </span>
                <h3 className="mt-1 font-medium text-ink">
                  {t(`features.${key}.title`)}
                </h3>
                <p className="text-sm text-muted">
                  {t(`features.${key}.text`)}
                </p>
              </li>
            ))}
          </ul>
        </section>

        {/* Templates */}
        <section
          id="templates"
          className="mx-auto max-w-6xl scroll-mt-20 py-16 md:py-24"
        >
          <SectionHeading
            eyebrow={t("templates.eyebrow")}
            title={t("templates.title")}
            subtitle={t("templates.subtitle")}
          />
          {demos.length ? (
            // Wrapped rows centered, so a short last row sits in the middle;
            // the column count per breakpoint leaves the fewest gaps.
            <ul
              className="mt-10 flex flex-wrap justify-center gap-(--gap) px-4 [--cols:2] [--gap:0.75rem] sm:px-6 sm:[--cols:var(--cols-sm)] sm:[--gap:1.25rem] lg:[--cols:var(--cols-lg)] lg:[--gap:1.5rem]"
              style={
                {
                  "--cols-sm": evenColumns(demos.length, [2, 3], 3),
                  "--cols-lg": evenColumns(demos.length, [3, 4, 5], 4),
                } as CSSProperties
              }
            >
              {demos.map((demo) => (
                <li
                  key={demo.id}
                  className="reveal max-w-[300px]"
                  style={{
                    width:
                      "calc((100% - (var(--cols) - 1) * var(--gap)) / var(--cols))",
                  }}
                >
                  <TemplateCard demo={demo} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="mx-4 mt-10 rounded-3xl border border-dashed border-line px-6 py-14 text-center text-muted sm:mx-6">
              {t("templates.empty")}
            </p>
          )}
        </section>

        {/* How it works */}
        <section id="how" className="scroll-mt-20 bg-sage text-paper">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 md:py-24">
            <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
              {t("how.eyebrow")}
            </p>
            <h2 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">
              {t("how.title")}
            </h2>
            <ol className="mt-10 grid gap-8 md:grid-cols-3 md:gap-10">
              {STEPS.map((key, i) => (
                <li key={key} className="reveal border-t border-paper/20 pt-6">
                  <span className="font-serif text-4xl text-gold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-medium">
                    {t(`how.${key}.title`)}
                  </h3>
                  <p className="mt-2 text-sm text-paper/75">
                    {t(`how.${key}.text`)}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section
          id="faq"
          className="mx-auto max-w-3xl scroll-mt-20 py-16 md:py-24"
        >
          <SectionHeading eyebrow={t("faq.eyebrow")} title={t("faq.title")} />
          <div className="mt-10 divide-y divide-line border-y border-line px-4 sm:mx-6 sm:px-0">
            {QUESTIONS.map((key) => (
              <details key={key} className="reveal group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {t(`faq.${key}.q`)}
                  <span
                    aria-hidden
                    className="text-xl leading-none text-gold transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="mt-3 pr-8 text-sm leading-relaxed text-muted">
                  {t(`faq.${key}.a`)}
                </p>
              </details>
            ))}
          </div>

          {/* Questions the FAQ doesn't answer: straight to Telegram. */}
          <div className="mx-4 mt-10 flex flex-col items-center gap-4 rounded-3xl bg-cream/70 px-6 py-7 text-center ring-1 ring-line sm:mx-6 sm:flex-row sm:text-left">
            <span
              aria-hidden
              className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#2aabee] text-white shadow-md shadow-[#2aabee]/30"
            >
              <TelegramIcon />
            </span>
            <div className="flex-1">
              <p className="font-serif text-2xl text-ink">
                {t("contact.title")}
              </p>
              <p className="mt-1 text-sm text-muted">{t("contact.text")}</p>
            </div>
            <a
              href={TELEGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-sage px-5 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
            >
              {t("contact.button")}
              <span aria-hidden>↗</span>
            </a>
          </div>
        </section>

        {/* Closing call to action */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <div className="reveal relative mx-auto max-w-6xl overflow-clip rounded-[2rem] bg-cream px-6 py-14 text-center ring-1 ring-line md:py-20">
            <FallingPetals />
            <h2 className="relative font-serif text-4xl font-medium text-ink sm:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="relative mx-auto mt-4 max-w-md text-muted">
              {t("cta.text")}
            </p>
            <Link
              href="/cabinet/new"
              className="relative mt-8 inline-flex h-12 items-center justify-center rounded-full bg-sage px-8 font-medium text-paper transition-colors hover:bg-sage-dark"
            >
              {t("cta.button")}
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}

function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="text-xs font-medium tracking-[0.25em] text-gold uppercase">
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="px-4 text-center sm:px-6">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-serif text-4xl font-medium text-ink sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mx-auto mt-4 max-w-md text-muted">{subtitle}</p>
      )}
    </div>
  );
}

const ICON_PATHS: Record<(typeof FEATURES)[number], string> = {
  designsMusic:
    "M12 3a9 9 0 1 0 0 18c1.1 0 1.6-.8 1.3-1.7-.4-1.1.3-2.3 1.5-2.3H17a4 4 0 0 0 4-4c0-5.5-4-10-9-10ZM7.5 12a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM10 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2ZM15 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  plovGift:
    "M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7c-1.5-3-5-3.5-5-1.5S10 7 12 7Zm0 0c1.5-3 5-3.5 5-1.5S14 7 12 7Z",
  map: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  rsvp: "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM2.5 20a6.5 6.5 0 0 1 13 0M15 11.5l2 2 4-4",
  card: "M5 3h14v18H5zM8.5 15l2.5-3 2 2 2.5-3.5 2 4.5M9.5 8.5a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z",
  qr: "M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2M14 18v2h2M18 18h2v2M7 7h0M17 7h0M7 17h0",
};

function FeatureIcon({ name }: { name: (typeof FEATURES)[number] }) {
  return (
    <svg aria-hidden viewBox="0 0 24 24" className="size-5">
      <path
        d={ICON_PATHS[name]}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Telegram's paper plane, in the current colour. */
function TelegramIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-6 -translate-x-px"
      fill="currentColor"
    >
      <path d="M21.4 4.3 18.3 19c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.1 12.8 1.4 11.3c-1-.3-1-1 .2-1.5L20 2.7c.9-.3 1.6.2 1.4 1.6Z" />
    </svg>
  );
}
