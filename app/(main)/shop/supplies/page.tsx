import type { Metadata } from 'next';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '용품 | GIFT PET',
  description: '강아지·고양이를 위한 생활 용품',
};

export default async function SuppliesShopPage() {
  const products = await getProducts({ productCategory: 'supplies' });
  return <ShopListContent title="용품" products={products} />;
}
