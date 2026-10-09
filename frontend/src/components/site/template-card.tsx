import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import type { Demo } from "@/lib/api-types";
import { formatSum } from "@/lib/format";

/** A design from GET /demos: choose it in the builder, or open its live demo. */
export default async function TemplateCard({ demo }: { demo: Demo }) {
  const t = await getTranslations("HomePage.templates");
  const price =
    demo.theme.price === 0
      ? t("free")
      : t("price", { price: formatSum(demo.theme.price) });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white/70">
      <a
        href={demo.demoUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="relative block aspect-[3/4] overflow-hidden bg-cream"
        tabIndex={-1}
        aria-hidden
      >
        {/* Served from the storage CDN as is; not worth proxying through Next. */}
        <Image
          src={demo.image.url}
          alt=""
          fill
          unoptimized
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 80vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
        <span className="absolute top-3 left-3 rounded-full bg-paper/90 px-3 py-1 text-xs font-medium text-ink backdrop-blur">
          {price}
        </span>
      </a>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-2xl text-ink">{demo.title}</h3>
        <p className="mt-1 line-clamp-2 text-sm text-muted">{demo.text}</p>
        <div className="mt-5 grid grid-cols-2 gap-2">
          <Link
            href={{ pathname: "/cabinet/new", query: { theme: demo.theme.id } }}
            className="inline-flex h-11 items-center justify-center rounded-full bg-sage text-sm font-medium text-paper transition-colors hover:bg-sage-dark"
          >
            {t("choose")}
          </Link>
          <a
            href={demo.demoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-11 items-center justify-center gap-1.5 rounded-full border border-sage text-sm font-medium text-sage transition-colors hover:bg-sage hover:text-paper"
          >
            {t("view")}
            <span aria-hidden>↗</span>
          </a>
        </div>
      </div>
    </article>
  );
}
