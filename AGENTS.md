# AGENTS.md — GIFT PET 프로젝트 에이전트 규칙

이 파일은 Claude Code가 이 프로젝트에서 작업할 때 반드시 따라야 하는 규칙을 정의합니다.
**작업 시작 전 반드시 이 파일과 ARCHITECTURE.md, DESIGN_SYSTEM.md를 읽을 것.**

---

## 1. 작업 원칙

### 1-1. 파일 수정 전 확인 사항
- 수정 대상 파일을 먼저 읽고 전체 구조를 파악한 뒤 작업한다.
- 기존 코드를 삭제하기 전에 그 코드가 다른 곳에서 참조되는지 확인한다.
- 한 번에 여러 파일을 수정할 경우 의존 관계 순서를 지킨다 (types → utils → components → page).

### 1-2. 절대 하지 말 것
- `any` 타입 사용 금지. 타입을 모르면 작업 전 사용자에게 확인 요청.
- `tailwind.config.ts`의 커스텀 토큰을 임의로 변경하거나 삭제하지 않는다.
- 인라인 스타일(`style={{}}`) 사용 금지. Tailwind 클래스만 사용한다.
- `console.log` 디버그 코드를 커밋 상태로 남기지 않는다.
- placeholder 이미지 URL(lh3.googleusercontent.com)을 그대로 사용하지 않는다. `/images/placeholder.jpg`로 교체한다.

### 1-3. 컴포넌트 작성 기준
- 컴포넌트 하나당 파일 하나. 파일명은 PascalCase (`ProductCard.tsx`).
- props 타입은 컴포넌트 파일 상단에 `interface`로 선언한다.
- 서버 컴포넌트가 기본. 상태·이벤트·브라우저 API가 필요한 경우에만 `'use client'` 추가.
- 재사용 가능한 UI 조각은 `src/components/ui/`에, 페이지 전용 섹션은 `src/components/sections/`에 둔다.

---

## 2. 작업 워크플로우

### 새 컴포넌트 추가 시
1. `ARCHITECTURE.md`에서 해당 컴포넌트의 위치 확인
2. `DESIGN_SYSTEM.md`에서 사용할 색상 토큰 · 타이포그래피 토큰 확인
3. props 인터페이스 정의
4. 컴포넌트 구현 (Tailwind 토큰 사용)
5. `src/app/page.tsx`에 import 및 배치

### 버그 수정 시
1. 오류 메시지 또는 재현 조건을 먼저 파악
2. 영향 범위 확인 (해당 컴포넌트만인지, 공통 유틸/훅인지)
3. 수정 후 관련 컴포넌트가 여전히 정상 동작하는지 확인

---

## 3. 코드 품질 기준

- **TypeScript**: strict 모드. 타입 단언(`as`)은 꼭 필요한 경우에만, 주석으로 이유 명시.
- **import 순서**: 1) React/Next.js 2) 외부 라이브러리 3) 내부 컴포넌트 4) 내부 유틸/타입
- **함수**: 화살표 함수 선호. 컴포넌트 자체는 `export default function ComponentName`.
- **주석**: "무엇"이 아닌 "왜"를 설명. 자명한 코드에 주석 불필요.

---

## 4. 현재 프로젝트 범위 (v0.1 — 메인페이지 껍데기)

이 단계에서 구현하는 것:
- 정적 UI만. API 연동, 실제 데이터, 인증 없음.
- placeholder 이미지와 더미 텍스트 사용.
- 반응형 (모바일 / 데스크톱) 레이아웃.

이 단계에서 구현하지 않는 것:
- 장바구니 기능 (버튼 UI는 있지만 동작 없음)
- 검색 기능 (input UI는 있지만 동작 없음)
- 인증/로그인
- 실제 상품 데이터 연동
