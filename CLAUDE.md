# 프로젝트 개요
todo-app — 풀스택 Todo 웹 애플리케이션.
백엔드는 Spring Boot, 프론트엔드는 React 18, DB/Auth는 Supabase(PostgreSQL)를 사용한다.

# 모노레포 구조
todo-app/
  backend/    → Spring Boot API 서버 (Java 17, Gradle Groovy)
  frontend/   → React 18 SPA (TypeScript, Vite)
  skills/     → 작업별 가이드 문서
  sql/        → DB 마이그레이션 SQL

# 구현된 기능
- 회원가입 / 이메일+비밀번호 로그인
- 소셜 로그인 (카카오, Google) — Supabase OAuth implicit flow
- 사용자별 Todo CRUD (생성/조회/수정/삭제/완료 toggle)
- JWT 인증 (ES256 / HS256 모두 지원)

# 공통 규칙
- 커밋 메시지는 Conventional Commits 형식 사용
  (feat:, fix:, refactor:, docs:, chore:)
- 환경변수는 절대 코드에 하드코딩 금지 → .env 파일 사용
- .env 파일은 절대 커밋 금지 (.gitignore 필수 확인)
- API 통신은 REST 방식, JSON 형식
- 에러 응답은 공통 포맷 준수 (skills/backend.md 참고)

# Skills 참조
- Spring Boot 작업 시: @skills/backend.md
- 프론트엔드 작업 시: @skills/frontend.md
- Supabase/DB 작업 시: @skills/database.md

# 명령어
## 전체 실행 (백엔드 + 프론트엔드 동시)
./start.sh

## 백엔드
cd backend && set -a && source .env && set +a && ./gradlew bootRun
cd backend && ./gradlew test
cd backend && ./gradlew build

## 프론트엔드
cd frontend && npm install
cd frontend && npm run dev     # 개발 서버 (http://localhost:5173)
cd frontend && npm run build   # 프로덕션 빌드
cd frontend && npm test        # 테스트 실행
