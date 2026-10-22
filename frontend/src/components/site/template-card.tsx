import Image from "next/image";
import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Demo } from "@/lib/api-types";
import { demoUrlFor } from "@/lib/demo-url";
import { formatSum } from "@/lib/format";

/**
 * A design from GET /demos as a poster: its art with the title over it,
 * the description below (from sm), then "choose" (to the builder) and
 * "view" (the live demo). Sized by the grid around it.
 */
export default async function TemplateCard({ demo }: { demo: Demo }) {
  const [t, locale] = await Promise.all([
    getTranslations("HomePage.templates"),
    getLocale(),
  ]);
  const demoUrl = demoUrlFor(demo.demoUrl, locale);
  const price =
    demo.theme.price === 0
      ? t("free")
      : t("price", { price: formatSum(demo.theme.price) });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[1.25rem] bg-white shadow-[0_10px_30px_-18px_rgba(42,39,35,0.45)] ring-1 ring-line transition-shadow duration-300 hover:shadow-[0_22px_45px_-20px_rgba(42,39,35,0.5)] sm:rounded-[1.5rem]">
      <a
        href={demoUrl}
        className="relative block aspect-[9/14] overflow-hidden bg-cream"
        tabIndex={-1}
        aria-hidden
      >
        {/* Served from the storage CDN as is; not worth proxying through Next. */}
        <Image
          src={demo.image.url}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
        <span className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <span className="absolute top-2 left-2 rounded-full bg-paper/90 px-2 py-0.5 text-[11px] font-medium text-ink backdrop-blur sm:top-3 sm:left-3 sm:px-2.5 sm:py-1 sm:text-xs">
          {price}
        </span>
        <h3 className="absolute inset-x-3 bottom-2.5 font-serif text-xl leading-tight text-white [text-shadow:0_1px_10px_rgba(0,0,0,0.35)] sm:inset-x-4 sm:bottom-3.5 sm:text-2xl">
          {demo.title}
        </h3>
      </a>
      <div className="flex flex-1 flex-col p-2.5 sm:p-4">
        <p className="mb-3 hidden text-[13px] leading-snug text-muted sm:line-clamp-2">
          {demo.text}
        </p>
        <div className="mt-auto flex gap-2">
          <Link
            href={{ pathname: "/cabinet/new", query: { theme: demo.theme.id } }}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full bg-sage text-[13px] font-medium text-paper transition-colors hover:bg-sage-dark sm:h-10 sm:text-sm"
          >
            {t("choose")}
          </Link>
          <a
            href={demoUrl}
            className="inline-flex h-9 flex-1 items-center justify-center rounded-full border border-sage text-[13px] font-medium text-sage transition-colors hover:bg-sage hover:text-paper sm:h-10 sm:text-sm"
          >
            {t("view")}
          </a>
        </div>
      </div>
    </article>
  );
}
