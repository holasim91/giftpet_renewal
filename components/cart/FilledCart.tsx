import Image from 'next/image';
import Link from 'next/link';
import ConfirmModal from '@/components/ui/ConfirmModal';
import AlertModal from '@/components/ui/AlertModal';
import QuantityControl from '@/components/ui/QuantityControl';
import { getDiscountRate } from '@/lib/price';
import type { Product } from '@/types';
import type { CartState } from '@/hooks/useCart';
import OrderSummary from './OrderSummary';
import SuggestionsSection from './SuggestionsSection';

interface Props extends CartState {
  suggestions: Product[];
}

export default function FilledCart({
  optimisticItems,
  checked,
  quantityPendingIds,
  deletePendingIds,
  isSelectedDeleting,
  pendingDelete,
  stockAlertOpen,
  activeItems,
  subtotal,
  discount,
  shippingFee,
  total,
  allChecked,
  toggleAll,
  toggleOne,
  handleRemove,
  handleRemoveSelected,
  confirmDelete,
  handleQuantity,
  handleOrder,
  isOrdering,
  cancelDelete,
  closeStockAlert,
  suggestions,
}: Props) {
  return (
    <main className="pb-28 md:pb-0">
      <div className="max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
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
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-label-sm text-secondary line-through">
                                {item.product.price.toLocaleString()}원
                              </span>
                              <span className="text-label-sm text-primary font-bold">
                                {getDiscountRate(item.product.price, item.product.discountPrice)}% 할인
                              </span>
                            </div>
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
                          <div>
                            <span className="text-headline-sm font-bold text-primary">
                              {effectivePrice.toLocaleString()}원
                            </span>
                            {item.product.discountPrice && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-label-sm text-tertiary line-through">
                                  {item.product.price.toLocaleString()}원
                                </span>
                                <span className="text-label-sm text-primary font-bold">
                                  {getDiscountRate(item.product.price, item.product.discountPrice)}% 할인
                                </span>
                              </div>
                            )}
                          </div>
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
              onOrder={handleOrder}
              isOrdering={isOrdering}
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
            onClick={handleOrder}
            disabled={isOrdering}
            className="flex-1 h-14 bg-primary text-on-primary text-headline-sm rounded-xl flex items-center justify-center hover:brightness-110 active:scale-[0.97] transition-all shadow-lg shadow-primary/20 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isOrdering ? '처리 중...' : '주문하기'}
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
        onCancel={cancelDelete}
      />
      <AlertModal
        isOpen={stockAlertOpen}
        message="구매 가능한 수량을 초과했습니다."
        onClose={closeStockAlert}
      />
    </main>
  );
}
