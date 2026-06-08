import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';
import { PRODUCT_CATEGORY_LABELS } from '@/types';
import AddToCartButton from '@/components/ui/AddToCartButton';

interface ProductCardProps {
  product: Product;
}

function StockBadge({ stock }: { stock: number }) {
  if (stock === 0) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-surface-container-highest text-secondary">
        품절
      </span>
    );
  }
  if (stock <= 5) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-error text-on-primary">
        품절임박!
      </span>
    );
  }
  return null;
}

function StatusBadge({ badges }: { badges: string[] }) {
  if (badges.includes('BEST')) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-inverse-surface text-inverse-on-surface">
        BEST
      </span>
    );
  }
  if (badges.includes('NEW')) {
    return (
      <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider bg-primary-container text-on-primary">
        NEW
      </span>
    );
  }
  return null;
}

export default function ProductCard({ product }: ProductCardProps) {
  const formattedPrice = product.price.toLocaleString();
  const isSoldOut = product.stock === 0;
  const hasStockIssue = product.stock <= 5; // 0~5: 재고 배지 표시

  return (
    <Link
      href={`/shop/product/${product.id}`}
      className={[
        'group cursor-pointer',
        // Mobile: outer is the card
        'bg-surface rounded-lg flex flex-col',
        'hover:shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow duration-300',
        // Desktop: fixed-width carousel item
        'md:bg-transparent md:rounded-none md:hover:shadow-none md:block',
        'md:min-w-[280px] md:w-[280px] md:snap-start',
      ].join(' ')}
    >
      {/* Desktop inner card / Mobile passthrough */}
      <div
        className={[
          'flex flex-col flex-1 md:block',
          // Desktop inner card with shadow + padding
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

          {/* 좌측 상단 */}
          <div className="absolute top-3 left-3 z-10">
            {hasStockIssue ? (
              <StockBadge stock={product.stock} />
            ) : (
              <StatusBadge badges={product.badges} />
            )}
          </div>
          {/* 우측 상단: 재고 이슈 있을 때만 상태 배지 */}
          {hasStockIssue && (
            <div className="absolute top-3 right-3 z-10">
              <StatusBadge badges={product.badges} />
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
            {/* Mobile price */}
            <span className="md:hidden text-[16px] font-semibold text-on-surface">
              {formattedPrice}원
            </span>
            {/* Desktop price */}
            <span className="hidden md:inline text-headline-sm text-on-surface font-bold">
              {formattedPrice}원
            </span>

            {/* Mobile: favorite — div to avoid button-in-a nesting */}
            <div
              aria-label="Add to wishlist"
              className="md:hidden text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </div>

            {/* Desktop: Add to Cart */}
            <AddToCartButton productId={product.id} disabled={isSoldOut} />
          </div>
        </div>
      </div>
    </Link>
  );
}
