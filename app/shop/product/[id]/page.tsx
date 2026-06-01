'use client';

// 수량·탭 상태가 필요하여 'use client' 사용 (AGENTS.md: 상태 필요 시 허용)
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import MobileHeader from '@/components/layout/MobileHeader';
import Footer from '@/components/layout/Footer';

// v0.1 더미 데이터 — 실제 이미지 준비 시 imageUrl을 '/images/placeholder.jpg' 등으로 교체
const PRODUCT = {
  id: '1',
  name: '[오프라인 전용] 트럼펫 소프트클로버 이뮨부스터 1kg',
  price: 35000,
  badge: 'BEST',
  categoryLabel: 'DOG SUPPLEMENT',
  categoryLabelKo: '영양제',
  imageUrl: '/images/placeholder.svg',
  specs: {
    deliveryFee: '₩3,000 (₩50,000 이상 무료)',
    manufacturer: '(주)인터펫코리아',
    origin: '대한민국',
    barcode: '8809818770769',
  },
  description:
    '트럼펫 소프트클로버 이뮨부스터는 엄선된 원료로 만들어진 프리미엄 영양제입니다. 말랑말랑한 클로버 형태로 아이들이 간식처럼 맛있게 먹을 수 있습니다.',
  ingredients: [
    '프로폴리스 추출물 (항산화)',
    '초유 분말 (면역력 증진)',
    '오메가3 (피부/피모 건강)',
  ],
};

const THUMBNAILS = Array(5).fill(PRODUCT.imageUrl);

const DESKTOP_TABS = [
  'Product Description',
  'Reviews (0)',
  'Q&A (0)',
  'Shipping Info',
  'Returns/Exchange',
];
const MOBILE_TABS = ['상세정보', '리뷰 (124)', 'Q&A'];

export default function ProductDetailPage() {
  const [qty, setQty] = useState(1);
  const [activeThumb, setActiveThumb] = useState(0);
  const [desktopTab, setDesktopTab] = useState(0);
  const [mobileTab, setMobileTab] = useState(0);

  const totalPrice = PRODUCT.price * qty;

  return (
    <>
      <Header />
      <MobileHeader />

      <main className="flex-1 w-full pb-40 md:pb-0">

        {/* ── 데스크톱 레이아웃 ── */}
        <div className="hidden md:block max-w-container mx-auto px-margin-desktop py-12">

          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-secondary text-label-sm mb-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <Link href="/shop/dog" className="hover:text-primary transition-colors">강아지</Link>
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
            <span className="text-on-surface">{PRODUCT.categoryLabelKo}</span>
          </nav>

          {/* Product Hero: 2-column grid */}
          <div className="grid grid-cols-2 gap-12 mb-16">

            {/* Left — Gallery */}
            <div className="flex flex-col gap-4">
              {/* Main image */}
              <div className="w-full aspect-square bg-surface-container-low rounded-xl overflow-hidden shadow-sm relative group">
                <Image
                  src={THUMBNAILS[activeThumb]}
                  alt={PRODUCT.name}
                  fill
                  unoptimized
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 1280px) 50vw, 560px"
                />
              </div>
              {/* Thumbnails */}
              <div className="grid grid-cols-5 gap-4">
                {THUMBNAILS.map((thumb, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActiveThumb(i)}
                    className={`aspect-square bg-surface-container-low rounded-lg overflow-hidden transition-all ${
                      i === activeThumb
                        ? 'border-2 border-primary-container'
                        : 'border border-surface-variant opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={thumb}
                      alt={`Thumbnail ${i + 1}`}
                      width={80}
                      height={80}
                      unoptimized
                      className={`w-full h-full object-cover ${
                        i !== activeThumb ? 'grayscale' : ''
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Right — Product Info */}
            <div className="flex flex-col gap-6">

              {/* Title & price */}
              <div className="pb-6 border-b border-surface-variant">
                <div className="flex gap-2 mb-3">
                  <span className="px-2 py-1 bg-surface-container-high text-on-surface-variant rounded text-[10px] font-bold uppercase tracking-wider">
                    Offline Only
                  </span>
                </div>
                <h1 className="text-headline-lg text-on-surface mb-4">{PRODUCT.name}</h1>
                <p className="text-headline-md text-primary font-bold">
                  ₩{PRODUCT.price.toLocaleString()}
                </p>
              </div>

              {/* Specs */}
              <div className="flex flex-col gap-3 text-body-md text-on-surface-variant">
                {[
                  { label: '배송비',  value: PRODUCT.specs.deliveryFee },
                  { label: '제조사',  value: PRODUCT.specs.manufacturer },
                  { label: '원산지',  value: PRODUCT.specs.origin },
                  { label: '바코드',  value: PRODUCT.specs.barcode },
                ].map(({ label, value }) => (
                  <div key={label} className="grid grid-cols-[120px_1fr] gap-4">
                    <span className="text-secondary">{label}</span>
                    <span>{value}</span>
                  </div>
                ))}
              </div>

              {/* Options & Action box */}
              <div className="flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-sm">

                {/* Select */}
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface">옵션 선택</label>
                  <select className="w-full bg-surface-container-low border border-surface-variant rounded-lg p-3 text-body-md focus:border-primary-container focus:ring-1 focus:ring-primary-container appearance-none">
                    <option>옵션을 선택하세요</option>
                    <option>{PRODUCT.name} — ₩{PRODUCT.price.toLocaleString()}</option>
                  </select>
                </div>

                {/* Selected item row */}
                <div className="bg-surface border border-surface-variant rounded-lg p-4 flex justify-between items-center">
                  <div className="flex flex-col gap-1">
                    <span className="text-label-sm text-secondary">선택 옵션</span>
                    <span className="text-body-md font-medium">이뮨부스터 1kg</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border border-surface-variant rounded bg-surface-container-lowest">
                      <button
                        type="button"
                        className="px-2 py-1 text-secondary hover:text-on-surface"
                        onClick={() => setQty(Math.max(1, qty - 1))}
                      >
                        <span className="material-symbols-outlined text-[18px]">remove</span>
                      </button>
                      <span className="w-10 text-center text-body-md">{qty}</span>
                      <button
                        type="button"
                        className="px-2 py-1 text-secondary hover:text-on-surface"
                        onClick={() => setQty(qty + 1)}
                      >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                      </button>
                    </div>
                    <span className="text-body-md font-bold">
                      ₩{(PRODUCT.price * qty).toLocaleString()}
                    </span>
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

                {/* Buttons */}
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
                    className="flex-1 h-12 bg-inverse-surface text-on-primary rounded-lg text-label-md hover:opacity-90 transition-opacity"
                  >
                    ADD TO CART
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
                <div className="w-full max-w-lg rounded-xl overflow-hidden bg-surface-container">
                  <Image
                    src={PRODUCT.imageUrl}
                    alt="상품 상세 이미지"
                    width={520}
                    height={520}
                    unoptimized
                    className="w-full object-cover"
                  />
                </div>
                <div className="w-full max-w-lg bg-surface-container-low p-6 rounded-xl border border-surface-variant">
                  <h3 className="text-label-md text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    주요 성분
                  </h3>
                  <ul className="text-body-md text-on-surface-variant space-y-2">
                    {PRODUCT.ingredients.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-body-md text-on-surface-variant">
                해당 내용은 준비 중입니다.
              </div>
            )}
          </div>
        </div>

        {/* ── 모바일 레이아웃 ── */}
        <div className="md:hidden">

          {/* Product image hero */}
          <div className="w-full aspect-square bg-surface-container-low relative overflow-hidden">
            <Image
              src={PRODUCT.imageUrl}
              alt={PRODUCT.name}
              fill
              unoptimized
              priority
              className="object-cover"
              sizes="100vw"
            />
            {/* Badge */}
            <div className="absolute top-4 left-4 bg-secondary text-on-secondary px-3 py-1 rounded-full text-label-sm uppercase tracking-wider shadow-sm">
              {PRODUCT.badge}
            </div>
          </div>

          {/* Product info card */}
          <div className="px-margin-mobile py-6 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
            <div className="flex flex-col gap-2">
              <span className="text-label-md text-on-surface-variant uppercase">
                {PRODUCT.categoryLabel}
              </span>
              <h1 className="text-headline-sm text-on-surface leading-tight">{PRODUCT.name}</h1>
              <div className="mt-2">
                <span className="text-headline-lg-mobile font-bold text-primary">
                  ₩{PRODUCT.price.toLocaleString()}
                </span>
              </div>
            </div>
            {/* Meta details */}
            <div className="mt-6 border-t border-surface-variant pt-4 flex flex-col gap-3">
              {[
                { label: '배송비', value: PRODUCT.specs.deliveryFee },
                { label: '제조사', value: PRODUCT.specs.manufacturer },
                { label: '원산지', value: PRODUCT.specs.origin },
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
              <div className="p-5 flex flex-col gap-6">
                <h2 className="text-headline-sm text-on-surface text-center mt-4">
                  우리 아이 면역력을 위한 특별한 선택
                </h2>
                <p className="text-body-md text-on-surface-variant leading-relaxed text-center">
                  {PRODUCT.description}
                </p>
                <div className="w-full aspect-video bg-surface-container rounded-xl overflow-hidden">
                  <Image
                    src={PRODUCT.imageUrl}
                    alt="상품 상세 이미지"
                    width={400}
                    height={225}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant">
                  <h3 className="text-label-md text-on-surface mb-3 flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[18px]">verified</span>
                    주요 성분
                  </h3>
                  <ul className="text-body-md text-on-surface-variant space-y-2">
                    {PRODUCT.ingredients.map((item) => (
                      <li key={item}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="py-16 text-center text-body-md text-on-surface-variant">
                해당 내용은 준비 중입니다.
              </div>
            )}
          </div>
        </div>
      </main>

      {/* 데스크톱 푸터 */}
      <div className="hidden md:block">
        <Footer />
      </div>

      {/* 모바일 고정 하단 액션 바 */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-surface-variant shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        {/* 수량 + 총 금액 */}
        <div className="px-margin-mobile py-4 border-b border-surface-container bg-surface-bright">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface">수량</span>
            <div className="flex items-center border border-outline-variant rounded-lg bg-surface-container-lowest">
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors rounded-l-lg"
                onClick={() => setQty(Math.max(1, qty - 1))}
              >
                <span className="material-symbols-outlined text-[18px]">remove</span>
              </button>
              <span className="w-10 text-center text-body-md font-medium">{qty}</span>
              <button
                type="button"
                className="w-8 h-8 flex items-center justify-center text-on-surface-variant hover:bg-surface-container transition-colors rounded-r-lg"
                onClick={() => setQty(qty + 1)}
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
              </button>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-label-md text-on-surface-variant">총 상품 금액</span>
            <span className="text-headline-sm font-bold text-primary">
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        {/* 버튼 */}
        <div className="px-margin-mobile py-3 flex gap-3 bg-surface-container-lowest">
          <button
            type="button"
            className="flex-1 py-3 px-4 rounded-lg border border-outline-variant text-on-surface text-label-md flex justify-center items-center gap-2 hover:bg-surface-container-low active:scale-95 transition-all"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
            <span>장바구니</span>
          </button>
          <button
            type="button"
            className="flex-[2] py-3 px-4 rounded-lg bg-primary-container text-on-primary text-label-md font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex justify-center items-center"
          >
            바로 구매
          </button>
        </div>
      </div>
    </>
  );
}
