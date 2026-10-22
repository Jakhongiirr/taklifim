import { getTranslations } from "next-intl/server";
import LocaleSwitcher from "@/components/locale-switcher";
import { Link } from "@/i18n/navigation";
import Logo from "./logo";

export default async function SiteHeader() {
  const t = await getTranslations("Site");

  return (
    <header className="sticky top-0 z-30 border-b border-line/70 bg-paper/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="shrink-0">
          <Logo compact />
        </Link>
        {/* Shown only where it fits on one line next to the buttons; the
            footer has every link for smaller screens. */}
        <nav className="ml-8 hidden gap-7 text-sm whitespace-nowrap text-muted lg:flex">
          <Link href="/#features" className="hover:text-ink">
            {t("nav.features")}
          </Link>
          <Link href="/designs" className="hover:text-ink">
            {t("nav.templates")}
          </Link>
          {/* Makes room for the wording and articles links on wide screens. */}
          <Link href="/#how" className="hover:text-ink xl:hidden">
            {t("nav.how")}
          </Link>
          <Link href="/wording" className="hidden hover:text-ink xl:inline">
            {t("footer.wording")}
          </Link>
          <Link href="/articles" className="hidden hover:text-ink xl:inline">
            {t("footer.articles")}
          </Link>
          <Link href="/#faq" className="hover:text-ink">
            {t("nav.faq")}
          </Link>
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <LocaleSwitcher />
          {/* The cabinet sends visitors without a session to the login page. */}
          <Link
            href="/cabinet"
            aria-label={t("cabinet")}
            className="inline-flex size-9 items-center justify-center rounded-full text-ink ring-1 ring-line transition-colors hover:ring-ink/30 md:w-auto md:gap-2 md:px-4"
          >
            <svg aria-hidden viewBox="0 0 24 24" className="size-4">
              <path
                d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            <span className="hidden text-sm md:inline">{t("cabinet")}</span>
          </Link>
          <Link
            href="/cabinet/new"
            className="inline-flex h-9 items-center rounded-full bg-sage px-4 text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </header>
  );
}
