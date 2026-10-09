const TASHKENT_OFFSET_MS = 5 * 60 * 60 * 1000; // UTC+5, no daylight saving

/** A moment's calendar parts in Tashkent time; `month` and `weekday` are 0-based (0 = Sunday). */
export function tashkentParts(value: Date | string) {
  const d = new Date(new Date(value).getTime() + TASHKENT_OFFSET_MS);
  const pad = (n: number) => String(n).padStart(2, "0");
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth(),
    day: d.getUTCDate(),
    weekday: d.getUTCDay(),
    time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`,
  };
}
