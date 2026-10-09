import { getTranslations } from "next-intl/server";
import { LEGAL_UPDATED } from "@/content/legal/operator";
import type { LegalBlock, LegalDoc } from "@/content/legal/types";
import { tashkentParts } from "@/lib/tashkent-date";
import SiteFooter from "./site-footer";
import SiteHeader from "./site-header";

/** A legal document: title, last update, contents and numbered sections. */
export default async function LegalPage({ doc }: { doc: LegalDoc }) {
  const [t, tDates] = await Promise.all([
    getTranslations("Legal"),
    getTranslations("Dates"),
  ]);
  const months = tDates.raw("months") as string[];
  const { day, month, year } = tashkentParts(`${LEGAL_UPDATED}T12:00:00Z`);
  const updated = `${day} ${months[month]} ${year}`;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 pt-10 pb-20 sm:px-6 sm:pt-14">
        <h1 className="font-serif text-4xl font-medium text-ink sm:text-5xl">
          {doc.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          {t("updated", { date: updated })}
        </p>

        <div className="mt-8 space-y-4 leading-relaxed text-ink/85">
          {doc.intro.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <nav
          aria-label={t("contents")}
          className="mt-10 rounded-3xl bg-white/70 p-5 ring-1 ring-line sm:p-6"
        >
          <p className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
            {t("contents")}
          </p>
          <ol className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
            {doc.sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#s${i + 1}`}
                  className="text-ink/80 underline-offset-4 hover:text-sage hover:underline"
                >
                  {i + 1}. {section.title}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {doc.sections.map((section, i) => (
          <section
            key={section.title}
            id={`s${i + 1}`}
            className="mt-12 scroll-mt-24"
          >
            <h2 className="font-serif text-2xl font-medium text-ink sm:text-3xl">
              <span className="mr-2 text-gold">{i + 1}.</span>
              {section.title}
            </h2>
            <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
              {section.body.map((block, j) => (
                <Block key={j} block={block} />
              ))}
            </div>
          </section>
        ))}
      </main>
      <SiteFooter />
    </>
  );
}

function Block({ block }: { block: LegalBlock }) {
  if (typeof block === "string") return <p>{block}</p>;
  return (
    <ul className="space-y-2 pl-1">
      {block.list.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden
            className="mt-2.5 size-1.5 shrink-0 rounded-full bg-gold"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
