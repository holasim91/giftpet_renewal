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
| DB | Supabase (PostgreSQL) | 무료 티어, 관리 콘솔 편의성 |
| ORM | Prisma | 타입 안전성, 스키마 관리 |
| 인증 | NextAuth.js | Next.js 통합 용이 |
| 배포 | Vercel | Next.js 최적화 배포 환경 |

---

## 디렉토리 구조

루트 레벨 구조다. `src/` 디렉토리는 사용하지 않으며, 경로 별칭 `@/*`는 프로젝트 루트를 가리킨다.

```
gift-pet/
├── public/
│   └── images/
│       └── placeholder.jpg          # 개발용 placeholder 이미지
│
├── app/                             # Next.js App Router (루트 레벨)
│   ├── layout.tsx                   # 루트 레이아웃 (폰트, 메타데이터, ToastProvider)
│   ├── globals.css                  # Tailwind 디렉티브, 전역 스타일
│   ├── not-found.tsx                # 404 페이지
│   │
│   ├── (main)/                      # Route Group — Header/MobileHeader/Footer 공통 레이아웃
│   │   ├── layout.tsx               # Header + MobileHeader + {children} + Footer
│   │   ├── page.tsx                 # /        — 메인페이지 (섹션 조합)
│   │   ├── cart/
│   │   │   ├── page.tsx             # /cart    — 장바구니 (서버, proxy.ts로 비로그인 차단)
│   │   │   └── CartClient.tsx       # 장바구니 클라이언트 로직
│   │   ├── mypage/
│   │   │   ├── page.tsx             # /mypage  — 마이페이지 (비로그인 redirect)
│   │   │   └── MypageClient.tsx     # 조합 컴포넌트
│   │   └── shop/
│   │       ├── page.tsx             # /shop    — 전체 상품
│   │       ├── product/[id]/
│   │       │   ├── page.tsx         # /shop/product/[id] — 상품 상세 (서버)
│   │       │   └── ProductDetailClient.tsx
│   │       ├── food|treats|supplies|supplements/
│   │       │   └── page.tsx         # /shop/{유형} — 전체 유형별
│   │       ├── dog/
│   │       │   ├── page.tsx         # /shop/dog
│   │       │   └── food|treats|supplies|supplements/page.tsx
│   │       └── cat/
│   │           ├── page.tsx         # /shop/cat
│   │           └── treats|supplies/page.tsx
│   │
│   ├── (auth)/                      # Route Group — 공통 네비 없음 (전체화면 폼)
│   │   ├── layout.tsx               # {children}만 렌더
│   │   └── auth/
│   │       ├── login/page.tsx       # /auth/login
│   │       └── register/page.tsx    # /auth/register
│   │
│   └── api/
│       └── auth/[...nextauth]/route.ts   # NextAuth API 핸들러
│
├── lib/
│   ├── prisma.ts                    # Prisma 클라이언트 싱글톤
│   ├── supabase.ts                  # Supabase 클라이언트 (브라우저 + admin)
│   ├── supabase/                    # Supabase SSR 클라이언트 (client.ts / server.ts)
│   └── constants.ts                 # 공유 상수 (BADGE_STYLES, NAV_CATEGORIES, PRODUCT_CATEGORIES)
│
├── actions/
│   ├── product.ts                   # 상품 조회 Server Actions
│   ├── cart.ts                      # 장바구니 CRUD Server Actions
│   ├── auth.ts                      # 로그인·로그아웃·회원가입
│   └── user.ts                      # 이름·비밀번호 변경
│
├── components/
│   ├── layout/
│   │   ├── Header.tsx               # 데스크톱 헤더 (로고, GNB, 메가메뉴)
│   │   ├── MobileHeader.tsx         # 모바일 헤더 async 래퍼
│   │   ├── MobileHeaderClient.tsx   # 모바일 헤더 인터랙션 ('use client')
│   │   ├── MobileDrawer.tsx         # 모바일 사이드 드로어 메뉴
│   │   └── Footer.tsx               # 푸터 (뉴스레터, 링크, 소셜)
│   │
│   ├── sections/                    # 메인페이지 섹션
│   │   ├── HeroBanner.tsx
│   │   ├── CategoryPills.tsx
│   │   ├── NewArrivals.tsx
│   │   └── MdRecommendation.tsx
│   │
│   ├── product/                     # 상품 상세 전용
│   │   ├── ProductImages.tsx
│   │   ├── ProductInfo.tsx
│   │   ├── ProductTabs.tsx
│   │   └── AddToCartSection.tsx     # 수량·장바구니·구매 (데스크톱 박스 + 모바일 sticky 바)
│   │
│   ├── mypage/                      # 마이페이지 전용
│   │   ├── ProfileCard.tsx
│   │   ├── NameChangeForm.tsx
│   │   ├── PasswordModal.tsx
│   │   └── OrderHistory.tsx
│   │
│   └── ui/                          # 재사용 단위 컴포넌트
│       ├── ProductCard.tsx
│       ├── CircularItem.tsx
│       ├── ProductGrid.tsx
│       ├── CategorySidebar.tsx
│       ├── ShopListContent.tsx
│       ├── QuantityControl.tsx      # 수량 +/- 공통 (compact / 기본 variant)
│       ├── AddToCartButton.tsx
│       ├── SignOutButton.tsx
│       ├── ConfirmModal.tsx
│       ├── AlertModal.tsx
│       ├── Toast.tsx
│       └── ComingSoon.tsx
│
├── types/
│   └── index.ts                     # 공통 타입 (Product, ActionResult 등)
│
├── prisma/
│   ├── schema.prisma                # DB 스키마 정의
│   └── seed.ts                      # 더미 상품 시딩 스크립트
│
├── references/                      # 디자인 원본 HTML (web/ · mobile/)
│
├── auth.ts                          # NextAuth v5 설정 (Credentials, JWT)
├── proxy.ts                         # 미들웨어 — /cart 등 보호 라우트 차단
├── prisma.config.ts                 # Prisma 7 설정 (DB URL)
├── tailwind.config.ts               # 커스텀 토큰 (DESIGN_SYSTEM.md 기반)
├── AGENTS.md
├── ARCHITECTURE.md
├── DESIGN_SYSTEM.md
├── CHANGELOG.md
└── README.md
```

---

## 컴포넌트 책임 분리

### Route Group 레이아웃
- `app/(main)/layout.tsx`: `Header` + `MobileHeader` + `{children}` + `Footer`를 공통 배치. 홈·shop(리스트/상세)·cart·mypage가 이 그룹에 속한다. 각 page는 콘텐츠만 반환하고 공통 네비를 직접 import하지 않는다.
- `app/(auth)/layout.tsx`: `{children}`만 렌더. login·register는 전체화면 중앙 정렬 폼이라 공통 네비를 두지 않는다.
- Route Group(`(main)`/`(auth)`)은 URL 경로에 영향을 주지 않는다 (`/auth/login`은 그대로 유지). 모바일 하단 네비게이션(BottomNav)은 폐기했고, 모바일 네비는 `MobileDrawer`(햄버거 메뉴)로 단일화했다.

### layout/ — 페이지 공통 요소
- `Header.tsx`: async 서버 컴포넌트. 데스크톱(md 이상)에서 표시. sticky 포지션. 메가메뉴 포함. `auth()`로 세션 확인 후 로그인 상태 표시.
- `MobileHeader.tsx`: async 서버 래퍼. 모바일(md 미만)에서 표시. `auth()` 호출 후 session을 `MobileHeaderClient`에 전달.
- `MobileHeaderClient.tsx`: `'use client'`. MobileHeader의 인터랙션 로직 분리 컴포넌트 (햄버거 버튼, Drawer 열기). session prop 수신.
- `MobileDrawer.tsx`: `'use client'`. 열림/닫힘 상태 관리. overlay 포함. session prop으로 로그인/비로그인 하단 영역 분기.
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
- `ShopListContent.tsx`: 상품 리스트 페이지 공유 레이아웃 (사이드바 + 정렬 + 그리드 + 페이지네이션). `title`·`products` props만으로 구성.
- `AddToCartButton.tsx`: `'use client'`. 상품 카드용 장바구니 추가 버튼. 비로그인 시 `/auth/login` 리다이렉트, 성공 시 Toast 표시.
- `SignOutButton.tsx`: `'use client'`. `logoutUser` Server Action을 폼 액션으로 호출하는 로그아웃 버튼.
- `ConfirmModal.tsx`: `'use client'`. 삭제 확인 모달 (overlay + 확인/취소 버튼). 데이터 삭제 전 반드시 사용.
- `Toast.tsx`: `'use client'`. `ToastProvider` + `useToast` hook. `app/layout.tsx`에 전역 등록.
- `ComingSoon.tsx`: 미구현 페이지 임시 플레이스홀더. `pageLabel` prop으로 페이지 구분 표시.

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
| `/shop/search?q=검색어` | 검색 결과 |
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

`/shop/food`(전체 유형)와 `/shop/dog/food`(동물별 서브카테고리)는 UI가 동일하다.
각 경로는 명시적 폴더(`shop/food/page.tsx`, `shop/dog/food/page.tsx` 등)로 두고, 공통 `ShopListContent` 컴포넌트를 재사용한다. 차이는 page에서 `getProducts({ animalCategory?, productCategory? })`에 넘기는 필터와 `title` prop뿐이다. (동적 `[category]/[subcategory]` 라우트는 사용하지 않는다.)

---

## 타입 정의

```typescript
// types/index.ts

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
Supabase 연동 후 더미 데이터는 전부 제거하고 Server Actions으로 교체한다.

---

## v1 구현 범위

### 완료 (껍데기)
- 메인페이지
- 상품 리스트 페이지 (`/shop`, `/shop/dog` 등)
- 상품 상세 페이지 (`/shop/product/[id]`)
- 반응형 (데스크톱 / 모바일)
- Vercel 배포

### v1 목표 (백엔드 연동)
- [x] Supabase + Prisma 연결
- [x] 상품 데이터 DB 연동 (더미 데이터 → 실제 DB)
- [x] 회원가입 / 로그인 (NextAuth.js v5 beta, Credentials Provider)
- [x] 장바구니 (Server Actions — CRUD 완전 구현, 헤더 배지 실시간 반영)
- [ ] 검색 (`/shop/search?q=`)

### v2 이후
- 결제 (토스페이먼츠 또는 포트원)
- 주문 내역
- 마이페이지