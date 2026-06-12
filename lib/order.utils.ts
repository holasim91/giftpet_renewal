import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';

type StockCheckItem = { productId: string; quantity: number };
type ProductWithStock = { id: string; stock: number };

export function validateStock(
  cartItems: StockCheckItem[],
  products: ProductWithStock[],
): { valid: true } | { valid: false; error: string } {
  for (const item of cartItems) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.quantity) {
      return { valid: false, error: '재고가 부족합니다' };
    }
  }
  return { valid: true };
}

type CartItemForTotal = {
  quantity: number;
  product: { price: number; discountPrice: number | null };
};

export type OrderTotals = {
  subtotal: number;
  shippingFee: number;
  discountAmount: number;
  totalAmount: number;
};

export function calculateOrderTotal(cartItems: CartItemForTotal[]): OrderTotals {
  let subtotal = 0;
  let discountAmount = 0;

  for (const item of cartItems) {
    const { price, discountPrice } = item.product;
    subtotal += (discountPrice ?? price) * item.quantity;
    if (discountPrice != null) {
      discountAmount += (price - discountPrice) * item.quantity;
    }
  }

  const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

  return { subtotal, shippingFee, discountAmount, totalAmount: subtotal + shippingFee };
}

type CartItemForBuild = {
  quantity: number;
  product: { id: string; name: string; price: number; discountPrice: number | null };
};

export type OrderItemInput = {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
};

export function buildOrderItems(cartItems: CartItemForBuild[]): OrderItemInput[] {
  return cartItems.map((item) => ({
    productId: item.product.id,
    productName: item.product.name,
    price: item.product.discountPrice ?? item.product.price,
    quantity: item.quantity,
  }));
}
