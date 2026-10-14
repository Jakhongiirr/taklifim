import { getTranslations } from "next-intl/server";
import { TELEGRAM_URL } from "@/content/legal/operator";
import { SOCIALS } from "@/content/socials";
import { Link } from "@/i18n/navigation";
import Logo from "./logo";

export default async function SiteFooter() {
  const t = await getTranslations("Site");

  return (
    <footer className="border-t border-line bg-cream/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-sm">
          <Logo className="h-10" />
          <p className="mt-2 text-sm text-muted">{t("footer.tagline")}</p>
          <div className="mt-4 flex items-center gap-3">
            <span className="text-xs tracking-wide text-muted uppercase">
              {t("footer.follow")}
            </span>
            <a
              href={SOCIALS.telegram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Telegram"
              title="Telegram"
              className="flex size-9 items-center justify-center rounded-full text-ink ring-1 ring-line transition-colors hover:bg-[#2aabee] hover:text-white hover:ring-[#2aabee]"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-[18px] -translate-x-px"
                fill="currentColor"
              >
                <path d="M21.4 4.3 18.3 19c-.2 1-.9 1.3-1.7.8l-4.8-3.5-2.3 2.2c-.3.3-.5.5-1 .5l.3-4.9 8.9-8c.4-.3-.1-.5-.6-.2L6.1 12.8 1.4 11.3c-1-.3-1-1 .2-1.5L20 2.7c.9-.3 1.6.2 1.4 1.6Z" />
              </svg>
            </a>
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              title="Instagram"
              className="flex size-9 items-center justify-center rounded-full text-ink ring-1 ring-line transition-colors hover:bg-gradient-to-tr hover:from-[#f9a825] hover:via-[#e1306c] hover:to-[#833ab4] hover:text-white hover:ring-transparent"
            >
              <svg
                aria-hidden
                viewBox="0 0 24 24"
                className="size-[18px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
              >
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle
                  cx="17.5"
                  cy="6.5"
                  r="1"
                  fill="currentColor"
                  stroke="none"
                />
              </svg>
            </a>
          </div>
        </div>
        <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
          <Link href="/#features" className="hover:text-ink">
            {t("nav.features")}
          </Link>
          <Link href="/designs" className="hover:text-ink">
            {t("nav.templates")}
          </Link>
          <Link href="/wording" className="hover:text-ink">
            {t("nav.wording")}
          </Link>
          <Link href="/#how" className="hover:text-ink">
            {t("nav.how")}
          </Link>
          <Link href="/#faq" className="hover:text-ink">
            {t("nav.faq")}
          </Link>
          <a
            href={TELEGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-ink"
          >
            {t("nav.contact")} ↗
          </a>
        </nav>
      </div>
      <div className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-4 text-xs text-muted sm:px-6">
          <span>{t("footer.rights", { year: new Date().getFullYear() })}</span>
          <span className="flex flex-wrap gap-x-5 gap-y-2">
            <Link href="/terms" className="hover:text-ink">
              {t("legal.terms")}
            </Link>
            <Link href="/privacy" className="hover:text-ink">
              {t("legal.privacy")}
            </Link>
            <a href="#top" className="hover:text-ink">
              {t("footer.top")} ↑
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
