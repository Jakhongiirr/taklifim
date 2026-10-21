import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

/** Make the invitation these texts go with. */
export default async function WordingCta() {
  const t = await getTranslations("Wording.cta");

  return (
    <div className="mt-16 rounded-[2rem] bg-cream px-6 py-12 text-center ring-1 ring-line">
      <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
        {t("title")}
      </h2>
      <p className="mx-auto mt-3 max-w-lg text-muted">{t("text")}</p>
      <ul className="mt-5 flex flex-wrap justify-center gap-x-5 gap-y-2 text-sm text-ink/80">
        {(t.raw("points") as string[]).map((point) => (
          <li key={point} className="flex items-center gap-2">
            <svg aria-hidden viewBox="0 0 24 24" className="size-4 text-sage">
              <path
                d="m5 12 5 5 9-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            {point}
          </li>
        ))}
      </ul>
      <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/cabinet/new"
          className="inline-flex h-12 items-center justify-center rounded-full bg-sage px-8 font-medium text-paper transition-colors hover:bg-sage-dark"
        >
          {t("button")}
        </Link>
        <Link
          href="/designs"
          className="inline-flex h-12 items-center justify-center rounded-full border border-line px-8 font-medium text-ink transition-colors hover:border-ink/40"
        >
          {t("designs")}
        </Link>
      </div>
    </div>
  );
}
