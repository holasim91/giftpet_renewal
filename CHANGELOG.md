# CHANGELOG

세션이 끝날 때마다 Claude Code가 자동으로 업데이트한다.
최신 세션이 위에 오도록 작성한다.

---

## 2026-06-11 세션 34

### 완료

#### UX 소수 수정
- `components/sections/HeroBanner.tsx` — 쇼핑하기 `<button>` → `<Link href="/shop">` 교체 (데스크톱·모바일 모두)
- `app/(main)/wishlist/WishlistClient.tsx` — 개별 "장바구니 담기" 성공 시 해당 상품 체크박스 자동 체크 (`setChecked` 추가)
- `components/mypage/OrderHistory.tsx` — `animate-ping` 깜빡이는 점 UI 전체 제거

#### 할인 표시 시스템
- `lib/price.ts` 신규 — `getDiscountRate(price, discountPrice): number` (할인율 계산, 외부 의존 없음)
- 할인가 있을 때 표시 형식: 할인가(primary, 굵게) + 정가 취소선 + N% 할인
  - `components/ui/ProductCard.tsx` — 캐러셀 카드 가격 영역
  - `components/ui/ProductCardBase.tsx` — 그리드·찜 카드 가격 영역 (WishlistClient 자동 반영)
  - `components/product/ProductInfo.tsx` — 상품 상세 데스크톱·모바일 모두
  - `app/(main)/cart/CartClient.tsx` — 데스크톱(상품명 아래) + 모바일(할인가 아래) 할인율 표시
- `components/product/AddToCartSection.tsx` — `totalPrice` 버그 수정: `product.price` → `discountPrice ?? price`

#### NewArrivals 캐러셀 인터랙션
- `components/sections/NewArrivals.tsx` — 서버 컴포넌트 → `'use client'` 전환
  - **화살표 버튼**: `scrollBy({ behavior: 'smooth' })` / 맨 처음이면 좌측 버튼 숨김, 맨 끝이면 우측 버튼 숨김
  - 초기 상태: `ResizeObserver`로 마운트 후 `updateScrollState()` 호출, `clientWidth || offsetWidth` fallback
  - **드래그 스크롤**: `useRef` 기반 (`isDragging`, `dragStartX`, `dragScrollLeft`, `hasDragged`)
  - **snap 비활성화**: `onMouseDown`에서 `el.style.scrollSnapType = 'none'` → `onMouseUp`에서 `''`로 복원 (드래그 중 카드 snap으로 끊기는 현상 제거)
  - **rAF 최적화**: `pendingDelta` ref + `requestAnimationFrame`으로 프레임당 1회만 `scrollLeft` 갱신, `mouseup`에서 미처리 rAF 취소
  - 드래그 후 링크 클릭 방지: `hasDragged` + `onClickCapture`

### 검증
- `pnpm build`: 정상 (22개 라우트)

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-11 세션 33

### 완료 (badges 제거 → isBest Boolean 교체)

#### 스키마 & DB
- `prisma/schema.prisma` — `badges String[]` 제거, `isBest Boolean @default(false)` 추가
- `prisma db push --accept-data-loss` — DB 컬럼 변경 반영
- `prisma generate` — Prisma 클라이언트 재생성

#### 시드
- `prisma/seed.ts` — 각 상품의 `badges: ['BEST']` → `isBest: true`, `badges: ['NEW']`/`badges: []` → 해당 필드 제거. `createMany` 매핑에서 `badges` spread 제거. `pnpm exec tsx prisma/seed.ts` 실행: 15개 재삽입 완료

#### 타입 & 배지 로직
- `types/index.ts` — `badges: string[]` → `isBest: boolean`
- `lib/badge.ts` — 전면 재작성: `getLeftBadge`/`getRightBadge` → `getCardBadge()` 단일 함수
  - 우선순위: SOLD OUT (stock=0) > BEST (isBest=true) > NEW (createdAt 30일 이내)
  - `BADGE_LABEL` 추가 (`SOLD_OUT` → 'SOLD OUT' 표시용)

#### Server Actions
- `actions/product.ts` — `getNewArrivals()`: `badges.has('NEW')` OR 조건 제거 → `createdAt 30일 이내` 단일 조건
- `actions/cart.ts` — `CartItemWithProduct` 타입 + Prisma select: `badges` → `isBest`

#### 컴포넌트
- `components/ui/ProductCard.tsx` — `getLeftBadge`/`getRightBadge` → `getCardBadge()`, 배지 단일화
- `components/ui/ProductCardBase.tsx` — 동일 교체
- `components/product/ProductInfo.tsx` — `badges.map()` → `getCardBadge()` 단일 배지
- `components/product/ProductImages.tsx` — `badges[0]` → `getCardBadge()`
- `app/(main)/cart/CartClient.tsx` — `badges[0]` → `product.isBest` 직접 체크

### 검증
- `pnpm build`: 정상 (22개 라우트, TypeScript 에러 없음)

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-11 세션 32

### 완료 (신상품 기준 개선 + seed 날짜 분산)

#### 1. `actions/product.ts` — `getNewArrivals()` 수정
- 기존: `isActive: true` 조건만 적용, 최근 N개 반환
- 변경: OR 조건 추가 — `badges has 'NEW'` OR `createdAt >= 30일 전`

#### 2. `prisma/seed.ts` — 날짜 분산
- `daysAgo(n)` 헬퍼 함수 추가, `as const` 제거 후 각 상품에 `createdAt` 명시
- 신상품 5개 (30일 이내): 네츄럴코어(5일), 테비 참치 퓨레(8일), 위시츄 덴탈 츄(12일), 아카나 퍼시픽 필하드(20일), 라비오뜨 자동 급수기(25일)
- 구상품 10개 (35~100일 전): BEST 배지 상품 포함 나머지 전체
- `pnpm prisma db seed` 실행: Product 15건 재삽입 완료

### 검증
- 브라우저(dev) 홈 신상품 섹션: 정확히 5개 표시 (NEW 배지 4개 + 30일 이내 1개)
- BEST 배지 상품(오리젠·힐스·져스트 등) 모두 제외 확인, createdAt 내림차순 정렬 정상

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-11 세션 31

### 완료 (배지 스타일 상수 통합 + 메인 품절 dimming)
- `lib/badge.ts` — `BADGE_STYLES` 상수 추가. `BEST: 'bg-[#4E7CAE] text-white'`, `NEW: 'bg-primary-container text-on-primary'`, `SOLD_OUT: 'bg-inverse-surface text-inverse-on-surface'`
  - `getRightBadge` 반환값 '품절' → **'SOLD OUT'** 변경
  - `getLeftBadge` 반환 타입 `string | null` → `'BEST' | 'NEW' | null` 명시
- `lib/constants.ts` — 기존 `BADGE_STYLES` 제거 (badge.ts로 이관 완료)
- `ProductCardBase` · `ProductCard` — import를 `@/lib/constants` → `@/lib/badge`로 교체, 좌측 배지 `BADGE_STYLES[leftBadge]`, 우측 SOLD OUT 배지 `BADGE_STYLES.SOLD_OUT` 사용
- `ProductImages` · `ProductInfo` — 상세 페이지 배지도 동일 import 교체 (`as Record<string, string>` 캐스트로 동적 key 허용)
- `components/ui/ProductCard.tsx` — `soldOut` 시 `opacity-60` 추가. 메인 신상품 캐러셀의 품절 상품도 shop 리스트와 동일하게 dimmed 처리됨.

### 검증
- `pnpm build`: 정상 (22개 라우트, 타입 에러 없음)
- 브라우저(dev): 메인 신상품 캐러셀에서 힐스 사이언스 다이어트 어덜트 1.5kg `opacity-60` 적용 확인 (DOM querySelector 검증)

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-11 세션 30

### 완료 (배지 시스템 통일 + 품절 카드 처리)

#### 1. seed 품절 상품 추가 + 버그 수정
- `prisma/seed.ts` — `prisma.wishlist.deleteMany()` 추가 (외래키 참조 순서: Cart → Wishlist → Product). Wishlist 모델 추가 이후 누락된 delete 로직이었음.
- '힐스 사이언스 다이어트 어덜트 1.5kg' 신규 추가 (`stock: 0`, `badges: ['BEST']`, 강아지 사료). 강아지 사료 3개 → 4개, 전체 15개.
- `pnpm prisma db seed` 실행: Cart 1건·Wishlist 2건·Product 14건 삭제 후 15개 재삽입 완료.

#### 2. 배지 시스템 통일
- `lib/badge.ts` 신규 — `getLeftBadge(product)` (BEST > NEW 우선순위, null 가능), `getRightBadge(product)` (stock===0일 때만 '품절', null 가능)
- `components/ui/ProductCardBase.tsx` — WishlistButton 제거, getLeftBadge/getRightBadge 적용. 우측 배지 영역이 하트 자리를 대체. 품절(`!isActive || stock===0`) 시 `opacity-60`. Quick Add 버튼: 판매종료 → '판매종료', stock===0 → '품절' + `bg-surface-container text-tertiary cursor-not-allowed` 스타일.
- `components/ui/ProductCard.tsx` — WishlistButton 제거. StockBadge/StatusBadge/hasStockIssue 로직 제거. getLeftBadge/getRightBadge 적용. 좌하단 품절임박 배지 제거. `cartDisabled = !isActive || stock===0`, `disabledLabel = isDiscontinued ? '판매종료' : '품절'`.
- `components/ui/AddToCartButton.tsx` — `disabledLabel?: string` prop 추가 (기본값 '품절'). disabled 시 prop 텍스트 표시.

### 검증
- `pnpm build`: 정상 (22개 라우트, 타입 에러 없음)
- 브라우저(dev) `/shop/dog/food`: 4개 카드 중 힐스 사이언스 다이어트 어덜트 1.5kg가 좌BEST·우품절 배지 + opacity-60 표시. Quick Add 호버 텍스트: 정상 카드 "Add to Cart", 품절 카드 "품절" 확인.

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-11 세션 29

### 완료 (ProductCardBase 통합 리팩터링)
- `components/ui/ProductCardBase.tsx` 신규 — ShopProductCard(ProductGrid)와 찜 전용 카드(WishlistClient)의 공통 베이스 컴포넌트
  - 이미지(`aspect-square md:aspect-[4/5]`, `rounded-xl`, `object-cover`, shadow + hover lift) · 배지 · 하트(WishlistButton) · 카테고리/상품명/가격 포함
  - 이미지~가격 영역만 `<Link href="/shop/product/${id}">` 래핑, 하단 액션 영역은 `children`으로 Link 바깥에 주입
  - 품절(`!isActive || stock === 0`) 시 `opacity-60` + "품절" 배지 — WishlistClient에 있던 로직을 베이스로 이관 (ProductGrid도 품절 상태 표시 가능하게 됨)
  - `showQuickAdd?: boolean` — `true` 시 이미지 하단 호버 Quick Add 오버레이 렌더 (ProductGrid 전용)
- `components/ui/ProductGrid.tsx` — `ShopProductCard` 인라인 정의 제거, `<ProductCardBase showQuickAdd />` 로 교체. 파일 50줄 → 14줄
- `app/(main)/wishlist/WishlistClient.tsx` — 인라인 카드 마크업 제거, `<ProductCardBase>` + `children`(체크박스 + 담기 버튼) 패턴으로 교체. 불필요해진 Image/Link/WishlistButton/BADGE_STYLES/PRODUCT_CATEGORY_LABELS import 제거

### 검증
- `pnpm build`: 정상 (22개 라우트, 타입 에러 없음)
- 브라우저(dev): `/shop` 4열 그리드·배지·하트 동일, `/wishlist` 카드 디자인 동일 + 카드 아래 체크박스·장바구니 담기 버튼 정상 렌더 확인

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-10 세션 28

### 완료 (찜 목록 4-2단계 — 장바구니 담기 + 일괄 담기)
- `app/(main)/wishlist/WishlistClient.tsx` 신규 (`'use client'`) — 찜 전용 그리드. `ProductGrid`는 `/shop` 공유 컴포넌트라 오염 방지 차원에서 카드 비주얼만 미러링하고 별도 작성
  - 각 카드: 선택 체크박스 + "장바구니 담기" 버튼 → `addToCart(productId, 1)`. 담아도 찜 유지(`toggleWishlist` 미호출)
  - 상단 툴바: 전체 선택 체크박스 `(선택/담기가능)` + "선택 상품 장바구니 담기" 버튼 → 선택 상품 `Promise.all`로 일괄 `addToCart`
  - 담기 성공 시 Toast "장바구니에 추가되었습니다" (일괄도 동일, 일부 실패 시 "N개 상품을 담지 못했습니다")
  - 품절(`!isActive || stock === 0`): "품절" 배지 + 카드 dimmed + 체크박스·담기 버튼 disabled, 전체 선택 분모에서 제외
  - 전체 선택 기본값은 미선택 (찜은 "선택 후 담기" 흐름이 자연스러움)
- `app/(main)/wishlist/page.tsx` — 목록 표시를 `ProductGrid` → `WishlistClient`로 교체 (빈 상태·헤더는 서버 컴포넌트 유지)

### 검증
- `pnpm build`: 정상 (22개 라우트, 타입 에러 없음)
- 브라우저(dev): 찜 3건(정상 2 + 품절 1) 시드 후
  - 툴바 전체 선택 `(0/2)` — 품절 제외 분모 정확, 일괄 버튼 초기 비활성
  - 품절 카드: 버튼 "품절"·disabled, 체크박스 disabled, dimmed 확인
  - 단건 담기 → Toast "장바구니에 추가되었습니다", 찜 하트 3개 유지(담아도 찜 해제 안 됨), 헤더 장바구니 배지 1→2
  - 전체 선택 `(2/2)` → 일괄 담기 → 배지 2→3 (아카나 수량 누적 + 네츄럴코어 신규)
  - 검증용 시드(찜 3건·임시 품절 stock0·테스트 장바구니 2건)는 모두 원복: cart 오리젠 q1만, wishlist 0, 오리젠 stock 45
- 참고: 헤더 배지가 담기 직후 갱신된 것은 Server Action 호출이 현재 라우트를 재검증하기 때문

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-10 세션 27

### 완료 (찜 목록 페이지 1차)
- `app/(main)/wishlist/page.tsx` 신규 — 서버 컴포넌트. `getWishlist()` 조회 → `item.product` 매핑 후 `ProductGrid` 재사용 (`/shop`과 동일 그리드 디자인)
  - 헤더: "찜 목록" + 총 개수 (데스크톱 중앙 / 모바일 좌측, ShopListContent 헤더 스타일 차용)
  - 빈 상태: 원형 favorite 아이콘 + "찜한 상품이 없습니다." + "쇼핑하러 가기"(→ `/shop`) 버튼
- `proxy.ts` — matcher에 `/wishlist`, `/wishlist/:path*` 추가 (비로그인 시 `/auth/login?callbackUrl=` 리다이렉트)
- `actions/wishlist.ts` — `getWishlist()`의 product select를 부분 필드 → `product: true`(전체 Product)로 변경. `ProductGrid`(props `Product[]`)에 그대로 전달 가능하게 함
- `types/index.ts` — `WishlistItemWithProduct.product` 타입을 부분 객체 → `Product`로 단순화
- `ARCHITECTURE.md` — (main) 트리에 `wishlist/`, URL 표 `/wishlist` 보호 라우트, v1 찜하기 항목 완료 체크

### 검증
- `pnpm build`: 정상 (22개 라우트, `/wishlist` ƒ Dynamic 추가, 타입 에러 없음)
- 브라우저(dev): 빈 상태(총 0개 + 안내 + 버튼) 정상, 찜 3개 추가 후 `/wishlist` → `/shop` 동일 그리드 3개 + "총 3개 상품" + 헤더 배지 "3" 확인. 검증 후 찜 전체 해제, DB `wishlist` 0 rows 확인
- 참고: 1차 작업이라 `/wishlist`에서 하트 해제 시 카드가 즉시 사라지지 않고 다음 새로고침에 반영됨 (서버 렌더 목록 + Provider Optimistic 분리)

### 현재 상태
- `pnpm build`: 정상 (22개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-10 세션 26

### 완료 (찜하기 3단계 — 헤더 찜 배지)
- `components/layout/Header.tsx` (데스크톱) — `getWishlistCount()` import 추가, `Promise.all([getCartCount(), getWishlistCount()])` 병렬 호출. 찜 `<button>` → `<Link href="/wishlist">` 교체 + 배지(`wishlistCount > 0`일 때, 9 초과 시 `9+`). 장바구니 배지와 동일 스타일(`-top-2 -right-2`)
- `components/layout/MobileHeader.tsx` (서버 래퍼) — `Promise.all`에 `getWishlistCount()` 추가, `wishlistCount` prop 전달
- `components/layout/MobileHeaderClient.tsx` — `wishlistCount: number` prop 수신, 찜 `<button>` → `<Link href="/wishlist">` 교체 + 배지(`-top-1 -right-1`, 동일 규칙)
- `ARCHITECTURE.md` — Header/MobileHeader/MobileHeaderClient 설명에 찜 배지·`/wishlist` 링크 반영

### 검증
- `pnpm build`: 정상 (21개 라우트, TypeScript 에러 없음)
- 브라우저(dev): 찜 2개 추가 후 새로고침 → 데스크톱·모바일 헤더 모두 찜 아이콘 배지 "2" 표시, `href="/wishlist"` 확인. 검증 후 찜 2개 해제로 DB 정리
- 참고: 헤더 배지는 서버 렌더 값이라 찜 토글 직후 즉시 갱신되지 않고 다음 네비게이션/새로고침 때 반영됨 (장바구니 배지와 동일 동작). `/wishlist` 페이지는 아직 미구현이라 링크 클릭 시 404 (다음 단계)

### 미완료 / 다음 세션
- `/wishlist` 페이지 + `proxy.ts` matcher 보호 라우트 (현재 헤더 링크 대상)

### 현재 상태
- `pnpm build`: 정상 (21개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-10 세션 25

### 완료 (찜하기 2단계 — UI 연동)
- 찜 상태 전달 방식: **별도 단건 조회 + Context** 채택 (상품 조회에 isWishlisted 미포함)
  - `actions/wishlist.ts` — `getWishlistedProductIds(): Promise<string[]>` 추가 (유저 찜 ID 전체 1쿼리)
  - `app/(main)/layout.tsx` — async 전환, `getWishlistedProductIds()` 호출 후 `WishlistProvider`에 초기값 주입
- `components/wishlist/WishlistProvider.tsx` 신규 — 찜 ID `Set<string>` Context
  - `isWishlisted(id)` / `toggle(id)`. `toggle`은 Optimistic(즉시 setIds) → `toggleWishlist` 서버 호출 → 실패 시 롤백 + `/auth/login`, 성공 시 Toast
- `components/ui/WishlistButton.tsx` 신규 — `useWishlist()` 구독 하트 (`div role="button"`, Link 내부 중첩 대비 `preventDefault`/`stopPropagation`)
  - 찜 상태에 따라 채움(`icon-fill`)/비움 + 색상 분기, `className`·`iconClassName`으로 위치/크기 주입
- `app/globals.css` — `@utility icon-fill` 추가 (Material Symbols `FILL 1` 채워진 하트)
- `components/ui/ProductCard.tsx` — 이미지 우상단 `WishlistButton` 오버레이 추가, 기존 미동작 모바일 하트 div 제거, 재고이슈 보조 배지 우상단→좌하단 이동(하트와 겹침 방지)
- `components/ui/ProductGrid.tsx` — 자체 `ShopProductCard`의 미동작 hover 하트 div를 `WishlistButton`으로 교체 (상품 리스트 13개 페이지가 ProductCard가 아닌 이 컴포넌트를 사용하므로 함께 연동, 상시 표시로 찜 상태 노출)
- `components/product/AddToCartSection.tsx` — 데스크톱 액션 박스의 기존 찜 `<button>`을 `WishlistButton`으로 교체

### 검증
- `pnpm build`: 정상 (21개 라우트, TypeScript 에러 없음)
- 브라우저(dev): `/shop` 그리드·상품 상세 양쪽에서 클릭 시 Optimistic 채움/비움, 서버 영속화, 재클릭 해제 확인. 콘솔/서버 에러 없음. (테스트로 추가한 찜은 모두 해제해 DB 정리)
- 주의: 스키마 변경 후 dev 서버는 stale Prisma 클라이언트를 들고 있어 재시작 필요했음 (`prisma.wishlist` undefined → 재시작 후 해결)

### 미완료 / 다음 세션
- `/wishlist` 페이지 + `proxy.ts` matcher 보호 라우트
- 헤더 찜 아이콘 카운트 배지 (`getWishlistCount()`)

### 현재 상태
- `pnpm build`: 정상 (21개 라우트)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-10 세션 24

### 완료 (찜하기 1단계 — 스키마·Server Actions)
- `prisma/schema.prisma` — `Wishlist` 모델 추가
  - `id` / `userId` / `productId` / `createdAt`, `@@unique([userId, productId])`로 중복 찜 방지
  - `User`·`Product`와 relation, `User.wishlist`·`Product.wishlist` 역참조 필드 추가
- `prisma db push` + `generate` 실행 — Supabase DB에 Wishlist 테이블 반영
  - prisma CLI가 `.env.local`을 자동 로드하지 않아 `node --env-file=.env.local node_modules/prisma/build/index.js db push`로 실행 (`prisma.config.ts`가 `process.env.DIRECT_URL` 참조)
- `types/index.ts` — `WishlistItemWithProduct` 인터페이스 추가 (`getWishlist()` 반환 타입, 상품 정보 포함)
- `actions/wishlist.ts` 신규 작성
  - `toggleWishlist(productId)` — 있으면 삭제·없으면 추가, `ActionResult<{ wishlisted: boolean }>` 반환
  - `getWishlist()` — 현재 유저 찜 목록 (상품 정보 포함, createdAt 내림차순)
  - `getWishlistCount()` — 찜 개수
  - 비로그인 처리: 조회는 빈 배열/0, 토글은 `{ success: false, error: '로그인이 필요합니다.' }`
- `ARCHITECTURE.md` — `actions/wishlist.ts`, `/wishlist` 라우팅, `Wishlist` 테이블(DB 모델 섹션), `WishlistItemWithProduct` 타입, v1 목표에 찜하기 항목 반영

### 미완료 / 다음 세션 (찜하기 2단계 — UI)
- `/wishlist` 페이지 + `proxy.ts` matcher에 `/wishlist` 추가 (보호 라우트)
- 상품 카드·상세 페이지에 찜 토글 버튼 (`favorite` 아이콘) 연동
- 헤더 찜 아이콘 카운트 배지 (`getWishlistCount()`)

### 현재 상태
- `pnpm build`: 정상 (21개 라우트, TypeScript 에러 없음)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-09 세션 23

### 완료
- `components/layout/MobileHeader.tsx` — `getCartCount()` import 추가, `Promise.all([auth(), getCartCount()])` 병렬 호출 후 `cartCount` prop 전달
- `components/layout/MobileHeaderClient.tsx` — 하드코딩된 배지 `'2'` 제거, `cartCount: number` prop 수신, 0개 시 배지 숨김·9개 초과 시 `'9+'`, `<button>` → `<Link href="/cart">` 교체
- `app/cart/page.tsx` + `app/cart/CartClient.tsx` — `SuggestionsSection` 더미 데이터(`SUGGESTIONS` 상수) 제거, `getMdPickProducts()` DB 연동, `suggestions: Product[]` prop 주입, 카드 → `<Link>` 교체
- `app/mypage/MypageClient.tsx` 분리 — 22줄 조합 컴포넌트로 축소
  - `components/mypage/ProfileCard.tsx` — 아바타·이름·이메일·로그아웃 버튼
  - `components/mypage/NameChangeForm.tsx` — 이름 변경 폼, `useState`·`useTransition` 소유
  - `components/mypage/PasswordModal.tsx` — 비밀번호 변경 카드 + 모달 + 닫기 확인 ConfirmModal
  - `components/mypage/OrderHistory.tsx` — 주문 내역 플레이스홀더
- `app/shop/product/[id]/ProductDetailClient.tsx` 분리 — 23줄 조합 컴포넌트로 축소
  - `components/product/ProductImages.tsx` — 데스크톱 갤러리 + 모바일 히어로, `activeThumb` 상태 소유
  - `components/product/ProductInfo.tsx` — 데스크톱 상품 정보 + 모바일 info card
  - `components/product/ProductTabs.tsx` — 데스크톱/모바일 탭, `desktopTab`·`mobileTab` 상태 소유
  - `components/product/AddToCartSection.tsx` — `qty`·`isPending`·`handleAddToCart` 소유, 데스크톱 action box + 모바일 sticky bar
  - `components/ui/QuantityControl.tsx` — 수량 +/- 공통 컴포넌트 (`compact` / 기본 variant), `CartClient`·`AddToCartSection` 재사용
- `types/index.ts` — `ActionResult<T = void>` 공통 타입 추가
- Server Action 반환 타입 통일 (`{ error?: string }` / `{ success: boolean }` / `void` → `ActionResult`)
  - `actions/cart.ts` — `addToCart`, `removeFromCart`, `removeSelectedFromCart`, `updateCartQuantity`
  - `actions/auth.ts` — `loginUser`, `registerUser`
  - `actions/user.ts` — `updateUserName`, `updateUserPassword`
- 영향받는 컴포넌트 6개 `result?.error` → `!result.success` 교체
  - `AddToCartButton`, `AddToCartSection`, `login/page`, `register/page`, `NameChangeForm`, `PasswordModal`

### 현재 상태
- `pnpm build`: 정상 (21개 라우트, TypeScript 에러 없음)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-09 세션 22

### 완료
- `app/mypage/MypageClient.tsx` — 좌측 카드(회원 정보 수정, 비밀번호 변경)와 우측 카드(주문 내역) 높이 통일
  - 그리드 컨테이너에 `items-stretch` 추가
  - 회원 정보 수정 카드에 `flex-1` 추가 → 우측 카드와 동일 높이 채움
- `components/layout/Header.tsx` — 데스크톱 검색창 UI 주석 처리 (TODO 포함)
- `components/layout/MobileHeaderClient.tsx` — 모바일 검색창 UI 주석 처리 (TODO 포함)
- `README.md` — `## v2 구현 예정` 섹션 추가 (배송지 관리 / 상품 옵션 / 찜 목록 / 주문 내역 / 소셜 로그인 / 장바구니 개선 / 상품 리뷰 / 결제)

### 현재 상태
- `pnpm build`: 정상 (21개 라우트, TypeScript 에러 없음)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-09 세션 21

### 완료
- `app/auth/register/page.tsx` — react-hook-form 적용 및 유효성 검사·UX 개선
  - `useForm<FormValues>({ mode: 'onTouched' })` — 첫 blur 후 onChange 재검사
  - 유효성 검사: 이름(1자 이상) / 이메일(형식 검사) / 비밀번호(8자 이상) / 비밀번호 확인(일치 검사) / 약관 동의(필수)
  - 비밀번호 확인 실시간 일치 표시: `watch` 값 직접 비교 → 일치 시 초록 체크 + 링 표시
  - 비밀번호 변경 시 confirmPassword 자동 재검사 (`trigger('confirmPassword')` via onChange)
  - 비밀번호 / 비밀번호 확인 보기/숨기기 토글 (visibility / visibility_off 아이콘)
  - 각 필드 에러 메시지 필드 하단 표시 + 에러 상태 붉은 링
  - 서버 액션 `registerUser` 반환 에러("이미 사용 중인 이메일입니다.") → `setError('email')` 로 이메일 필드 하단 표시
  - 기존 useState 기반 → react-hook-form으로 전면 교체, 코드 간소화

### 현재 상태
- `pnpm build`: 정상 (21개 라우트, TypeScript 에러 없음)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-08 세션 20

### 완료
- `prisma/schema.prisma` — `Product` 모델에 `isActive Boolean @default(true)` 추가
- `types/index.ts` — `Product` 인터페이스에 `isActive: boolean` 추가
- `prisma db push` — Supabase DB에 컬럼 반영 (기존 상품 전체 isActive = true)
- `prisma generate` — Prisma 클라이언트 재생성
- `actions/product.ts` — 모든 조회 함수에 `isActive: true` 필터 추가
  - `getProducts()`, `getNewArrivals()`, `getMdPickProducts()` — where 조건 추가
  - `getProductById()` — `findUnique({ where: { id, isActive: true } })` → isActive=false 시 null 반환 → 페이지에서 notFound() 호출
- `actions/cart.ts` — `CartItemWithProduct` 타입과 `getCart()` select에 `isActive` 추가
- `app/cart/CartClient.tsx` — isActive=false 상품 처리
  - 초기 checked 상태: 비활성 상품 제외
  - 전체선택 카운터: 활성 상품만 집계
  - 체크박스: disabled + opacity-40
  - 수량 컨트롤: 대시(—)로 대체
  - 금액 표시: 대시(—)로 대체
  - "판매 종료된 상품입니다" 텍스트 표시 (데스크톱/모바일 모두)
  - 카드 opacity: 0.6으로 dimmed 처리
  - 결제 금액: 비활성 상품 자동 제외

### 현재 상태
- `pnpm build`: 정상 (20개 라우트, TypeScript 에러 없음)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-05 세션 19

### 완료
- `actions/cart.ts` — 장바구니 Server Actions 신규 작성
  - `getCart()` · `getCartCount()` · `addToCart()` · `removeFromCart()` · `removeSelectedFromCart()` · `updateCartQuantity()` (반환 타입 `{ success: boolean }`으로 변경)
- `components/ui/AddToCartButton.tsx` — 장바구니 추가 클라이언트 컴포넌트 (비로그인 → /auth/login, 성공 → Toast)
- `components/ui/Toast.tsx` — 전역 Toast 시스템 (`ToastProvider` + `useToast`, `success`/`error` 타입 분기)
- `components/ui/ConfirmModal.tsx` — 삭제 확인 모달 (overlay 클릭 취소, `isOpen=false` 시 `pointer-events-none` 수정)
- `components/ui/ProductCard.tsx` — "Add to Cart" div → `<AddToCartButton>` 교체
- `components/layout/Header.tsx` — `getCartCount()` 배지 + `/cart` 링크 전환
- `app/layout.tsx` — `ToastProvider` 전역 등록
- `app/cart/page.tsx` — 장바구니 서버 컴포넌트 (proxy.ts 미들웨어로 비로그인 차단)
- `app/cart/CartClient.tsx` — 장바구니 클라이언트 컴포넌트 전체 구현
  - 빈 장바구니 / 상품 있는 상태 분기
  - 데스크톱: 좌 2/3 아이템 + 우 1/3 주문 요약 sticky
  - 모바일: 카드형 목록 + 결제 예정 금액 카드 + 하단 sticky 주문바
  - 체크박스 전체/개별 선택, 소계·배송비·총액 실시간 계산 (100,000원 이상 무료배송)
  - `useOptimistic` — 수량 변경 즉시 UI 반영, 서버 실패 시 자동 롤백
  - pending 상태 3원 분리: `quantityPendingIds` / `deletePendingIds` / `isSelectedDeleting`
  - 삭제 시 `ConfirmModal` 확인 후 진행, 완료 시 Toast 표시
  - "함께 구매하면 좋은 상품" 섹션 (UI만)
- `components/layout/Footer.tsx` — `mt-16 md:mt-24` 상단 여백 추가 (전 페이지 일괄 적용)

### 버그 수정
- `ConfirmModal` — `isOpen=false`일 때 내부 카드 `pointer-events-none` 누락 → 보이지 않는 카드가 클릭 차단하는 버그 수정
- `updateCartQuantity` — `revalidatePath` 불필요한 호출 제거 (수량 변경은 헤더 배지에 영향 없음)
- `handleQuantity` — `setItems`를 `startTransition` 바깥에서 호출하던 구조 → `useOptimistic` 패턴으로 교체 (화면 끊김 제거)

### 현재 상태
- `pnpm build`: 정상 (20개 라우트, TypeScript 에러 없음)
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-05 세션 18

### 완료
- `AGENTS.md` — 섹션 5·6·7 추가 (기존 내용 유지)
  - 섹션 5: Toast / ConfirmModal 공통 UI 컴포넌트 사용 규칙
  - 섹션 6: Server Actions 위치·구조·revalidatePath 규칙
  - 섹션 7: NextAuth v5 인증 패턴 (세션 확인, 보호 라우트, 로그아웃)
- `ARCHITECTURE.md` — 기존 내용 유지, 누락 항목만 추가
  - `layout/` 목록에 `MobileHeaderClient.tsx`, `BottomNav.tsx` 추가 및 `Header`·`MobileHeader` 설명 갱신
  - `ui/` 목록에 `ShopListContent`, `AddToCartButton`, `SignOutButton`, `ConfirmModal`, `Toast`, `ComingSoon` 추가
  - v1 목표 완료 항목 체크 (Supabase·DB 연동·인증·장바구니 4개 완료, 검색만 미완료)

### 현재 상태
- `pnpm build`: 정상
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-05 세션 17

### 완료
- `actions/cart.ts` — 장바구니 Server Actions 신규 작성
  - `getCart()` — 로그인 유저 장바구니 조회 (product 포함)
  - `getCartCount()` — 장바구니 아이템 수 조회 (헤더 배지용)
  - `addToCart(productId, quantity)` — 이미 있으면 수량 증가, 없으면 생성
  - `removeFromCart(cartId)` — 단일 삭제 (userId 검증)
  - `removeSelectedFromCart(cartIds[])` — 선택 삭제
  - `updateCartQuantity(cartId, quantity)` — 수량 변경
- `components/ui/AddToCartButton.tsx` — 상품 카드용 "Add to Cart" 클라이언트 컴포넌트
  - 비로그인 시 `/auth/login` 리다이렉트
  - 로그인 시 addToCart 호출 후 router.refresh()로 헤더 배지 갱신
- `components/ui/ProductCard.tsx` — "Add to Cart" div → `<AddToCartButton>` 교체
- `components/layout/Header.tsx` — 장바구니 아이콘 업데이트
  - `getCartCount()` 호출로 실제 수량 배지 표시
  - button → `<Link href="/cart">` 링크로 전환
  - 0개일 때 배지 숨김, 9개 초과 시 '9+' 표시
- `app/cart/CartClient.tsx` — 장바구니 클라이언트 컴포넌트 신규 작성
  - 빈 장바구니: shopping_cart 아이콘 + 안내 문구 + 쇼핑하러 가기 버튼
  - 상품 있을 때: 체크박스 선택 + 수량 조절 + 삭제 (전체/선택/단일)
  - 데스크톱: 좌 3/4 아이템 목록 + 우 1/4 주문 요약 (sticky)
  - 모바일: 전체선택/선택삭제 + 카드형 목록 + 결제 예정금액 카드 + 하단 sticky 주문바
  - 배송비 3,000원 고정, 100,000원 이상 무료 자동 적용
  - 체크박스 선택 상태 기반 소계·총액 실시간 계산
  - "함께 구매하면 좋은 상품" 섹션 (UI만, 정적 더미 데이터, /images/placeholder.jpg)
- `app/cart/page.tsx` — 장바구니 페이지 서버 컴포넌트 신규 생성
  - `proxy.ts`가 `/cart/*` 비로그인 접근 차단 (기존 미들웨어 활용)
  - `getCart()` 호출 후 `CartClient`에 initialItems 전달

### 현재 상태
- `pnpm build`: 정상 (20개 라우트, /cart ƒ Dynamic 추가)
- `pnpm dev`: 정상
- 장바구니: 비로그인 → /auth/login 리다이렉트, 로그인 → 장바구니 CRUD 완전 구현
- 헤더 장바구니 아이콘: 실제 수량 배지 + /cart 링크
- 상품 카드 "Add to Cart": DB 연동 완료
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-05 세션 16

### 완료
- `actions/auth.ts` — `signOut` import 추가 + `logoutUser()` Server Action 추가
- `components/ui/SignOutButton.tsx` — 로그아웃 폼 클라이언트 컴포넌트 (form action으로 logoutUser 호출)
- `components/layout/Header.tsx` — async 서버 컴포넌트로 전환
  - `auth()` 호출로 세션 확인
  - 로그인 상태: 이름 + `<SignOutButton />` 표시
  - 비로그인: person 아이콘 → `/auth/login` 링크
- `components/layout/MobileHeaderClient.tsx` — 기존 MobileHeader 로직을 클라이언트 컴포넌트로 분리 (session prop 수신)
- `components/layout/MobileHeader.tsx` — async 서버 래퍼로 교체
  - `auth()` 호출, session을 MobileHeaderClient에 전달
  - 기존 `<MobileHeader />` 임포트 경로 유지 → 16개 페이지 수정 불필요
- `components/layout/MobileDrawer.tsx` — session prop 추가, 하단 Login 섹션 교체
  - 비로그인: `/auth/login` 링크
  - 로그인: 이름 표시 + `<SignOutButton />`
- `pnpm build` 정상 (19개 라우트, 모든 shop/* 페이지 ƒ Dynamic으로 전환됨)

### 현재 상태
- `pnpm build`: 정상 (19개 라우트)
- `pnpm dev`: 정상
- 헤더 로그인 연동: 데스크톱(person 아이콘 → 로그인/로그아웃) + 모바일 드로어 하단 완료
- 마지막 수정 파일: `CHANGELOG.md`

---

## 2026-06-05 세션 15

### 완료
- `pnpm add next-auth@beta bcryptjs` — NextAuth v5 (5.0.0-beta.31) + bcryptjs 설치
- `auth.ts` — NextAuth Credentials Provider 설정
  - Prisma `User.email` + bcrypt 비밀번호 검증
  - JWT 세션 전략, `session.user.id` 포함 callback
  - TypeScript `declare module 'next-auth'` 세션 타입 확장
- `app/api/auth/[...nextauth]/route.ts` — NextAuth API 핸들러 (GET/POST)
- `middleware.ts` 삭제 (Supabase SSR 세션 갱신) → `proxy.ts` 신규 생성
  - `/cart/:path*` 경로 진입 시 비로그인 유저 → `/auth/login?callbackUrl=...` 리다이렉트
  - Next.js 16 `ƒ Proxy (Middleware)` 로 빌드 결과에서 정상 인식 확인
- `actions/auth.ts` — 로그인 + 회원가입 Server Actions
  - `loginUser`: signIn('credentials') 호출, AuthError → 에러 메시지 반환, NEXT_REDIRECT re-throw
  - `registerUser`: 이메일 중복 체크, bcrypt.hash(pw, 12), prisma.user.create
- `app/auth/login/page.tsx` — 로그인 페이지 (클라이언트 컴포넌트)
  - 이메일·비밀번호 입력, 에러 메시지, `useTransition` pending 상태
  - DESIGN_SYSTEM.md 토큰 기반 UI: surface-container-lowest 카드, primary-container CTA
- `app/auth/register/page.tsx` — 회원가입 페이지 (클라이언트 컴포넌트)
  - 이름·이메일·비밀번호 입력, 이용약관 체크박스, 성공 시 /auth/login 이동
- `.env.local.example` — `NEXTAUTH_SECRET` → `AUTH_SECRET` (NextAuth v5 권장)
- `pnpm build` 정상 (19개 라우트, 타입 에러 없음)

### 미완료 / 다음 세션
- 헤더에 로그인/로그아웃 버튼 연동 (`auth()` 서버 컴포넌트에서 세션 확인)
- 장바구니 Server Actions (`actions/cart.ts`)
- NextAuth `AUTH_SECRET` 환경변수 .env.local에 추가 필요

### 현재 상태
- `pnpm build`: 정상 (19개 라우트)
- `pnpm dev`: 정상
- 인증: NextAuth v5 JWT 세션, /auth/login + /auth/register 구현
- proxy.ts: /cart 비로그인 접근 차단
- 마지막 수정 파일: `CHANGELOG.md`

---

## 형식

```
## YYYY-MM-DD 세션 N

### 완료
- 항목

### 미완료 / 다음 세션
- 항목

### 현재 상태
- pnpm dev 동작 여부
- 마지막으로 작업한 파일
```

---

<!-- 실제 세션 기록은 여기서부터 -->

## 2026-06-02 세션 14

### 완료
- `prisma/schema.prisma` — `Product` 모델에 `isMdPick Boolean @default(false)` 필드 추가
- `prisma db push` — Supabase DB에 컬럼 반영
- `prisma generate` — Prisma 클라이언트 재생성 (isMdPick 타입 포함)
- `prisma/seed.ts` — 4개 상품에 `isMdPick: true` 지정 후 seed 재실행
  - 오리젠 오리지날 그레인프리 소고기&연어 800g (강아지 사료 BEST)
  - 져스트 드라이드 치킨 저키 120g (강아지 간식 BEST)
  - 트럼펫 소프트클로버 이뮨부스터 60g (강아지 영양제 BEST)
  - 이나바 치루 참치&닭 14g×4 (고양이 간식 BEST)
- `components/ui/CircularItem.tsx` — 원형 이미지 꽉 채움 수정
  - 기존: inner wrapper `md:w-16 md:h-16` 인셋 + `md:object-contain` → 이미지 작게 떠 있는 버그
  - 수정: 부모 div에 `relative` 이동, inner wrapper 제거, `Image fill + object-cover` 직접 적용
- `components/sections/HeroBanner.tsx` — 배경 이미지 Unsplash 실사 이미지로 교체
  - `images.unsplash.com/photo-1546377791-2e01b4449bf0` (강아지+고양이 함께 있는 사진)
  - `unoptimized` 제거, `fill + object-cover` 유지
- `next.config.ts` — `images.unsplash.com` remotePatterns 허용 (이전 세션에서 추가, 이번 세션에서 실제 사용)

### 현재 상태
- `pnpm build`: 정상 (17개 라우트)
- `pnpm dev`: 정상
- 히어로 배너: Unsplash 실사 이미지 표시
- MD 추천 원형 이미지: fill+object-cover로 꽉 채움
- 더미 데이터: 전 페이지 제거 완료
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-02 세션 13

### 완료
- `types/index.ts` — `Product` 인터페이스에 `isMdPick: boolean` 추가 (Prisma 스키마와 동기화)
- `actions/product.ts` — 두 함수 추가
  - `getNewArrivals(limit = 8)` — createdAt 내림차순 최신 N개
  - `getMdPickProducts()` — `isMdPick: true` 상품 전체
- `components/sections/NewArrivals.tsx` — DUMMY_PRODUCTS 제거, `products: Product[]` props 수신으로 전환
  - `href="#"` → `<Link href="/shop">` 교체
  - View More 카드도 `/shop` 링크로 전환
- `components/sections/MdRecommendation.tsx` — DUMMY_RECS 제거, `products: Product[]` props 수신
  - `Product[] → CircularRecommendation[]` 매핑 (bgColor 4색 순환: primary-fixed / primary-fixed-dim / outline-variant / surface-container)
  - 상품 없을 때 `null` 반환 처리
- `app/page.tsx` — `async` 서버 컴포넌트 전환, `Promise.all([getNewArrivals(8), getMdPickProducts()])` 병렬 조회, 섹션에 props 전달
- `app/shop/product/[id]/page.tsx` — 서버 컴포넌트로 완전 교체
  - `getProductById(id)` 호출, `null`이면 `notFound()` 호출
  - `ProductDetailClient`에 product prop 전달
- `app/shop/product/[id]/ProductDetailClient.tsx` — 신규 클라이언트 컴포넌트
  - 수량·탭·썸네일 `useState` 유지
  - 실제 product prop 사용: 이름·가격·이미지·배지·discountPrice·브레드크럼 모두 DB 데이터
  - 배지 배열 전체 렌더링, discountPrice 있으면 취소선 + 할인가 표시
  - 카테고리 레이블 동적 생성 (animalCategory + productCategory)
- Prisma 클라이언트 재생성 (`prisma generate`) — isMdPick 필드 클라이언트 반영
- `pnpm build` 정상 (17개 라우트, 타입 에러 없음)
- 브라우저 확인: 메인 신상품·MD추천 DB 렌더링, 상세 페이지 실제 데이터 정상 표시

### 미완료 / 다음 세션
- NextAuth.js 설치 및 회원가입/로그인 구현
- 장바구니 Server Actions (`actions/cart.ts`)

### 현재 상태
- `pnpm build`: 정상 (17개 라우트)
- `pnpm dev`: 정상
- 더미 데이터: 메인페이지·상품 리스트·상품 상세 모두 제거 완료
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-02 세션 12

### 완료
- `next.config.ts` — `images.remotePatterns`에 `images.unsplash.com` 추가 (Unsplash 이미지 최적화 허용)
- `prisma/seed.ts` — imageUrl 전면 교체: 강아지 상품 10개 → 강아지 Unsplash 사진, 고양이 상품 4개 → 고양이 Unsplash 사진
  - `?w=600&q=80` 파라미터 통일
  - `badges: [...p.badges]` spread 수정 (as const readonly 타입 에러 해결)
- `pnpm prisma db seed` 재실행: 기존 14개 삭제 → Unsplash 이미지 14개 재삽입
- `actions/product.ts` 신규 생성
  - `getProducts({ animalCategory?, productCategory? })` — Prisma로 카테고리 필터 조회, `orderBy: createdAt desc`
  - `getProductById(id)` — 단일 상품 조회
  - `'use server'` 선언으로 클라이언트 컴포넌트에서도 호출 가능
- 상품 리스트 페이지 13개 전면 교체: DUMMY_PRODUCTS 제거 → `await getProducts({ ... })`로 교체
  - `/shop`, `/shop/dog`, `/shop/cat`
  - `/shop/food`, `/shop/treats`, `/shop/supplies`, `/shop/supplements`
  - `/shop/dog/food`, `/shop/dog/treats`, `/shop/dog/supplies`, `/shop/dog/supplements`
  - `/shop/cat/treats`, `/shop/cat/supplies`
- `pnpm build` 정상 통과 (17개 라우트, 타입 에러 없음)
- 브라우저 확인: `/shop` 총 14개 상품 + Unsplash 이미지 정상 렌더링, `/shop/cat` 총 4개 상품 + 고양이 이미지 정상 렌더링

### 미완료 / 다음 세션
- 상품 상세 페이지 (`/shop/product/[id]`) DB 연동 (`getProductById` 적용)
- NextAuth.js 설치 및 회원가입/로그인 구현
- 장바구니 Server Actions (`actions/cart.ts`)

### 현재 상태
- `pnpm build`: 정상 (17개 라우트)
- `pnpm dev`: 정상
- Supabase DB: Product 14개, Unsplash 이미지 URL 적용 완료
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-02 세션 11

### 완료
- `prisma/seed.ts` — 14개 상품 더미 데이터 시딩 스크립트 작성
  - 강아지 사료 3개 / 간식 3개 / 용품 2개 / 영양제 2개
  - 고양이 간식 2개 / 용품 2개
  - discountPrice 4개 (오리진, 져스트, 쿨링매트, 이나바)
  - badges: NEW 4개, BEST 4개, 빈 배열 6개
  - imageUrl: /images/placeholder.jpg 통일, detailContent: null, stock: 15~90
  - 실행 전 Cart → Product 순서로 기존 데이터 초기화 (idempotent)
- `prisma.config.ts` — `migrations.seed` 설정 추가 (Prisma 7 방식)
  - Prisma 7에서 seed 커맨드는 package.json이 아닌 prisma.config.ts에서 관리
  - `seed: 'tsx prisma/seed.ts'`
- `package.json` — `"prisma": { "seed": "tsx prisma/seed.ts" }` 추가 (레거시 호환)
- `pnpm add -D tsx dotenv` — seed 실행 환경 패키지 설치
- `pnpm-workspace.yaml` — esbuild 빌드 허용
- `pnpm prisma db seed` 실행 성공: Product 14개 Supabase DB 삽입 확인

### 미완료 / 다음 세션
- 더미 데이터 → Server Actions으로 교체 (product.ts: getProducts, getProductById)
- 상품 리스트·상세 페이지를 실제 DB 데이터로 연동
- NextAuth.js 설치 및 회원가입/로그인 구현

### 현재 상태
- `pnpm build`: 정상 (17개 라우트)
- Supabase DB: Product 14개 존재
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-02 세션 10

### 완료
- `types/index.ts` — Prisma 스키마 기반으로 전면 교체
  - `Product`: `category: string` 제거 → `productCategory: ProductCategory` + `animalCategory: AnimalCategory | null` + `description/detailContent/discountPrice/stock` 추가
  - `badges: ('NEW'|'BEST'|'HIT')[]` → `badges: string[]` (Prisma String[] 미러링)
  - `PRODUCT_CATEGORY_LABELS`, `ANIMAL_CATEGORY_LABELS` 유틸 맵 추가
  - `CircularRecommendation` 유지 (UI 전용)
- `components/ui/ProductGrid.tsx` — `product.category` → `PRODUCT_CATEGORY_LABELS[product.productCategory]`
- `components/ui/ProductCard.tsx` — 동일 수정
- `components/sections/NewArrivals.tsx` — DUMMY_PRODUCTS 새 타입으로 교체
- shop 페이지 13개 — DUMMY_PRODUCTS 일괄 변환 (Python 스크립트):
  - `category: '...'` → `productCategory`, `animalCategory` (제품명 기반 자동 결정)
  - `imageUrl: '/images/placeholder.svg'` → `'/images/placeholder.jpg'`
  - 누락 필드 추가: `description: null, detailContent: null, discountPrice: null, stock: 0`
- `pnpm build` 타입 에러 없이 통과 (17개 라우트)

### 현재 상태
- `pnpm build`: 정상 (TypeScript strict 통과)
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-02 세션 9

### 완료
- `prisma/schema.prisma` — 스키마 전면 교체 (사용자 지정 스키마 적용)
  - Product: id/name/description?/detailContent?/price/discountPrice?/imageUrl/stock/animalCategory?/productCategory/badges(String[])/timestamps
  - User: id/email/password(필수)/name?/createdAt (role 제거, updatedAt 제거)
  - Cart: id/userId/productId/quantity/createdAt — 단순 플랫 구조 (CartItem 분리 없음)
  - Badge enum 제거 → badges를 String[]로 변경
  - Role enum 제거
  - `prisma generate` 재실행 → 타입 재생성 완료
- `.env.local.example` / `lib/prisma.ts` / `lib/supabase.ts` — 세션 8에서 생성된 파일 그대로 유지 (변경 불필요)

### 미완료 / 다음 세션
- `.env.local` 실제 값 채우기 (사용자가 직접 입력)
- `prisma migrate dev` 실행 (Supabase DB에 테이블 생성)
- 더미 데이터 → Server Actions으로 교체
- NextAuth.js 설치 및 인증 구현

### 현재 상태
- `pnpm build` / TypeScript: 정상
- DB: 미연결 (환경변수 미설정)
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-02 세션 8

### 완료
- `pnpm add @prisma/client @prisma/adapter-pg @supabase/supabase-js pg` + `pnpm add -D prisma @types/pg` — 패키지 설치
- `pnpm-workspace.yaml` — `@prisma/engines`, `prisma` 빌드 스크립트 허용 (pnpm v11 allowBuilds)
- `.npmrc` — pnpm onlyBuiltDependencies 설정 (npx 경유 npm 경고는 무해)
- `prisma/schema.prisma` — Product·User·Cart·CartItem 테이블 + Enum 정의
  - Prisma 7 변경: datasource에서 url 제거 → prisma.config.ts로 이동
  - Product: id/name/price(Int)/imageUrl/badges(Badge[])/animalCategory?/productCategory/description/stock/isActive/timestamps
  - User: id/email/name/password?/role(CUSTOMER|ADMIN)/timestamps
  - Cart: User와 1:1 관계, CartItem 목록 포함
  - CartItem: [cartId, productId] 복합 unique로 중복 방지
- `prisma.config.ts` — Prisma 7 설정. datasource.url = DIRECT_URL (migrate 전용), 런타임은 lib/prisma.ts 어댑터 사용
- `.env.local.example` — 환경변수 키 목록 (값 비움): NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, DATABASE_URL, DIRECT_URL, NEXTAUTH_URL, NEXTAUTH_SECRET
- `.gitignore` — `.env*` 와일드카드에 `!.env.local.example` 예외 추가
- `lib/prisma.ts` — PrismaClient 싱글톤. Prisma 7 방식: PrismaPg 어댑터 + DATABASE_URL, HMR 중복 생성 방지
- `lib/supabase.ts` — 브라우저 클라이언트(anon key) + createSupabaseAdmin()(service role key, 서버 전용)
- `pnpm build` 최종 통과 (17개 라우트 정상 빌드)

### 미완료 / 다음 세션
- `.env.local` 실제 값 채우기 (Supabase 프로젝트 생성 후)
- `prisma migrate dev` 실행 (Supabase DB에 테이블 생성)
- 더미 데이터 → Server Actions으로 교체 (product.ts, cart.ts)
- NextAuth.js 설치 및 인증 구현

### 현재 상태
- `pnpm build`: 정상 (17개 라우트)
- DB: 미연결 (환경변수 미설정), 빌드·TypeScript는 통과
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-01 세션 7

### 완료
- `components/ui/ShopListContent.tsx` — 사이드바 표시 브레이크포인트 `md:`(768px) → `lg:`(1024px)로 변경
  - 원인: 768~1023px 구간에서 사이드바(208px) + 4컬럼 그리드가 공존해 카드폭 ~110px → 가격 줄바꿈·텍스트 심각하게 잘림
  - 수정 후: 768~1023px 구간에서는 사이드바 숨김 → 카드폭 150px+ → 가격 한 줄 표시, 이름 정상 클램프(line-clamp-2)
  - 1024px 이상에서는 기존과 동일하게 사이드바 표시
- `components/ui/ProductCard.tsx` / `ProductGrid.tsx` — 상품 카드 → `/shop/product/[id]` 링크 연결
  - `<button>` in `<a>` 구조(유효하지 않은 HTML) → 내부 버튼을 `<div>`로 교체하여 링크 정상 동작

### 현재 상태
- `pnpm dev`: 정상 동작
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-01 세션 6

### 완료
- `public/images/placeholder.jpg` — 유효한 1×1 JPEG 바이너리로 재생성 (기존 SVG 내용 → 실제 JPEG, 브라우저 정상 렌더링)
- `app/shop/product/[id]/page.tsx` — 레퍼런스 기준 전면 점검·개선
  - 모든 `imageUrl: '/images/placeholder.svg'` → `/images/placeholder.jpg`로 교체 (AGENTS.md 규칙 준수)
  - BADGE_STYLE 맵 추가 (NEW/BEST/HIT 색상 토큰 통일)
  - 썸네일 간격 `gap-3`으로 조정, 비활성 썸네일 opacity `0.6`
  - 스펙 테이블 `grid-cols-[110px_1fr]`로 정렬 개선, value를 `text-on-surface`로 명시
  - 수량 컨트롤 `rounded-lg overflow-hidden` + `aria-label` 추가 (접근성)
  - 총액 `min-w-[72px] text-right`로 우측 정렬 고정
  - 탭 설명 이미지 영역 `max-w-2xl` (기존 `max-w-lg` → 레퍼런스 기준 wider)
  - 모바일 info card `px-margin-mobile` 패딩으로 통일
  - 데스크톱 푸터 `hidden md:block` 유지, 모바일 하단 액션바 `border-outline-variant rounded-lg overflow-hidden` 개선
- 브라우저 확인: 데스크톱(이미지+썸네일+스펙+옵션박스+탭 5개), 모바일(히어로+배지+하단 액션바) 정상

### 현재 상태
- `pnpm dev`: 정상 동작
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-01 세션 5

### 완료
- `components/ui/CategorySidebar.tsx` — `'use client'`, `usePathname` 기반 활성 상태. 동물별(강아지/고양이) + 상품 유형(사료/간식/용품/영양제) 2섹션. 부모 경로 활성 시 자식 링크 자동 확장(강아지→사료/간식/용품/영양제, 고양이→간식/용품). 현재 경로 primary 컬러 하이라이트
- `components/ui/ShopListContent.tsx` — 모든 리스트 페이지 공유 레이아웃. 데스크톱: CategorySidebar(sticky) + 정렬바 + 그리드 + 페이지네이션. 모바일: 필터 버튼 + 정렬 칩 + 그리드. `title`, `products` props만으로 페이지 구성
- `app/shop/page.tsx` — ShopListContent로 리팩터링 (기존 인라인 코드 제거)
- `app/shop/dog/page.tsx` — ShopListContent로 리팩터링
- `app/shop/cat/page.tsx` — 고양이 전체 페이지 신규 생성
- `app/shop/food/page.tsx` — 전체 사료 페이지 신규 생성
- `app/shop/treats/page.tsx` — 전체 간식 페이지 신규 생성
- `app/shop/supplies/page.tsx` — 전체 용품 페이지 신규 생성
- `app/shop/supplements/page.tsx` — 전체 영양제 페이지 신규 생성
- `app/shop/dog/food/page.tsx` — 강아지 사료 신규 생성
- `app/shop/dog/treats/page.tsx` — 강아지 간식 신규 생성
- `app/shop/dog/supplies/page.tsx` — 강아지 용품 신규 생성
- `app/shop/dog/supplements/page.tsx` — 강아지 영양제 신규 생성
- `app/shop/cat/treats/page.tsx` — 고양이 간식 신규 생성
- `app/shop/cat/supplies/page.tsx` — 고양이 용품 신규 생성
- 브라우저 확인 완료: `/shop`, `/shop/dog`, `/shop/dog/food`, `/shop/cat` 렌더링 및 사이드바 active 상태 정상

### 미완료 / 다음 세션
- `placeholder.jpg` 포맷 불일치 (SVG 내용에 .jpg 확장자) → 실제 상품 이미지 준비 시 교체
- `ARCHITECTURE.md` 갱신 (실제 구조에 맞게 `src/` 불일치 정리, CategorySidebar·ShopListContent 추가 반영)
- 정렬·필터 실제 인터랙션 연동 (현재 UI만 존재)

### 현재 상태
- `pnpm dev`: 정상 동작
- 구현된 라우트: `/shop`, `/shop/dog`, `/shop/cat`, `/shop/food`, `/shop/treats`, `/shop/supplies`, `/shop/supplements`, `/shop/dog/food`, `/shop/dog/treats`, `/shop/dog/supplies`, `/shop/dog/supplements`, `/shop/cat/treats`, `/shop/cat/supplies`
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-06-01 세션 4

### 완료
- `app/not-found.tsx` — 404 페이지: `search_off` 아이콘 + "404" 레이블 + "길을 잃으셨나요?" + 설명 + 홈으로 돌아가기 버튼 (primary-container, rounded-full). 브라우저 확인 완료
- `components/ui/ComingSoon.tsx` — 미구현 페이지 임시 컴포넌트: `construction` 아이콘 + "준비 중인 페이지입니다" + 설명 + 홈으로 돌아가기 버튼. `pageLabel?: string` prop으로 페이지 구분 표시 가능
- `components/layout/Header.tsx` — 메가메뉴 위치 수정: `top-full` → `top-[calc(100%+1rem)]` (inner container pb-4 오프셋 적용, 헤더 최하단 정렬)
- `components/layout/Header.tsx` — 메가메뉴 너비 수정: nav를 `self-center relative`로 변경하여 GNB 텍스트 전체 너비(모든 카테고리~영양제)에 맞춤, `grid-cols-2` 균등 분할

## 2026-06-01 세션 3

### 완료
- `components/layout/Header.tsx` — GNB 전면 교체: NEW/BEST/EVENT/COMMUNITY/Q&A → **모든 카테고리/강아지/고양이/사료/간식/용품/영양제**, 실제 `/shop/*` 링크 연결. 메가메뉴: SMALL ANIMAL·AQUARIUM 제거 → 강아지·고양이 2컬럼으로 축소, 서브항목 사료·간식·용품·영양제 + 실제 URL. 메가메뉴 트리거: 헤더 전체 group → `모든 카테고리` div만 group으로 좁힘
- `components/layout/MobileDrawer.tsx` — 드로어 네비 전면 교체: 모든 카테고리(링크) + 강아지·고양이(아코디언, useState 토글) + 카테고리 섹션(사료·간식·용품·영양제 링크). 브라우저 클릭 인터랙션 확인 완료

## 2026-06-01 세션 2

### 완료
- `public/images/placeholder.jpg` — 상품 리스트 페이지용 placeholder 이미지 생성
- `types/index.ts` — badges 타입에 `'HIT'` 추가, `AnimalCategory`·`ProductCategory` 타입 신설
- `components/layout/BottomNav.tsx` — 모바일 전용 하단 고정 네비게이션 (Home/Search/My Page/Cart, `md:hidden`)
- `components/ui/ProductGrid.tsx` — 상품 리스트용 그리드 컴포넌트: 2열(모바일)/4열(데스크톱), `aspect-square md:aspect-[4/5]` 카드, NEW/BEST/HIT 배지, 데스크톱 hover 시 Quick Add 슬라이드업 + favorite 버튼
- `app/shop/page.tsx` — 강아지 상품 리스트 페이지(`/shop`): 카테고리 헤더(모바일/데스크톱 분기), 필터 버튼, 정렬 버튼, ProductGrid, 페이지네이션, BottomNav
- `components/sections/NewArrivals.tsx` + `components/ui/ProductCard.tsx` — 가로 스크롤 캐러셀 복원, chevron 버튼, View More 카드 추가, 카드 고정 너비(`md:w-[280px]`) 복원
- `app/globals.css` — `--spacing-container: 1280px` 수정 (Tailwind v4 `--width-*` 미지원 버그 수정)
- `pnpm dev` 실행 후 데스크톱·모바일 렌더링 정상 확인 (preview 도구 사용)

### 미완료 / 다음 세션
- `placeholder.jpg` 포맷 불일치 (SVG 내용에 .jpg 확장자) → 실제 상품 이미지 준비 시 교체
- 메가메뉴 hover / 드로어 open 등 인터랙션 브라우저 직접 확인
- `ARCHITECTURE.md` 갱신 (AGENTS.md의 새 구조 반영, `src/` 디렉토리 불일치 정리)
- `/shop/dog`, `/shop/cat` 등 동물별 카테고리 페이지 구현 (현재 `/shop` 1개만)
- `CategorySidebar.tsx` 구현 (AGENTS.md 명시, 레퍼런스 HTML에는 미포함)

### 현재 상태
- `pnpm dev`: 정상 동작 (`/` 메인페이지 + `/shop` 상품 리스트 페이지)
- 마지막 수정 파일: `CHANGELOG.md`

## 2026-05-31 세션 1

### 완료
- `app/globals.css` — Tailwind v4 `@theme` 블록에 디자인 토큰 전체 설정 (색상 46개, 타이포그래피 9종, 간격·보더 레디우스·폰트 패밀리), `no-scrollbar` 유틸리티 추가
- `app/layout.tsx` — Geist 폰트 → Plus Jakarta Sans 교체, Material Symbols Outlined CDN 추가, 메타데이터 GIFT PET으로 변경
- `app/page.tsx` — 메인페이지 조합 (Header + MobileHeader + 4개 섹션 + Footer), 데스크톱 `max-w-container` 컨테이너 적용
- `types/index.ts` — `Product`, `CircularRecommendation` 인터페이스 정의
- `public/images/placeholder.svg` — 개발용 placeholder 이미지(발바닥 SVG) 생성
- `components/layout/Header.tsx` — 데스크톱 헤더: 3단 구조(로고·검색·GNB), 메가메뉴(4컬럼), group-hover CSS 트리거
- `components/layout/MobileHeader.tsx` — 모바일 헤더: 2단 구조, 드로어 상태 관리
- `components/layout/MobileDrawer.tsx` — 모바일 드로어: NEW·BEST·EVENT·COMMUNITY·Q&A 네비, 슬라이드 애니메이션, overlay
- `components/layout/Footer.tsx` — 푸터: 데스크톱 1+2 컬럼(브랜드+뉴스레터 / 링크+소셜), 모바일 단일 컬럼
- `components/sections/HeroBanner.tsx` — 히어로 배너: 데스크톱 `h-[400px]` + 반투명 오버레이 카드, 모바일 `aspect-[4/3]` + 하단 gradient
- `components/sections/CategoryPills.tsx` — 카테고리 필: 모바일 전용, 가로 스크롤, All 활성 스타일
- `components/sections/NewArrivals.tsx` — 신상품: 데스크톱 가로 스크롤 + snap + chevron 버튼, 모바일 2열 그리드
- `components/sections/MdRecommendation.tsx` — MD 추천: 데스크톱 중앙 정렬 + chevron 버튼 + `rounded-2xl`, 모바일 가로 스크롤
- `components/ui/ProductCard.tsx` — 상품 카드: 데스크톱 2단 구조(inner white card), 모바일 flat card, mix-blend-multiply 이미지 효과
- `components/ui/CircularItem.tsx` — 원형 아이템: 데스크톱 `w-32 border-4 border-white` + 내부 인셋 이미지, 모바일 `w-20 border-outline-variant/30`
- references/web·mobile HTML 원본 기반으로 12개 파일 전면 수정 (색상·간격·타이포그래피·구조 일치)

- `globals.css` — `--width-container` → `--spacing-container` 수정 (Tailwind v4에서 `max-w-*` 유틸리티는 `--spacing-*` 네임스페이스만 인식, `--width-*`는 지원 안 함)

### 미완료 / 다음 세션
- placeholder 이미지 실제 상품 이미지로 교체 (실제 이미지 준비 시)
- `ARCHITECTURE.md`의 `src/` 디렉토리 구조와 실제 구조 불일치 정리 (현재 루트 레벨 사용 중)
- 메가메뉴 hover / 드로어 open 등 인터랙션 동작 브라우저 직접 확인

### 현재 상태
- `pnpm dev`: 정상 동작 확인 (TypeScript 통과, 데스크톱·모바일 렌더링 정상)
- 마지막 수정 파일: `app/globals.css` (--spacing-container 수정)
