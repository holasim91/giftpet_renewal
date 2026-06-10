// 상품 배지(NEW/BEST/HIT) 색상 스타일. 여러 카드 컴포넌트에서 공유한다.
export const BADGE_STYLES: Record<string, string> = {
  NEW: 'bg-primary-container text-on-primary',
  BEST: 'bg-[#343434] text-white',
  HIT: 'bg-[#343434] text-white',
};

export interface NavSubItem {
  icon: string;
  label: string;
  href: string;
}

export interface NavCategory {
  key: 'dog' | 'cat';
  heading: string;
  href: string;
  items: NavSubItem[];
}

// 동물별 카테고리. 데스크톱 메가메뉴 + 모바일 드로어 아코디언이 공유한다.
export const NAV_CATEGORIES: NavCategory[] = [
  {
    key: 'dog',
    heading: '강아지',
    href: '/shop/dog',
    items: [
      { icon: 'set_meal',     label: '사료',   href: '/shop/dog/food' },
      { icon: 'pet_supplies', label: '간식',   href: '/shop/dog/treats' },
      { icon: 'home',         label: '용품',   href: '/shop/dog/supplies' },
      { icon: 'healing',      label: '영양제', href: '/shop/dog/supplements' },
    ],
  },
  {
    key: 'cat',
    heading: '고양이',
    href: '/shop/cat',
    items: [
      { icon: 'cruelty_free', label: '간식', href: '/shop/cat/treats' },
      { icon: 'toys',         label: '용품', href: '/shop/cat/supplies' },
    ],
  },
];

// 상품 유형 카테고리(동물 무관). GNB + 드로어 하단 카테고리 링크가 공유한다.
export const PRODUCT_CATEGORIES: { label: string; href: string }[] = [
  { label: '사료',   href: '/shop/food' },
  { label: '간식',   href: '/shop/treats' },
  { label: '용품',   href: '/shop/supplies' },
  { label: '영양제', href: '/shop/supplements' },
];
