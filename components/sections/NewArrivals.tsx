'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

interface NewArrivalsProps {
  products: Product[];
}

const SCROLL_AMOUNT = 280 + 24; // 카드 너비 + gap-6

export default function NewArrivals({ products }: NewArrivalsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // 드래그 상태 (re-render 불필요)
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const dragStartX = useRef(0);
  const dragScrollLeft = useRef(0);
  const rafId = useRef<number | null>(null);
  const pendingDelta = useRef(0);

  const updateScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const visibleWidth = el.clientWidth || el.offsetWidth;
    if (visibleWidth === 0) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(Math.ceil(el.scrollLeft + visibleWidth) < el.scrollWidth);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollState();
    const ro = new ResizeObserver(updateScrollState);
    ro.observe(el);
    return () => ro.disconnect();
  }, [updateScrollState]);

  const scroll = (dir: 'left' | 'right') => {
    scrollRef.current?.scrollBy({
      left: dir === 'left' ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
      behavior: 'smooth',
    });
  };

  const onMouseDown = (e: React.MouseEvent) => {
    const el = scrollRef.current;
    if (!el) return;
    isDragging.current = true;
    hasDragged.current = false;
    dragStartX.current = e.pageX - el.offsetLeft;
    dragScrollLeft.current = el.scrollLeft;
    // 드래그 중 snap 비활성화 — snap이 걸리면 드래그가 끊김
    el.style.scrollSnapType = 'none';
    e.preventDefault();
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = e.pageX - scrollRef.current.offsetLeft;
    const delta = dragStartX.current - x;
    if (Math.abs(delta) > 5) hasDragged.current = true;
    pendingDelta.current = delta;
    // rAF으로 프레임당 1회만 scrollLeft 갱신
    if (rafId.current !== null) return;
    rafId.current = requestAnimationFrame(() => {
      if (scrollRef.current && isDragging.current) {
        scrollRef.current.scrollLeft = dragScrollLeft.current + pendingDelta.current;
      }
      rafId.current = null;
    });
  };

  const onMouseUp = () => {
    isDragging.current = false;
    if (rafId.current !== null) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    // snap 복원
    if (scrollRef.current) {
      scrollRef.current.style.scrollSnapType = '';
    }
  };

  // 드래그 후 링크 클릭 방지
  const onClickCapture = (e: React.MouseEvent) => {
    if (hasDragged.current) {
      e.stopPropagation();
      e.preventDefault();
      hasDragged.current = false;
    }
  };

  return (
    <section className="py-6 md:py-0 bg-surface md:bg-transparent">

      {/* Section header */}
      <div className="flex justify-between items-center md:items-end mb-4 md:mb-6 px-margin-mobile md:px-0">
        <h2 className="text-headline-sm md:text-headline-md text-on-surface">신상품</h2>

        {/* Desktop: prev/next carousel buttons */}
        <div className="hidden md:flex space-x-2">
          <button
            type="button"
            aria-label="이전"
            onClick={() => scroll('left')}
            className={`w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center hover:border-primary-container hover:text-primary-container transition-all duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="다음"
            onClick={() => scroll('right')}
            className={`w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center hover:border-primary-container hover:text-primary-container transition-all duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Mobile: View All link */}
        <Link href="/shop" className="md:hidden text-label-sm text-primary hover:underline">
          전체 보기
        </Link>
      </div>

      {/* Desktop: horizontal scroll carousel */}
      <div
        ref={scrollRef}
        onScroll={updateScrollState}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onClickCapture={onClickCapture}
        className="hidden md:flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory cursor-grab active:cursor-grabbing select-none"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* View More card */}
        <Link
          href="/shop"
          className="min-w-[280px] w-[280px] snap-start group cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        >
          <div className="relative bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-4 transition-all duration-300">
            <div className="aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden relative flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-tertiary">more_horiz</span>
            </div>
            <h3 className="text-body-md text-on-surface min-h-[48px] mb-2 font-medium text-center">
              신상품 더 보기
            </h3>
          </div>
        </Link>
      </div>

      {/* Mobile: 2-column grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-margin-mobile">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}
