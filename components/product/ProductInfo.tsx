import type { Product } from '@/types';
import { PRODUCT_CATEGORY_LABELS, ANIMAL_CATEGORY_LABELS } from '@/types';
import { BADGE_STYLES } from '@/lib/constants';

interface Props {
  product: Product;
}

export default function ProductInfo({ product }: Props) {
  const animalLabel = product.animalCategory
    ? ANIMAL_CATEGORY_LABELS[product.animalCategory].toUpperCase()
    : null;
  const categoryLabel = [animalLabel, product.productCategory.toUpperCase()].filter(Boolean).join(' ');

  const specs = [
    { label: '배송비', value: '₩3,000 (₩100,000 이상 무료)' },
    { label: '카테고리', value: categoryLabel },
  ];

  return (
    <>
      {/* Desktop info */}
      <div className="hidden md:flex flex-col gap-6">
        <div className="pb-6 border-b border-surface-variant">
          {product.badges.length > 0 && (
            <div className="flex gap-2 mb-3">
              {product.badges.map((badge) => (
                <span
                  key={badge}
                  className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${BADGE_STYLES[badge] ?? 'bg-surface-container text-on-surface-variant'}`}
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
        <div className="flex flex-col gap-3 text-body-md text-on-surface-variant">
          {specs.map(({ label, value }) => (
            <div key={label} className="grid grid-cols-[110px_1fr] gap-4">
              <span className="text-secondary">{label}</span>
              <span className="text-on-surface">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile info card */}
      <div className="md:hidden px-margin-mobile py-6 bg-surface-container-lowest shadow-[0px_4px_20px_rgba(0,0,0,0.02)]">
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
        <div className="mt-6 border-t border-surface-variant pt-4 flex flex-col gap-3">
          {specs.map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center">
              <span className="text-body-md text-on-surface-variant">{label}</span>
              <span className="text-body-md text-on-surface font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
