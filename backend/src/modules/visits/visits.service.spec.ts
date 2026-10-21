import type Redis from 'ioredis';
import type { DataSource } from 'typeorm';
import { Role } from '../users/role.enum';
import { tashkentDay, VisitsService } from './visits.service';

const TAKLIF = { id: 't1', userId: 'owner' };

function setup({ published = true } = {}) {
  const seen = new Set<string>();
  const redis = {
    set: jest.fn((key: string) => {
      if (seen.has(key)) return Promise.resolve(null);
      seen.add(key);
      return Promise.resolve('OK');
    }),
  };
  const sql: string[] = [];
  const sources: [string, string | undefined][] = [];
  const db = {
    query: jest.fn((query: string, params: string[] = []) => {
      sql.push(query);
      if (query.startsWith('INSERT INTO daily_sources')) {
        sources.push([params[1], /"(\w+)"\) VALUES/.exec(query)?.[1]]);
      }
      if (query.startsWith('SELECT')) {
        return Promise.resolve(published ? [TAKLIF] : []);
      }
      return Promise.resolve([]);
    }),
  };
  const service = new VisitsService(
    db as unknown as DataSource,
    redis as unknown as Redis,
  );
  const count = (pattern: RegExp) => sql.filter((q) => pattern.test(q)).length;
  return {
    service,
    visitors: () => count(/INSERT INTO daily_visits \(day, "visitors"\)/),
    dailyViews: () =>
      count(/INSERT INTO daily_visits \(day, "invitationViews"\)/),
    views: () => count(/UPDATE taklif SET "viewCount"/),
    sources: () => sources,
  };
}

const guest = { visitorId: 'visitor-0001', slug: 'abc123' };

describe('VisitsService', () => {
  it('counts a visitor and a view once a day', async () => {
    const s = setup();
    await s.service.record(guest);
    await s.service.record(guest);
    expect(s.visitors()).toBe(1);
    expect(s.views()).toBe(1);
    expect(s.dailyViews()).toBe(1);
  });

  it('counts each visitor separately', async () => {
    const s = setup();
    await s.service.record(guest);
    await s.service.record({ ...guest, visitorId: 'visitor-0002' });
    expect(s.visitors()).toBe(2);
    expect(s.views()).toBe(2);
  });

  it('counts the site visit only, without a slug', async () => {
    const s = setup();
    await s.service.record({ visitorId: guest.visitorId });
    expect(s.visitors()).toBe(1);
    expect(s.views()).toBe(0);
  });

  it("doesn't count the owner's or an admin's views", async () => {
    const s = setup();
    await s.service.record(guest, { sub: 'owner', role: Role.User });
    await s.service.record(
      { ...guest, visitorId: 'visitor-0002' },
      { sub: 'someone', role: Role.Admin },
    );
    expect(s.visitors()).toBe(2);
    expect(s.views()).toBe(0);
  });

  it('counts a logged-in guest', async () => {
    const s = setup();
    await s.service.record(guest, { sub: 'someone', role: Role.User });
    expect(s.views()).toBe(1);
  });

  it("doesn't count views of an unpublished invitation", async () => {
    const s = setup({ published: false });
    await s.service.record(guest);
    expect(s.views()).toBe(0);
  });
});

describe('VisitsService sources', () => {
  it("records the source of each visitor's first visit of the day", async () => {
    const s = setup();
    await s.service.record(
      { ...guest, referrer: 'https://www.google.com/' },
      undefined,
      'Mozilla/5.0',
    );
    await s.service.record(
      { ...guest, referrer: 'https://chatgpt.com/' },
      undefined,
      'Mozilla/5.0',
    );
    await s.service.record(
      { visitorId: 'visitor-0002', utm: 'instagram' },
      undefined,
      'Mozilla/5.0',
    );
    expect(s.sources()).toEqual([
      ['google', 'invitation'],
      ['instagram', 'site'],
    ]);
  });
});

describe('tashkentDay', () => {
  it('is the Tashkent date (UTC+5)', () => {
    expect(tashkentDay(new Date('2026-10-20T18:59:00Z'))).toBe('2026-10-20');
    expect(tashkentDay(new Date('2026-10-20T19:00:00Z'))).toBe('2026-10-21');
  });
});
