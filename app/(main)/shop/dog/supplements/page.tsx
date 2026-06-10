import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '강아지 영양제 | GIFT PET',
  description: '강아지를 위한 건강 영양제',
};

export default async function DogSupplementsPage() {
  const products = await getProducts({ animalCategory: 'dog', productCategory: 'supplements' });
  return <ShopListContent title="강아지 영양제" products={products} />;
}
