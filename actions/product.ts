'use server';

import { prisma } from '@/lib/prisma';
import type { AnimalCategory, ProductCategory } from '@/types';

interface GetProductsParams {
  animalCategory?: AnimalCategory;
  productCategory?: ProductCategory;
}

export async function getProducts({ animalCategory, productCategory }: GetProductsParams = {}) {
  return prisma.product.findMany({
    where: {
      isActive: true,
      ...(animalCategory !== undefined && { animalCategory }),
      ...(productCategory !== undefined && { productCategory }),
    },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id, isActive: true },
  });
}

export async function getNewArrivals(limit = 8) {
  return prisma.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
    take: limit,
  });
}

export async function getMdPickProducts() {
  return prisma.product.findMany({
    where: { isMdPick: true, isActive: true },
    orderBy: { createdAt: 'desc' },
  });
}
