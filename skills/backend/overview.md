# 백엔드 개요

## 기술 스택
- Java 22 / Spring Boot 3.2.3 / Gradle 8.10.2 (Groovy DSL)
- spring-boot-starter-web, spring-boot-starter-validation, Lombok
- DB 연동: Supabase REST API (`RestTemplate` + Apache HttpClient 5)
- JWT 검증: JJWT 0.12.6 (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- OpenAPI 문서: springdoc-openapi-starter-webmvc-ui 2.3.0
- `httpclient5`: PATCH 메서드 지원을 위해 필수 (기본 HttpURLConnection은 PATCH 미지원)

## 패키지 구조
```
com.example.todoapp/
  TodoAppApplication.java
  global/
    common/
      ApiResponse.java              # 공통 응답 래퍼 { success, data, message }
    config/
      SupabaseProperties.java       # @ConfigurationProperties(prefix="supabase")
      SupabaseConfig.java           # RestTemplate Bean (HttpComponentsClientHttpRequestFactory)
      WebMvcConfig.java             # AuthInterceptor 등록 (/api/v1/**, /api/v1/auth/** 제외)
      OpenApiConfig.java            # Springdoc Bearer JWT 보안 스킴 전역 설정
    interceptor/
      AuthInterceptor.java          # JWT 검증 (ES256 / HS256 모두 지원)
    exception/
      UnauthorizedException.java
      TodoNotFoundException.java
      GlobalExceptionHandler.java   # @RestControllerAdvice
  domain/auth/
    dto/  SignupRequest, LoginRequest, AuthResponse, SupabaseAuthResponse, SupabaseUser
    service/  AuthService
    controller/  AuthController
  domain/todo/
    entity/  Todo.java              # Supabase 응답 역직렬화용 record (JPA Entity 아님)
    dto/  TodoCreateRequest, TodoUpdateRequest, TodoResponse
    service/  TodoService
    controller/  TodoController
```

## 환경변수 (.env)
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>   # RLS 우회용 — anon key와 반드시 다른 값 사용
SUPABASE_ANON_KEY=<anon JWT>
SUPABASE_JWT_SECRET=<base64-encoded JWT secret>
```
- `.env`는 커밋 금지. `.env.example` 참고.
- `SUPABASE_JWT_SECRET`: Supabase Dashboard → Settings → API → JWT Secret
- `SUPABASE_SERVICE_ROLE_KEY`: anon key 혼용 금지 — RLS 우회 불가

## 명령어
```bash
# 서버 실행 (환경변수 로드 필요)
set -a && source .env && set +a && ./gradlew bootRun

./gradlew test    # 테스트
./gradlew build   # 빌드
```
