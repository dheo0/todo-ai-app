# Springdoc OpenAPI 가이드

## 설정

### build.gradle
```groovy
implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.3.0'
```

### application.yml
```yaml
springdoc:
  api-docs:
    path: /v3/api-docs
  swagger-ui:
    path: /swagger-ui.html
    operations-sorter: method
```

### OpenApiConfig.java (전역 Bearer JWT 보안 스킴)
```java
@Configuration
public class OpenApiConfig {
    private static final String BEARER_SCHEME = "bearerAuth";

    @Bean
    public OpenAPI openAPI() {
        return new OpenAPI()
                .info(new Info().title("Todo App API").version("v1"))
                .addSecurityItem(new SecurityRequirement().addList(BEARER_SCHEME))
                .components(new Components().addSecuritySchemes(BEARER_SCHEME,
                        new SecurityScheme()
                                .type(SecurityScheme.Type.HTTP)
                                .scheme("bearer")
                                .bearerFormat("JWT")));
    }
}
```

## 컨트롤러 어노테이션 패턴

```java
@Tag(name = "Todo")                             // API 그룹 이름
@RestController
public class TodoController {

    @Operation(summary = "Todo 전체 조회",
               description = "로그인한 사용자의 Todo 목록을 반환합니다.")
    @ApiResponses({
        @ApiResponse(responseCode = "200", description = "OK"),
    })
    @GetMapping
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAll(
            @Parameter(hidden = true)           // Swagger UI에서 숨김
            @RequestAttribute("userId") String userId) { ... }
}
```

**중요**: `@RequestAttribute("userId")`는 AuthInterceptor가 주입하는 내부 값이므로 반드시 `@Parameter(hidden = true)` 적용.

## DTO @Schema 어노테이션
```java
@Schema(description = "Todo 응답")
public record TodoResponse(
    @Schema(description = "Todo ID (UUID)", example = "550e8400-e29b-41d4-a716-446655440000")
    String id,
    @Schema(description = "할 일 제목", example = "Spring Boot 공부하기")
    String title,
    @Schema(description = "완료 여부", example = "false")
    boolean completed,
    @Schema(description = "생성 시각 (ISO 8601)", example = "2024-01-15T09:30:00Z")
    String createdAt
) {}
```

## OpenAPI 스펙 활용 (프론트엔드 코드 생성)
1. 백엔드 서버 실행 후 스펙 저장:
   ```bash
   curl http://localhost:8080/v3/api-docs -o frontend/openapi.json
   ```
2. 프론트엔드에서 코드 생성:
   ```bash
   cd frontend && npm run generate
   ```
- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
