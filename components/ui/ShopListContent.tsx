'use client';

import { useState, Suspense } from 'react';
import CategorySidebar from './CategorySidebar';
import ProductGrid from './ProductGrid';
import SortBar from './SortBar';
import FilterDrawer from './FilterDrawer';
import type { Product } from '@/types';

interface ShopListContentProps {
  title: string;
  products: Product[];
}

export default function ShopListContent({ title, products }: ShopListContentProps) {
  const totalCount = products.length;
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <main className="flex-1 w-full max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12 pb-28 md:pb-12">

      {/* Category Header */}
      <div className="mb-6 md:mb-10">
        {/* Desktop (1024px+) */}
        <div className="hidden lg:block text-center">
          <h1 className="text-headline-lg text-on-background mb-4">{title}</h1>
          <p className="text-body-md text-secondary">
            총 <span className="text-primary font-bold">{totalCount}</span>개 상품
          </p>
        </div>
        {/* Mobile + Tablet (~1023px) */}
        <div className="lg:hidden flex justify-between items-end py-4 border-b border-surface-variant">
          <div>
            <h2 className="text-headline-lg-mobile text-on-surface mb-1">{title}</h2>
            <p className="text-body-md text-on-surface-variant">총 {totalCount}개 상품</p>
          </div>
          <button
            type="button"
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-1 border border-outline-variant rounded-full px-3 py-1.5 text-label-sm text-on-surface hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">tune</span>
            필터
          </button>
        </div>
      </div>

      {/* Main flex layout: sidebar + content */}
      <div className="flex gap-8 items-start">

        {/* Sidebar — 1024px 이상에서만 표시 */}
        <aside className="hidden lg:block sticky top-28">
          <CategorySidebar />
        </aside>

        {/* Content area */}
        <div className="flex-1 min-w-0">

          {/* Desktop: Sort bar */}
          <div className="hidden md:flex justify-end items-center border-b border-surface-variant pb-4 mb-8">
            <Suspense fallback={null}>
              <SortBar />
            </Suspense>
          </div>

          {/* Product Grid */}
          <div className="mb-10 md:mb-16">
            <ProductGrid products={products} />
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2">
            <button
              type="button"
              aria-label="이전 페이지"
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-secondary transition-colors disabled:opacity-50"
              disabled
            >
              <span className="material-symbols-outlined text-[20px]">chevron_left</span>
            </button>
            {[1, 2, 3].map((page) => (
              <button
                key={page}
                type="button"
                className={`w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full text-label-md transition-colors ${
                  page === 1
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-secondary hover:bg-surface-container'
                }`}
              >
                {page}
              </button>
            ))}
            <span className="text-on-surface-variant px-1">...</span>
            <button
              type="button"
              aria-label="다음 페이지"
              className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center rounded-full bg-surface-container hover:bg-surface-variant text-secondary transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">chevron_right</span>
            </button>
          </div>

        </div>
      </div>

      <FilterDrawer isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </main>
  );
}
