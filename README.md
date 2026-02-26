# Todo App

풀스택 Todo 웹 애플리케이션 — Spring Boot + React 18 + Supabase(PostgreSQL)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | Java 22 / Spring Boot 3.2.3 / Gradle 8.10.2 |
| 프론트엔드 | React 18 / TypeScript 5 / Vite 5 / Zustand 4 / MUI 7 |
| DB / Auth | Supabase (PostgreSQL + Auth) |
| HTTP 클라이언트 | RestTemplate + Apache HttpClient 5 (백엔드) / hey-api/client-axios 자동 생성 (프론트) |
| API 문서 | Springdoc OpenAPI 2.3.0 (Swagger UI) |

---

## 구현 기능

- **이메일/비밀번호** 회원가입 · 로그인
- **소셜 로그인** — 카카오, Google (Supabase OAuth)
- **Todo CRUD** — 생성 / 조회 / 인라인 수정 / 완료 토글 / 삭제
- **사용자별 데이터 분리** — JWT 기반 인증, userId 필터
- **Swagger UI** — `http://localhost:8080/swagger-ui.html`

---

## 프로젝트 구조

```
todo-app/
├── backend/          # Spring Boot REST API 서버
├── frontend/         # React 18 SPA
├── skills/           # 작업별 가이드 문서
│   ├── backend/      # api, auth, domain, swagger, exception, overview
│   ├── frontend/     # api-client, auth, store, components, routing, overview
│   └── db/           # schema, migration, supabase, overview
├── sql/
│   └── migrations/   # DB 마이그레이션 SQL
├── start.sh          # 백엔드 + 프론트엔드 동시 실행
└── stop.sh           # 서비스 종료
```

---

## 시작하기

### 사전 준비

- Java 22+
- Node.js 18+
- Supabase 프로젝트 (URL, service_role 키, anon 키, JWT Secret)

### 1. DB 설정

Supabase Dashboard → SQL Editor에서 실행:

```bash
# sql/migrations/ 의 파일을 순서대로 실행
sql/migrations/001_create_todos.sql
```

### 2. 백엔드 환경변수

`backend/.env.example` → `backend/.env` 복사 후 값 입력:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>   # RLS 우회용 — anon key 혼용 금지
SUPABASE_ANON_KEY=<anon JWT>
SUPABASE_JWT_SECRET=<base64-encoded JWT secret>
```

### 3. 프론트엔드 환경변수

`frontend/.env.example` → `frontend/.env` 복사 후 값 입력:

```env
VITE_API_URL=http://localhost:8080
VITE_SUPABASE_URL=https://<project-ref>.supabase.co
```

### 4. 실행

```bash
# 전체 동시 실행
./start.sh

# 개별 실행
cd backend && set -a && source .env && set +a && ./gradlew bootRun   # http://localhost:8080
cd frontend && npm install && npm run dev                             # http://localhost:5173
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 | 인증 |
|--------|------|------|------|
| POST | `/api/v1/auth/signup` | 회원가입 | 불필요 |
| POST | `/api/v1/auth/login` | 로그인 | 불필요 |
| GET | `/api/v1/todos` | 전체 목록 | 필요 |
| GET | `/api/v1/todos/{id}` | 단건 조회 | 필요 |
| POST | `/api/v1/todos` | 생성 | 필요 |
| PATCH | `/api/v1/todos/{id}` | 수정 | 필요 |
| DELETE | `/api/v1/todos/{id}` | 삭제 | 필요 |

**공통 응답 포맷**

```json
{ "success": true,  "data": { ... }, "message": "요청 성공" }
{ "success": false, "data": null,    "message": "오류 메시지" }
```

---

## 인증 구조

### JWT 검증 (AuthInterceptor)
Supabase 발급 JWT는 **ES256** 알고리즘으로 서명된다.
백엔드 `AuthInterceptor`는 JWKS 공개키(ES256)와 JWT Secret(HS256) 두 가지 방식을 모두 지원한다.

### 소셜 로그인 흐름
```
1. 로그인 버튼 클릭 → {SUPABASE_URL}/auth/v1/authorize?provider=kakao
2. OAuth 인증 완료 → http://localhost:5173/#access_token=xxx
3. 프론트엔드: URL 해시 파싱 → localStorage 저장 → 자동 로그인
```

---

## 백엔드 구조

```
src/main/java/com/example/todoapp/
├── global/
│   ├── common/ApiResponse.java           # 공통 응답 래퍼
│   ├── config/
│   │   ├── SupabaseConfig.java           # RestTemplate Bean (Apache HttpClient 5)
│   │   ├── SupabaseProperties.java       # 환경변수 바인딩
│   │   ├── WebMvcConfig.java             # AuthInterceptor 등록
│   │   └── OpenApiConfig.java            # Swagger Bearer JWT 설정
│   ├── interceptor/AuthInterceptor.java  # ES256/HS256 JWT 검증
│   └── exception/GlobalExceptionHandler.java
├── domain/auth/                          # 회원가입 / 로그인 API
└── domain/todo/                          # Todo CRUD API
```

---

## 프론트엔드 구조

```
src/
├── api/generatedClient.ts    # JWT 인터셉터 + 401 처리
├── generated/                # ← npm run generate 자동 생성 (gitignore)
│   ├── sdk.gen.ts            # API 호출 함수 (getAll, create, update ...)
│   └── types.gen.ts          # API 타입 정의
├── store/
│   ├── todoStore.ts          # Todo 상태 관리
│   └── authStore.ts          # 인증 상태 + 소셜 로그인
├── pages/
│   ├── TodoPage.tsx          # 메인 화면
│   ├── LoginPage.tsx         # 소셜 로그인 버튼 포함
│   └── RegisterPage.tsx      # 이메일 회원가입
└── components/
    ├── TodoForm.tsx
    └── TodoItem.tsx          # 인라인 편집 지원
```

**OpenAPI 클라이언트 재생성** (백엔드 API 변경 시):

```bash
curl http://localhost:8080/v3/api-docs -o frontend/openapi.json
cd frontend && npm run generate
```

---

## 커밋 컨벤션

Conventional Commits 형식 사용:

```
feat:     새 기능
fix:      버그 수정
refactor: 리팩토링
docs:     문서 수정
chore:    빌드/설정 변경
```
