import type { Metadata } from 'next';
import CartClient from './CartClient';
import { getCart } from '@/actions/cart';
import { getMdPickProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '장바구니 | GIFT PET',
};

export default async function CartPage() {
  const [cartItems, suggestions] = await Promise.all([getCart(), getMdPickProducts()]);

  return <CartClient initialItems={cartItems} suggestions={suggestions} />;
}
