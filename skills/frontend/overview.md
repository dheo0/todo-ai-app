# 프론트엔드 개요

## 기술 스택
- React 18 / TypeScript 5 / Vite 5
- Zustand 4 (전역 상태 관리)
- MUI (Material UI) v7 — `@mui/material`, `@mui/icons-material`, `@emotion/react`, `@emotion/styled`
- `@hey-api/client-axios` 0.9.1 — OpenAPI 생성 클라이언트
- React Router DOM v7
- Vitest (테스트)

## 파일 구조
```
src/
  vite-env.d.ts               # /// <reference types="vite/client" /> (import.meta.env 타입)
  main.tsx                    # 진입점 — import '@/api/generatedClient' 먼저 실행
  App.tsx                     # ThemeProvider + CssBaseline + 라우트 정의
  types/
    todo.ts                   # Todo, TodoCreateRequest, TodoUpdateRequest
    auth.ts                   # AuthResponse, SignupRequest, LoginRequest, SocialProvider
  api/
    generatedClient.ts        # 생성된 client에 JWT 인터셉터 + 401 처리 설정
  generated/                  # ← npm run generate로 자동 생성 (gitignore됨)
    types.gen.ts              # API 타입 (TodoResponse, AuthResponse 등)
    sdk.gen.ts                # SDK 함수 (getAll, create, update, delete_, login, signup)
    client.gen.ts             # 기본 client 인스턴스
    client/                   # Axios 클라이언트 구현체
  store/
    todoStore.ts              # todos, isLoading, fetchTodos, addTodo, toggleTodo, editTodo, deleteTodo
    authStore.ts              # userId, email, isAuthenticated, login, signup, logout, socialLogin
  pages/
    TodoPage.tsx              # 할 일 목록 (인증 필요)
    LoginPage.tsx             # 로그인 (이메일/비밀번호 + 카카오/Google 소셜)
    RegisterPage.tsx          # 회원가입
  router/
    PrivateRoute.tsx          # 미인증 시 /login 리다이렉트
  components/
    TodoForm.tsx              # 할 일 입력 폼
    TodoItem.tsx              # 할 일 항목 (인라인 편집 지원)
```

## 환경변수 (.env)
```
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
```
- `.env`는 커밋 금지. `.env.example` 참고.
- Vite 환경변수는 반드시 `VITE_` 접두사 사용.
- `vite-env.d.ts` 파일이 있어야 `import.meta.env` TypeScript 타입 인식.

## 명령어
```bash
npm install         # 의존성 설치
npm run dev         # 개발 서버 (http://localhost:5173)
npm run build       # 프로덕션 빌드 (tsc + vite build)
npm run generate    # OpenAPI 클라이언트 코드 생성 (openapi.json → src/generated/)
npm test            # 테스트 실행 (vitest)
```
