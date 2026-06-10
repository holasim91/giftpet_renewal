import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '간식 | GIFT PET',
  description: '강아지·고양이를 위한 건강 간식',
};

export default async function TreatsShopPage() {
  const products = await getProducts({ productCategory: 'treats' });
  return <ShopListContent title="간식" products={products} />;
}
