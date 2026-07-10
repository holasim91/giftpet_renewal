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
- 컴포넌트 코드에서 외부 이미지 URL(unsplash.com, lh3.googleusercontent.com 등)을 직접 참조하지 않는다.
  이미지는 `public/images/`에 두고 로컬 경로(`/images/...`)로 참조한다.
  → 외부 서비스의 가용성에 데모가 의존하지 않도록 하기 위함.

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

## 4. 테스트 전략
- 비즈니스 로직은 순수 함수로 분리하고 테스트 먼저 작성
- 테스트 프레임워크: Vitest
- UI 테스트는 하지 않음
- 테스트 파일 위치: 구현 파일과 같은 디렉토리 (*.test.ts)

---

## 5. 공통 UI 컴포넌트 사용 규칙

### Toast (`components/ui/Toast.tsx`)
- `ToastProvider`는 `app/layout.tsx`에 전역으로 등록되어 있다. 중복 추가 금지.
- 사용법: `'use client'` 컴포넌트 내에서 `const { showToast } = useToast()` 호출 후 `showToast('메시지', 'success' | 'error')`.
- Server Action 성공/실패 결과는 반드시 Toast로 사용자에게 피드백한다.
- 서버 컴포넌트에서는 직접 사용 불가. 클라이언트 래퍼를 만든다.

### ConfirmModal (`components/ui/ConfirmModal.tsx`)
- **데이터 삭제 액션은 반드시 `<ConfirmModal>`로 사용자 확인을 받은 뒤 실행한다.**
- 필수 props: `isOpen`, `message`, `onConfirm`, `onCancel`.
- `isPending` prop으로 처리 중 상태를 표시한다 (버튼 disabled + "처리 중..." 텍스트).
- 취소(overlay 클릭 포함)·확인 버튼 모두 핸들러를 연결해야 한다.
- 삭제가 아닌 일반 확인 대화상자에도 재사용 가능하다 (`confirmLabel` prop 변경).

---

## 6. Server Actions 규칙

- 모든 Server Action은 `actions/` 디렉토리에 도메인별로 분리한다.
  - `actions/auth.ts` — 로그인(`loginUser`)·로그아웃(`logoutUser`)·회원가입(`registerUser`)
  - `actions/cart.ts` — 장바구니 CRUD (`getCart`, `getCartCount`, `addToCart`, `removeFromCart`, `removeSelectedFromCart`, `updateCartQuantity`)
  - `actions/product.ts` — 상품 조회 (`getProducts`, `getProductById`, `getNewArrivals`, `getMdPickProducts`)
- 파일 최상단에 `'use server'` 선언 필수.
- 인증이 필요한 쓰기 액션은 내부 첫 줄에서 `const session = await auth()`로 세션을 확인하고, 없으면 즉시 early return 또는 에러 반환.
- 쓰기 액션(`add`, `remove`, `update`) 완료 후 `revalidatePath('/관련경로')` 호출.
- 새 도메인의 Server Action이 생기면 `actions/도메인.ts`로 신규 파일 생성. 기존 파일에 무관한 로직 혼재 금지.

---

## 7. 인증 규칙

- 인증 구현: NextAuth v5 (beta). 설정은 루트의 `auth.ts`에서 Credentials Provider + JWT 전략.
- 세션 확인 (서버): `import { auth } from '@/auth'` → `const session = await auth()`.
- 세션 확인 (클라이언트): Server Action 내부에서 처리하고 결과만 반환. 클라이언트에서 `auth()` 직접 호출 금지.
- 보호 라우트: `proxy.ts`(미들웨어)가 `/cart/*` 비로그인 접근을 `/auth/login?callbackUrl=...`으로 차단. 새 보호 라우트 추가 시 `proxy.ts`의 matcher에 경로 추가.
- 비로그인 유저가 클라이언트에서 인증 필요 기능 사용 시: `router.push('/auth/login')`.
- 로그아웃: `<SignOutButton />` 컴포넌트 사용 (`logoutUser` Server Action이 폼 액션으로 연결됨).
- 비밀번호 해싱: `bcryptjs`, cost factor 12 (`bcrypt.hash(password, 12)`).