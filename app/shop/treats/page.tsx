import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '간식 | GIFT PET',
  description: '강아지·고양이를 위한 건강 간식',
};

export default async function TreatsShopPage() {
  const products = await getProducts({ productCategory: 'treats' });
  return (
    <>
      <Header />
      <MobileHeader />
      <ShopListContent title="간식" products={products} />
      <Footer />
      <BottomNav />
    </>
  );
}
