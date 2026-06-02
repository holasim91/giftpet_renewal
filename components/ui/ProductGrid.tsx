import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
}

const BADGE_STYLES: Record<string, string> = {
  NEW: 'bg-primary-container text-on-primary',
  BEST: 'bg-[#343434] text-white',
  HIT: 'bg-[#343434] text-white',
};

function ShopProductCard({ product }: { product: Product }) {
  return (
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

        {/* Badges */}
        {product.badges.length > 0 && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 flex flex-col gap-1.5">
            {product.badges.map((badge) => (
              <span
                key={badge}
                className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${BADGE_STYLES[badge] ?? 'bg-surface-variant text-on-surface'}`}
              >
                {badge}
              </span>
            ))}
          </div>
        )}

        {/* Desktop: favorite icon (hover) — div to avoid button-in-a nesting */}
        <div
          aria-label="Add to wishlist"
          className="hidden md:flex absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-secondary opacity-0 group-hover:opacity-100 transition-opacity hover:text-primary-container cursor-pointer"
        >
          <span className="material-symbols-outlined text-[20px]">favorite</span>
        </div>

        {/* Desktop: Quick Add to Cart (slides up on hover) */}
        <div className="hidden md:block absolute bottom-0 left-0 w-full p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="w-full bg-primary text-white py-3 rounded-lg font-medium text-sm flex justify-center items-center gap-2 shadow-md cursor-pointer">
            <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
            Add to Cart
          </div>
        </div>
      </div>

      {/* Product info */}
      <div className="mt-3 space-y-1 md:p-4 md:mt-0">
        <p className="text-label-sm text-on-surface-variant">{product.category}</p>
        <h3 className="text-body-md text-on-surface line-clamp-2 overflow-hidden text-ellipsis leading-snug">
          {product.name}
        </h3>
        <p className="text-headline-sm text-on-surface font-bold mt-2">
          {product.price.toLocaleString()}원
        </p>
      </div>
    </Link>
  );
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
      {products.map((product) => (
        <ShopProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
