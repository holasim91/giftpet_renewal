# ARCHITECTURE.md — GIFT PET 프로젝트 구조

---

## 기술 스택

| 항목 | 선택 | 이유 |
|---|---|---|
| 프레임워크 | Next.js 15 (App Router) | create-next-app 기본값 |
| 언어 | TypeScript (strict) | create-next-app 기본값 |
| 스타일링 | Tailwind CSS v4 | create-next-app 기본값 |
| 폰트 | next/font (Google Fonts) | 자동 최적화, CLS 방지 |
| 아이콘 | Material Symbols Outlined | 디자인 원본과 동일 |
| 이미지 | next/image | 자동 최적화, lazy loading |
| 린터 | ESLint (Next.js 기본 설정) | create-next-app 기본값 |

---

## 디렉토리 구조

```
gift-pet/
├── public/
│   └── images/
│       └── placeholder.jpg          # 개발용 placeholder 이미지
│
├── src/
│   ├── app/
│   │   ├── layout.tsx               # 루트 레이아웃 (폰트, 메타데이터)
│   │   ├── page.tsx                 # 메인페이지 (섹션 조합)
│   │   ├── globals.css              # Tailwind 디렉티브, 전역 스타일
│   │   └── shop/
│   │       ├── page.tsx             # /shop — 전체 상품
│   │       ├── product/
│   │       │   └── [id]/
│   │       │       └── page.tsx     # /shop/product/[id] — 상품 상세
│   │       ├── food/
│   │       │   └── page.tsx         # /shop/food — 전체 사료
│   │       ├── treats/
│   │       │   └── page.tsx         # /shop/treats — 전체 간식
│   │       ├── supplies/
│   │       │   └── page.tsx         # /shop/supplies — 전체 용품
│   │       ├── supplements/
│   │       │   └── page.tsx         # /shop/supplements — 전체 영양제
│   │       └── [category]/
│   │           ├── page.tsx         # /shop/dog, /shop/cat — 동물별 전체
│   │           └── [subcategory]/
│   │               └── page.tsx     # /shop/dog/food, /shop/cat/treats 등
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx           # 데스크톱 헤더 (로고, 검색, GNB, 메가메뉴)
│   │   │   ├── MobileHeader.tsx     # 모바일 헤더 (햄버거, 로고, 아이콘)
│   │   │   ├── MobileDrawer.tsx     # 모바일 사이드 드로어 메뉴
│   │   │   └── Footer.tsx           # 푸터 (뉴스레터, 링크, 소셜)
│   │   │
│   │   ├── sections/
│   │   │   ├── HeroBanner.tsx       # 히어로 배너 섹션
│   │   │   ├── CategoryPills.tsx    # 카테고리 필 (모바일 전용)
│   │   │   ├── NewArrivals.tsx      # 신상품 섹션 (가로 스크롤)
│   │   │   └── MdRecommendation.tsx # MD 추천 섹션 (원형 아이템)
│   │   │
│   │   └── ui/
│   │       ├── ProductCard.tsx      # 상품 카드 컴포넌트
│   │       ├── CircularItem.tsx     # MD 추천용 원형 아이템
│   │       ├── ProductGrid.tsx      # 상품 카드 4열 그리드. 상품 리스트 페이지에서 사용.
│   │       └── CategorySidebar.tsx  # 카테고리 필터 사이드바. 상품 리스트 페이지 좌측 고정.
│   │
│   └── types/
│       └── index.ts                 # 공통 타입 정의
│
├── references/
│   ├── web/
│   │   ├── v0_main_web.html         # 메인페이지 디자인 원본 (데스크톱)
│   │   ├── v0_item_list.html        # 상품 리스트 디자인 원본 (데스크톱)
│   │   └── v0_item_detail.html      # 상품 상세 디자인 원본 (데스크톱)
│   └── mobile/
│       ├── v0_main_mobile.html      # 메인페이지 디자인 원본 (모바일)
│       ├── v0_item_list.html        # 상품 리스트 디자인 원본 (모바일)
│       └── v0_item_detail.html      # 상품 상세 디자인 원본 (모바일)
│
├── tailwind.config.ts               # 커스텀 토큰 (DESIGN_SYSTEM.md 기반)
├── AGENTS.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── CHANGELOG.md
└── README.md
```

---

## 컴포넌트 책임 분리

### layout/ — 페이지 공통 요소
- `Header.tsx`: 데스크톱(md 이상)에서 표시. sticky 포지션. 메가메뉴 포함.
- `MobileHeader.tsx`: 모바일(md 미만)에서 표시. 햄버거 버튼으로 Drawer 제어.
- `MobileDrawer.tsx`: `'use client'`. 열림/닫힘 상태 관리. overlay 포함.
- `Footer.tsx`: 데스크톱 3컬럼 / 모바일 단일 컬럼. 뉴스레터 input 포함.

### sections/ — 메인페이지 섹션
- 각 섹션은 독립적. page.tsx에서 순서대로 배치.
- `CategoryPills.tsx`: 모바일에서만 표시 (`md:hidden`).
- `NewArrivals.tsx`: 가로 스크롤 캐러셀. 마지막 카드는 View More 카드.
- `MdRecommendation.tsx`: 데스크톱은 가로 중앙 정렬. 모바일은 가로 스크롤.

### ui/ — 재사용 단위 컴포넌트
- `ProductCard.tsx`: 배지(NEW/BEST), 이미지, 상품명, 가격, Add to Cart 버튼.
- `CircularItem.tsx`: 원형 이미지 + 라벨. MD 추천 섹션에서 사용.
- `ProductGrid.tsx`: 상품 카드를 4열 그리드로 렌더링. 상품 리스트 페이지에서 사용.
- `CategorySidebar.tsx`: 카테고리 필터 사이드바. 상품 리스트 페이지 좌측 고정.

---

## 반응형 브레이크포인트

Tailwind 기본값 사용:
- 모바일: `< 768px` (기본)
- 데스크톱: `md:` (768px 이상)

Header는 두 컴포넌트로 분리 (`Header` / `MobileHeader`). 각 컴포넌트 내부에서 `hidden md:block` / `md:hidden`으로 처리한다.

---

## URL 구조 및 라우팅

### 카테고리 구조

```
전체
├── 사료 (food)
├── 간식 (treats)
├── 용품 (supplies)
└── 영양제 (supplements)

강아지 (dog)
├── 사료 (food)
├── 간식 (treats)
├── 용품 (supplies)
└── 영양제 (supplements)

고양이 (cat)
├── 간식 (treats)
└── 용품 (supplies)
```

### URL 매핑

| URL | 설명 |
|---|---|
| `/shop` | 전체 상품 |
| `/shop/product/[id]` | 상품 상세 |
| `/shop/food` | 전체 사료 |
| `/shop/treats` | 전체 간식 |
| `/shop/supplies` | 전체 용품 |
| `/shop/supplements` | 전체 영양제 |
| `/shop/dog` | 강아지 전체 |
| `/shop/dog/food` | 강아지 사료 |
| `/shop/dog/treats` | 강아지 간식 |
| `/shop/dog/supplies` | 강아지 용품 |
| `/shop/dog/supplements` | 강아지 영양제 |
| `/shop/cat` | 고양이 전체 |
| `/shop/cat/treats` | 고양이 간식 |
| `/shop/cat/supplies` | 고양이 용품 |

### 라우팅 전략

`/shop/food`(전체 카테고리)와 `/shop/dog/food`(동물별 서브카테고리)는 UI가 동일하다.
`[category]/[subcategory]/page.tsx` 컴포넌트를 공유하고 params로 필터링한다.
전체 카테고리 페이지(`/shop/food` 등)는 별도 폴더로 두되 동일한 컴포넌트를 재사용한다.

---

## 타입 정의

```typescript
// src/types/index.ts

export type AnimalCategory = 'dog' | 'cat';
export type ProductCategory = 'food' | 'treats' | 'supplies' | 'supplements';

export interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  badges: ('NEW' | 'BEST')[];
  animalCategory: AnimalCategory | null; // null이면 전체 카테고리
  productCategory: ProductCategory;
}

export interface CircularRecommendation {
  id: string;
  label: string;
  imageUrl: string;
  bgColor: string; // Tailwind 클래스
}
```

더미 데이터는 각 컴포넌트 파일 내부에 `const DUMMY_DATA = [...]`로 선언한다.