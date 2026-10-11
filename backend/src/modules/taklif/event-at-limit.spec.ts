import {
  eventAtLimit,
  eventAtRangeError,
  MAX_DAYS_AHEAD,
  MAX_POSTPONE_DAYS,
} from './event-at-limit';

describe('eventAtLimit', () => {
  it('is null before the first publish', () => {
    expect(eventAtLimit({ lockedEventAt: null })).toBeNull();
  });

  it(`is ${MAX_POSTPONE_DAYS} days after the date at first publish`, () => {
    const locked = new Date('2026-12-05T12:00:00Z');
    expect(eventAtLimit({ lockedEventAt: locked })?.toISOString()).toBe(
      '2027-01-04T12:00:00.000Z',
    );
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
