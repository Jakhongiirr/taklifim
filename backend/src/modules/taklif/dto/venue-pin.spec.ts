import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateTaklifDto } from './create-taklif.dto';
import { UpdateTaklifDto } from './update-taklif.dto';

const base = {
  brideName: 'Madina',
  groomName: 'Jasur',
  hostName: 'Karimovlar oilasi',
  eventAt: '2026-10-20T18:00:00+05:00',
  venueName: "Navruz to'yxonasi",
  venueAddress: 'Toshkent',
  themeId: '0b6c1d0e-4f5a-4c1e-9a8b-0a1b2c3d4e5f',
};

const failed = (
  cls: typeof CreateTaklifDto | typeof UpdateTaklifDto,
  body: object,
) =>
  validateSync(plainToInstance(cls, body))
    .map((e) => e.property)
    .sort();

describe('venue pin validation', () => {
  it('accepts a create without a pin, or with both coordinates', () => {
    expect(failed(CreateTaklifDto, base)).toEqual([]);
    expect(
      failed(CreateTaklifDto, { ...base, latitude: 41.31, longitude: 69.24 }),
    ).toEqual([]);
  });

  it('rejects one coordinate alone and out-of-range values', () => {
    expect(failed(CreateTaklifDto, { ...base, latitude: 41.31 })).toEqual([
      'longitude',
    ]);
    expect(
      failed(CreateTaklifDto, { ...base, latitude: 91, longitude: 181 }),
    ).toEqual(['latitude', 'longitude']);
    expect(
      failed(CreateTaklifDto, { ...base, latitude: '41', longitude: 69 }),
    ).toEqual(['latitude']);
  });

  it('lets PATCH remove the pin only as a pair', () => {
    expect(
      failed(UpdateTaklifDto, { latitude: null, longitude: null }),
    ).toEqual([]);
    expect(failed(UpdateTaklifDto, { latitude: null })).toEqual([
      'latitude',
      'longitude',
    ]);
    expect(failed(UpdateTaklifDto, { latitude: null, longitude: 69 })).toEqual([
      'latitude',
    ]);
  });
});
