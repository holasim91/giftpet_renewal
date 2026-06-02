import ProductCard from '@/components/ui/ProductCard';
import type { Product } from '@/types';

const DUMMY_PRODUCTS: Product[] = [
  {
    id: '1',
    name: '오가닉 연어 고양이 간식 100g',
    price: 12990,
    imageUrl: '/images/placeholder.jpg',
    badges: ['NEW', 'BEST'],
    category: '고양이 간식',
  },
  {
    id: '2',
    name: '프리미엄 정형외과 강아지 침대 그레이',
    price: 89990,
    imageUrl: '/images/placeholder.jpg',
    badges: ['NEW'],
    category: '강아지 용품',
  },
  {
    id: '3',
    name: '스마트 자동 급수기 1.8L',
    price: 45990,
    imageUrl: '/images/placeholder.jpg',
    badges: ['NEW'],
    category: '생활 용품',
  },
  {
    id: '4',
    name: '내구성 츄잉 장난감 세트 L',
    price: 24990,
    imageUrl: '/images/placeholder.jpg',
    badges: ['NEW'],
    category: '강아지 장난감',
  },
  {
    id: '5',
    name: '내추럴 그레인프리 강아지 사료 5kg',
    price: 52000,
    imageUrl: '/images/placeholder.jpg',
    badges: ['BEST'],
    category: '강아지 사료',
  },
  {
    id: '6',
    name: '고양이 스크래쳐 캣타워 하우스',
    price: 78000,
    imageUrl: '/images/placeholder.jpg',
    badges: [],
    category: '고양이 용품',
  },
];

export default function NewArrivals() {
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
            className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center hover:border-primary-container hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          <button
            type="button"
            aria-label="다음"
            className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center hover:border-primary-container hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>

        {/* Mobile: View All link */}
        <a href="#" className="md:hidden text-label-sm text-primary hover:underline">
          전체 보기
        </a>
      </div>

      {/* Desktop: horizontal scroll carousel */}
      <div className="hidden md:flex overflow-x-auto gap-6 pb-8 no-scrollbar snap-x snap-mandatory">
        {DUMMY_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}

        {/* View More card */}
        <div className="min-w-[280px] w-[280px] snap-start group cursor-pointer opacity-70 hover:opacity-100 transition-opacity">
          <div className="relative bg-white rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] p-4 transition-all duration-300">
            <div className="aspect-square bg-surface-container-low rounded-lg mb-4 overflow-hidden relative flex items-center justify-center">
              <span className="material-symbols-outlined text-4xl text-tertiary">more_horiz</span>
            </div>
            <h3 className="text-body-md text-on-surface min-h-[48px] mb-2 font-medium text-center">
              신상품 더 보기
            </h3>
          </div>
        </div>
      </div>

      {/* Mobile: 2-column grid */}
      <div className="md:hidden grid grid-cols-2 gap-4 px-margin-mobile">
        {DUMMY_PRODUCTS.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}
