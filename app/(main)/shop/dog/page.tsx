import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '강아지 | GIFT PET',
  description: '강아지를 위한 프리미엄 사료, 간식, 용품, 영양제',
};

export default async function DogShopPage() {
  const products = await getProducts({ animalCategory: 'dog' });
  return <ShopListContent title="강아지" products={products} />;
}
