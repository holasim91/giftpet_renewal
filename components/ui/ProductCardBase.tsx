import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { PRODUCT_CATEGORY_LABELS } from '@/types';
import { getCardBadge, BADGE_STYLES, BADGE_LABEL } from '@/lib/badge';
import { getDiscountRate } from '@/lib/price';

interface ProductCardBaseProps {
  product: Product;
  children?: React.ReactNode;
  showQuickAdd?: boolean;
}

export default function ProductCardBase({ product, children, showQuickAdd = false }: ProductCardBaseProps) {
  const isDiscontinued = !product.isActive;
  const isSoldByStock = product.stock === 0;
  const soldOut = isDiscontinued || isSoldByStock;

  const badge = getCardBadge(product);
  const quickAddLabel = isDiscontinued ? '판매종료' : isSoldByStock ? '품절' : 'Add to Cart';

  return (
    <div className={soldOut ? 'opacity-60' : ''}>
      <Link href={`/shop/product/${product.id}`} className="group block">
        {/* Image container */}
        <div className="relative w-full aspect-square md:aspect-[4/5] bg-surface-container-low rounded-xl overflow-hidden shadow-[0px_4px_20px_rgba(0,0,0,0.05)] group-hover:-translate-y-1 group-hover:shadow-[0px_8px_24px_rgba(0,0,0,0.08)] transition-all duration-300">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 25vw"
          />

          {/* 배지 */}
          {badge && (
            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10">
              <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${BADGE_STYLES[badge]}`}>
                {BADGE_LABEL[badge]}
              </span>
            </div>
          )}

          {/* Quick Add (ProductGrid 전용) */}
          {showQuickAdd && (
            <div className="hidden md:block absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <div className={`w-full py-3 rounded-lg font-medium text-sm flex justify-center items-center gap-2 shadow-md ${soldOut ? 'bg-surface-container text-tertiary cursor-not-allowed' : 'bg-primary text-white cursor-pointer'}`}>
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                {quickAddLabel}
              </div>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="mt-3 space-y-1 md:p-4 md:mt-0">
          <p className="text-label-sm text-on-surface-variant">{PRODUCT_CATEGORY_LABELS[product.productCategory]}</p>
          <h3 className="text-body-md text-on-surface line-clamp-2 overflow-hidden text-ellipsis leading-snug">
            {product.name}
          </h3>
          {product.discountPrice ? (
            <div className="mt-2 space-y-0.5">
              <p className="text-headline-sm text-primary font-bold">
                {product.discountPrice.toLocaleString()}원
              </p>
              <div className="flex items-center gap-1.5">
                <span className="text-label-sm text-tertiary line-through">
                  {product.price.toLocaleString()}원
                </span>
                <span className="text-label-sm text-primary font-bold">
                  {getDiscountRate(product.price, product.discountPrice)}% 할인
                </span>
              </div>
            </div>
          ) : (
            <p className="text-headline-sm text-on-surface font-bold mt-2">
              {product.price.toLocaleString()}원
            </p>
          )}
        </div>
      </Link>

      {children}
    </div>
  );
}
