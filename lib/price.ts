export function getDiscountRate(price: number, discountPrice: number): number {
  return Math.round((1 - discountPrice / price) * 100);
}
