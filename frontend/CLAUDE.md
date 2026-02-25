# 프론트엔드 개요
React 18 + TypeScript + Vite 기반 SPA.
상태 관리는 Zustand, HTTP 통신은 Axios를 사용한다.
백엔드 API(`http://localhost:8080`)는 Vite 프록시를 통해 `/api` 경로로 호출한다.

# 기술 스택
- React 18 / TypeScript 5 / Vite 5
- Zustand 4 (전역 상태 관리)
- Axios 1 (HTTP 클라이언트)
- MUI (Material UI) v6 — UI 컴포넌트 라이브러리
  - `@mui/material`, `@mui/icons-material`
  - `@emotion/react`, `@emotion/styled` (MUI 스타일링 엔진)
- 테스트: Vitest

# 파일 구조
```
src/
  main.tsx                    # 진입점
  App.tsx                     # 루트 컴포넌트 — ThemeProvider + CssBaseline 감싸고 TodoPage 렌더링
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
    TodoForm.tsx              # 할 일 입력 폼 (MUI TextField + Button + AddIcon)
    TodoItem.tsx              # 할 일 항목 (MUI Checkbox, ListItem, IconButton + Tooltip / 인라인 편집 모드 지원)
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

# MUI 사용 규칙
- `App.tsx`에서 `ThemeProvider` + `CssBaseline`으로 전체 앱을 감싼다.
- 테마는 `createTheme`으로 생성하며 `App.tsx`에서 중앙 관리한다.
- 아이콘은 `@mui/icons-material`에서 named import로 사용한다.
  예) `import AddIcon from '@mui/icons-material/Add'`
- 레이아웃: `Box`, `Container` 사용 / 스타일은 `sx` prop으로 지정한다.
- 리스트 항목: `ListItem` + `ListItemText` + `Divider` 조합 사용.
- 버튼은 아이콘 전용일 경우 `IconButton`, 텍스트 포함 시 `Button` 사용.
- 호버 설명은 `Tooltip`으로 제공한다.

# TodoItem 편집 모드
- MUI `EditIcon` 버튼 클릭 시 인라인 `TextField`로 전환 (`isEditing` state)
- `Enter` → 저장(`CheckIcon`) / `Escape` → 취소(`CloseIcon`)
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
