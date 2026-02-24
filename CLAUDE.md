# 프로젝트 개요
todo-app — 풀스택 Todo 웹 애플리케이션.
백엔드는 Spring Boot, 프론트엔드는 React 18, DB는 Supabase(PostgreSQL)를 사용한다.

# 모노레포 구조
todo-app/
  backend/    → Spring Boot API 서버 (Java 17, Gradle Groovy)
  frontend/   → React 18 SPA (TypeScript, Vite)
  skills/     → 작업별 가이드 문서
  sql/        → DB 마이그레이션 SQL

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
## 백엔드
cd backend && ./gradlew bootRun       # 서버 실행
cd backend && ./gradlew test          # 테스트 실행
cd backend && ./gradlew build         # 빌드

## 프론트엔드
cd frontend && npm install            # 의존성 설치
cd frontend && npm run dev            # 개발 서버 (http://localhost:5173)
cd frontend && npm run build          # 프로덕션 빌드
cd frontend && npm test               # 테스트 실행
