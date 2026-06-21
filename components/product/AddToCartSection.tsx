'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { addToCart } from '@/actions/cart';
import { useToast } from '@/components/ui/Toast';
import { useWishlist } from '@/components/wishlist/WishlistProvider';
import QuantityControl from '@/components/ui/QuantityControl';
import WishlistButton from '@/components/ui/WishlistButton';
import type { Product } from '@/types';

interface Props {
  product: Product;
}

export default function AddToCartSection({ product }: Props) {
  const [qty, setQty] = useState(1);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showToast } = useToast();
  const { isLoggedIn } = useWishlist();

  const totalPrice = (product.discountPrice ?? product.price) * qty;

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
      return;
    }
    startTransition(async () => {
      const result = await addToCart(product.id, qty);
      if (!result.success) {
        showToast('담기에 실패했습니다', 'error');
      } else {
        showToast('장바구니에 추가되었습니다', 'success');
        router.refresh();
      }
    });
  };

  const handleBuyNow = () => {
    if (!isLoggedIn) {
      router.push('/auth/login');
    }
  };

  return (
    <>
      {/* Desktop action box */}
      <div className="hidden md:flex flex-col gap-4 bg-surface-container-lowest p-6 rounded-xl border border-surface-variant shadow-sm">
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
        <div className="flex justify-between items-end pt-4 border-t border-surface-variant">
          <span className="text-body-md text-secondary">총 상품 금액</span>
          <div className="flex items-baseline gap-2">
            <span className="text-label-sm text-secondary">총 {qty}개</span>
            <span className="text-headline-md font-bold text-primary">
              ₩{totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="flex gap-3">
          <WishlistButton
            productId={product.id}
            className="w-12 h-12 flex items-center justify-center border border-surface-variant rounded-lg hover:border-primary-container"
            iconClassName=""
          />
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isPending}
            className="flex-1 h-12 bg-inverse-surface text-on-primary rounded-lg text-label-md hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {isPending ? '추가 중...' : '장바구니 담기'}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 h-12 bg-primary-container text-on-primary rounded-lg text-label-md hover:bg-primary transition-colors"
          >
            바로 구매
          </button>
        </div>
      </div>

      {/* Mobile sticky bottom bar */}
      <div className="md:hidden fixed bottom-0 left-0 w-full z-40 bg-surface-container-lowest border-t border-surface-variant shadow-[0px_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl">
        <div className="px-margin-mobile py-4 border-b border-surface-container bg-surface-bright">
          <div className="flex items-center justify-between">
            <span className="text-label-md text-on-surface">수량</span>
            <QuantityControl
              quantity={qty}
              onDecrease={() => setQty(Math.max(1, qty - 1))}
              onIncrease={() => setQty(qty + 1)}
              compact
            />
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
            onClick={handleBuyNow}
            className="flex-[2] py-3 px-4 rounded-lg bg-primary-container text-on-primary text-label-md font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all flex justify-center items-center"
          >
            바로 구매
          </button>
        </div>
      </div>
    </>
  );
}
