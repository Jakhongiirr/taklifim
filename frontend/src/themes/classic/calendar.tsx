/**
 * The wedding month as a small calendar (weeks start on Monday, as in
 * Uzbekistan), with the day circled in gold and a beating heart.
 */
export default function MonthCalendar({
  year,
  month,
  day,
  title,
  weekdays,
}: {
  year: number;
  /** 0-based. */
  month: number;
  day: number;
  title: string;
  /** Short names, Monday first. */
  weekdays: string[];
}) {
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(year, month, 1)).getUTCDay() + 6) % 7;
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="mx-auto max-w-[300px]">
      <p className="font-serif text-2xl text-[#2a2723] capitalize">{title}</p>
      <div className="mt-5 grid grid-cols-7 gap-y-1.5 text-center">
        {weekdays.map((name) => (
          <span
            key={name}
            className="pb-2 text-[10px] tracking-[0.15em] text-[#a8844f] uppercase"
          >
            {name}
          </span>
        ))}
        {cells.map((n, i) =>
          n === null ? (
            <span key={`blank-${i}`} />
          ) : n === day ? (
            <span
              key={n}
              className="relative flex h-9 items-center justify-center"
            >
              <span className="absolute size-9 rounded-full border border-[#a8844f]" />
              <span className="absolute size-11 rounded-full border border-[#a8844f]/30" />
              <span className="relative font-serif text-lg font-semibold text-[#46523f]">
                {n}
              </span>
              <svg
                aria-hidden
                viewBox="0 0 24 22"
                className="classic-beat absolute -top-1.5 -right-0.5 size-3.5 text-[#c2846f]"
              >
                <path
                  d="M12 21 C5 15.5 1 12 1 7.5 C1 4 3.6 1.5 7 1.5 C9 1.5 10.9 2.6 12 4.3 C13.1 2.6 15 1.5 17 1.5 C20.4 1.5 23 4 23 7.5 C23 12 19 15.5 12 21Z"
                  fill="currentColor"
                />
              </svg>
            </span>
          ) : (
            <span
              key={n}
              className="flex h-9 items-center justify-center text-sm text-[#2a2723]/70"
            >
              {n}
            </span>
          ),
        )}
      </div>
    </div>
  );
}
