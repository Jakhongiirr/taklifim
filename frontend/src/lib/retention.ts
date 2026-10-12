// When the backend's nightly cleanup (TaklifCleanupService) removes an
// invitation's photos (the invitation itself is kept). Mirrors its rules:
// it runs at 03:00 Tashkent (22:00 UTC) and deletes the photos of drafts
// not edited for 7 days, and of every invitation three months after its event.

const HOUR = 60 * 60 * 1000;
const CLEANUP_UTC_HOUR = 22;
const DRAFT_MAX_AGE_HOURS = 7 * 24;
const KEEP_AFTER_EVENT_MONTHS = 3;

/** The first cleanup run strictly after `ms`. */
function nextCleanupAfter(ms: number) {
  const run = new Date(ms);
  run.setUTCHours(CLEANUP_UTC_HOUR, 0, 0, 0);
  if (run.getTime() <= ms) run.setUTCDate(run.getUTCDate() + 1);
  return run;
}

/** When an unedited draft loses its photos. */
export function draftPhotosDeletedAt(updatedAt: string) {
  return nextCleanupAfter(
    new Date(updatedAt).getTime() + DRAFT_MAX_AGE_HOURS * HOUR,
  );
}

/** When an invitation loses its photos after its event. */
export function photosDeletedAfterEventAt(eventAt: string) {
  const cutoff = new Date(eventAt);
  cutoff.setUTCMonth(cutoff.getUTCMonth() + KEEP_AFTER_EVENT_MONTHS);
  return nextCleanupAfter(cutoff.getTime());
}
