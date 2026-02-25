# 백엔드 개요
Spring Boot 3.2.3 기반 REST API 서버.
DB는 Supabase(PostgreSQL)에 JDBC 직접 연결이 아닌 **Supabase REST API(PostgREST)** 방식으로 연동한다.
인증은 Supabase Auth API를 경유하며, JWT 검증은 Spring Interceptor에서 직접 수행한다.
JPA/Hibernate를 사용하지 않으며, `RestTemplate`으로 HTTP 호출한다.

# 기술 스택
- Java 22 / Spring Boot 3.2.3 / Gradle 8.10.2 (Groovy DSL)
- spring-boot-starter-web, spring-boot-starter-validation, Lombok
- DB 연동: Supabase REST API (`RestTemplate` + Apache HttpClient 5)
- JWT 검증: JJWT 0.12.6 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- httpclient5: PATCH 메서드 지원을 위해 필수 (기본 HttpURLConnection은 PATCH 미지원)

# 패키지 구조
```
com.example.todoapp/
  TodoAppApplication.java
  global/
    common/
      ApiResponse.java              # 공통 응답 래퍼 { success, data, message }
    config/
      SupabaseProperties.java       # @ConfigurationProperties(prefix="supabase")
                                    #   url, serviceRoleKey, anonKey, jwtSecret
      SupabaseConfig.java           # RestTemplate Bean (HttpComponentsClientHttpRequestFactory)
      WebMvcConfig.java             # AuthInterceptor 등록 (/api/v1/** 적용, /api/v1/auth/** 제외)
    interceptor/
      AuthInterceptor.java          # JWT 검증 인터셉터 (ES256 / HS256 모두 지원)
    exception/
      UnauthorizedException.java    # 401 응답용 RuntimeException
      TodoNotFoundException.java    # 404 응답용 RuntimeException
      GlobalExceptionHandler.java   # @RestControllerAdvice
  domain/auth/
    dto/
      SignupRequest.java            # email, password
      LoginRequest.java             # email, password
      AuthResponse.java             # accessToken, tokenType, expiresIn, userId, email, needsEmailConfirmation
      SupabaseAuthResponse.java     # Supabase Auth API 응답 역직렬화 record
      SupabaseUser.java             # id, email
    service/
      AuthService.java              # Supabase Auth API 호출 (signup / login)
    controller/
      AuthController.java           # POST /api/v1/auth/signup, POST /api/v1/auth/login
  domain/todo/
    entity/
      Todo.java                     # Supabase 응답 역직렬화용 record (JPA Entity 아님)
    dto/
      TodoCreateRequest.java        # @NotBlank title
      TodoUpdateRequest.java        # title?, completed?
      TodoResponse.java             # id, title, completed, createdAt (String)
    service/
      TodoService.java              # Supabase REST API HTTP 호출 로직
    controller/
      TodoController.java           # /api/v1/todos REST 엔드포인트
```

# JWT 검증 (`AuthInterceptor`)
`/api/v1/**` 요청에 적용 (단, `/api/v1/auth/**`는 제외).

Supabase는 **ES256**(타원곡선 비대칭 암호화)으로 사용자 JWT를 서명한다.
- **ES256 토큰**: `SUPABASE_URL/auth/v1/.well-known/jwks.json` 에서 공개키를 조회해 검증 (첫 요청 시 조회 후 캐싱)
- **HS256 토큰**: `SUPABASE_JWT_SECRET` 환경변수로 검증 (anon key / service role key 등)

검증 성공 시 `userId`(JWT sub claim)를 `request.setAttribute("userId", userId)` 로 전달.
실패 시 `UnauthorizedException` → GlobalExceptionHandler → 401 응답.

# 인증 API (`AuthService`)
- `POST /api/v1/auth/signup` → Supabase `POST /auth/v1/signup` 호출 (anonKey 사용)
  - Supabase 이메일 인증 활성화 시 `needsEmailConfirmation: true` 반환
- `POST /api/v1/auth/login` → Supabase `POST /auth/v1/token?grant_type=password` 호출 (anonKey 사용)
  - 성공 시 `accessToken`, `userId`, `email` 반환

# Supabase REST API 연동 (`TodoService`)
- `RestTemplate`으로 Supabase PostgREST 엔드포인트 직접 호출
- 모든 요청 헤더:
  ```
  apikey: {serviceRoleKey}
  Authorization: Bearer {serviceRoleKey}
  Content-Type: application/json
  ```
- 생성/수정 시 `Prefer: return=representation` 헤더 추가
- PostgREST는 단건 조회도 배열로 반환 → `Todo[]`로 받아 첫 번째 요소 사용
- 존재하지 않는 id 조회 시 빈 배열 → `TodoNotFoundException`

# API 엔드포인트
```
POST   /api/v1/auth/signup      → 회원가입 (인터셉터 제외)
POST   /api/v1/auth/login       → 로그인 (인터셉터 제외)

GET    /api/v1/todos            → 전체 목록 (userId 필터)
GET    /api/v1/todos/{id}       → 단건 조회
POST   /api/v1/todos            → 생성 (body: { title })
PATCH  /api/v1/todos/{id}       → 부분 수정 (body: { title?, completed? })
DELETE /api/v1/todos/{id}       → 삭제
```

# 공통 응답 포맷
```json
{ "success": true, "data": { ... }, "message": "요청 성공" }
{ "success": false, "data": null, "message": "오류 메시지" }
```

# 환경변수 (.env)
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>   ← RLS 우회용, anon key와 다른 값
SUPABASE_ANON_KEY=<anon JWT>
SUPABASE_JWT_SECRET=<base64-encoded JWT secret>
```
- `.env`는 커밋 금지. `.env.example` 참고.
- `SUPABASE_JWT_SECRET`: Supabase 대시보드 → Settings → API → JWT Secret
- `SUPABASE_SERVICE_ROLE_KEY`: 반드시 service_role key 사용 (anon key 혼용 금지, RLS 우회 불가)
- 서버 실행 시: `set -a && source .env && set +a && ./gradlew bootRun`

# 주의사항
- `RestTemplate`은 반드시 `HttpComponentsClientHttpRequestFactory`로 생성 (PATCH 지원)
- `SUPABASE_SERVICE_ROLE_KEY`에 anon key를 사용하면 Supabase RLS가 적용되어 데이터 접근 실패
- Supabase 사용자 JWT는 ES256으로 서명됨 → HS256으로만 검증 시 401 발생

# 새 도메인 추가 순서
1. `domain/{name}/entity/` → Supabase 응답 역직렬화용 record 작성 (`@JsonProperty`로 snake_case 매핑)
2. `domain/{name}/dto/` → Request / Response DTO 작성
3. `domain/{name}/service/` → `RestTemplate`으로 Supabase REST API 호출 로직 작성
4. `domain/{name}/controller/` → REST 엔드포인트 작성
5. `global/exception/` → 필요한 커스텀 예외 추가

# 명령어
```bash
set -a && source .env && set +a && ./gradlew bootRun   # 서버 실행 (http://localhost:8080)
./gradlew test                                          # 테스트 실행
./gradlew build                                         # 빌드
```
