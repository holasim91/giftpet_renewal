import type { Product } from '@/types';

export const BADGE_STYLES = {
  BEST: 'bg-[#4E7CAE] text-white',
  NEW: 'bg-primary-container text-on-primary',
  SOLD_OUT: 'bg-inverse-surface text-inverse-on-surface',
} as const;

export type CardBadge = keyof typeof BADGE_STYLES;

export const BADGE_LABEL: Record<CardBadge, string> = {
  BEST: 'BEST',
  NEW: 'NEW',
  SOLD_OUT: 'SOLD OUT',
};

// 우선순위: SOLD OUT > BEST > NEW
export function getCardBadge(product: Product): CardBadge | null {
  if (product.stock === 0) return 'SOLD_OUT';
  if (product.isBest) return 'BEST';
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  if (product.createdAt && new Date(product.createdAt) >= thirtyDaysAgo) return 'NEW';
  return null;
}
