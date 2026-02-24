# 백엔드 개요
Spring Boot 3.2.3 기반 REST API 서버.
DB는 Supabase(PostgreSQL)에 JDBC 직접 연결이 아닌 **Supabase REST API(PostgREST)** 방식으로 연동한다.
JPA/Hibernate를 사용하지 않으며, `RestTemplate`으로 HTTP 호출한다.

# 기술 스택
- Java 22 / Spring Boot 3.2.3 / Gradle 8.10.2 (Groovy DSL)
- spring-boot-starter-web, spring-boot-starter-validation, Lombok
- DB 연동: Supabase REST API (`RestTemplate`)

# 패키지 구조
```
com.example.todoapp/
  TodoAppApplication.java
  global/
    common/
      ApiResponse.java          # 공통 응답 래퍼 { success, data, message }
    config/
      SupabaseProperties.java   # @ConfigurationProperties(prefix="supabase")
      SupabaseConfig.java       # RestTemplate Bean 등록 + @EnableConfigurationProperties
    exception/
      TodoNotFoundException.java      # RuntimeException 상속
      GlobalExceptionHandler.java     # @RestControllerAdvice
  domain/todo/
    entity/
      Todo.java                 # Supabase 응답 역직렬화용 record (JPA Entity 아님)
    dto/
      TodoCreateRequest.java    # @NotBlank title
      TodoUpdateRequest.java    # title?, completed?
      TodoResponse.java         # id, title, completed, createdAt (String)
    service/
      TodoService.java          # Supabase REST API HTTP 호출 로직
    controller/
      TodoController.java       # /api/v1/todos REST 엔드포인트
```

# Supabase REST API 연동 방식
- `TodoService`가 `RestTemplate`으로 Supabase PostgREST 엔드포인트를 직접 호출한다.
- 모든 요청에 아래 헤더를 포함한다:
  ```
  apikey: {serviceRoleKey}
  Authorization: Bearer {serviceRoleKey}
  Content-Type: application/json
  ```
- 생성/수정 시 `Prefer: return=representation` 헤더를 추가해 응답 바디를 반환받는다.
- PostgREST는 단건 조회도 배열로 반환하므로 `Todo[]`로 받아 첫 번째 요소를 사용한다.
- 존재하지 않는 id 조회 시 빈 배열 → `TodoNotFoundException` 발생.

# API 엔드포인트
```
GET    /api/v1/todos          → 전체 목록
GET    /api/v1/todos/{id}     → 단건 조회
POST   /api/v1/todos          → 생성 (body: { title })
PATCH  /api/v1/todos/{id}     → 부분 수정 (body: { title?, completed? })
DELETE /api/v1/todos/{id}     → 삭제
```

# 공통 응답 포맷
```json
{ "success": true, "data": { ... }, "message": "요청 성공" }
{ "success": false, "data": null, "message": "오류 메시지" }
```

# 환경변수 (.env)
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>   ← RLS 우회, 서버 전용
SUPABASE_ANON_KEY=<anon JWT>
```
- `.env`는 커밋 금지. `.env.example` 참고.
- 서버 실행 시 환경변수 주입: `set -a && source .env && set +a && ./gradlew bootRun`

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
