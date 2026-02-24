# Todo App

풀스택 Todo 웹 애플리케이션 — Spring Boot + React 18 + Supabase(PostgreSQL)

---

## 기술 스택

| 영역 | 기술 |
|------|------|
| 백엔드 | Java 22 / Spring Boot 3.2.3 / Gradle 8.10.2 |
| 프론트엔드 | React 18 / TypeScript 5 / Vite 5 |
| 상태 관리 | Zustand 4 |
| HTTP 클라이언트 | Axios (프론트) / RestTemplate + Apache HttpClient 5 (백엔드) |
| DB | Supabase (PostgreSQL) — REST API 방식 연동 |

---

## 프로젝트 구조

```
todo-app/
├── backend/       # Spring Boot API 서버
├── frontend/      # React 18 SPA
├── skills/        # 작업별 가이드 문서
└── sql/
    └── migrations/  # DB 마이그레이션 SQL
```

---

## 시작하기

### 사전 준비

- Java 17+
- Node.js 18+
- Supabase 프로젝트 (URL, service_role 키, anon 키)

### 1. DB 설정

Supabase Dashboard → SQL Editor에서 실행:

```sql
-- sql/migrations/001_create_todos.sql
CREATE TABLE todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 2. 백엔드 환경변수 설정

`backend/.env.example`을 복사해 `backend/.env` 생성:

```env
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>
SUPABASE_ANON_KEY=<anon JWT>
```

> `service_role` 키는 RLS를 우회하므로 **백엔드 서버 전용**으로 사용

### 3. 프론트엔드 환경변수 설정

`frontend/.env.example`을 복사해 `frontend/.env` 생성:

```env
VITE_API_URL=http://localhost:8080
```

### 4. 실행

**백엔드**

```bash
cd backend
set -a && source .env && set +a
./gradlew bootRun      # http://localhost:8080
```

**프론트엔드**

```bash
cd frontend
npm install
npm run dev            # http://localhost:5173
```

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/v1/todos` | 전체 목록 조회 |
| GET | `/api/v1/todos/{id}` | 단건 조회 |
| POST | `/api/v1/todos` | 생성 (body: `{ title }`) |
| PATCH | `/api/v1/todos/{id}` | 수정 (body: `{ title?, completed? }`) |
| DELETE | `/api/v1/todos/{id}` | 삭제 |

**공통 응답 포맷**

```json
{ "success": true, "data": { ... }, "message": "요청 성공" }
{ "success": false, "data": null, "message": "오류 메시지" }
```

---

## 주요 기능

- 할 일 추가 / 조회
- 체크박스로 완료 상태 토글
- 인라인 수정 (수정 버튼 → 입력창 → `Enter` 저장 / `Escape` 취소)
- 삭제

---

## 백엔드 구조 ([CLAUDE.md](backend/CLAUDE.md))

```
src/main/java/com/example/todoapp/
├── global/
│   ├── common/ApiResponse.java          # 공통 응답 래퍼
│   ├── config/SupabaseConfig.java        # RestTemplate Bean (Apache HttpClient 5)
│   ├── config/SupabaseProperties.java    # Supabase 설정 바인딩
│   └── exception/GlobalExceptionHandler.java
└── domain/todo/
    ├── entity/Todo.java                  # Supabase 응답 역직렬화 record
    ├── dto/                              # Request / Response DTO
    ├── service/TodoService.java          # Supabase REST API 호출
    └── controller/TodoController.java
```

> `RestTemplate`은 `HttpComponentsClientHttpRequestFactory` 기반으로 생성한다.
> 기본 `HttpURLConnection`은 PATCH를 지원하지 않는다.

---

## 프론트엔드 구조 ([CLAUDE.md](frontend/CLAUDE.md))

```
src/
├── api/client.ts        # Axios 인스턴스 (인터셉터 포함)
├── api/todo.ts          # Todo API 함수
├── store/todoStore.ts   # Zustand 스토어
├── types/todo.ts        # TypeScript 타입
├── pages/TodoPage.tsx   # 메인 페이지
└── components/
    ├── TodoForm.tsx     # 할 일 입력 폼
    └── TodoItem.tsx     # 항목 컴포넌트 (편집 모드 포함)
```

> Vite 프록시: `/api` → `http://localhost:8080` (개발 시 CORS 불필요)

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
