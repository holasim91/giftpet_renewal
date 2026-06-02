# CHANGELOG

세션이 끝날 때마다 Claude Code가 자동으로 업데이트한다.
최신 세션이 위에 오도록 작성한다.

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
