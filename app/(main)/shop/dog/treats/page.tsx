import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '강아지 간식 | GIFT PET',
  description: '강아지를 위한 건강 간식',
};

export default async function DogTreatsPage() {
  const products = await getProducts({ animalCategory: 'dog', productCategory: 'treats' });
  return <ShopListContent title="강아지 간식" products={products} />;
}
