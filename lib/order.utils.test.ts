import { describe, it, expect } from 'vitest';
import { validateStock, calculateOrderTotal, buildOrderItems } from './order.utils';
import { SHIPPING_FEE } from './constants';

describe('validateStock', () => {
  it('재고 충분 → valid: true', () => {
    const cartItems = [{ productId: 'p1', quantity: 2 }];
    const products = [{ id: 'p1', name: '상품A', stock: 5 }];
    expect(validateStock(cartItems, products)).toEqual({ valid: true });
  });

  it('재고 부족 → valid: false', () => {
    const cartItems = [{ productId: 'p1', quantity: 10 }];
    const products = [{ id: 'p1', name: '상품A', stock: 5 }];
    const result = validateStock(cartItems, products);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toBe('상품A의 재고가 부족합니다');
  });

  it('여러 상품 중 하나만 부족 → valid: false', () => {
    const cartItems = [
      { productId: 'p1', quantity: 2 },
      { productId: 'p2', quantity: 10 },
    ];
    const products = [
      { id: 'p1', name: '상품A', stock: 5 },
      { id: 'p2', name: '상품B', stock: 3 },
    ];
    expect(validateStock(cartItems, products).valid).toBe(false);
  });

  it('여러 상품 중 일부만 재고 부족 → valid: false, 부족한 상품명 포함', () => {
    const cartItems = [
      { productId: 'p1', quantity: 1 },
      { productId: 'p2', quantity: 5 },
    ];
    const products = [
      { id: 'p1', name: '사료A', stock: 10 },
      { id: 'p2', name: '간식B', stock: 2 },
    ];
    const result = validateStock(cartItems, products);
    expect(result.valid).toBe(false);
    if (!result.valid) expect(result.error).toContain('간식B');
  });

  it('재고가 정확히 주문 수량과 같을 때 → valid: true (경계값)', () => {
    const cartItems = [{ productId: 'p1', quantity: 5 }];
    const products = [{ id: 'p1', name: '상품A', stock: 5 }];
    expect(validateStock(cartItems, products)).toEqual({ valid: true });
  });
});

describe('calculateOrderTotal', () => {
  it('일반 금액 → 배송비 3,000원', () => {
    const cartItems = [{ quantity: 1, product: { price: 50000, discountPrice: null } }];
    const result = calculateOrderTotal(cartItems);
    expect(result.subtotal).toBe(50000);
    expect(result.shippingFee).toBe(SHIPPING_FEE);
    expect(result.totalAmount).toBe(53000);
    expect(result.discountAmount).toBe(0);
  });

  it('10만원 이상 → 배송비 0원', () => {
    const cartItems = [{ quantity: 1, product: { price: 100000, discountPrice: null } }];
    const result = calculateOrderTotal(cartItems);
    expect(result.shippingFee).toBe(0);
    expect(result.totalAmount).toBe(100000);
  });

  it('할인 상품 포함 → 할인금액 계산', () => {
    const cartItems = [{ quantity: 2, product: { price: 20000, discountPrice: 15000 } }];
    const result = calculateOrderTotal(cartItems);
    expect(result.subtotal).toBe(30000);       // 15000 * 2
    expect(result.discountAmount).toBe(10000); // (20000 - 15000) * 2
    expect(result.shippingFee).toBe(SHIPPING_FEE);
    expect(result.totalAmount).toBe(33000);
  });

  it('정확히 100,000원일 때 → 배송비 0원 (경계값)', () => {
    const cartItems = [{ quantity: 2, product: { price: 50000, discountPrice: null } }];
    const result = calculateOrderTotal(cartItems);
    expect(result.subtotal).toBe(100000);
    expect(result.shippingFee).toBe(0);
    expect(result.totalAmount).toBe(100000);
  });

  it('99,999원일 때 → 배송비 3,000원 (경계값)', () => {
    const cartItems = [{ quantity: 1, product: { price: 99999, discountPrice: null } }];
    const result = calculateOrderTotal(cartItems);
    expect(result.subtotal).toBe(99999);
    expect(result.shippingFee).toBe(SHIPPING_FEE);
    expect(result.totalAmount).toBe(102999);
  });

  it('할인가 있는 상품 + 없는 상품 혼합', () => {
    const cartItems = [
      { quantity: 1, product: { price: 30000, discountPrice: null } },
      { quantity: 2, product: { price: 20000, discountPrice: 15000 } },
    ];
    const result = calculateOrderTotal(cartItems);
    expect(result.subtotal).toBe(60000);       // 30000 + 15000*2
    expect(result.discountAmount).toBe(10000); // (20000-15000)*2
    expect(result.shippingFee).toBe(SHIPPING_FEE);
    expect(result.totalAmount).toBe(63000);
  });
});

describe('buildOrderItems', () => {
  it('주문 시점 가격 스냅샷 확인', () => {
    const cartItems = [
      { quantity: 2, product: { id: 'p1', name: '상품A', price: 10000, discountPrice: null } },
    ];
    expect(buildOrderItems(cartItems)).toEqual([
      { productId: 'p1', productName: '상품A', price: 10000, quantity: 2 },
    ]);
  });

  it('할인가 있으면 할인가로 스냅샷', () => {
    const cartItems = [
      { quantity: 1, product: { id: 'p2', name: '상품B', price: 30000, discountPrice: 24000 } },
    ];
    expect(buildOrderItems(cartItems)[0].price).toBe(24000);
  });

  it('할인가 없는 상품 → 정가로 스냅샷', () => {
    const cartItems = [
      { quantity: 3, product: { id: 'p3', name: '상품C', price: 15000, discountPrice: null } },
    ];
    expect(buildOrderItems(cartItems)[0].price).toBe(15000);
  });

  it('할인가 있는 상품 → 할인가로 스냅샷', () => {
    const cartItems = [
      { quantity: 1, product: { id: 'p4', name: '상품D', price: 50000, discountPrice: 40000 } },
    ];
    expect(buildOrderItems(cartItems)[0].price).toBe(40000);
  });

  it('상품명 스냅샷 확인', () => {
    const cartItems = [
      { quantity: 1, product: { id: 'p5', name: '힐스 사이언스 다이어트 어덜트', price: 45000, discountPrice: null } },
    ];
    expect(buildOrderItems(cartItems)[0].productName).toBe('힐스 사이언스 다이어트 어덜트');
  });
});
