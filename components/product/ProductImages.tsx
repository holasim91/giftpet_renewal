'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/types';
import { getCardBadge, BADGE_STYLES, BADGE_LABEL } from '@/lib/badge';

interface Props {
  product: Product;
}

export default function ProductImages({ product }: Props) {
  const [activeThumb, setActiveThumb] = useState(0);
  const thumbnails = [product.imageUrl];
  const badge = getCardBadge(product);

  return (
    <>
      {/* Desktop gallery */}
      <div className="hidden md:flex flex-col gap-4">
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

      {/* Mobile hero */}
      <div className="md:hidden w-full aspect-square bg-surface-container-low relative overflow-hidden">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        {badge && (
          <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-label-sm uppercase tracking-wider shadow-sm font-bold ${BADGE_STYLES[badge]}`}>
            {BADGE_LABEL[badge]}
          </div>
        )}
      </div>
    </>
  );
}
