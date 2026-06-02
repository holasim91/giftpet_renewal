import type { Metadata } from 'next';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';
import BottomNav from '@/components/layout/BottomNav';
import ShopListContent from '@/components/ui/ShopListContent';
import { getProducts } from '@/actions/product';

export const metadata: Metadata = {
  title: '강아지 용품 | GIFT PET',
  description: '강아지를 위한 생활 용품',
};

export default async function DogSuppliesPage() {
  const products = await getProducts({ animalCategory: 'dog', productCategory: 'supplies' });
  return (
    <>
      <Header />
      <MobileHeader />
      <ShopListContent title="강아지 용품" products={products} />
      <Footer />
      <BottomNav />
    </>
  );
}
