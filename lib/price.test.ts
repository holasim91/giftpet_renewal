import { describe, it, expect } from 'vitest';
import { getDiscountRate } from './price';

describe('getDiscountRate', () => {
  it('28000원 → 22400원 → 20% 할인', () => {
    expect(getDiscountRate(28000, 22400)).toBe(20);
  });

  it('할인 없음 → 0%', () => {
    expect(getDiscountRate(10000, 10000)).toBe(0);
  });

  it('소수점 반올림 확인 (33.33... → 33)', () => {
    expect(getDiscountRate(10000, 6667)).toBe(33);
  });
});
