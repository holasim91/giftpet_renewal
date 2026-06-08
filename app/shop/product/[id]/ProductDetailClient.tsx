'use client';

// 수량·탭·썸네일 상태 필요 → 'use client' (AGENTS.md 허용)
import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Footer from '@/components/layout/Footer';
import type { Product } from '@/types';
import { PRODUCT_CATEGORY_LABELS, ANIMAL_CATEGORY_LABELS } from '@/types';
import { addToCart } from '@/actions/cart';
import { useToast } from '@/components/ui/Toast';

const BADGE_STYLE: Record<string, string> = {
  NEW: 'bg-primary-container text-on-primary',
  BEST: 'bg-[#343434] text-white',
  HIT: 'bg-[#343434] text-white',
};

const DESKTOP_TABS = [
  'Product Description',
  'Reviews (0)',
  'Q&A (0)',
  'Shipping Info',
  'Returns/Exchange',
];
const MOBILE_TABS = ['상세정보', '리뷰 (0)', 'Q&A'];

interface Props {
  product: Product;
}

export default function ProductDetailClient({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [desktopTab, setDesktopTab] = useState(0);
  const [mobileTab, setMobileTab] = useState(0);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();

  const handleAddToCart = () => {
    startTransition(async () => {
      const result = await addToCart(product.id, qty);
      if (result?.error) {
        router.push('/auth/login');
      } else {
        showToast('장바구니에 추가되었습니다', 'success');
        router.refresh();
      }
    });
  };

  const thumbnails = [product.imageUrl];
  const firstBadge = product.badges[0];
  const totalPrice = product.price * qty;

  const animalLabel = product.animalCategory
    ? ANIMAL_CATEGORY_LABELS[product.animalCategory].toUpperCase()
    : null;
  const categoryLabel = [animalLabel, product.productCategory.toUpperCase()].filter(Boolean).join(' ');
  const categoryLabelKo = PRODUCT_CATEGORY_LABELS[product.productCategory];

  return (
    <main className="flex-1 w-full pb-40 md:pb-0">

      {/* ── 데스크톱 ── */}
      <div className="hidden md:block max-w-container mx-auto px-margin-desktop py-12">

        {/* Breadcrumbs */}
        <nav aria-label="breadcrumb" className="flex items-center gap-2 text-secondary text-label-sm mb-8">
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

        {/* Product Hero — 2-column */}
        <div className="grid grid-cols-2 gap-12 mb-16">

          {/* Left — Gallery */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden shadow-sm relative group">
              <Image
                src={thumbnails[activeThumb]}
                alt={product.name}
                fill
                priority
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 1280px) 50vw, 560px"
              />
            </div>
            {thumbnails.length > 1 && (
              <div className="grid grid-cols-5 gap-3">
                {thumbnails.map((thumb, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveThumb(i)}
                    className={`aspect-square bg-surface-container-low rounded-lg overflow-hidden transition-all ${
                      i === activeThumb
                        ? 'border-2 border-primary-container'
                        : 'border border-surface-variant opacity-60 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={thumb}
                      alt={`썸네일 ${i + 1}`}
                      width={80}
                      height={80}
                      className={`w-full h-full object-cover ${i !== activeThumb ? 'grayscale' : ''}`}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Info */}
          <div className="flex flex-col gap-6">

            {/* Title & Price */}
            <div className="pb-6 border-b border-surface-variant">
              {product.badges.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {product.badges.map((badge) => (
                    <span
                      key={badge}
                      className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLE[badge] ?? 'bg-surface-container text-on-surface-variant'}`}
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
              <h1 className="text-headline-lg text-on-surface mb-4">{product.name}</h1>
              <div className="flex items-baseline gap-3">
                {product.discountPrice ? (
                  <>
                    <p className="text-headline-md text-primary font-bold">
                      ₩{product.discountPrice.toLocaleString()}
                    </p>
                    <p className="text-body-md text-tertiary line-through">
                      ₩{product.price.toLocaleString()}
                    </p>
                  </>
                ) : (
                  <p className="text-headline-md text-primary font-bold">
                    ₩{product.price.toLocaleString()}
                  </p>
                )}
              </div>
            </div>

            {/* Specs */}
            <div className="flex flex-col gap-3 text-body-md text-on-surface-variant">
              {[
                { label: '배송비', value: '₩3,000 (₩100,000 이상 무료)' },
                { label: '카테고리', value: categoryLabel },
              ].map(({ label, value }) => (
                <div key={label} className="grid grid-cols-[110px_1fr] gap-4">
                  <span className="text-secondary">{label}</span>
                  <span className="text-on-surface">{value}</span>
                </div>
              ))}
            </div>

            {/* Options & Action box */}
            <div className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-sm">

              {/* Quantity */}
              <div className="flex items-center justify-between">
                <span className="text-label-md text-on-surface">수량</span>
                <div className="flex items-center border border-surface-variant rounded-lg bg-surface-container-lowest overflow-hidden">
                  <button
                    type="button"
                    aria-label="수량 감소"
                    className="w-8 h-8 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
                    onClick={() => setQty(Math.max(1, qty - 1))}
                  >
                    <span className="material-symbols-outlined text-[18px]">remove</span>
                  </button>
                  <span className="w-10 text-center text-body-md font-medium">{qty}</span>
                  <button
                    type="button"
                    aria-label="수량 증가"
                    className="w-8 h-8 flex items-center justify-center text-secondary hover:text-on-surface hover:bg-surface-container transition-colors"
                    onClick={() => setQty(qty + 1)}
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-end pt-4 border-t border-surface-variant">
                <span className="text-body-md text-secondary">총 상품 금액</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-label-sm text-secondary">총 {qty}개</span>
                  <span className="text-headline-md font-bold text-primary">
                    ₩{totalPrice.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* CTA */}
              <div className="flex gap-3">
                <button
                  type="button"
                  aria-label="찜하기"
                  className="w-12 h-12 flex items-center justify-center border border-surface-variant rounded-lg text-secondary hover:text-primary-container hover:border-primary-container transition-colors"
                >
                  <span className="material-symbols-outlined">favorite</span>
                </button>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={isPending}
                  className="flex-1 h-12 bg-inverse-surface text-on-primary rounded-lg text-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isPending ? '추가 중...' : 'ADD TO CART'}
                </button>
                <button
                  type="button"
                  className="flex-1 h-12 bg-primary-container text-on-primary rounded-lg text-label-md hover:bg-primary transition-colors"
                >
                  BUY NOW
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Tabs */}
        <div className="w-full">
          <div className="border-b border-surface-variant flex gap-8 overflow-x-auto no-scrollbar text-label-md">
            {DESKTOP_TABS.map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setDesktopTab(i)}
                className={`pb-4 whitespace-nowrap transition-colors ${
                  i === desktopTab
                    ? 'text-on-surface border-b-2 border-on-surface'
                    : 'text-secondary hover:text-on-surface'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {desktopTab === 0 ? (
            <div className="py-12 flex flex-col items-center gap-8">
              <div className="w-full max-w-2xl rounded-xl overflow-hidden shadow-sm bg-surface-container-low">
                <Image
                  src={product.imageUrl}
                  alt="상품 상세 이미지"
                  width={672}
                  height={672}
                  className="w-full object-cover"
                />
              </div>
              {product.description && (
                <div className="w-full max-w-2xl bg-surface-container-low p-6 rounded-xl border border-surface-variant">
                  <p className="text-body-md text-on-surface-variant leading-relaxed">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="py-20 text-center text-body-md text-on-surface-variant">
              해당 내용은 준비 중입니다.
            </div>
          )}
        </div>
      </div>

      {/* ── 모바일 ── */}
      <div className="md:hidden">

        {/* Hero image */}
        <div className="w-full aspect-square bg-surface-container-low relative overflow-hidden">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {firstBadge && (
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-label-sm uppercase tracking-wider shadow-sm font-bold ${BADGE_STYLE[firstBadge] ?? 'bg-surface-container text-on-surface'}`}>
              {firstBadge}
            </div>
          )}
        </div>

        {/* Info card */}
        <div className="px-margin-mobile py-6 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
          <span className="text-label-md text-on-surface-variant uppercase tracking-wide">
            {categoryLabel}
          </span>
          <h1 className="text-headline-sm text-on-surface leading-tight mt-2">{product.name}</h1>
          <div className="mt-3 flex items-baseline gap-3">
            {product.discountPrice ? (
              <>
                <span className="text-headline-lg-mobile font-bold text-primary">
                  ₩{product.discountPrice.toLocaleString()}
                </span>
                <span className="text-body-md text-tertiary line-through">
                  ₩{product.price.toLocaleString()}
                </span>
              </>
            ) : (
              <span className="text-headline-lg-mobile font-bold text-primary">
                ₩{product.price.toLocaleString()}
              </span>
            )}
          </div>
          {/* Meta */}
          <div className="mt-6 border-t border-surface-variant pt-4 flex flex-col gap-3">
            {[
              { label: '배송비', value: '₩3,000 (₩100,000 이상 무료)' },
              { label: '카테고리', value: categoryLabel },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between items-center">
                <span className="text-body-md text-on-surface-variant">{label}</span>
                <span className="text-body-md text-on-surface font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="mt-2 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
          <div className="flex border-b border-surface-variant px-margin-mobile overflow-x-auto no-scrollbar">
            {MOBILE_TABS.map((tab, i) => (
              <button
                key={tab}
                type="button"
                onClick={() => setMobileTab(i)}
                className={`flex-1 py-4 text-center text-label-md whitespace-nowrap transition-colors ${
                  i === mobileTab
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-on-surface-variant hover:bg-surface-container'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {mobileTab === 0 ? (
            <div className="px-margin-mobile py-6 flex flex-col gap-6">
              {product.description && (
                <p className="text-body-md text-on-surface-variant leading-relaxed text-center">
                  {product.description}
                </p>
              )}
              <div className="w-full aspect-video bg-surface-container rounded-xl overflow-hidden">
                <Image
                  src={product.imageUrl}
                  alt="상품 상세 이미지"
                  width={400}
                  height={225}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ) : (
            <div className="py-16 text-center text-body-md text-on-surface-variant">
              해당 내용은 준비 중입니다.
            </div>
          )}
        </div>
      </div>

      <div className="hidden md:block">
        <Footer />
      </div>

      {/* 모바일 하단 고정 액션 바 */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-surface-variant shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        <div className="px-margin-mobile py-4 border-b border-surface-container bg-surface-bright">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface">수량</span>
            <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest overflow-hidden">
              <button
                type="button"
                aria-label="수량 감소"
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-10 text-center text-body-md font-medium">{qty}</span>
              <button
                type="button"
                aria-label="수량 증가"
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors"
                onClick={() => setQty(qty + 1)}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-4">
            <span className="text-label-md text-on-surface-variant">총 상품 금액</span>
            <span className="text-headline-sm font-bold text-primary">
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="px-margin-mobile py-3 flex gap-3 bg-surface-container-lowest">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isPending}
            className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface text-label-md flex justify-center items-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all disabled:opacity-50"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span>{isPending ? '추가 중...' : '장바구니'}</span>
          </button>
          <button
            type="button"
            className="flex-[2] py-3 px-4 rounded-lg bg-primary-container text-on-primary text-label-md font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex justify-center items-center"
          >
            바로 구매
          </button>
        </div>
      </div>
    </main>
  );
}
