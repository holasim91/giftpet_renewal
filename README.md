# GIFT PET — 펫 쇼핑몰 리뉴얼

실제 운영 중인 펫 쇼핑몰 GIFT PET의 웹사이트 리뉴얼 프로젝트.
Next.js 15 기반 풀스택으로 구현.

## 배포 링크

https://gp-renewal.vercel.app

---

## 기술 스택

| 분류 | 기술 |
|---|---|
| 프레임워크 | Next.js 16 (App Router, Turbopack) |
| 언어 | TypeScript (strict) |
| 스타일링 | Tailwind CSS v4 |
| DB | Supabase (PostgreSQL) |
| ORM | Prisma 7 |
| 인증 | NextAuth.js v5 (beta) |
| 스토리지 | Supabase Storage |
| 상태관리 | React 19 (useOptimistic, useState) |
| 폼 | react-hook-form |
| 테스트 | Vitest |
| 배포 | Vercel |

---

## 주요 기능

- **상품 목록/상세** — 동물(강아지/고양이) × 유형(사료/간식/용품/영양제) 카테고리 필터링, 13개 라우트
- **회원가입/로그인** — NextAuth.js Credentials Provider, bcrypt 해싱
- **장바구니** — 수량 조절 Optimistic Update, 선택 삭제, 헤더 배지
- **찜하기** — Context 기반 전역 상태, Optimistic 토글, 목록 페이지
- **배송지 관리** — 카카오 우편번호 API, 기본 배송지 지정
- **주문/결제** — PENDING → PAID 2단계 플로우, 재고 트랜잭션 처리
- **주문 내역** — 상태별 표시(준비중/배송중/완료)
- **상품 리뷰** — 별점, 이미지 최대 3장(WebP 자동 변환), Supabase Storage 업로드, 작성/조회/삭제

---

## 설계 결정

### 스키마 설계

**`badges String[]` → `isBest Boolean`으로 변경**

초기 설계에서 `badges: ['NEW', 'BEST']` 배열로 관리했으나 두 가지 문제가 있었음:

- NEW는 날짜 기반으로 자동 계산 가능한데 수동으로 관리해야 하는 불일치
- 배열에 어떤 값이든 들어올 수 있어 일관성 보장 불가

→ `isBest Boolean`으로 명시적 관리, NEW는 `createdAt` 30일 기준 자동 계산으로 분리

**주문 시점 스냅샷**

`OrderItem`에 상품명/가격, `Order`에 배송지를 직접 저장.
상품 가격 변경이나 배송지 삭제 후에도 주문 내역이 당시 정보를 유지.
실제 쇼핑몰 레퍼런스 분석으로 발견한 패턴.

**PENDING → PAID 주문 플로우**

장바구니 "주문하기" 클릭 시 PENDING 주문 먼저 생성 후 `/checkout?order_id=xxx`로 이동.
결제 완료 시 재고 확인 → PAID 전환 → 재고 차감 → 장바구니 비우기를 단일 트랜잭션으로 처리.
실제 쇼핑몰 URL 구조 분석으로 설계.

### 컴포넌트 설계

**합성 컴포넌트 패턴 (ProductCardBase)**

상품 카드가 그리드/찜 목록 등 여러 컨텍스트에서 사용되면서 각자 다른 하단 액션(체크박스+담기 버튼)이 필요했음.
props로 분기하면 불가능한 조합이 열리고 새 케이스마다 카드를 수정해야 함.

→ 합성 패턴으로 베이스는 이미지~가격만 담당, 하단 액션은 children으로 주입.
카드가 사용처를 몰라도 되어 OCP(개방-폐쇄 원칙) 준수.

**`useCart` 커스텀 훅 분리**

`CartClient.tsx`가 400줄을 넘어가면서 UI 변경과 비즈니스 로직 변경이 같은 파일에서 일어나는 SRP 위반 발견.

→ 상태/계산/핸들러를 `useCart`로 분리, CartClient는 JSX만 담당.

---

## 디자인 품질

Impeccable 디자인 스킬로 접근성·디자인 일관성 감사 진행 (13/20 → 15/20)

---

## 추후 개선 사항

- 결제 연동 (토스페이먼츠 또는 포트원)
- 검색 (Algolia 또는 PostgreSQL 전문 검색)
- 소셜 로그인 (Google, Kakao)
- 상품 옵션 (맛, 사이즈)
- 리뷰 커서 기반 페이지네이션
- 구매 후 30일 이내 리뷰 작성 제한

---

## 로컬 실행 방법

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.local.example .env.local
# .env.local에 값 채우기

# DB 스키마 적용
pnpm prisma db push

# 시드 데이터 (상품 15개)
pnpm prisma db seed

# 개발 서버
pnpm dev        # http://localhost:3000

# 빌드
pnpm build

# 테스트
pnpm test
```

### 필수 환경변수

```
DATABASE_URL=              # Supabase Transaction Pooler (포트 6543)
DIRECT_URL=                # Supabase Direct Connection (포트 5432, migrate 전용)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=       # Storage 업로드용 (서버 전용)
AUTH_SECRET=               # NextAuth 서명 키 (openssl rand -base64 32)
```

---

## 이미지 출처
데모용 이미지는 Unsplash (https://unsplash.com) 라이선스 하에 사용.
