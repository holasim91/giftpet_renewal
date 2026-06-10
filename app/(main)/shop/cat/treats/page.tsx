import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '고양이 간식 | GIFT PET',
  description: '고양이를 위한 건강 간식',
};

export default async function CatTreatsPage() {
  const products = await getProducts({ animalCategory: 'cat', productCategory: 'treats' });
  return <ShopListContent title="고양이 간식" products={products} />;
}
