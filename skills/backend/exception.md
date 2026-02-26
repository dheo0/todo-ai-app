# 예외 처리 가이드

## 구조
- 커스텀 예외: `global/exception/` 하위에 추가
- 일괄 처리: `GlobalExceptionHandler` (`@RestControllerAdvice`)

## 커스텀 예외 작성
```java
public class TodoNotFoundException extends RuntimeException {
    public TodoNotFoundException(String id) {
        super("존재하지 않는 Todo입니다: " + id);
    }
}

public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
```

## GlobalExceptionHandler
```java
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(TodoNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handleNotFound(TodoNotFoundException e) {
        return ResponseEntity.status(404).body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handleUnauthorized(UnauthorizedException e) {
        return ResponseEntity.status(401).body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidation(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(fe -> fe.getField() + ": " + fe.getDefaultMessage())
                .collect(Collectors.joining(", "));
        return ResponseEntity.status(400).body(ApiResponse.fail(message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleGeneral(Exception e) {
        return ResponseEntity.status(500).body(ApiResponse.fail("서버 오류가 발생했습니다."));
    }
}
```

## 새 예외 추가 순서
1. `global/exception/` 에 RuntimeException 상속 클래스 작성
2. `GlobalExceptionHandler` 에 `@ExceptionHandler` 메서드 추가
3. Service/Controller에서 예외 throw
