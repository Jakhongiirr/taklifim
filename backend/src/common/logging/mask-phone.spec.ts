import { maskPhone } from './mask-phone';

describe('maskPhone', () => {
  it('keeps the country/operator code and the last four digits', () => {
    expect(maskPhone('+998901234567')).toBe('+99890***4567');
  });

  it('hides short values completely', () => {
    expect(maskPhone('12345')).toBe('***');
  });
});
