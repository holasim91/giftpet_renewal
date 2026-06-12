'use server';

import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import type { ActionResult } from '@/types';

export type CreateOrderInput = {
  items: { productId: string; quantity: number }[];
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail?: string;
  deliveryMemo?: string;
};

export type OrderWithItems = {
  id: string;
  status: 'PAID' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingFee: number;
  discountAmount: number;
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
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

export async function createOrder(
  data: CreateOrderInput,
): Promise<ActionResult<{ orderId: string }>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. 재고 확인
      const products = await tx.product.findMany({
        where: { id: { in: data.items.map((i) => i.productId) } },
        select: { id: true, name: true, price: true, discountPrice: true, stock: true },
      });

      for (const item of data.items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product || product.stock < item.quantity) {
          throw new Error('재고가 부족합니다');
        }
      }

      // 2. Order 생성
      const order = await tx.order.create({
        data: {
          userId: session.user!.id,
          totalAmount: data.totalAmount,
          shippingFee: data.shippingFee,
          discountAmount: data.discountAmount,
          recipientName: data.recipientName,
          phone: data.phone,
          zipCode: data.zipCode,
          address: data.address,
          addressDetail: data.addressDetail,
          deliveryMemo: data.deliveryMemo,
        },
      });

      // 3. OrderItem 생성 (상품명·가격 스냅샷)
      await tx.orderItem.createMany({
        data: data.items.map((item) => {
          const product = products.find((p) => p.id === item.productId)!;
          return {
            orderId: order.id,
            productId: item.productId,
            productName: product.name,
            price: product.discountPrice ?? product.price,
            quantity: item.quantity,
          };
        }),
      });

      // 4. 재고 차감
      await Promise.all(
        data.items.map((item) =>
          tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          }),
        ),
      );

      // 5. 장바구니 비우기
      await tx.cart.deleteMany({ where: { userId: session.user!.id } });

      return order.id;
    });

    return { success: true, data: { orderId: result } };
  } catch (e) {
    const message = e instanceof Error ? e.message : '주문 처리 중 오류가 발생했습니다.';
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
          select: {
            id: true,
            productId: true,
            productName: true,
            price: true,
            quantity: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch {
    return [];
  }
}

export async function getOrderById(
  id: string,
): Promise<ActionResult<OrderWithItems>> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: '로그인이 필요합니다.' };

  try {
    const order = await prisma.order.findFirst({
      where: { id, userId: session.user.id },
      include: {
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            price: true,
            quantity: true,
          },
        },
      },
    });

    if (!order) return { success: false, error: '주문을 찾을 수 없습니다.' };
    return { success: true, data: order };
  } catch {
    return { success: false, error: '주문 조회 중 오류가 발생했습니다.' };
  }
}
