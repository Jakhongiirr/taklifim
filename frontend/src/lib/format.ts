const dateTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
});

export function formatDateTime(value: string | null) {
  return value ? dateTime.format(new Date(value)) : "—";
}

// Weddings happen in Uzbekistan: show and enter event times in Tashkent time
// (UTC+5, no daylight saving) whatever the admin's own time zone is.
const TASHKENT = "Asia/Tashkent";
const TASHKENT_OFFSET = "+05:00";

const eventDateTime = new Intl.DateTimeFormat("en-GB", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: TASHKENT,
});

export function formatEventAt(value: string) {
  return eventDateTime.format(new Date(value));
}

/** ISO instant -> "2026-10-20T18:00" in Tashkent time, for datetime-local. */
export function toTashkentInput(value: string) {
  const shifted = new Date(new Date(value).getTime() + 5 * 60 * 60 * 1000);
  return shifted.toISOString().slice(0, 16);
}

/** "2026-10-20T18:00" (Tashkent time) -> "2026-10-20T18:00:00+05:00" */
export function fromTashkentInput(value: string) {
  return `${value}:00${TASHKENT_OFFSET}`;
}

/** Prices are whole so'm. */
/** Admin prices, written like the site's: "129 000 so'm". */
export function formatPrice(value: number) {
  return value === 0 ? "Free" : `${formatSum(value)} so'm`;
}

/** "8600123456789012" -> "8600 1234 5678 9012" */
export function formatCardNumber(value: string) {
  return value.replace(/(\d{4})(?=\d)/g, "$1 ");
}

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 ** 2).toFixed(1)} MB`;
}

/** "+998901234567" -> "+998 90 123 45 67"; other countries stay as is. */
export function formatPhone(value: string) {
  const m = /^\+998(\d{2})(\d{3})(\d{2})(\d{2})$/.exec(value);
  return m ? `+998 ${m[1]} ${m[2]} ${m[3]} ${m[4]}` : value;
}

/**
 * 119000 -> "119 000" (non-breaking space), the way prices are written in
 * Uzbekistan. Our own, not Intl: Node and browsers format "uz" differently
 * ("119 000" vs "119,000"), which breaks hydration.
 */
export function formatSum(value: number) {
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

/** "Jasur & Madina": the groom's name comes first, as is customary. */
export function coupleNames(taklif: { groomName: string; brideName: string }) {
  return `${taklif.groomName} & ${taklif.brideName}`;
}
