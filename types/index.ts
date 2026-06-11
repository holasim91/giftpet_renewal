// ─── Prisma 스키마와 동기화된 타입 정의 ─────────────────────────────────
// prisma/schema.prisma의 enum과 model을 미러링.
// DB에서 데이터를 가져올 때 Prisma가 반환하는 타입과 동일한 구조를 유지한다.
// 관계 필드(cart 등)는 UI에서 불필요하므로 제외.

// ── Server Action 공통 반환 타입 ──────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

// ── Enum ───────────────────────────────────────────────────────────────────

export type AnimalCategory = 'dog' | 'cat';

export type ProductCategory = 'food' | 'treats' | 'supplies' | 'supplements';

// ── Product ────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  description: string | null;
  detailContent: string | null;
  price: number;
  discountPrice: number | null;
  imageUrl: string;
  stock: number;
  animalCategory: AnimalCategory | null; // null = 전체 카테고리
  productCategory: ProductCategory;
  isBest: boolean;
  isMdPick: boolean;
  isActive: boolean;
  // 서버: Prisma가 Date 반환 / 클라이언트: 직렬화 후 ISO 문자열
  createdAt?: Date | string;
}

// ── Wishlist (찜 목록, 상품 정보 포함) ─────────────────────────────────────

export interface WishlistItemWithProduct {
  id: string;
  product: Product;
}

// ── CircularRecommendation (UI 전용, DB 없음) ──────────────────────────────

export interface CircularRecommendation {
  id: string;
  label: string;
  imageUrl: string;
  bgColor: string; // Tailwind 클래스
}

// ── 카테고리 표시 레이블 ───────────────────────────────────────────────────

export const PRODUCT_CATEGORY_LABELS: Record<ProductCategory, string> = {
  food: '사료',
  treats: '간식',
  supplies: '용품',
  supplements: '영양제',
};

export const ANIMAL_CATEGORY_LABELS: Record<AnimalCategory, string> = {
  dog: '강아지',
  cat: '고양이',
};
