import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import { getPendingOrder } from '@/actions/order';
import { getShippingAddresses } from '@/actions/shipping';
import CheckoutClient from './CheckoutClient';

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const session = await auth();
  if (!session?.user) redirect('/auth/login');

  const { order_id } = await searchParams;
  if (!order_id) redirect('/cart');

  const [order, addresses] = await Promise.all([
    getPendingOrder(order_id),
    getShippingAddresses(),
  ]);

  if (!order) redirect('/cart');

  return <CheckoutClient orderId={order_id} order={order} shippingAddresses={addresses} />;
}
