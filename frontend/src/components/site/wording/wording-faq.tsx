import type { WordingFaq as Faq } from "@/content/wording";

/** Questions and answers under the samples. */
export default function WordingFaq({
  title,
  faq,
}: {
  title: string;
  faq: Faq[];
}) {
  return (
    <section className="mt-12 rounded-3xl bg-cream/70 p-6 ring-1 ring-line sm:p-7">
      <h2 className="font-serif text-2xl font-medium text-ink">{title}</h2>
      <dl className="mt-4 space-y-5">
        {faq.map(({ q, a }) => (
          <div key={q}>
            <dt className="font-medium text-ink">{q}</dt>
            <dd className="mt-1.5 leading-relaxed text-ink/80">{a}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
