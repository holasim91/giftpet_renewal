'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { SHIPPING_FEE, FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import { revalidatePath } from 'next/cache';
import type { ActionResult } from '@/types';

export type OrderWithItems = {
  id: string;
  status: 'PENDING' | 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  recipientName: string | null;
  phone: string | null;
  zipCode: string | null;
  address: string | null;
  addressDetail: string | null;
  deliveryMemo: string | null;
  createdAt: Date;
  items: {
    id: string;
    productId: string;
    productName: string;
    price: number;
    quantity: number;
  }[];
};

export type ShippingData = {
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
};

export async function createPendingOrder(
  items: { productId: string; quantity: number }[],
): Promise<ActionResult<{ orderId: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
      select: { id: true, name: true, price: true, discountPrice: true },
    });

    let subtotal = 0;
    let discountAmount = 0;
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return { success: false, error: '상품을 찾을 수 없습니다.' };
      subtotal += (product.discountPrice ?? product.price) * item.quantity;
      if (product.discountPrice != null) {
        discountAmount += (product.price - product.discountPrice) * item.quantity;
      }
    }
    const shippingFee = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;

    const order = await prisma.$transaction(async (tx) => {
      const created = await tx.order.create({
        data: {
          userId: session.user!.id,
          totalAmount: subtotal + shippingFee,
          shippingFee,
          discountAmount,
        },
      });

      await tx.orderItem.createMany({
        data: items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            orderId: created.id,
            productId: item.productId,
            productName: product.name,
            price: product.discountPrice ?? product.price,
            quantity: item.quantity,
          };
        }),
      });

      return created;
    });

    return { success: true, data: { orderId: order.id } };
  } catch {
    return { success: false, error: '주문 생성 중 오류가 발생했습니다.' };
  }
}

export async function confirmOrder(
  orderId: string,
  shippingData: ShippingData,
  deliveryMemo?: string,
): Promise<ActionResult> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    await prisma.$transaction(async (tx) => {
      const order = await tx.order.findFirst({
        where: { id: orderId, userId: session.user!.id, status: 'PENDING' },
        include: { items: { select: { productId: true, quantity: true } } },
      });
      if (!order) throw new Error('주문을 찾을 수 없습니다.');

      // 1. 재고 확인
      const products = await tx.product.findMany({
        where: { id: { in: order.items.map((i) => i.productId) } },
        select: { id: true, stock: true },
      });
      for (const item of order.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error('재고가 부족합니다');
        }
      }

      // 2. PAID로 업데이트 + 배송지/메모 저장
      await tx.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          recipientName: shippingData.recipientName,
          phone: shippingData.phone,
          zipCode: shippingData.zipCode,
          address: shippingData.address,
          addressDetail: shippingData.addressDetail,
          deliveryMemo,
        },
      });

      // 3. 재고 차감
      await Promise.all(
        order.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // 4. 장바구니 비우기
      await tx.cart.deleteMany({ where: { userId: session.user!.id } });
    });

    revalidatePath('/cart');
    revalidatePath('/mypage');
    return { success: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : '주문 확정 중 오류가 발생했습니다.';
    return { success: false, error: message };
  }
}

export async function getOrders(): Promise<OrderWithItems[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    return await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          select: { id: true, productId: true, productName: true, price: true, quantity: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getOrderById(id: string): Promise<ActionResult<OrderWithItems>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const order = await prisma.order.findFirst({
      where: { id, userId: session.user.id },
      include: {
        items: {
          select: { id: true, productId: true, productName: true, price: true, quantity: true },
        },
      },
    });

    if (!order) return { success: false, error: '주문을 찾을 수 없습니다.' };
    return { success: true, data: order };
  } catch {
    return { success: false, error: '주문 조회 중 오류가 발생했습니다.' };
  }
}
