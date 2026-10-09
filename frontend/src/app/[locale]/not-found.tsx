import { getTranslations } from "next-intl/server";
import Ornament from "@/components/site/ornament";
import SiteHeader from "@/components/site/site-header";
import { Link } from "@/i18n/navigation";

/**
 * Unknown pages, and invitations that are hidden, expired or never existed
 * (guests land here from old links), so the wording covers both.
 */
export default async function NotFound() {
  const t = await getTranslations("NotFound");

  return (
    <>
      <SiteHeader />
      <main className="relative flex flex-1 flex-col items-center justify-center overflow-hidden px-6 py-16 text-center">
        <div
          aria-hidden
          className="absolute top-1/3 left-1/2 -z-10 aspect-square w-[min(640px,140vw)] -translate-1/2 rounded-full bg-[radial-gradient(circle,rgba(168,132,79,0.16),rgba(70,82,63,0.06)_45%,transparent_70%)] blur-2xl"
        />

        {/* "4 ✉ 4": the envelope is the zero. */}
        <div
          aria-label="404"
          role="img"
          className="flex items-center gap-3 font-serif text-[6.5rem] leading-none font-medium text-gold/50 select-none sm:gap-5 sm:text-[8.5rem]"
        >
          <span aria-hidden>4</span>
          <Envelope className="w-28 motion-safe:animate-[float_4s_ease-in-out_infinite_alternate] sm:w-36" />
          <span aria-hidden>4</span>
        </div>

        <Ornament className="mt-6" />
        <h1 className="mt-5 font-serif text-4xl font-medium text-ink sm:text-5xl">
          {t("title")}
        </h1>
        <p className="mt-4 max-w-md text-muted">{t("text")}</p>

        <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:w-auto sm:max-w-none sm:flex-row">
          <Link
            href="/"
            className="inline-flex h-12 items-center justify-center rounded-full bg-sage px-7 font-medium text-paper transition-colors hover:bg-sage-dark"
          >
            {t("back")}
          </Link>
          <Link
            href="/#templates"
            className="inline-flex h-12 items-center justify-center rounded-full border border-line px-7 font-medium text-ink transition-colors hover:border-ink/40"
          >
            {t("designs")}
          </Link>
        </div>
      </main>
    </>
  );
}

/** A closed invitation envelope with a gold wax seal. */
function Envelope({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden
      viewBox="0 0 200 140"
      className={`drop-shadow-[0_18px_30px_rgba(42,39,35,0.18)] ${className}`}
    >
      <rect x="4" y="4" width="192" height="132" rx="10" fill="#fbf8f2" />
      <rect
        x="4"
        y="4"
        width="192"
        height="132"
        rx="10"
        fill="none"
        stroke="#e4dccd"
        strokeWidth="2"
      />
      {/* Lower folds and the closed flap. */}
      <path
        d="M8 132 L82 72 M192 132 L118 72"
        fill="none"
        stroke="#e4dccd"
        strokeWidth="2"
      />
      <path
        d="M6 10 L100 84 L194 10"
        fill="#f2ece1"
        stroke="#e4dccd"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      {/* Wax seal. */}
      <circle cx="100" cy="84" r="17" fill="#a8844f" />
      <circle
        cx="100"
        cy="84"
        r="12.5"
        fill="none"
        stroke="#f2ece1"
        strokeOpacity="0.6"
        strokeWidth="1"
      />
      <path
        d="M100 91 C93 86 89 82.5 89 78.5 C89 75.5 91.3 73.5 94 73.5 C96.4 73.5 98.4 74.9 100 77 C101.6 74.9 103.6 73.5 106 73.5 C108.7 73.5 111 75.5 111 78.5 C111 82.5 107 86 100 91Z"
        fill="#f2ece1"
        fillOpacity="0.9"
      />
    </svg>
  );
}
