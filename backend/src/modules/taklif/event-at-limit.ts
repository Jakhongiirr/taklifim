/** How many times an owner can change an event's date once it's published. */
export const MAX_EVENT_AT_CHANGES = 5;
/** How far ahead an event can be set. */
export const MAX_DAYS_AHEAD = 730;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Why `eventAt` is outside the range owners may set (after `now`, at most
 * MAX_DAYS_AHEAD later), or null when it's fine. A past date (including
 * pre-1970, negative timestamps) would have the invitation deleted by the
 * nightly cleanup; a far-future one would never expire.
 */
export function eventAtRangeError(eventAt: Date, now = new Date()) {
  if (eventAt.getTime() <= now.getTime()) {
    return 'eventAt must be in the future';
  }
  if (eventAt.getTime() > now.getTime() + MAX_DAYS_AHEAD * DAY_MS) {
    return `eventAt can be at most ${MAX_DAYS_AHEAD} days ahead`;
  }
  return null;
}

/**
 * How many more times the owner may change `eventAt`: counted from the first
 * publish (`lockedEventAt` is set then); null before that, when it's free.
 */
export function eventAtChangesLeft(taklif: {
  lockedEventAt: Date | null;
  eventAtChanges: number;
}) {
  return taklif.lockedEventAt
    ? Math.max(0, MAX_EVENT_AT_CHANGES - taklif.eventAtChanges)
    : null;
}
