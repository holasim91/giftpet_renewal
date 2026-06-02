import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '모든 상품 | GIFT PET',
  description: '강아지, 고양이를 위한 프리미엄 사료, 간식, 용품, 영양제',
};

export default async function ShopPage() {
  const products = await getProducts();
  return (
    <>
      <Header />
      <MobileHeader />
      <ShopListContent title="모든 상품" products={products} />
      <Footer />
      <BottomNav />
    </>
  );
}
