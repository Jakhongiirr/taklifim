"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { formatSum } from "@/lib/format";
import type { Design } from "./types";

/**
 * Designs as a swipeable row of portrait cards; tap one to choose it.
 * `locked` (a paid invitation) shows only the chosen design, with a note.
 */
export default function DesignPicker({
  designs,
  value,
  onChange,
  locked = false,
}: {
  designs: Design[];
  value: string;
  onChange: (id: string) => void;
  locked?: boolean;
}) {
  const t = useTranslations("Builder.design");
  const shown = locked
    ? designs.filter((design) => design.id === value)
    : designs;

  return (
    <>
      {locked && (
        <p className="mb-3 rounded-2xl bg-cream px-4 py-3 text-sm text-muted">
          {t("locked")}
        </p>
      )}
      <div
        role="radiogroup"
        className="-mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 [scrollbar-width:none] sm:mx-0 sm:grid sm:grid-cols-3 sm:px-0"
      >
        {shown.map((design) => {
          const selected = design.id === value;
          return (
            <div key={design.id} className="w-40 shrink-0 snap-start sm:w-auto">
              <button
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => onChange(design.id)}
                disabled={locked}
                className={`relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-cream ring-2 transition ${selected ? "ring-sage" : "ring-transparent hover:ring-line"}`}
              >
                {design.imageUrl ? (
                  <Image
                    src={design.imageUrl}
                    alt=""
                    fill
                    unoptimized
                    sizes="160px"
                    className="object-cover"
                  />
                ) : (
                  <span className="flex h-full items-center justify-center font-serif text-2xl text-gold italic">
                    {design.name}
                  </span>
                )}
                {selected && (
                  <span className="absolute top-2 right-2 rounded-full bg-sage px-2.5 py-1 text-xs font-medium text-paper">
                    ✓ {t("selected")}
                  </span>
                )}
              </button>
              <div className="mt-2 flex items-start justify-between gap-2 px-1">
                <div className="min-w-0">
                  <p className="truncate font-serif text-lg leading-tight text-ink">
                    {design.name}
                  </p>
                  <p className="text-xs text-muted">
                    {design.price === 0
                      ? t("free")
                      : t("price", { price: formatSum(design.price) })}
                  </p>
                </div>
                {design.demoUrl && (
                  <a
                    href={design.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 pt-0.5 text-xs text-sage underline-offset-4 hover:underline"
                  >
                    {t("preview")} ↗
                  </a>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
