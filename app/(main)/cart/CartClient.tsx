'use client';

import { useOptimistic, useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  removeFromCart,
  removeSelectedFromCart,
  updateCartQuantity,
  type CartItemWithProduct,
} from '@/actions/cart';
import { useToast } from '@/components/ui/Toast';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AlertModal from '@/components/ui/AlertModal';
import QuantityControl from '@/components/ui/QuantityControl';
import type { Product } from '@/types';

const SHIPPING_FEE = 3000;
const FREE_SHIPPING_THRESHOLD = 100000;

interface Props {
  initialItems: CartItemWithProduct[];
  suggestions: Product[];
}

export default function CartClient({ initialItems, suggestions }: Props) {
  const [items, setItems] = useState(initialItems);
  const [optimisticItems, addOptimistic] = useOptimistic(
    items,
    (state, { cartId, newQty }: { cartId: string; newQty: number }) =>
      state.map((i) => (i.id === cartId ? { ...i, quantity: newQty } : i)),
  );
  // 비활성 상품은 초기 checked에서 제외
  const [checked, setChecked] = useState<Set<string>>(
    new Set(initialItems.filter((i) => i.product.isActive).map((i) => i.id)),
  );
  const [, startTransition] = useTransition(); // addOptimistic 전용
  const [quantityPendingIds, setQuantityPendingIds] = useState<Set<string>>(new Set());
  const [deletePendingIds, setDeletePendingIds] = useState<Set<string>>(new Set());
  const [isSelectedDeleting, setIsSelectedDeleting] = useState(false);
  const { showToast } = useToast();

  type PendingDelete =
    | { type: 'single'; cartId: string }
    | { type: 'selected'; count: number };
  const [pendingDelete, setPendingDelete] = useState<PendingDelete | null>(null);
  const [stockAlertOpen, setStockAlertOpen] = useState(false);

  // 활성 상품만 선택 대상으로 계산
  const activeItems = optimisticItems.filter((i) => i.product.isActive);

  // 합계 계산: 체크된 항목 중 활성 상품만 (isActive false는 checked에 들어갈 수 없어 자연 제외)
  const selectedItems = optimisticItems.filter((i) => checked.has(i.id));
  const subtotal = selectedItems.reduce(
    (sum, i) => sum + (i.product.discountPrice ?? i.product.price) * i.quantity,
    0,
  );
  const discount = selectedItems.reduce(
    (sum, i) =>
      i.product.discountPrice
        ? sum + (i.product.price - i.product.discountPrice) * i.quantity
        : sum,
    0,
  );
  const shippingFee = subtotal === 0 ? 0 : subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shippingFee;

  const allChecked = activeItems.length > 0 && checked.size === activeItems.length;

  const toggleAll = (v: boolean) =>
    setChecked(v ? new Set(activeItems.map((i) => i.id)) : new Set());

  const toggleOne = (id: string) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const handleRemove = (cartId: string) => {
    setPendingDelete({ type: 'single', cartId });
  };

  const handleRemoveSelected = () => {
    if (checked.size === 0) return;
    setPendingDelete({ type: 'selected', count: checked.size });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.type === 'single') {
      const { cartId } = pendingDelete;
      setPendingDelete(null);
      setDeletePendingIds((prev) => new Set(prev).add(cartId));
      void (async () => {
        try {
          await removeFromCart(cartId);
          setItems((prev) => prev.filter((i) => i.id !== cartId));
          setChecked((prev) => {
            const next = new Set(prev);
            next.delete(cartId);
            return next;
          });
          showToast('상품이 삭제되었습니다', 'success');
        } finally {
          setDeletePendingIds((prev) => {
            const next = new Set(prev);
            next.delete(cartId);
            return next;
          });
        }
      })();
    } else {
      const ids = Array.from(checked);
      setPendingDelete(null);
      setIsSelectedDeleting(true);
      void (async () => {
        try {
          await removeSelectedFromCart(ids);
          setItems((prev) => prev.filter((i) => !ids.includes(i.id)));
          setChecked(new Set());
          showToast('선택한 상품이 삭제되었습니다', 'success');
        } finally {
          setIsSelectedDeleting(false);
        }
      })();
    }
  };

  const handleQuantity = (cartId: string, newQty: number) => {
    if (newQty < 1) return;
    const stock = items.find((i) => i.id === cartId)?.product.stock ?? Infinity;
    if (newQty > stock) {
      setStockAlertOpen(true);
      return;
    }
    setQuantityPendingIds((prev) => new Set(prev).add(cartId));
    startTransition(async () => {
      addOptimistic({ cartId, newQty });
      const result = await updateCartQuantity(cartId, newQty);
      if (result.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === cartId ? { ...i, quantity: newQty } : i)),
        );
      }
      setQuantityPendingIds((prev) => {
        const next = new Set(prev);
        next.delete(cartId);
        return next;
      });
    });
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (items.length === 0) {
    return (
      <main className="min-h-[60vh]">
        {/* Empty cart message */}
        <div className="flex flex-col items-center justify-center py-20 px-margin-mobile text-center gap-6">
          <div className="w-28 h-28 bg-surface-container rounded-full flex items-center justify-center">
            <span className="material-symbols-outlined text-6xl text-surface-dim">
              shopping_cart
            </span>
          </div>
          <div>
            <h1 className="text-headline-md text-on-surface mb-2">
              장바구니에 담긴 상품이 없습니다.
            </h1>
            <p className="text-body-md text-secondary">
              GIFT PET의 다양한 상품을 확인하고 장바구니에 담아보세요!
            </p>
          </div>
          <Link
            href="/shop"
            className="mt-2 px-8 py-4 bg-primary text-on-primary rounded-lg text-label-md hover:bg-primary-container hover:text-on-primary-container transition-colors shadow-sm"
          >
            쇼핑하러 가기
          </Link>
        </div>

        {/* 추천 상품 */}
        <SuggestionsSection products={suggestions} />
      </main>
    );
  }

  // ── Filled state ─────────────────────────────────────────────────────────
  return (
    <main className="pb-28 md:pb-0">
      <div className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
        {/* Page title */}
        <h1 className="text-headline-lg-mobile md:text-headline-xl mb-8 md:mb-12">
          장바구니 ({optimisticItems.length})
        </h1>

        <div className="flex flex-col lg:flex-row gap-gutter">
          {/* ── Left: Cart items ─────────────────────────────────────── */}
          <div className="w-full lg:w-2/3 flex flex-col gap-base">

            {/* Mobile: 전체선택 + 선택 삭제 */}
            <div className="flex items-center justify-between py-3 border-b border-surface-container-highest md:hidden">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="w-5 h-5 rounded border-outline text-primary focus:ring-primary"
                />
                <span className="text-label-md text-on-surface">
                  전체 선택 ({checked.size}/{activeItems.length})
                </span>
              </label>
              <button
                type="button"
                onClick={handleRemoveSelected}
                disabled={checked.size === 0 || isSelectedDeleting}
                className="text-label-md text-secondary hover:text-error transition-colors"
              >
                선택 삭제
              </button>
            </div>

            {/* Desktop: Table header */}
            <div className="hidden md:flex bg-surface-container p-4 rounded-lg items-center text-label-md text-secondary uppercase">
              <div className="w-12 flex justify-center">
                <input
                  type="checkbox"
                  checked={allChecked}
                  onChange={(e) => toggleAll(e.target.checked)}
                  className="rounded border-outline text-primary focus:ring-primary"
                />
              </div>
              <div className="flex-1 px-4">상품정보</div>
              <div className="w-32 text-center">수량</div>
              <div className="w-32 text-center">상품금액</div>
              <div className="w-12" />
            </div>

            {/* Cart items */}
            {optimisticItems.map((item) => {
              const isInactive = !item.product.isActive;
              const effectivePrice = item.product.discountPrice ?? item.product.price;
              return (
                <div
                  key={item.id}
                  className={`bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] transition-shadow ${isInactive ? 'opacity-60' : 'hover:shadow-[0px_8px_30px_rgba(0,0,0,0.1)]'}`}
                >
                  {/* Desktop row */}
                  <div className="hidden md:flex p-6 items-center">
                    <div className="w-12 flex justify-center">
                      <input
                        type="checkbox"
                        checked={!isInactive && checked.has(item.id)}
                        onChange={() => !isInactive && toggleOne(item.id)}
                        disabled={isInactive}
                        className="rounded border-outline text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </div>
                    <Link
                      href={`/shop/product/${item.product.id}`}
                      className="flex-1 px-4 flex items-center gap-6 hover:opacity-80 transition-opacity"
                    >
                      <div className="w-24 h-24 bg-surface-container-low rounded-lg overflow-hidden flex-shrink-0 relative">
                        <Image
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-body-md font-semibold mb-1 line-clamp-2">
                          {item.product.name}
                        </p>
                        {isInactive ? (
                          <p className="text-label-sm text-error font-medium">판매 종료된 상품입니다</p>
                        ) : (
                          item.product.discountPrice && (
                            <p className="text-label-sm text-secondary line-through">
                              {item.product.price.toLocaleString()}원
                            </p>
                          )
                        )}
                      </div>
                    </Link>
                    <div className="w-32 flex justify-center">
                      {isInactive ? (
                        <span className="text-label-sm text-tertiary">—</span>
                      ) : (
                        <QuantityControl
                          quantity={item.quantity}
                          onDecrease={() => handleQuantity(item.id, item.quantity - 1)}
                          onIncrease={() => handleQuantity(item.id, item.quantity + 1)}
                          disabled={quantityPendingIds.has(item.id)}
                        />
                      )}
                    </div>
                    <div className="w-32 text-center">
                      {isInactive ? (
                        <span className="text-label-sm text-tertiary">—</span>
                      ) : (
                        <span className="text-headline-sm font-bold">
                          {(effectivePrice * item.quantity).toLocaleString()}원
                        </span>
                      )}
                    </div>
                    <div className="w-12 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemove(item.id)}
                        disabled={deletePendingIds.has(item.id)}
                        aria-label="삭제"
                        className="text-secondary hover:text-error transition-colors"
                      >
                        <span className="material-symbols-outlined">close</span>
                      </button>
                    </div>
                  </div>

                  {/* Mobile card */}
                  <div className="md:hidden p-4 flex gap-3 relative">
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      disabled={deletePendingIds.has(item.id)}
                      aria-label="삭제"
                      className="absolute top-2 right-2 text-outline hover:text-error transition-colors"
                    >
                      <span className="material-symbols-outlined text-[20px]">close</span>
                    </button>
                    <div className="pt-1">
                      <input
                        type="checkbox"
                        checked={!isInactive && checked.has(item.id)}
                        onChange={() => !isInactive && toggleOne(item.id)}
                        disabled={isInactive}
                        className="w-5 h-5 rounded border-outline text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-40"
                      />
                    </div>
                    <Link
                      href={`/shop/product/${item.product.id}`}
                      className="w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container-low relative hover:opacity-80 transition-opacity"
                    >
                      <Image
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 flex flex-col justify-between min-w-0">
                      <Link
                        href={`/shop/product/${item.product.id}`}
                        className="text-body-md font-semibold line-clamp-2 pr-6 hover:text-primary transition-colors"
                      >
                        {item.product.name}
                      </Link>
                      {isInactive ? (
                        <p className="text-label-sm text-error font-medium mt-2">판매 종료된 상품입니다</p>
                      ) : (
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-headline-sm font-bold text-primary">
                            {effectivePrice.toLocaleString()}원
                          </span>
                          <QuantityControl
                            quantity={item.quantity}
                            onDecrease={() => handleQuantity(item.id, item.quantity - 1)}
                            onIncrease={() => handleQuantity(item.id, item.quantity + 1)}
                            disabled={quantityPendingIds.has(item.id)}
                            compact
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Desktop: Bottom controls */}
            <div className="hidden md:flex justify-between mt-4">
              <button
                type="button"
                onClick={handleRemoveSelected}
                disabled={checked.size === 0 || isSelectedDeleting}
                className="px-6 py-3 border border-outline-variant rounded-lg text-label-md font-bold hover:bg-surface-container-high transition-colors"
              >
                선택상품 삭제
              </button>
              <Link
                href="/shop"
                className="px-6 py-3 border border-outline-variant rounded-lg text-label-md font-bold hover:bg-surface-container-high transition-colors"
              >
                쇼핑 계속하기
              </Link>
            </div>
          </div>

          {/* ── Right: Order summary (desktop) ───────────────────────── */}
          <div className="hidden lg:block w-full lg:w-1/3">
            <OrderSummary
              subtotal={subtotal}
              discount={discount}
              shippingFee={shippingFee}
              total={total}
            />
          </div>
        </div>

        {/* Mobile: Order summary card */}
        <div className="lg:hidden mt-6 bg-surface-container-low rounded-xl p-6">
          <h2 className="text-label-md text-on-surface-variant uppercase mb-4">결제 예정 금액</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between text-body-md text-secondary">
              <span>주문금액</span>
              <span>{subtotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-body-md text-secondary">
              <span>배송비</span>
              <span>{shippingFee.toLocaleString()}원</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-body-md text-primary">
                <span>상품 할인</span>
                <span>-{discount.toLocaleString()}원</span>
              </div>
            )}
            <div className="mt-2 pt-4 border-t border-outline-variant flex justify-between items-center">
              <span className="text-headline-sm font-bold">총 결제 금액</span>
              <span className="text-headline-md font-bold text-primary">
                {total.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 함께 구매하면 좋은 상품 */}
      <SuggestionsSection products={suggestions} />

      {/* Mobile: sticky bottom bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface-container-lowest border-t border-surface-container-highest px-margin-mobile py-4">
        <div className="flex items-center gap-4 max-w-container mx-auto">
          <div className="flex-shrink-0">
            <p className="text-label-sm text-secondary">총 {checked.size}건</p>
            <p className="text-headline-sm font-bold text-primary">
              {total.toLocaleString()}원
            </p>
          </div>
          <button
            type="button"
            className="flex-1 h-14 bg-primary text-on-primary font-headline-sm rounded-xl flex items-center justify-center hover:brightness-110 active:scale-[0.97] transition-all shadow-lg shadow-primary/20"
          >
            주문하기
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={pendingDelete !== null}
        message={
          pendingDelete?.type === 'selected'
            ? `선택한 ${pendingDelete.count}개 상품을 삭제하시겠습니까?`
            : '상품을 장바구니에서 삭제하시겠습니까?'
        }
        isPending={isSelectedDeleting || deletePendingIds.size > 0}
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
      <AlertModal
        isOpen={stockAlertOpen}
        message="구매 가능한 수량을 초과했습니다."
        onClose={() => setStockAlertOpen(false)}
      />
    </main>
  );
}

// ── Order Summary (데스크톱 우측 sticky) ──────────────────────────────────────
function OrderSummary({
  subtotal,
  discount,
  shippingFee,
  total,
}: {
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
}) {
  return (
    <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] sticky top-32 border border-surface-container-high">
      <h2 className="text-headline-sm font-bold mb-8">주문 요약</h2>
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-body-md text-secondary">총 상품금액</span>
          <span className="text-body-lg font-bold whitespace-nowrap">{subtotal.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between items-start">
          <div>
            <span className="text-body-md text-secondary">배송비</span>
            {shippingFee > 0 && (
              <p className="text-[10px] text-tertiary mt-1">10만원 이상 결제 시 무료</p>
            )}
            {shippingFee === 0 && subtotal >= FREE_SHIPPING_THRESHOLD && (
              <p className="text-[10px] text-primary mt-1">무료배송 적용!</p>
            )}
          </div>
          <span className="text-body-lg font-bold whitespace-nowrap">
            {shippingFee === 0 && subtotal >= FREE_SHIPPING_THRESHOLD
              ? '무료'
              : `${shippingFee.toLocaleString()}원`}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-body-md text-secondary">할인금액</span>
          <span className="text-body-lg font-bold whitespace-nowrap">
            {discount > 0 ? `-${discount.toLocaleString()}원` : '-0원'}
          </span>
        </div>
      </div>
      <hr className="border-surface-container-highest mb-8" />
      <div className="flex justify-between items-center mb-10">
        <span className="text-headline-sm font-bold whitespace-nowrap">총 결제금액</span>
        <span className="text-headline-md font-bold text-primary whitespace-nowrap">
          {total.toLocaleString()}원
        </span>
      </div>
      <button
        type="button"
        className="w-full bg-primary text-on-primary py-5 rounded-xl font-headline-sm hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
      >
        주문하기
      </button>
    </div>
  );
}

// ── Suggestions section ───────────────────────────────────────────────────────
function SuggestionsSection({ products }: { products: Product[] }) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 md:mt-24 px-margin-mobile md:px-margin-desktop max-w-container mx-auto">
      <h3 className="text-headline-md font-bold mb-6 md:mb-8">함께 구매하면 좋은 상품</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link key={product.id} href={`/shop/product/${product.id}`} className="group">
            <div className="aspect-square bg-surface-container rounded-2xl overflow-hidden mb-3 md:mb-4 relative">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                unoptimized
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              {product.badges[0] && (
                <span className="absolute top-2 left-2 bg-primary-container text-on-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {product.badges[0]}
                </span>
              )}
            </div>
            <h4 className="text-body-md font-semibold mb-1 line-clamp-1">{product.name}</h4>
            <p className="text-headline-sm font-bold">
              {(product.discountPrice ?? product.price).toLocaleString()}원
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
