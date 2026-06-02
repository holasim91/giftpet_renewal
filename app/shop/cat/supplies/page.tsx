import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '고양이 용품 | GIFT PET',
  description: '고양이를 위한 생활 용품',
};

export default async function CatSuppliesPage() {
  const products = await getProducts({ animalCategory: 'cat', productCategory: 'supplies' });
  return (
    <>
      <Header />
      <MobileHeader />
      <ShopListContent title="고양이 용품" products={products} />
      <Footer />
      <BottomNav />
    </>
  );
}
