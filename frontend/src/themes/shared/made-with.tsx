import { Link } from "@/i18n/navigation";

/**
 * The closing "Taklifim.uz orqali yaratildi" credit with the logo mark,
 * linking to the site's home page. The same words in every locale. It takes
 * the theme's colour from `className` (the mark's two tones are masks filled
 * with currentColor, the ornament fainter) and its own plain sans type, so it
 * reads clearly without competing with the couple's lettering. Opens in a new
 * tab, so the invitation (and its music) stays open behind it.
 */
export default function MadeWith({ className }: { className: string }) {
  return (
    <p className={`flex justify-center ${className}`}>
      <Link
        href="/"
        target="_blank"
        className="inline-flex items-center gap-2 rounded-full border border-current/25 px-4 py-2 font-sans text-[13px] leading-none font-normal tracking-normal not-italic normal-case transition hover:border-current/50"
      >
        <span aria-hidden className="relative size-[22px] shrink-0">
          <span className="absolute inset-0 bg-current opacity-45 [mask:url(/brand/logo-mark-accent.svg)_center/contain_no-repeat]" />
          <span className="absolute inset-0 bg-current [mask:url(/brand/logo-mark-ink.svg)_center/contain_no-repeat]" />
        </span>
        <span>
          <span className="font-semibold">Taklifim.uz</span> orqali yaratildi
        </span>
      </Link>
    </p>
  );
}
