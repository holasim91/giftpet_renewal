# GIFT PET — 펫 쇼핑몰 리뉴얼

펫 쇼핑몰 GIFT PET의 웹사이트 리뉴얼 프로젝트.  
현재 단계: **v1.1** | 배포: https://gp-renewal.vercel.app

---

## 개발 서버

```bash
pnpm dev        # http://localhost:3000
pnpm build
pnpm lint
```

환경변수 (`.env.local`):

```
DATABASE_URL=           # Supabase Transaction Pooler (6543)
DIRECT_URL=             # Supabase Direct Connection (5432)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
AUTH_SECRET=
```

---

## 하네스 문서 읽는 순서

Claude Code가 작업 시작 전 반드시 읽어야 하는 문서:

1. `AGENTS.md` — 작업 규칙, 하지 말 것, 워크플로우
2. `ARCHITECTURE.md` — 디렉토리 구조, 컴포넌트 책임
3. `DESIGN_SYSTEM.md` — 색상·타이포그래피·간격 토큰, tailwind.config.ts
4. `CHANGELOG.md` — 버전별 구현 이력

---

## v1.1 구현 범위

### 완료
- [x] 메인페이지 (HeroBanner, CategoryPills, NewArrivals 캐러셀, MD 추천)
- [x] 상품 리스트 페이지 (전체 / 강아지 / 고양이 / 유형별 13개 라우트)
- [x] 상품 상세 페이지 (`/shop/product/[id]`)
- [x] 반응형 (데스크톱 / 모바일), Header / MobileHeader 분리
- [x] DB 연동 (Supabase + Prisma 7, 상품 15개 시딩)
- [x] 로그인 / 회원가입 (NextAuth.js v5, Credentials Provider)
- [x] 장바구니 (CRUD 완전 구현, 헤더 배지, 수량 조절, 선택 삭제)
- [x] 마이페이지 (이름·비밀번호 변경, 주문 내역 플레이스홀더)
- [x] 찜하기 (토글, /wishlist 목록 페이지, 헤더 배지, Optimistic UI)
- [x] 할인 표시 (할인가 + 정가 취소선 + 할인율 — 카드·상세·장바구니)
- [x] 배지 시스템 (SOLD OUT > BEST > NEW 우선순위, isBest Boolean)
- [x] Vercel 배포

### 미구현
- 검색 (input UI 주석 처리)
- 결제

---

## v2 구현 예정

### 검색
- Algolia 연동 예정
- `/shop/search?q=` 라우트

### 리팩토링
- 상품 카드 컴포넌트 3종 통합 (ProductCard, ProductCardBase, 추천 카드)
- useCart 커스텀 훅 분리 (CartClient 로직 분리)

### 배송지 관리
- 카카오 우편번호 API 연동
- `ShippingAddress` 테이블 추가

### 상품 옵션
- 맛, 사이즈 등 옵션 관리
- `ProductOption` 테이블 추가

### 주문 내역
- 주문 상태 관리 (결제 완료 / 배송 중 / 배송 완료)
- `Order`, `OrderItem` 테이블 추가

### 소셜 로그인
- Google, Kakao 로그인
- 비밀번호 찾기 / 재설정

### 장바구니 개선
- 장바구니 만료 정책 (90일)
- 함께 구매하면 좋은 상품 데이터 연동

### 상품 리뷰
- 리뷰 작성 / 수정 / 삭제, 별점 시스템

### 결제 (사업자 등록 후)
- 토스페이먼츠 또는 포트원 연동

---

## 디자인 원본

- 데스크톱: `references/web/v0_main_web.html`
- 모바일: `references/mobile/v0_main_mobile.html`

Stitch로 생성된 Material Design 3 기반 디자인.
