/** How much later than its first published date an owner can move an event. */
export const MAX_POSTPONE_DAYS = 30;
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
 * Latest `eventAt` the owner may set: MAX_POSTPONE_DAYS after the date the
 * invitation had when first published (`lockedEventAt`); null before that.
 */
export function eventAtLimit(taklif: { lockedEventAt: Date | null }) {
  return taklif.lockedEventAt
    ? new Date(taklif.lockedEventAt.getTime() + MAX_POSTPONE_DAYS * DAY_MS)
    : null;
}
