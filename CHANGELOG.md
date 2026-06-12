# CHANGELOG

세션이 끝날 때마다 Claude Code가 자동으로 업데이트한다.
최신 버전이 위에 오도록 작성한다.

---

## v1.1.0 (2026-06-11)

### 찜하기 (Wishlist)
- `prisma/schema.prisma` — `Wishlist` 모델 추가 (`@@unique([userId, productId])`)
- `actions/wishlist.ts` 신규 — `toggleWishlist`, `getWishlist`, `getWishlistCount`, `getWishlistedProductIds`
- `components/wishlist/WishlistProvider.tsx` 신규 — 찜 ID `Set<string>` Context, Optimistic 토글 (실패 시 롤백)
- `components/ui/WishlistButton.tsx` 신규 — `useWishlist()` 구독 하트, 채움/비움 + 색상 분기
- `app/(main)/wishlist/page.tsx` 신규 — 찜 목록 서버 컴포넌트 (빈 상태, 개수 표시)
- `app/(main)/wishlist/WishlistClient.tsx` 신규 — 선택 체크박스 + 단건/일괄 장바구니 담기, 품절 상품 disabled
- `proxy.ts` — `/wishlist` 보호 라우트 추가
- Header / MobileHeader — 찜 배지 (`getWishlistCount()`), `/wishlist` 링크

### 배지 시스템 통일
- `prisma/schema.prisma` — `badges String[]` 제거, `isBest Boolean @default(false)` 추가
- `lib/badge.ts` 신규 — `getCardBadge()` 단일 함수 (SOLD OUT > BEST > NEW 우선순위)
- `BADGE_STYLES` 상수 통합: `BEST: 'bg-[#4E7CAE] text-white'`, `NEW: 'bg-primary-container text-on-primary'`, `SOLD_OUT: 'bg-inverse-surface text-inverse-on-surface'`
- ProductCard, ProductCardBase, ProductImages, ProductInfo, CartClient — `badges` 배열 → `getCardBadge()` 교체

### 컴포넌트 통합 및 리팩토링
- `components/ui/ProductCardBase.tsx` 신규 — ShopProductCard(ProductGrid) + WishlistClient 카드 공통 베이스
- `components/ui/QuantityControl.tsx` 신규 — 수량 +/- 공통 컴포넌트 (`compact` / 기본 variant)
- `types/index.ts` — `ActionResult<T = void>` 공통 타입 추가, 전 Server Action 반환 타입 통일
- 컴포넌트 파일 분리: `ProductImages`, `ProductInfo`, `ProductTabs`, `AddToCartSection`, `ProfileCard`, `NameChangeForm`, `PasswordModal`, `OrderHistory`
- `app/auth/register/page.tsx` — react-hook-form 적용, 필드별 유효성 검사, 비밀번호 보기/숨기기

### 할인 표시 시스템
- `lib/price.ts` 신규 — `getDiscountRate(price, discountPrice): number`
- 할인가 있을 때 표시: 할인가(primary, 굵게) + 정가 취소선 + N% 할인
  - 적용: ProductCard, ProductCardBase, ProductInfo, CartClient
- `AddToCartSection` — `totalPrice` 버그 수정 (`product.price` → `discountPrice ?? price`)

### 신상품·시딩 개선
- `actions/product.ts` `getNewArrivals()` — 신상품 기준: `badges has 'NEW'` OR `createdAt 30일 이내`
- `prisma/seed.ts` — `daysAgo(n)` 헬퍼, 신상품 5개(30일 이내) + 구상품 10개(35~100일 전) 날짜 분산
- 힐스 사이언스 다이어트 어덜트 1.5kg 신규 추가 (`stock: 0`, BEST 배지) — 품절 UI 검증용

### 캐러셀 인터랙션
- `components/sections/NewArrivals.tsx` — 서버 컴포넌트 → `'use client'` 전환
  - 화살표 버튼: `scrollBy({ behavior: 'smooth' })`, 맨 처음/끝에서 숨김 (`opacity-0 pointer-events-none`)
  - 드래그 스크롤: `useRef` 기반, `requestAnimationFrame` 최적화 (프레임당 1회 `scrollLeft` 갱신)
  - 드래그 중 snap 비활성화: `el.style.scrollSnapType = 'none'` → mouseup 시 `''` 복원
  - 드래그 후 링크 클릭 방지: `hasDragged` + `onClickCapture`

### 기타 UX 수정
- HeroBanner — 쇼핑하기 `<button>` → `<Link href="/shop">`
- WishlistClient — 단일 담기 성공 시 체크박스 자동 체크
- OrderHistory — `animate-ping` 깜빡이는 점 UI 제거
- Footer — `mt-16 md:mt-24` 전 페이지 일괄 적용

---

## v1.0.0 (2026-06-05)

### 기본 UI 구현
- 메인페이지: HeroBanner, CategoryPills, NewArrivals 캐러셀, MdRecommendation
- 상품 리스트: 13개 라우트 (`/shop`, `/shop/dog`, `/shop/cat`, `/shop/{유형}`, `/shop/dog/{유형}`, `/shop/cat/{유형}`)
- 상품 상세 페이지 (`/shop/product/[id]`)
- 반응형: 데스크톱 / 모바일, Header / MobileHeader 분리
- 공통: Footer, 404, ComingSoon
- `components/layout/MobileDrawer.tsx` — 모바일 사이드 드로어 (session prop 기반 로그인/비로그인 분기)
- `components/ui/CategorySidebar.tsx` — `usePathname` 기반 활성 상태, 동물별 + 유형별 2섹션
- `components/ui/ShopListContent.tsx` — 전 리스트 페이지 공유 레이아웃

### DB 연동
- Supabase (PostgreSQL) + Prisma 7 (`prisma.config.ts` URL 관리)
- `prisma/schema.prisma` — Product, User, Cart, Wishlist 테이블
- `prisma/seed.ts` — 상품 15개 시딩 (Unsplash 이미지, 카테고리·배지·가격 포함)
- `actions/product.ts` — `getProducts`, `getProductById`, `getNewArrivals`, `getMdPickProducts`
- 상품 리스트·상세·메인 — 더미 데이터 전면 제거, DB 연동

### 인증
- NextAuth.js v5 (Credentials Provider, JWT 전략)
- `auth.ts` — Prisma User + bcryptjs 비밀번호 검증
- `actions/auth.ts` — `loginUser`, `registerUser`, `logoutUser`
- `/auth/login`, `/auth/register` 페이지
- `proxy.ts` 미들웨어 — `/cart`, `/wishlist` 비로그인 접근 차단
- `components/ui/SignOutButton.tsx` — 로그아웃 폼 컴포넌트

### 장바구니
- `actions/cart.ts` — `getCart`, `getCartCount`, `addToCart`, `removeFromCart`, `removeSelectedFromCart`, `updateCartQuantity`
- `app/(main)/cart/CartClient.tsx` — 체크박스 선택, 수량 조절(`useOptimistic`), 삭제(ConfirmModal), 결제 요약
- `components/ui/AddToCartButton.tsx` — 상품 카드용 버튼 (비로그인 → `/auth/login`, 성공 → Toast)
- Header 장바구니 배지 — `getCartCount()`, `/cart` 링크, 0 숨김·9+ 표시
- `components/ui/Toast.tsx` — `ToastProvider` + `useToast`, `app/layout.tsx` 전역 등록
- `components/ui/ConfirmModal.tsx` — 삭제 확인 모달

### 마이페이지
- `app/(main)/mypage/page.tsx` — 세션 확인 후 비로그인 redirect
- 회원 정보 수정: 이름 변경, 비밀번호 변경 (`actions/user.ts`)
- 주문 내역 플레이스홀더

### 상품 품절·비활성 처리
- `Product.isActive Boolean`, `Product.stock Int` 필드
- 품절(`stock=0`): 배지 표시 + `opacity-60` dimming + 장바구니 버튼 disabled
- 비활성(`isActive=false`): 리스트에서 제외, 장바구니에서 "판매 종료" 표시

---

## 형식

```
## vX.Y.Z (YYYY-MM-DD)

### 카테고리
- 항목
```
