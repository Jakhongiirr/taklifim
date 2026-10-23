import { BadRequestException } from '@nestjs/common';
import { resolveOccasion } from './occasion';
import { TaklifOccasion } from './taklif-occasion.enum';

const { Wedding, Fotiha, Plov } = TaklifOccasion;

describe('resolveOccasion', () => {
  it('makes every plov-design invitation a plov', () => {
    expect(resolveOccasion('plov')).toBe(Plov);
    expect(resolveOccasion('plov', Plov)).toBe(Plov);
    expect(resolveOccasion('plov', undefined, Fotiha)).toBe(Plov);
  });

  it('rejects another occasion on the plov design', () => {
    expect(() => resolveOccasion('plov', Wedding)).toThrow(BadRequestException);
    expect(() => resolveOccasion('plov', Fotiha)).toThrow(BadRequestException);
  });

  it('rejects a plov on any other design', () => {
    expect(() => resolveOccasion('haven', Plov)).toThrow(BadRequestException);
  });

  it('keeps the asked or current occasion on other designs', () => {
    expect(resolveOccasion('haven')).toBe(Wedding);
    expect(resolveOccasion('haven', Fotiha)).toBe(Fotiha);
    expect(resolveOccasion('haven', undefined, Fotiha)).toBe(Fotiha);
  });

  it('turns a plov into a wedding when it leaves the plov design', () => {
    expect(resolveOccasion('haven', undefined, Plov)).toBe(Wedding);
  });
});
