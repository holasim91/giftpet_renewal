import { describe, it, expect } from 'vitest';
import { getCardBadge } from './badge';
import type { Product } from '@/types';

const base: Product = {
  id: 'p1',
  name: '테스트 상품',
  description: null,
  detailContent: null,
  price: 10000,
  discountPrice: null,
  imageUrl: '/images/placeholder.jpg',
  stock: 10,
  animalCategory: 'dog',
  productCategory: 'food',
  isBest: false,
  isMdPick: false,
  isActive: true,
};

const daysAgo = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};

describe('getCardBadge', () => {
  it('stock 0 → SOLD_OUT', () => {
    expect(getCardBadge({ ...base, stock: 0 })).toBe('SOLD_OUT');
  });

  it('isBest true → BEST', () => {
    expect(getCardBadge({ ...base, isBest: true })).toBe('BEST');
  });

  it('30일 이내 등록 → NEW', () => {
    expect(getCardBadge({ ...base, createdAt: daysAgo(10) })).toBe('NEW');
  });

  it('stock 0 + isBest true → SOLD_OUT (우선순위)', () => {
    expect(getCardBadge({ ...base, stock: 0, isBest: true })).toBe('SOLD_OUT');
  });

  it('아무것도 해당 없음 → null', () => {
    expect(getCardBadge({ ...base, createdAt: daysAgo(31) })).toBeNull();
  });
});
