# REST API 패턴

## 엔드포인트 네이밍 규칙
```
GET    /api/v1/{resource}        → 목록 조회
GET    /api/v1/{resource}/{id}   → 단건 조회
POST   /api/v1/{resource}        → 생성
PUT    /api/v1/{resource}/{id}   → 전체 수정
PATCH  /api/v1/{resource}/{id}   → 부분 수정
DELETE /api/v1/{resource}/{id}   → 삭제
```

## 현재 구현된 엔드포인트
```
POST   /api/v1/auth/signup       → 회원가입 (AuthInterceptor 제외)
POST   /api/v1/auth/login        → 로그인 (AuthInterceptor 제외)

GET    /api/v1/todos             → 전체 목록 (userId 필터)
GET    /api/v1/todos/{id}        → 단건 조회
POST   /api/v1/todos             → 생성 (body: { title })
PATCH  /api/v1/todos/{id}        → 부분 수정 (body: { title?, completed? })
DELETE /api/v1/todos/{id}        → 삭제
```

## 공통 응답 래퍼 (`ApiResponse<T>`)
```java
public record ApiResponse<T>(
    boolean success,
    T data,
    String message
) {
    public static <T> ApiResponse<T> ok(T data) {
        return new ApiResponse<>(true, data, "요청 성공");
    }
    public static <T> ApiResponse<T> fail(String message) {
        return new ApiResponse<>(false, null, message);
    }
}
```

성공 응답:
```json
{ "success": true, "data": { ... }, "message": "요청 성공" }
```

실패 응답:
```json
{ "success": false, "data": null, "message": "오류 메시지" }
```

## Controller 패턴
```java
@RestController
@RequestMapping("/api/v1/todos")
@RequiredArgsConstructor
@Tag(name = "Todo")
public class TodoController {

    private final TodoService todoService;

    @GetMapping
    @Operation(summary = "Todo 전체 조회")
    public ResponseEntity<ApiResponse<List<TodoResponse>>> getAll(
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        return ResponseEntity.ok(ApiResponse.ok(todoService.getAll(userId)));
    }

    @PostMapping
    @Operation(summary = "Todo 생성")
    @ApiResponse(responseCode = "201", description = "생성 성공")
    public ResponseEntity<ApiResponse<TodoResponse>> create(
            @RequestBody @Valid TodoCreateRequest req,
            @Parameter(hidden = true) @RequestAttribute("userId") String userId) {
        return ResponseEntity.status(201).body(ApiResponse.ok(todoService.create(req, userId)));
    }
}
```

**주의**: `@RequestAttribute("userId")`는 AuthInterceptor가 주입한 값 — Swagger에서 숨기려면 `@Parameter(hidden = true)` 필수.
