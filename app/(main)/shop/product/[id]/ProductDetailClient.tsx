'use client';

import Link from 'next/link';
import type { Product } from '@/types';
import { PRODUCT_CATEGORY_LABELS, ANIMAL_CATEGORY_LABELS } from '@/types';
import ProductImages from '@/components/product/ProductImages';
import ProductInfo from '@/components/product/ProductInfo';
import ProductTabs from '@/components/product/ProductTabs';
import AddToCartSection from '@/components/product/AddToCartSection';

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const categoryLabelKo = PRODUCT_CATEGORY_LABELS[product.productCategory];

  return (
    <main className="flex-1 w-full pb-40 md:pb-0">
      <div className="md:max-w-container md:mx-auto md:px-margin-desktop md:py-12">

        {/* 브레드크럼 — 데스크톱 전용 */}
        <nav aria-label="breadcrumb" className="hidden md:flex items-center gap-2 text-secondary text-label-sm mb-8">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          {product.animalCategory && (
            <>
              <Link href={`/shop/${product.animalCategory}`} className="hover:text-primary transition-colors">
                {ANIMAL_CATEGORY_LABELS[product.animalCategory]}
              </Link>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            </>
          )}
          <span className="text-on-surface">{categoryLabelKo}</span>
        </nav>

        {/* 상품 히어로: 데스크톱 2열 그리드 / 모바일 스택 */}
        <div className="md:grid md:grid-cols-2 md:gap-12 md:mb-16">
          <ProductImages product={product} />
          <div className="md:flex md:flex-col md:gap-6">
            <ProductInfo product={product} />
            <AddToCartSection product={product} />
          </div>
        </div>

        <ProductTabs product={product} />
      </div>
    </main>
  );
}
