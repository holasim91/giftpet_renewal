import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '강아지 사료 | GIFT PET',
  description: '강아지를 위한 프리미엄 사료',
};

export default async function DogFoodPage() {
  const products = await getProducts({ animalCategory: 'dog', productCategory: 'food' });
  return <ShopListContent title="강아지 사료" products={products} />;
}
