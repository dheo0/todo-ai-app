# 프로젝트 개요
todo-app — 풀스택 Todo 웹 애플리케이션.
백엔드는 Spring Boot, 프론트엔드는 React 18, DB/Auth는 Supabase(PostgreSQL)를 사용한다.

# 모노레포 구조
```
todo-app/
  backend/    → Spring Boot REST API 서버 (Java 22, Gradle Groovy)
  frontend/   → React 18 SPA (TypeScript, Vite)
  skills/     → 작업별 가이드 문서
    backend/  → 백엔드 작업 가이드
    frontend/ → 프론트엔드 작업 가이드
    db/       → DB/Supabase 작업 가이드
  sql/        → DB 마이그레이션 SQL
```

# 구현된 기능
- 이메일/비밀번호 회원가입·로그인
- 소셜 로그인 (카카오, Google) — Supabase OAuth implicit flow
- 사용자별 Todo CRUD (생성/조회/수정/완료 toggle/삭제)
- JWT 인증 (ES256 / HS256 모두 지원)
- Swagger UI (`http://localhost:8080/swagger-ui.html`)

# 공통 규칙
- 커밋 메시지: Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- 환경변수 하드코딩 금지 → `.env` 파일 사용
- `.env` 파일 커밋 금지 (`.gitignore` 필수 확인)
- API 통신: REST / JSON
- 에러 응답: `{ success: false, data: null, message: "..." }` 공통 포맷

# Skills 참조
| 작업 영역 | 참조 문서 |
|-----------|-----------|
| Spring Boot 전반 | @skills/backend/overview.md |
| REST API 패턴 | @skills/backend/api.md |
| JWT 인증 | @skills/backend/auth.md |
| 새 도메인 추가 | @skills/backend/domain.md |
| Swagger/OpenAPI | @skills/backend/swagger.md |
| 예외 처리 | @skills/backend/exception.md |
| 프론트엔드 전반 | @skills/frontend/overview.md |
| OpenAPI 클라이언트 | @skills/frontend/api-client.md |
| 인증 흐름 | @skills/frontend/auth.md |
| Zustand 스토어 | @skills/frontend/store.md |
| 컴포넌트/MUI | @skills/frontend/components.md |
| 라우팅 | @skills/frontend/routing.md |
| DB 개요/PostgREST | @skills/db/overview.md |
| 스키마 설계 | @skills/db/schema.md |
| 마이그레이션 | @skills/db/migration.md |
| Supabase 설정 | @skills/db/supabase.md |

# 명령어
```bash
./start.sh   # 백엔드 + 프론트엔드 동시 실행
./stop.sh    # 서비스 종료 (포트 8080, 5173)
```

## 백엔드
```bash
cd backend
set -a && source .env && set +a && ./gradlew bootRun   # 서버 실행
./gradlew test                                          # 테스트
./gradlew build                                         # 빌드
```

## 프론트엔드
```bash
cd frontend
npm install          # 의존성 설치
npm run dev          # 개발 서버 (http://localhost:5173)
npm run build        # 프로덕션 빌드
npm run generate     # OpenAPI 클라이언트 재생성
npm test             # 테스트
```

# currentDate
Today's date is 2026-02-26.
