import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '영양제 | GIFT PET',
  description: '강아지·고양이를 위한 건강 영양제',
};

export default async function SupplementsShopPage() {
  const products = await getProducts({ productCategory: 'supplements' });
  return <ShopListContent title="영양제" products={products} />;
}
