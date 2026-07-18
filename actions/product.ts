'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import type { AnimalCategory, ProductCategory, SortOption, Product } from '@/types';

interface GetProductsParams {
  animalCategory?: AnimalCategory;
  productCategory?: ProductCategory;
  sort?: SortOption;
}

export async function getProducts({ animalCategory, productCategory, sort = 'recommended' }: GetProductsParams = {}) {
  try {
    if (sort === 'price_asc') {
      return await prisma.$queryRaw<Product[]>`
        SELECT * FROM "Product"
        WHERE "isActive" = true
        ${animalCategory ? Prisma.sql`AND "animalCategory" = ${animalCategory}` : Prisma.empty}
        ${productCategory ? Prisma.sql`AND "productCategory" = ${productCategory}` : Prisma.empty}
        ORDER BY COALESCE("discountPrice", price) ASC
      `;
    }
    if (sort === 'price_desc') {
      return await prisma.$queryRaw<Product[]>`
        SELECT * FROM "Product"
        WHERE "isActive" = true
        ${animalCategory ? Prisma.sql`AND "animalCategory" = ${animalCategory}` : Prisma.empty}
        ${productCategory ? Prisma.sql`AND "productCategory" = ${productCategory}` : Prisma.empty}
        ORDER BY COALESCE("discountPrice", price) DESC
      `;
    }

    const where = {
      isActive: true,
      ...(animalCategory !== undefined && { animalCategory }),
      ...(productCategory !== undefined && { productCategory }),
    };

    const orderBy: Prisma.ProductOrderByWithRelationInput[] =
      sort === 'recommended'
        ? [{ isBest: 'desc' }, { isMdPick: 'desc' }, { createdAt: 'desc' }]
        : [{ createdAt: 'desc' }];

    return await prisma.product.findMany({ where, orderBy });
  } catch {
    return [];
  }
}

export async function getProductById(id: string) {
  try {
    return await prisma.product.findUnique({
      where: { id, isActive: true },
    });
  } catch {
    return null;
  }
}

export async function getNewArrivals(limit = 8) {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  try {
    const recent = await prisma.product.findMany({
      where: {
        isActive: true,
        createdAt: { gte: thirtyDaysAgo },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    // 30일 이내 신상품이 없으면 (시딩 시각에 종속되어 발생) 최신 등록순으로 폴백해
    // 메인 신상품 영역이 비지 않도록 한다.
    if (recent.length > 0) return recent;

    return await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  } catch {
    return [];
  }
}

export async function getMdPickProducts() {
  try {
    return await prisma.product.findMany({
      where: { isMdPick: true, isActive: true },
      orderBy: { createdAt: 'desc' },
      take: 4,
    });
  } catch {
    return [];
  }
}
