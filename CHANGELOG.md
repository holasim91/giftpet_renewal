# CHANGELOG

세션이 끝날 때마다 Claude Code가 자동으로 업데이트한다.
최신 버전이 위에 오도록 작성한다.

---

## v1.6.4 (2026-07-18)

### 메인페이지 신상품 미노출 수정
- `actions/product.ts` `getNewArrivals()` — 30일 이내 신상품이 0건일 때(시딩 시각에 종속되어 발생) 최신 등록순으로 폴백하는 로직 추가. 시딩 시점이 오래 경과해도 메인 "신상품" 섹션이 비지 않도록 함. 30일 이내 신상품이 있으면 기존대로 그쪽을 우선 노출. 재시딩 불필요(Cart·Wishlist 등 기존 데이터 보존)

## v1.6.3 (2026-07-10)

### AGENTS.md 정합성 정리 + 히어로 배너 이미지 로컬화
- `AGENTS.md` — 4절 「현재 프로젝트 범위 (v0.1 — 메인페이지 껍데기)」 삭제. 변화하는 상태 정보는 `CHANGELOG.md`가 담당하므로 규약 문서에서 제거. 같은 위치의 「테스트 전략」을 `## 4. 테스트 전략`으로 승격(내용 유지)
- `AGENTS.md` 1-2절 — 이미지 규칙을 "컴포넌트 코드에서 외부 이미지 URL(unsplash.com, lh3.googleusercontent.com 등) 직접 참조 금지 → `public/images/` 로컬 경로 참조"로 교체, 근거(외부 서비스 가용성 의존 회피) 한 줄 명시
- `components/sections/HeroBanner.tsx` — 히어로 배너 이미지 Unsplash 외부 URL → `/images/hero-banner.jpg` 로컬 참조 (데스크톱·모바일 2곳)
- `public/images/hero-banner.jpg` 신규 — 히어로 배너 이미지 로컬 저장
- `README.md` — 이미지 출처(Unsplash) 표기 추가
- 범위 한정: `prisma/seed.ts`의 상품 이미지 URL과 `next.config.ts`의 unsplash `remotePatterns`는 재시딩(DB 갱신)이 필요하여 이번 작업 범위에서 제외(DB에 저장된 URL이 남아 있어 제거 시 배포 데모 파손)

## v1.6.2 (2026-06-21)

### Impeccable 디자인 감사 — 접근성·브랜드 일관성·미구현 UI 수정 (13/20 → 15/20)
- `PRODUCT.md` 신규 — impeccable 스킬 컨텍스트 파일 (register, 사용자, 브랜드 성격, anti-reference, 접근성 정의)
- `lib/badge.ts` — BEST 배지 `bg-[#4268A8] text-white` → `bg-inverse-surface text-inverse-on-surface` (오프-브랜드 하드코딩 파란색 → 디자인 토큰으로 교체)
- `components/cart/FilledCart.tsx` — `font-headline-sm` → `text-headline-sm` (존재하지 않는 Tailwind 클래스 수정)
- `components/ui/AddToCartButton.tsx` — `<div role="button">` → `<button type="button">` (키보드 접근성 확보), "Add to Cart" → "장바구니 담기" (언어 혼용 제거)
- `components/product/AddToCartSection.tsx` — "ADD TO CART" → "장바구니 담기", "BUY NOW" → "바로 구매" (한국어 UI 일관성)
- `components/sections/CategoryPills.tsx` — 정적 버튼 → `<Link>` + `usePathname()` 활성 하이라이트 (실제 동작하는 카테고리 탐색)
- `components/ui/FilterDrawer.tsx` 신규 — 모바일·태블릿 바텀시트 필터 드로어 (동물별·유형별 단일 선택, 고양이 URL fallback 처리, 현재 경로 기준 초기 선택 복원)
- `components/ui/ShopListContent.tsx` — FilterDrawer 연결, `md:hidden` → `lg:hidden` (태블릿 768~1023px 필터 버튼 노출)
- `components/layout/MegaMenuTrigger.tsx` 신규 — 키보드 접근 가능 메가메뉴 클라이언트 컴포넌트 (`aria-expanded`, `aria-haspopup="menu"`, Escape 닫기, onBlur 포커스 아웃 감지)
- `components/layout/Header.tsx` — 메가메뉴 인터랙션을 MegaMenuTrigger(클라이언트)로 분리, Header는 서버 컴포넌트 유지
- `components/ui/ConfirmModal.tsx` — 포커스 트랩 추가 (모달 열릴 때 취소 버튼 자동 포커스, Tab 순환 트랩, Escape 닫기)

---

## v1.6.1 (2026-06-16)

### Lighthouse 성능 최적화 (Performance 72→92, Best Practices 77→100)
- `app/layout.tsx` — Material Symbols `display=swap` → `display=block` 변경, Plus Jakarta Sans `display: 'swap'` 추가
- `app/globals.css` — `.material-symbols-outlined`에 `width: 1em; height: 1em; overflow: hidden` 추가 — 아이콘 박스 고정으로 CLS 0.194 제거
- `lib/badge.ts` — NEW 배지 WCAG AA 통과 (`text-white` 2.74:1 → `text-on-primary-container` 4.54:1), BEST 배지 대비 개선 (`#4E7CAE` 4.36:1 → `#4268A8` 5.53:1)
- `components/sections/NewArrivals.tsx` — "전체 보기" 링크·View More 카드에 `aria-label="신상품 전체 보기"` 추가
- `components/layout/MobileHeaderClient.tsx` — `aria-label` 한국어 통일 (`Open menu`→`메뉴 열기`, `Wishlist`→`찜 목록`)
- `components/layout/MobileDrawer.tsx` — `aria-label` 한국어 통일 (`Navigation menu`→`내비게이션 메뉴`, `Close menu`→`메뉴 닫기`)
- `next.config.ts` — 보안 헤더 추가 (`X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)

---

## v1.6.0 (2026-06-16)

### 비로그인 처리 / 상품 정렬 / 리뷰·마이페이지 UX 개선
- `components/wishlist/WishlistProvider.tsx` — `isLoggedIn` 컨텍스트 추가, 비로그인 시 Optimistic update 없이 즉시 `/auth/login` 이동
- `components/ui/AddToCartButton.tsx`, `components/product/AddToCartSection.tsx` — 비로그인 처리 통일
- `actions/product.ts` — `getProducts`에 `sort` 파라미터 추가 (`recommended` / `newest` / `price_asc` / `price_desc`), 가격 정렬은 `$queryRaw COALESCE` 활용. `getMdPickProducts` limit 파라미터 추가
- `components/ui/SortBar.tsx` 신규 — 정렬 선택 컴포넌트
- `components/ui/ShopListContent.tsx` — SortBar 연동, 정렬 상태 반영
- `app/(main)/shop/*` 13개 페이지 — `searchParams` 연동 (`sort` 파라미터 전달)
- `components/sections/MdRecommendation.tsx` — 화살표 + 드래그 캐러셀 구현 (`'use client'` 전환)
- `app/(main)/wishlist/WishlistClient.tsx` — 장바구니 담기 완료 항목 체크박스 `disabled` 처리
- `actions/review.ts` — 리뷰 작성 조건 `PAID` 이상 → `DELIVERED`만 허용
- `components/review/ReviewWriteModal.tsx` — 이미지 업로드 중 스피너 표시, X 버튼 크기 축소
- `components/Providers.tsx` 신규 — `SessionProvider` 래퍼
- `components/mypage/NameChangeForm.tsx` — `useSession().update()`로 헤더 이름 즉시 갱신, `auth.ts` JWT update 트리거 처리
- `components/mypage/OrderHistory.tsx` — 최초 3건 표시 후 더보기 버튼으로 3건씩 추가 노출
- `prisma/seed.ts` — 시딩 데이터 확장

---

## v1.5.0 (2026-06-15)

### 상품 리뷰 기능
- `prisma/schema.prisma` — `Review` 모델 추가 (`@@unique([userId, orderId, productId])`), `User`·`Product`·`Order`에 `reviews Review[]` relation 추가
- `lib/image.ts` 신규 — `convertToWebP(file)` (canvas, 브라우저 전용), `uploadReviewImage(blob, userId)` (Supabase Storage `review-images` 버킷), `deleteReviewImage(url)` (Storage 삭제)
- `actions/review.ts` 신규 — `getReviews`, `createReview`, `deleteReview`, `getMyReviewableProducts`, `getMyReviewedKeys`, `uploadReviewImageAction`, `deleteReviewImageAction`
- `types/index.ts` — `ReviewForDisplay`, `ReviewedKey` 타입 추가
- `components/review/StarRating.tsx` 신규 — 별점 선택/표시 (readonly/interactive, sm/md/lg 크기)
- `components/review/ImageLightbox.tsx` 신규 — 이미지 확대 뷰어 (Escape 닫기)
- `components/review/ReviewCard.tsx` 신규 — 단일 리뷰 카드 (이미지 클릭 확대, 본인 리뷰 삭제)
- `components/review/ReviewWriteModal.tsx` 신규 — 리뷰 작성 모달 (파일 선택 즉시 WebP 변환·업로드, 닫을 때 미제출 이미지 자동 삭제)
- `components/product/ProductTabs.tsx` — Reviews 탭 실제 리뷰 표시 (평균 별점·리뷰 수, 본인 리뷰 삭제)
- `components/mypage/OrderHistory.tsx` — `'use client'` 전환, 주문 항목별 리뷰 작성/완료 버튼, `ReviewWriteModal` 연결
- `app/(main)/mypage/page.tsx` — `getMyReviewedKeys` 병렬 조회
- `app/(main)/mypage/MypageClient.tsx` — `initialReviewedKeys` prop 전달
- `package.json` — `@supabase/supabase-js` 추가

---

## v1.4.0 (2026-06-14)

### 장바구니 주문하기 버튼 연결
- `hooks/useCart.ts` — `handleOrder` 추가: 체크 없으면 Toast, `createPendingOrder` 호출, 성공 시 `/checkout?order_id=` 리다이렉트, 실패 시 Toast. `isOrdering` 상태 추가. 반환값에 `handleOrder`·`isOrdering` 포함.
- `components/cart/OrderSummary.tsx` — `onOrder`·`isOrdering` props 추가, 주문하기 버튼 연결 (처리 중 disabled + "처리 중..." 텍스트)
- `components/cart/FilledCart.tsx` — `handleOrder`·`isOrdering` 구조분해, 데스크톱 `OrderSummary` + 모바일 sticky 버튼 모두 연결

---

## v1.3.0 (2026-06-12)

### 주문 플로우 PENDING/PAID 방식으로 재설계
- `prisma/schema.prisma` — `OrderStatus` enum에 `PENDING` 추가, `Order.status` 기본값 `PENDING`으로 변경, `recipientName`·`phone`·`zipCode`·`address` nullable 처리
- `actions/order.ts` — `createOrder` 제거, `createPendingOrder(items)` 신규 (배송지 없이 PENDING 주문 생성, 재고 차감 없음), `confirmOrder(orderId, shippingData, deliveryMemo?)` 신규 (트랜잭션: 재고 확인 → PAID 업데이트 + 배송지 저장 → 재고 차감 → 장바구니 비우기)
- `types/index.ts` — `OrderStatus`에 `'PENDING'` 추가

### 테스트 환경 구축 및 유닛 테스트
- `vitest.config.ts` 신규 — Vitest 설정 (`@/*` 경로 별칭은 프로젝트 루트 기준)
- `package.json` — `test`, `test:ui` 스크립트 및 vitest 의존성 추가
- `lib/order.utils.ts` 신규 — `validateStock`, `calculateOrderTotal`, `buildOrderItems` 순수 함수
- `lib/order.utils.test.ts` 신규 — 8개 유닛 테스트 (재고 확인 3, 총액 계산 3, 주문 항목 빌드 2)

---

## v1.2.0 (2026-06-12)

### 주문 스키마 및 Server Actions
- `prisma/schema.prisma` — `OrderStatus` enum, `Order`, `OrderItem` 모델 추가
- `actions/order.ts` 신규 — `createOrder` (트랜잭션: 재고 확인 → 주문 생성 → OrderItem 스냅샷 → 재고 차감 → 장바구니 비우기), `getOrders`, `getOrderById`
- `lib/order.utils.ts` 신규 — `validateStock`, `calculateOrderTotal`, `buildOrderItems` 순수 함수
- `types/index.ts` — `OrderStatus`, `OrderItem`, `Order` 타입 추가

### 테스트
- `vitest.config.ts` 신규 — Vitest 설정 (`@/*` 경로 별칭)
- `lib/badge.test.ts`, `lib/price.test.ts`, `lib/format.test.ts`, `lib/order.utils.test.ts` 신규 — 비즈니스 로직 유닛 테스트 19케이스
- `package.json` — `test`, `test:ui` 스크립트 및 vitest 의존성 추가

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
