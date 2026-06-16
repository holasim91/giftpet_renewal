import { redirect } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { getOrderById } from '@/actions/order';
import { formatPhone } from '@/lib/format';

export default async function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ order_id?: string }>;
}) {
  const { order_id } = await searchParams;
  if (!order_id) redirect('/');

  const result = await getOrderById(order_id);
  if (!result.success) redirect('/');

  const order = result.data!;
  if (order.status === 'PENDING') redirect('/cart');

  const netSubtotal = order.totalAmount - order.shippingFee;
  const originalSubtotal = netSubtotal + order.discountAmount;
  const orderNumber = order.id.slice(0, 8).toUpperCase();
  const orderDate = new Date(order.createdAt).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="flex-grow w-full max-w-2xl mx-auto px-margin-mobile md:px-margin-desktop py-10 md:py-16">
      {/* 성공 헤더 */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary-fixed mb-5">
          <span className="material-symbols-outlined text-[40px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
        <h1 className="text-headline-md md:text-headline-lg font-bold text-on-surface mb-2">
          주문이 완료되었습니다!
        </h1>
        <p className="text-body-md text-on-surface-variant">
          주문번호:{' '}
          <span className="font-semibold text-on-surface">#{orderNumber}</span>
          <span className="mx-2 text-outline-variant">·</span>
          {orderDate}
        </p>
      </div>

      <div className="space-y-4">
        {/* 배송지 정보 */}
        <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <h2 className="flex items-center gap-2 text-headline-sm font-semibold mb-4">
            <span className="material-symbols-outlined text-primary text-[18px]">local_shipping</span>
            배송지 정보
          </h2>
          <div className="space-y-1 text-body-md">
            <p>
              <span className="text-on-surface-variant mr-3">수령인</span>
              <span className="font-semibold text-on-surface">{order.recipientName}</span>
            </p>
            <p>
              <span className="text-on-surface-variant mr-3">연락처</span>
              <span className="text-on-surface">{order.phone ? formatPhone(order.phone) : '-'}</span>
            </p>
            <p>
              <span className="text-on-surface-variant mr-3">주소</span>
              <span className="text-on-surface">
                {order.address}
                {order.addressDetail && `, ${order.addressDetail}`}{' '}
                ({order.zipCode})
              </span>
            </p>
            {order.deliveryMemo && (
              <p>
                <span className="text-on-surface-variant mr-3">요청사항</span>
                <span className="text-on-surface">{order.deliveryMemo}</span>
              </p>
            )}
          </div>
        </section>

        {/* 주문 상품 목록 */}
        <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <h2 className="flex items-center gap-2 text-headline-sm font-semibold mb-4">
            <span className="material-symbols-outlined text-primary text-[18px]">shopping_bag</span>
            주문 상품
            <span className="text-label-md font-normal text-on-surface-variant ml-1">
              {order.items.length}건
            </span>
          </h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                  <Image
                    src={item.imageUrl}
                    alt={item.productName}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="flex-grow min-w-0 flex flex-col justify-center">
                  <p className="text-label-md font-semibold text-on-surface line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-body-md text-on-surface-variant mt-0.5">수량: {item.quantity}</p>
                  <p className="text-label-md font-semibold text-primary mt-1">
                    {(item.price * item.quantity).toLocaleString()}원
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 결제 금액 요약 */}
        <section className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/30 shadow-[0px_4px_20px_rgba(0,0,0,0.05)]">
          <h2 className="flex items-center gap-2 text-headline-sm font-semibold mb-4">
            <span className="material-symbols-outlined text-primary text-[18px]">payments</span>
            결제 금액
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">총 상품금액</span>
              <span className="text-on-surface">{originalSubtotal.toLocaleString()}원</span>
            </div>
            <div className="flex justify-between text-body-md">
              <span className="text-on-surface-variant">배송비</span>
              <span className="text-on-surface">
                {order.shippingFee === 0 ? '무료' : `${order.shippingFee.toLocaleString()}원`}
              </span>
            </div>
            {order.discountAmount > 0 && (
              <div className="flex justify-between text-body-md">
                <span className="text-on-surface-variant">할인금액</span>
                <span className="text-error">-{order.discountAmount.toLocaleString()}원</span>
              </div>
            )}
            <div className="flex justify-between items-end pt-3 border-t border-outline-variant">
              <span className="text-headline-sm font-semibold text-on-surface">최종 결제금액</span>
              <span className="text-headline-md font-bold text-primary">
                {order.totalAmount.toLocaleString()}원
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* 버튼 */}
      <div className="flex gap-3 mt-8">
        <Link
          href="/shop"
          className="flex-1 py-4 text-center rounded-xl border border-outline-variant text-label-md font-semibold text-on-surface hover:bg-surface-container-low transition-colors"
        >
          쇼핑 계속하기
        </Link>
        <Link
          href="/mypage"
          className="flex-1 py-4 text-center rounded-xl bg-primary text-on-primary text-label-md font-semibold hover:opacity-90 transition-opacity"
        >
          주문 내역 보기
        </Link>
      </div>
    </main>
  );
}
