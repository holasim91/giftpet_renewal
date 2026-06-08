'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export type CartItemWithProduct = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    discountPrice: number | null;
    imageUrl: string;
    badges: string[];
    isActive: boolean;
    stock: number;
  };
};

export async function getCart(): Promise<CartItemWithProduct[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  return prisma.cart.findMany({
    where: { userId: session.user.id },
    select: {
      id: true,
      quantity: true,
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          discountPrice: true,
          imageUrl: true,
          badges: true,
          isActive: true,
          stock: true,
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getCartCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;
  return prisma.cart.count({ where: { userId: session.user.id } });
}

export async function addToCart(productId: string, quantity = 1): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: '로그인이 필요합니다.' };

  const existing = await prisma.cart.findFirst({
    where: { userId: session.user.id, productId },
  });

  if (existing) {
    await prisma.cart.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + quantity },
    });
  } else {
    await prisma.cart.create({
      data: { userId: session.user.id, productId, quantity },
    });
  }

  revalidatePath('/cart');
  return {};
}

export async function removeFromCart(cartId: string): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.cart.deleteMany({
    where: { id: cartId, userId: session.user.id },
  });

  revalidatePath('/cart');
}

export async function removeSelectedFromCart(cartIds: string[]): Promise<void> {
  const session = await auth();
  if (!session?.user?.id) return;

  await prisma.cart.deleteMany({
    where: { id: { in: cartIds }, userId: session.user.id },
  });

  revalidatePath('/cart');
}

export async function updateCartQuantity(
  cartId: string,
  quantity: number,
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false };
  if (quantity < 1) return { success: false };

  try {
    await prisma.cart.updateMany({
      where: { id: cartId, userId: session.user.id },
      data: { quantity },
    });
    return { success: true };
  } catch {
    return { success: false };
  }
}
