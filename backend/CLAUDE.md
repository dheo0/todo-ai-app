# 백엔드 개요
Spring Boot 3.2.3 기반 REST API 서버.
Supabase REST API(PostgREST)로 DB 연동, Supabase Auth API로 인증 처리.
JPA/Hibernate 미사용 — `RestTemplate`으로 직접 HTTP 호출.

# 스킬 참조
| 주제 | 문서 |
|------|------|
| 기술 스택·패키지 구조·환경변수·실행 명령어 | @skills/backend/overview.md |
| REST API 패턴·공통 응답 포맷·Controller 작성 | @skills/backend/api.md |
| JWT 검증(ES256/HS256)·Supabase Auth 연동 | @skills/backend/auth.md |
| 새 도메인 추가 순서·Entity/DTO/Service 패턴 | @skills/backend/domain.md |
| Swagger/OpenAPI 어노테이션·코드 생성 | @skills/backend/swagger.md |
| 예외 처리·GlobalExceptionHandler | @skills/backend/exception.md |
| DB 연결·PostgREST 쿼리 | @skills/db/overview.md |
| Supabase 키·소셜 로그인 설정 | @skills/db/supabase.md |

# 핵심 특이사항
- `RestTemplate`은 반드시 `HttpComponentsClientHttpRequestFactory`로 생성 (PATCH 지원)
- Supabase 사용자 JWT → **ES256** 서명 → HS256만 쓰면 401 발생
- `SUPABASE_SERVICE_ROLE_KEY`에 anon key 혼용 → RLS 적용으로 데이터 접근 실패
- `@RequestAttribute("userId")`는 Swagger에서 `@Parameter(hidden = true)` 필수

# 현재 API 엔드포인트
```
POST   /api/v1/auth/signup       → 회원가입
POST   /api/v1/auth/login        → 로그인
GET    /api/v1/todos             → 목록 조회
GET    /api/v1/todos/{id}        → 단건 조회
POST   /api/v1/todos             → 생성
PATCH  /api/v1/todos/{id}        → 수정
DELETE /api/v1/todos/{id}        → 삭제
```

# 명령어
```bash
set -a && source .env && set +a && ./gradlew bootRun
./gradlew test
./gradlew build
```
