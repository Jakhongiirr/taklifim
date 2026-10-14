import {
  eventAtChangesLeft,
  eventAtRangeError,
  MAX_DAYS_AHEAD,
  MAX_EVENT_AT_CHANGES,
} from './event-at-limit';

describe('eventAtChangesLeft', () => {
  const locked = new Date('2026-12-05T12:00:00Z');

  it('is null before the first publish', () => {
    expect(
      eventAtChangesLeft({ lockedEventAt: null, eventAtChanges: 0 }),
    ).toBeNull();
  });

  it(`counts down from ${MAX_EVENT_AT_CHANGES} after the first publish`, () => {
    expect(
      eventAtChangesLeft({ lockedEventAt: locked, eventAtChanges: 0 }),
    ).toBe(MAX_EVENT_AT_CHANGES);
    expect(
      eventAtChangesLeft({ lockedEventAt: locked, eventAtChanges: 4 }),
    ).toBe(1);
    expect(
      eventAtChangesLeft({ lockedEventAt: locked, eventAtChanges: 9 }),
    ).toBe(0);
  });
});

describe('eventAtRangeError', () => {
  const now = new Date('2026-10-10T12:00:00Z');

  it('accepts a future date', () => {
    expect(eventAtRangeError(new Date('2026-11-14T12:00:00Z'), now)).toBeNull();
  });

  it.each([
    ['now', '2026-10-10T12:00:00Z'],
    ['the past', '2026-10-09T12:00:00Z'],
    ['before 1970 (a negative timestamp)', '1969-12-31T23:59:59Z'],
    ['year 1', '0001-01-01T00:00:00Z'],
  ])('rejects %s', (_, value) => {
    expect(eventAtRangeError(new Date(value), now)).toBe(
      'eventAt must be in the future',
    );
  });

  // 730 days after 2026-10-10 is 2028-10-09 (2028 is a leap year).
  it(`rejects more than ${MAX_DAYS_AHEAD} days ahead`, () => {
    expect(eventAtRangeError(new Date('2028-10-09T12:00:00Z'), now)).toBeNull();
    expect(eventAtRangeError(new Date('2028-10-09T12:00:01Z'), now)).toBe(
      `eventAt can be at most ${MAX_DAYS_AHEAD} days ahead`,
    );
  });
});
