import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";
import PhoneMockup from "@/components/site/phone-mockup";
import SiteFooter from "@/components/site/site-footer";
import SiteHeader from "@/components/site/site-header";
import TemplateCard from "@/components/site/template-card";
import { Link } from "@/i18n/navigation";
import { formatSum } from "@/lib/format";
import { getDemos } from "@/lib/server/demos";

// Rebuilt in the background at most every 5 minutes, like the demos fetch.
export const revalidate = 300;

const FEATURES = ["photos", "music", "map", "gift"] as const;
const STEPS = ["s1", "s2", "s3"] as const;
const QUESTIONS = ["q1", "q2", "q3", "q4", "q5"] as const;

export default async function HomePage() {
  const [t, demos] = await Promise.all([
    getTranslations("HomePage"),
    getDemos(),
  ]);
  // "From" price in the hero: the cheapest paid design on show.
  const prices = demos.map((demo) => demo.theme.price).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : null;

  return (
    <>
      <SiteHeader />
      <main id="top" className="flex-1">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-14 px-4 pt-10 pb-16 sm:px-6 md:grid-cols-[1.1fr_1fr] md:pt-20 md:pb-24">
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
            {minPrice !== null && (
              <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-white/60 px-4 py-1.5 text-sm text-ink">
                <span className="size-1.5 rounded-full bg-gold" />
                {t("hero.priceFrom", { price: formatSum(minPrice) })}
              </p>
            )}
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

        {/* Features */}
        <section className="border-y border-line bg-cream/50">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-x-4 gap-y-8 px-4 py-10 sm:px-6 lg:grid-cols-4">
            {FEATURES.map((key) => (
              <li key={key} className="flex flex-col gap-2">
                <span className="flex size-10 items-center justify-center rounded-full bg-paper text-sage ring-1 ring-line">
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
            // Mobile: a swipeable row. From sm: wrapped rows, centered when few.
            <ul className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 [scrollbar-width:none] sm:flex-wrap sm:justify-center sm:gap-6 sm:overflow-visible sm:px-6">
              {demos.map((demo) => (
                <li
                  key={demo.id}
                  className="w-[78%] shrink-0 snap-center sm:w-[calc(50%-12px)] lg:w-[calc((100%-48px)/3)]"
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
                <li key={key} className="border-t border-paper/20 pt-6">
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
              <details key={key} className="group py-5">
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
        </section>

        {/* Closing call to action */}
        <section className="px-4 pb-16 sm:px-6 md:pb-24">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-cream px-6 py-14 text-center ring-1 ring-line md:py-20">
            <h2 className="font-serif text-4xl font-medium text-ink sm:text-5xl">
              {t("cta.title")}
            </h2>
            <p className="mx-auto mt-4 max-w-md text-muted">{t("cta.text")}</p>
            <Link
              href="/cabinet/new"
              className="mt-8 inline-flex h-12 items-center justify-center rounded-full bg-sage px-8 font-medium text-paper transition-colors hover:bg-sage-dark"
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
  photos: "M4 7h3l2-2h6l2 2h3v12H4zM12 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z",
  music:
    "M9 18V6l11-2v12M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM20 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z",
  map: "M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12ZM12 11.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  gift: "M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7S10.5 3 8 3.5 7.5 7 12 7Zm0 0s1.5-4 4-3.5S16.5 7 12 7Z",
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
