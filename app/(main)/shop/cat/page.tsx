import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '고양이 | GIFT PET',
  description: '고양이를 위한 프리미엄 간식, 용품',
};

export default async function CatShopPage() {
  const products = await getProducts({ animalCategory: 'cat' });
  return <ShopListContent title="고양이" products={products} />;
}
