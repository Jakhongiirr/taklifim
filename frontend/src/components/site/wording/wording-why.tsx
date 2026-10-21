import RichText from "@/components/site/articles/rich-text";

/** Why send the wording with an online invitation. */
export default function WordingWhy({
  heading,
  paragraphs,
  list,
}: {
  heading: string;
  paragraphs: string[];
  list: string[];
}) {
  return (
    <section className="mt-14 max-w-3xl">
      <h2 className="font-serif text-3xl font-medium text-ink sm:text-4xl">
        {heading}
      </h2>
      <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
        {paragraphs.map((p) => (
          <p key={p}>
            <RichText text={p} />
          </p>
        ))}
      </div>
      <ul className="mt-5 grid gap-2.5 sm:grid-cols-2">
        {list.map((item) => (
          <li key={item} className="flex gap-3 text-ink/85">
            <svg
              aria-hidden
              viewBox="0 0 24 24"
              className="mt-0.5 size-5 shrink-0 text-sage"
            >
              <path
                d="m5 12 5 5 9-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              />
            </svg>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
