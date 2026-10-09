/** How much later than its first published date an owner can move an event. */
export const MAX_POSTPONE_DAYS = 30;
const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Latest `eventAt` the owner may set: MAX_POSTPONE_DAYS after the date the
 * invitation had when first published (`lockedEventAt`); null before that.
 */
export function eventAtLimit(taklif: { lockedEventAt: Date | null }) {
  return taklif.lockedEventAt
    ? new Date(taklif.lockedEventAt.getTime() + MAX_POSTPONE_DAYS * DAY_MS)
    : null;
}
