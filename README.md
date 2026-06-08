# GIFT PET — 메인페이지 리뉴얼

펫 쇼핑몰 GIFT PET의 웹사이트 리뉴얼 프로젝트.
현재 단계: **v0.1 메인페이지 껍데기 구현**

---

## 프로젝트 시작

```bash
pnpm create next-app@latest gift-pet \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd gift-pet
```

설치 후 할 일:
1. `tailwind.config.ts`를 `DESIGN_SYSTEM.md`의 토큰으로 교체
2. `src/app/globals.css`에 Material Symbols 폰트 링크 추가
3. `src/app/layout.tsx`에 Plus Jakarta Sans 폰트 설정 (`next/font/google`)
4. 디렉토리 구조를 `ARCHITECTURE.md` 기준으로 생성

---

## 개발 서버 실행

```bash
pnpm dev
```

→ http://localhost:3000

---

## 하네스 문서 읽는 순서

Claude Code가 작업 시작 전 반드시 읽어야 하는 문서:

1. `AGENTS.md` — 작업 규칙, 하지 말 것, 워크플로우
2. `ARCHITECTURE.md` — 디렉토리 구조, 컴포넌트 책임
3. `DESIGN_SYSTEM.md` — 색상·타이포그래피·간격 토큰, tailwind.config.ts

---

## v0.1 구현 범위

### 구현
- [x] 데스크톱 헤더 (로고, 검색, GNB, 메가메뉴)
- [x] 모바일 헤더 (햄버거, 로고, 아이콘, 검색창)
- [x] 모바일 드로어 메뉴
- [x] 히어로 배너 (데스크톱 / 모바일)
- [x] 카테고리 필 (모바일 전용)
- [x] New Arrivals 섹션
- [x] MD's Recommendation 섹션
- [x] 푸터

### 미구현 (기능 없음, UI만)
- 검색 input — UI만, 동작 없음
- 장바구니, 찜 버튼 — UI만, 동작 없음
- 뉴스레터 구독 — UI만, 동작 없음
- GNB 링크 — `href="#"` placeholder
- 상품 옵션 (맛, 사이즈 등) 및 옵션별 가격/재고 관리
- 결제

## 보안 개선 사항 (미구현)
- 로그인 시도 횟수 제한
- 소셜 로그인 (Google, Kakao)
- 비밀번호 찾기 / 재설정

---

## 디자인 원본

- 데스크톱: `v0_main_web.html`
- 모바일: `v0_main_mobile.html`

Stitch로 생성된 Material Design 3 기반 디자인.