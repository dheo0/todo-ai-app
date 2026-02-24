# Spring Boot 작업 가이드

## 새 도메인 추가 순서
1. entity/ → JPA Entity 생성
2. repository/ → JpaRepository 인터페이스 생성
3. dto/ → Request, Response DTO 분리 생성
4. service/ → 비즈니스 로직 작성
5. controller/ → REST API 엔드포인트 작성
6. 단위 테스트 및 통합 테스트 작성

## API 엔드포인트 네이밍
GET    /api/v1/{resource}          → 목록 조회
GET    /api/v1/{resource}/{id}     → 단건 조회
POST   /api/v1/{resource}          → 생성
PUT    /api/v1/{resource}/{id}     → 전체 수정
PATCH  /api/v1/{resource}/{id}     → 부분 수정
DELETE /api/v1/{resource}/{id}     → 삭제

## Entity 작성 규칙
```java
@Entity
@Table(name = "todos")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Todo extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String title;

    private boolean completed = false;

    // 정적 팩토리 메서드로 생성
    public static Todo create(String title) {
        Todo todo = new Todo();
        todo.title = title;
        return todo;
    }
}
```

## DTO 작성 규칙
```java
// Request
public record TodoCreateRequest(
    @NotBlank String title
) {}

// Response
public record TodoResponse(
    String id,
    String title,
    boolean completed,
    LocalDateTime createdAt
) {
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
            todo.getId(), todo.getTitle(),
            todo.isCompleted(), todo.getCreatedAt()
        );
    }
}
```

## 공통 응답 래퍼
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

## 예외 처리
GlobalExceptionHandler(@RestControllerAdvice)에서 일괄 처리.
커스텀 예외는 global/exception/ 에 추가.
```java
@RestControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(EntityNotFoundException e) {
        return ResponseEntity.status(404).body(ApiResponse.fail(e.getMessage()));
    }
}
```
