import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { PRODUCT_CATEGORY_LABELS } from '@/types';
import { getCardBadge, BADGE_STYLES, BADGE_LABEL } from '@/lib/badge';
import { getDiscountRate } from '@/lib/price';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = product.price.toLocaleString();
  const isDiscontinued = !product.isActive;
  const isSoldByStock = product.stock === 0;
  const cartDisabled = isDiscontinued || isSoldByStock;
  const disabledLabel = isDiscontinued ? '판매종료' : '품절';

  const badge = getCardBadge(product);
  const soldOut = isDiscontinued || isSoldByStock;

  return (
    <Link
      href={`/shop/product/${product.id}`}
      className={[
        'group cursor-pointer',
        'bg-surface rounded-lg flex flex-col',
        'hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300',
        'md:bg-transparent md:rounded-none md:hover:shadow-none md:block',
        'md:min-w-[280px] md:w-[280px] md:snap-start',
        soldOut ? 'opacity-60' : '',
      ].join(' ')}
    >
      {/* Desktop inner card / Mobile passthrough */}
      <div
        className={[
          'flex flex-col flex-1 md:block',
          'md:relative md:bg-white md:rounded-xl',
          'md:shadow-[0px_4px_20px_rgba(0,0,0,0.05)]',
          'md:p-4',
          'md:group-hover:shadow-[0px_8px_30px_rgba(0,0,0,0.1)]',
          'md:group-hover:-translate-y-1',
          'md:transition-all md:duration-300',
        ].join(' ')}
      >
        {/* Image container */}
        <div className="relative aspect-square bg-surface-container-low overflow-hidden rounded-t-lg md:rounded-lg mb-3 md:mb-4">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            unoptimized
            className="object-cover mix-blend-multiply opacity-90 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 50vw, 280px"
          />

          {/* 배지 */}
          {badge && (
            <div className="absolute top-3 left-3 z-10">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${BADGE_STYLES[badge]}`}>
                {BADGE_LABEL[badge]}
              </span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col flex-grow px-1 pb-2 md:px-0 md:pb-0 md:flex-none">
          {/* Category label — mobile only */}
          <span className="md:hidden text-label-sm text-on-surface-variant uppercase mb-1">
            {PRODUCT_CATEGORY_LABELS[product.productCategory]}
          </span>

          {/* Product name */}
          <h4 className="text-body-md text-ellipsis text-on-surface line-clamp-2 mb-2 leading-tight md:min-h-[48px] md:font-medium">
            {product.name}
          </h4>

          {/* Bottom row */}
          <div className="mt-auto md:mt-4 flex items-center justify-between">
            {product.discountPrice ? (
              <div className="flex flex-col">
                <span className="text-[16px] md:text-headline-sm font-bold text-primary">
                  {product.discountPrice.toLocaleString()}원
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-label-sm text-tertiary line-through">
                    {formattedPrice}원
                  </span>
                  <span className="text-label-sm text-primary font-bold">
                    {getDiscountRate(product.price, product.discountPrice)}% 할인
                  </span>
                </div>
              </div>
            ) : (
              <span className="text-[16px] md:text-headline-sm text-on-surface font-bold">
                {formattedPrice}원
              </span>
            )}

            <AddToCartButton
              productId={product.id}
              disabled={cartDisabled}
              disabledLabel={disabledLabel}
            />
          </div>
        </div>
      </div>
    </Link>
  );
}
