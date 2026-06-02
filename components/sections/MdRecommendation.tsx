import Image from 'next/image';
import CircularItem from '@/components/ui/CircularItem';
import type { Product, CircularRecommendation } from '@/types';

const BG_COLORS = [
  'bg-primary-fixed',
  'bg-primary-fixed-dim',
  'bg-outline-variant',
  'bg-surface-container',
];

interface MdRecommendationProps {
  products: Product[];
}

export default function MdRecommendation({ products }: MdRecommendationProps) {
  const items: CircularRecommendation[] = products.map((p, i) => ({
    id: p.id,
    label: p.name,
    imageUrl: p.imageUrl,
    bgColor: BG_COLORS[i % BG_COLORS.length],
  }));

  if (items.length === 0) return null;

  return (
    <>
      {/* Desktop */}
      <section className="hidden md:block bg-surface-container-lowest py-8 rounded-2xl">
        <h2 className="text-headline-md text-on-surface mb-8 text-center">
          MD 추천
        </h2>
        <div className="flex justify-center items-center space-x-12 px-4">
          <button
            type="button"
            aria-label="이전"
            className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center hover:border-primary-container hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">chevron_left</span>
          </button>
          {items.map((item) => (
            <CircularItem key={item.id} item={item} />
          ))}
          <button
            type="button"
            aria-label="다음"
            className="w-10 h-10 rounded-full border border-surface-container-high flex items-center justify-center hover:border-primary-container hover:text-primary-container transition-colors"
          >
            <span className="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Mobile */}
      <section className="md:hidden py-8 bg-surface-container-lowest">
        <div className="px-margin-mobile mb-4">
          <h3 className="text-headline-sm text-on-surface">MD 추천</h3>
          <p className="text-body-md text-[14px] text-on-surface-variant mt-1">
            이 계절에 딱 맞는 MD 엄선 상품
          </p>
        </div>
        <div className="pl-margin-mobile flex space-x-6 overflow-x-auto no-scrollbar pb-4 pr-margin-mobile">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col items-center flex-shrink-0 w-24">
              <div className="w-20 h-20 rounded-full bg-surface-container overflow-hidden mb-3 shadow-sm border border-outline-variant/30">
                <Image
                  src={item.imageUrl}
                  alt={item.label}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-label-md text-on-surface text-center leading-tight">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
