# 프론트엔드 개요
React 18 + TypeScript + Vite 기반 SPA.
상태 관리는 Zustand, HTTP 통신은 Axios를 사용한다.
백엔드 API(`http://localhost:8080`)는 Vite 프록시를 통해 `/api` 경로로 호출한다.

# 기술 스택
- React 18 / TypeScript 5 / Vite 5
- Zustand 4 (전역 상태 관리)
- Axios 1 (HTTP 클라이언트)
- 테스트: Vitest

# 파일 구조
```
src/
  main.tsx                    # 진입점
  App.tsx                     # 루트 컴포넌트 (현재 TodoPage 렌더링)
  types/
    todo.ts                   # Todo, TodoCreateRequest, TodoUpdateRequest 인터페이스
  api/
    client.ts                 # Axios 인스턴스 (baseURL, 인터셉터 설정)
    todo.ts                   # Todo 도메인 API 함수 (getAll / getById / create / update / delete)
  store/
    todoStore.ts              # Zustand 스토어 (todos, isLoading, fetchTodos, addTodo, toggleTodo, editTodo, deleteTodo)
  pages/
    TodoPage.tsx              # 할 일 목록 페이지
  components/
    TodoForm.tsx              # 할 일 입력 폼 컴포넌트
    TodoItem.tsx              # 할 일 항목 컴포넌트 (체크박스 + 수정 + 삭제 / 인라인 편집 모드 지원)
```

# Axios 클라이언트 (`src/api/client.ts`)
- `baseURL`: `import.meta.env.VITE_API_URL`
- 요청 인터셉터: localStorage의 `accessToken`을 `Authorization: Bearer` 헤더에 자동 첨부
- 응답 인터셉터: 401 응답 시 토큰 제거 후 `/login`으로 이동

# Vite 프록시
`vite.config.ts`에서 `/api` → `http://localhost:8080` 으로 프록시 설정되어 있다.
개발 시 CORS 없이 백엔드와 통신 가능.

# 환경변수 (.env)
```
VITE_API_URL=http://localhost:8080
```
- `.env`는 커밋 금지. `.env.example` 참고.
- Vite 환경변수는 반드시 `VITE_` 접두사 사용.

# 새 기능 추가 순서
1. `src/types/` → TypeScript 타입 정의
2. `src/api/` → 도메인별 API 함수 작성 (`apiClient` 사용)
3. `src/store/` → Zustand 스토어 추가
4. `src/components/` or `src/pages/` → UI 구현
   - 컴포넌트: named export 사용
   - 인터페이스는 파일 상단에 선언

# TodoItem 편집 모드
- "수정" 버튼 클릭 시 인라인 입력창으로 전환 (`isEditing` state)
- `Enter` → 저장 / `Escape` → 취소
- 편집 중에는 파란 테두리로 구분
- 저장 시 `onEdit(id, title)` 호출 → `editTodo` 액션 → `PATCH /api/v1/todos/{id}` (body: `{ title }`)

# 컴포넌트 작성 규칙
- named export 사용 (`export function Foo`)
- Props 타입은 `interface FooProps` 형태로 컴포넌트 파일 상단에 선언
- 경로 alias `@/` → `src/` (예: `import { Todo } from '@/types/todo'`)

# 명령어
```bash
npm install        # 의존성 설치
npm run dev        # 개발 서버 (http://localhost:5173)
npm run build      # 프로덕션 빌드 (tsc + vite build)
npm test           # 테스트 실행 (vitest)
```
