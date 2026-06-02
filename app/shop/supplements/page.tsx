import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '영양제 | GIFT PET',
  description: '강아지·고양이를 위한 건강 영양제',
};

export default async function SupplementsShopPage() {
  const products = await getProducts({ productCategory: 'supplements' });
  return (
    <>
      <Header />
      <MobileHeader />
      <ShopListContent title="영양제" products={products} />
      <Footer />
      <BottomNav />
    </>
  );
}
