'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useToast } from '@/components/ui/Toast';
import { confirmOrder } from '@/actions/order';
import type { ShippingData, PendingOrderForCheckout } from '@/actions/order';
import { formatPhone } from '@/lib/format';
import { FREE_SHIPPING_THRESHOLD } from '@/lib/constants';
import type { ShippingAddress } from '@/types';

type Tab = 'saved' | 'new';

const DELIVERY_MEMO_OPTIONS = [
  '문 앞에 놓아주세요',
  '경비실에 맡겨주세요',
  '직접 받겠습니다',
  '택배함에 넣어주세요',
  '배송 전 연락 바랍니다',
];

type NewAddressForm = {
  recipientName: string;
  phone: string;
  zipCode: string;
  address: string;
  addressDetail: string;
};

interface Props {
  orderId: string;
  order: PendingOrderForCheckout;
  shippingAddresses: ShippingAddress[];
}

export default function CheckoutClient({ orderId, order, shippingAddresses }: Props) {
  const router = useRouter();
  const { showToast } = useToast();

  const defaultTab: Tab = shippingAddresses.length > 0 ? 'saved' : 'new';
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    shippingAddresses.find((a) => a.isDefault)?.id ?? shippingAddresses[0]?.id ?? null,
  );
  const [memoOption, setMemoOption] = useState('');
  const [customMemo, setCustomMemo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<NewAddressForm>();

  const watchedZipCode = watch('zipCode', '');

  // 총 상품금액(정가 기준) = 순소계 + 할인금액
  const netSubtotal = order.totalAmount - order.shippingFee;
  const originalSubtotal = netSubtotal + order.discountAmount;
  const remainingForFree = FREE_SHIPPING_THRESHOLD - netSubtotal;

  const openPostcode = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        setValue('zipCode', data.zonecode, { shouldValidate: true });
        setValue('address', data.roadAddress || data.jibunAddress, { shouldValidate: true });
      },
    }).open();
  };

  const processPayment = async (shippingData: ShippingData) => {
    setIsSubmitting(true);
    try {
      const memo =
        memoOption === 'custom' ? (customMemo.trim() || undefined) : (memoOption || undefined);
      const result = await confirmOrder(orderId, shippingData, memo);
      if (result.success) {
        router.push(`/order/complete?order_id=${orderId}`);
      } else {
        showToast(result.error, 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePayment = () => {
    if (activeTab === 'saved') {
      const selected = shippingAddresses.find((a) => a.id === selectedAddressId);
      if (!selected) {
        showToast('배송지를 선택해주세요.', 'error');
        return;
      }
      processPayment({
        recipientName: selected.recipientName,
        phone: selected.phone,
        zipCode: selected.zipCode,
        address: selected.address,
        addressDetail: selected.addressDetail ?? undefined,
      });
    } else {
      handleSubmit((data) =>
        processPayment({
          recipientName: data.recipientName,
          phone: data.phone,
          zipCode: data.zipCode,
          address: data.address,
          addressDetail: data.addressDetail || undefined,
        }),
      )();
    }
  };

  const inputCls =
    'w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:outline-none bg-surface-container-lowest text-body-md transition-colors';
  const readonlyCls =
    'px-4 py-3 rounded-lg border border-outline-variant bg-surface-container-low text-body-md outline-none';
  const labelCls = 'block text-label-md font-semibold text-on-surface-variant mb-1';

  return (
    <main className="flex-grow w-full max-w-container mx-auto px-margin-mobile md:px-margin-desktop py-8 md:py-12">
      <h1 className="text-headline-md md:text-headline-lg font-bold text-on-surface mb-8">
        주문/결제
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* ── 좌측: 배송지 + 요청사항 ── */}
        <div className="lg:col-span-8 space-y-6">
          <section className="bg-surface-container-lowest rounded-xl p-6 md:p-8 shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30">
            {/* 헤더 */}
            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-primary text-[20px]">
                local_shipping
              </span>
              <h2 className="text-headline-sm font-semibold">배송지 정보</h2>
            </div>

            {/* 탭 */}
            <div className="flex border-b border-outline-variant mb-6">
              {(['saved', 'new'] as Tab[]).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-3 text-label-md font-semibold tracking-widest border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary text-primary'
                      : 'border-transparent text-on-surface-variant hover:text-primary'
                  }`}
                >
                  {tab === 'saved' ? '기존 배송지' : '신규 배송지'}
                </button>
              ))}
            </div>

            {/* 기존 배송지 목록 */}
            {activeTab === 'saved' && (
              <div className="space-y-3">
                {shippingAddresses.length === 0 ? (
                  <p className="py-6 text-center text-body-md text-on-surface-variant">
                    저장된 배송지가 없습니다.
                  </p>
                ) : (
                  shippingAddresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border cursor-pointer transition-colors ${
                        selectedAddressId === addr.id
                          ? 'border-primary bg-surface-container-low/50'
                          : 'border-outline-variant hover:border-primary'
                      }`}
                    >
                      <input
                        type="radio"
                        name="savedAddress"
                        className="mt-1 h-4 w-4 accent-primary"
                        checked={selectedAddressId === addr.id}
                        onChange={() => setSelectedAddressId(addr.id)}
                      />
                      <div>
                        <p className="text-label-md font-semibold text-on-surface mb-1 flex items-center gap-2">
                          {addr.recipientName}
                          {addr.isDefault && (
                            <span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded text-[10px]">
                              기본배송지
                            </span>
                          )}
                        </p>
                        <p className="text-body-md text-on-surface-variant">
                          {formatPhone(addr.phone)}
                        </p>
                        <p className="text-body-md text-on-surface-variant">
                          {addr.address}
                          {addr.addressDetail && `, ${addr.addressDetail}`}{' '}
                          ({addr.zipCode})
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            )}

            {/* 신규 배송지 폼 */}
            {activeTab === 'new' && (
              <div className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelCls}>수령인</label>
                    <input
                      {...register('recipientName', { required: '수령인을 입력해주세요.' })}
                      type="text"
                      placeholder="이름을 입력해주세요"
                      className={inputCls}
                    />
                    {errors.recipientName && (
                      <p className="mt-1 text-label-sm text-error">
                        {errors.recipientName.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className={labelCls}>연락처</label>
                    <input
                      {...register('phone', {
                        required: '연락처를 입력해주세요.',
                        pattern: {
                          value: /^01[0-9]-?\d{3,4}-?\d{4}$/,
                          message: '올바른 연락처를 입력해주세요.',
                        },
                      })}
                      type="tel"
                      placeholder="010-0000-0000"
                      className={inputCls}
                    />
                    {errors.phone && (
                      <p className="mt-1 text-label-sm text-error">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className={labelCls}>주소</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      {...register('zipCode', { required: true })}
                      type="text"
                      placeholder="우편번호"
                      readOnly
                      className={`${readonlyCls} w-2/5`}
                    />
                    <button
                      type="button"
                      onClick={openPostcode}
                      className="w-3/5 px-4 py-3 bg-secondary-container text-on-secondary-container text-label-md font-semibold rounded-lg hover:opacity-80 transition-opacity"
                    >
                      주소 찾기
                    </button>
                  </div>
                  <input
                    {...register('address', { required: true })}
                    type="text"
                    placeholder="기본 주소"
                    readOnly
                    className={`${readonlyCls} w-full mb-2`}
                  />
                  {(errors.zipCode || errors.address) && !watchedZipCode && (
                    <p className="mb-2 text-label-sm text-error">주소를 검색해주세요.</p>
                  )}
                  <input
                    {...register('addressDetail')}
                    type="text"
                    placeholder="상세 주소"
                    className={inputCls}
                  />
                </div>
              </div>
            )}

            {/* 배송 요청사항 */}
            <div className="mt-8 pt-6 border-t border-outline-variant/30">
              <label className={labelCls}>배송 요청사항</label>
              <div className="relative">
                <select
                  value={memoOption}
                  onChange={(e) => setMemoOption(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:outline-none bg-surface-container-lowest text-body-md appearance-none cursor-pointer transition-colors"
                >
                  <option value="">선택 안 함</option>
                  {DELIVERY_MEMO_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                  <option value="custom">직접 입력</option>
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
                  expand_more
                </span>
              </div>
              {memoOption === 'custom' && (
                <textarea
                  value={customMemo}
                  onChange={(e) => setCustomMemo(e.target.value)}
                  maxLength={50}
                  placeholder="배송 요청사항을 입력해주세요 (최대 50자)"
                  className="mt-3 w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-primary focus:outline-none bg-surface-container-lowest text-body-md resize-none h-24 transition-colors"
                />
              )}
            </div>
          </section>
        </div>

        {/* ── 우측: 주문 요약 ── */}
        <aside className="lg:col-span-4">
          <div className="sticky top-28 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 overflow-hidden">
            <div className="p-6 bg-surface-container-low">
              <h2 className="text-headline-sm font-semibold text-on-surface">주문 요약</h2>
            </div>

            <div className="p-6 space-y-6">
              {/* 상품 목록 */}
              <div className="space-y-4 max-h-64 overflow-y-auto pr-1">
                {order.items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden bg-surface-container">
                      <Image
                        src={item.imageUrl}
                        alt={item.productName}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="text-label-md font-semibold text-on-surface line-clamp-2">
                        {item.productName}
                      </p>
                      <p className="text-body-md text-on-surface-variant mt-0.5">
                        수량: {item.quantity}
                      </p>
                      <p className="text-label-md font-semibold text-primary mt-1">
                        {(item.price * item.quantity).toLocaleString()}원
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* 무료배송 안내 */}
              {order.shippingFee > 0 && remainingForFree > 0 && (
                <div className="px-3 py-2 bg-primary-fixed rounded-lg">
                  <p className="text-label-sm text-on-primary-fixed-variant text-center">
                    {remainingForFree.toLocaleString()}원 더 담으면 무료배송
                  </p>
                </div>
              )}

              {/* 금액 내역 */}
              <div className="pt-4 border-t border-outline-variant/30 space-y-3">
                <div className="flex justify-between">
                  <span className="text-body-md text-on-surface-variant">총 상품금액</span>
                  <span className="text-body-md text-on-surface">
                    {originalSubtotal.toLocaleString()}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-body-md text-on-surface-variant">배송비</span>
                  <span className="text-body-md text-on-surface">
                    {order.shippingFee === 0 ? '무료' : `${order.shippingFee.toLocaleString()}원`}
                  </span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-body-md text-on-surface-variant">할인금액</span>
                    <span className="text-body-md text-error">
                      -{order.discountAmount.toLocaleString()}원
                    </span>
                  </div>
                )}
              </div>

              {/* 최종금액 + 결제 버튼 */}
              <div className="pt-4 border-t-2 border-outline-variant space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-headline-sm font-semibold text-on-surface">
                    최종 결제금액
                  </span>
                  <span className="text-headline-md font-bold text-primary">
                    {order.totalAmount.toLocaleString()}원
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handlePayment}
                  disabled={isSubmitting}
                  className="w-full py-4 bg-primary text-on-primary text-headline-sm font-semibold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100"
                >
                  {isSubmitting
                    ? '처리 중...'
                    : `${order.totalAmount.toLocaleString()}원 결제하기`}
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
