import { notFound } from 'next/navigation';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import { getProductById } from '@/actions/product';
import ProductDetailClient from './ProductDetailClient';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) notFound();

  return (
    <>
      <Header />
      <MobileHeader />
      <ProductDetailClient product={product} />
    </>
  );
}
