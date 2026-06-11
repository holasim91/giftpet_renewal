'use client';

import { useState, useTransition } from 'react';
import { addToCart } from '@/actions/cart';
import { useToast } from '@/components/ui/Toast';
import ProductCardBase from '@/components/ui/ProductCardBase';
import type { Product } from '@/types';

interface Props {
  products: Product[];
}

const isSoldOut = (p: Product) => !p.isActive || p.stock === 0;

export default function WishlistClient({ products }: Props) {
  const addableIds = products.filter((p) => !isSoldOut(p)).map((p) => p.id);

  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [cardPendingIds, setCardPendingIds] = useState<Set<string>>(new Set());
  const [isBulkPending, startBulk] = useTransition();
  const { showToast } = useToast();

  const allChecked = addableIds.length > 0 && checked.size === addableIds.length;

  const toggleAll = (v: boolean) => setChecked(v ? new Set(addableIds) : new Set());

  const toggleOne = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleAddOne = (productId: string) => {
    setCardPendingIds((prev) => new Set(prev).add(productId));
    startBulk(async () => {
      const result = await addToCart(productId, 1);
      setCardPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      if (result.success) {
        setChecked((prev) => new Set(prev).add(productId));
        showToast('장바구니에 추가되었습니다', 'success');
      } else {
        showToast('담기에 실패했습니다', 'error');
      }
    });
  };

  const handleAddSelected = () => {
    const ids = [...checked];
    if (ids.length === 0) return;
    startBulk(async () => {
      const results = await Promise.all(ids.map((id) => addToCart(id, 1)));
      const failed = results.filter((r) => !r.success).length;
      if (failed === 0) showToast('장바구니에 추가되었습니다', 'success');
      else showToast(`${failed}개 상품을 담지 못했습니다`, 'error');
    });
  };

  return (
    <>
      {/* Toolbar: 전체 선택 + 선택 담기 */}
      <div className="flex items-center justify-between py-3 mb-4 border-b border-surface-variant">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={(e) => toggleAll(e.target.checked)}
            disabled={addableIds.length === 0}
            className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
          />
          <span className="text-label-md text-on-surface">
            전체 선택 ({checked.size}/{addableIds.length})
          </span>
        </label>
        <button
          type="button"
          onClick={handleAddSelected}
          disabled={checked.size === 0 || isBulkPending}
          className="px-4 py-2 rounded-lg bg-primary text-on-primary text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          선택 상품 장바구니 담기
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-gutter">
        {products.map((product) => {
          const soldOut = isSoldOut(product);
          const cardPending = cardPendingIds.has(product.id);

          return (
            <ProductCardBase key={product.id} product={product}>
              <div className="mt-3 md:px-4 flex items-center gap-3">
                <input
                  type="checkbox"
                  aria-label="상품 선택"
                  checked={checked.has(product.id)}
                  onChange={() => !soldOut && toggleOne(product.id)}
                  disabled={soldOut}
                  className="w-5 h-5 shrink-0 rounded border-outline text-primary focus:ring-primary disabled:opacity-40"
                />
                <button
                  type="button"
                  onClick={() => handleAddOne(product.id)}
                  disabled={soldOut || cardPending}
                  className="flex-1 py-2.5 rounded-lg border border-outline-variant text-on-surface text-label-md flex justify-center items-center gap-1.5 hover:bg-surface-container-low active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
                >
                  <span className="material-symbols-outlined text-[18px]!">shopping_cart</span>
                  {soldOut ? '품절' : cardPending ? '담는 중...' : '장바구니 담기'}
                </button>
              </div>
            </ProductCardBase>
          );
        })}
      </div>
    </>
  );
}
