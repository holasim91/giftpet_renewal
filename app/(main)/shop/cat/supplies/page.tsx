import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '고양이 용품 | GIFT PET',
  description: '고양이를 위한 생활 용품',
};

export default async function CatSuppliesPage() {
  const products = await getProducts({ animalCategory: 'cat', productCategory: 'supplies' });
  return <ShopListContent title="고양이 용품" products={products} />;
}
