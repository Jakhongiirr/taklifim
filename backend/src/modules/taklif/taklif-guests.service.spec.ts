import { ConflictException, NotFoundException } from '@nestjs/common';
import type { Repository } from 'typeorm';
import type { JwtPayload } from '../auth/auth.types';
import { Role } from '../users/role.enum';
import type { TaklifGuest } from './taklif-guest.entity';
import { MAX_GUESTS, TaklifGuestsService } from './taklif-guests.service';
import type { TaklifResponse } from './taklif-response.entity';
import type { Taklif } from './taklif.entity';

const owner = { sub: 'u1', role: Role.User } as JwtPayload;
const stranger = { sub: 'u2', role: Role.User } as JwtPayload;

function setup({ count = 0 } = {}) {
  const taklifs = {
    findOneBy: jest.fn(() => Promise.resolve({ id: 't1', userId: 'u1' })),
  };
  const guests = {
    countBy: jest.fn(() => Promise.resolve(count)),
    create: jest.fn((g: Partial<TaklifGuest>) => g),
    save: jest.fn((rows: Partial<TaklifGuest>[]) =>
      Promise.resolve(rows.map((g, i) => ({ ...g, id: `g${i}` }))),
    ),
    find: jest.fn(() =>
      Promise.resolve([
        { id: 'g1', name: 'Aziza opa', token: 'aaaa2222' },
        { id: 'g2', name: 'Jasur aka', token: 'bbbb3333' },
      ]),
    ),
  };
  const responses = {
    find: jest.fn(() =>
      Promise.resolve([
        { guestId: 'g1', attending: false, guests: 1, createdAt: new Date(2) },
        { guestId: 'g1', attending: true, guests: 3, createdAt: new Date(1) },
      ]),
    ),
  };
  const service = new TaklifGuestsService(
    taklifs as unknown as Repository<Taklif>,
    guests as unknown as Repository<TaklifGuest>,
    responses as unknown as Repository<TaklifResponse>,
  );
  return { service, guests };
}

describe('TaklifGuestsService', () => {
  it('gives each added guest their own link', async () => {
    const { service } = setup();
    const added = await service.add('t1', ['Aziza opa', 'Jasur aka'], owner);
    expect(added.map((g) => g.name)).toEqual(['Aziza opa', 'Jasur aka']);
    expect(added[0].token).toMatch(/^[a-z2-9]{8}$/);
    expect(added[0].token).not.toBe(added[1].token);
  });

  it(`stops at ${MAX_GUESTS} guests`, async () => {
    const { service } = setup({ count: MAX_GUESTS - 1 });
    await expect(service.add('t1', ['A', 'B'], owner)).rejects.toThrow(
      ConflictException,
    );
  });

  it("hides another owner's guests", async () => {
    const { service } = setup();
    await expect(service.list('t1', stranger)).rejects.toThrow(
      NotFoundException,
    );
  });

  it("shows each guest's latest reply", async () => {
    const { service } = setup();
    const [aziza, jasur] = await service.list('t1', owner);
    expect(aziza.reply).toMatchObject({ attending: false });
    expect(jasur.reply).toBeNull();
  });
});
