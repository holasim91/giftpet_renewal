'use client';

import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const ANIMALS = [
  { label: '전체', value: null },
  { label: '강아지', value: 'dog' },
  { label: '고양이', value: 'cat' },
] as const;

const TYPES = [
  { label: '사료', value: 'food' },
  { label: '간식', value: 'treats' },
  { label: '용품', value: 'supplies' },
  { label: '영양제', value: 'supplements' },
] as const;

type AnimalValue = 'dog' | 'cat' | null;
type TypeValue = 'food' | 'treats' | 'supplies' | 'supplements' | null;

// 고양이 전용 서브카테고리: 간식·용품만 존재 (/shop/cat/food 같은 URL 없음)
const CAT_VALID_TYPES = new Set<string>(['treats', 'supplies']);

function parsePathname(pathname: string): { animal: AnimalValue; type: TypeValue } {
  const parts = pathname.replace('/shop', '').split('/').filter(Boolean);
  const animal = (['dog', 'cat'] as const).find((a) => parts.includes(a)) ?? null;
  const type = (['food', 'treats', 'supplies', 'supplements'] as const).find((t) => parts.includes(t)) ?? null;
  return { animal, type };
}

function buildUrl(animal: AnimalValue, type: TypeValue): string {
  if (!animal && !type) return '/shop';
  if (!animal) return `/shop/${type}`;
  if (!type) return `/shop/${animal}`;
  if (animal === 'cat' && !CAT_VALID_TYPES.has(type)) return '/shop/cat';
  return `/shop/${animal}/${type}`;
}

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FilterDrawer({ isOpen, onClose }: FilterDrawerProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [animal, setAnimal] = useState<AnimalValue>(null);
  const [type, setType] = useState<TypeValue>(null);

  // 드로어가 열릴 때마다 현재 URL 기준으로 선택 상태 초기화
  useEffect(() => {
    if (isOpen) {
      const parsed = parsePathname(pathname);
      setAnimal(parsed.animal);
      setType(parsed.type);
    }
  }, [isOpen, pathname]);

  const handleApply = () => {
    router.push(buildUrl(animal, type));
    onClose();
  };

  const pillBase = 'px-4 py-2 rounded-full text-label-md transition-colors';
  const pillActive = 'bg-primary text-on-primary shadow-sm';
  const pillInactive = 'bg-surface-container-low border border-outline-variant text-on-surface';

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      {/* Bottom sheet */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="카테고리 필터"
        className={`fixed bottom-0 left-0 right-0 z-50 bg-surface rounded-t-2xl shadow-xl transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        {/* Handle bar */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-outline-variant" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-surface-variant">
          <h2 className="text-headline-sm text-on-surface">필터</h2>
          <button
            type="button"
            aria-label="필터 닫기"
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-5 flex flex-col gap-6">

          {/* 동물별 */}
          <div>
            <p className="text-label-md text-secondary mb-3">동물별</p>
            <div className="flex gap-2 flex-wrap">
              {ANIMALS.map((a) => (
                <button
                  key={String(a.value)}
                  type="button"
                  onClick={() => setAnimal(a.value)}
                  className={`${pillBase} ${animal === a.value ? pillActive : pillInactive}`}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          {/* 상품 유형 */}
          <div>
            <p className="text-label-md text-secondary mb-3">상품 유형</p>
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => setType(null)}
                className={`${pillBase} ${type === null ? pillActive : pillInactive}`}
              >
                전체
              </button>
              {TYPES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => setType(t.value)}
                  className={`${pillBase} ${type === t.value ? pillActive : pillInactive}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 적용하기 */}
        <div className="px-6 pb-8 pt-2">
          <button
            type="button"
            onClick={handleApply}
            className="w-full h-12 bg-primary-container text-on-primary rounded-xl text-label-md font-bold hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
          >
            적용하기
          </button>
        </div>
      </div>
    </>
  );
}
