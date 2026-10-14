import type { WordingSample } from "@/content/wording";
import CopySample from "./copy-sample";

/** A wording sample with its [placeholders] marked, and a copy button. */
export default function SampleCard({
  sample,
  copyLabel,
  copiedLabel,
}: {
  sample: WordingSample;
  copyLabel: string;
  copiedLabel: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-3xl bg-white p-5 ring-1 ring-line sm:p-6">
      <h3 className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
        {sample.title}
      </h3>
      <p className="mt-3 flex-1 leading-relaxed whitespace-pre-line text-ink/85">
        {sample.text.split(/(\[[^\]]+\])/).map((part, i) =>
          i % 2 ? (
            <span key={i} className="rounded bg-sage/10 px-1 text-sage">
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </p>
      <CopySample
        text={sample.text}
        label={copyLabel}
        copiedLabel={copiedLabel}
      />
    </article>
  );
}
