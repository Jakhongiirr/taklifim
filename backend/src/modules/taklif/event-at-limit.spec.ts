import { eventAtLimit, MAX_POSTPONE_DAYS } from './event-at-limit';

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
