import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '사료 | GIFT PET',
  description: '강아지·고양이를 위한 프리미엄 사료',
};

export default async function FoodShopPage() {
  const products = await getProducts({ productCategory: 'food' });
  return <ShopListContent title="사료" products={products} />;
}
