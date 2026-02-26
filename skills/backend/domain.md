# 새 도메인 추가 가이드

## 추가 순서
1. `domain/{name}/entity/` → Supabase 응답 역직렬화용 record 작성
2. `domain/{name}/dto/` → Request / Response DTO 작성
3. `domain/{name}/service/` → RestTemplate으로 Supabase REST API 호출 로직
4. `domain/{name}/controller/` → REST 엔드포인트 작성
5. `global/exception/` → 필요한 커스텀 예외 추가

## Entity (Supabase 응답 역직렬화 record)
JPA Entity가 아님. Supabase REST API(PostgREST) 응답 JSON을 역직렬화하는 record.

```java
public record Todo(
    @JsonProperty("id") String id,
    @JsonProperty("user_id") String userId,
    @JsonProperty("title") String title,
    @JsonProperty("completed") boolean completed,
    @JsonProperty("created_at") String createdAt
) {}
```
- 필드명이 snake_case인 경우 `@JsonProperty`로 매핑 필수.

## DTO 작성 규칙

### Request DTO
```java
public record TodoCreateRequest(
    @NotBlank String title
) {}

public record TodoUpdateRequest(
    String title,       // nullable (선택 수정)
    Boolean completed   // nullable
) {}
```

### Response DTO
```java
public record TodoResponse(
    String id,
    String title,
    boolean completed,
    String createdAt
) {
    public static TodoResponse from(Todo todo) {
        return new TodoResponse(
            todo.id(), todo.title(), todo.completed(), todo.createdAt()
        );
    }
}
```

## Service (Supabase REST API 호출)
```java
@Service
@RequiredArgsConstructor
public class TodoService {

    private final RestTemplate restTemplate;
    private final SupabaseProperties supabase;

    private HttpHeaders supabaseHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.set("apikey", supabase.serviceRoleKey());
        headers.set("Authorization", "Bearer " + supabase.serviceRoleKey());
        headers.setContentType(MediaType.APPLICATION_JSON);
        return headers;
    }

    public List<TodoResponse> getAll(String userId) {
        String url = supabase.url() + "/rest/v1/todos?user_id=eq." + userId
                   + "&select=*&order=created_at.desc";
        Todo[] todos = restTemplate.exchange(
            url, HttpMethod.GET,
            new HttpEntity<>(supabaseHeaders()), Todo[].class
        ).getBody();
        return Arrays.stream(todos).map(TodoResponse::from).toList();
    }

    public TodoResponse create(TodoCreateRequest req, String userId) {
        String url = supabase.url() + "/rest/v1/todos";
        HttpHeaders headers = supabaseHeaders();
        headers.set("Prefer", "return=representation");  // 생성된 객체 반환
        Map<String, Object> body = Map.of(
            "title", req.title(),
            "user_id", userId
        );
        Todo[] result = restTemplate.exchange(
            url, HttpMethod.POST,
            new HttpEntity<>(body, headers), Todo[].class
        ).getBody();
        return TodoResponse.from(result[0]);
    }
}
```

**핵심 패턴:**
- `Prefer: return=representation` — 생성/수정 후 결과 객체 반환 요청
- PostgREST는 단건도 배열 반환 → `Todo[]`로 받아 `[0]` 사용
- `RestTemplate`은 반드시 `HttpComponentsClientHttpRequestFactory`로 생성 (PATCH 지원)
- 필터 조건: `?field=eq.{value}` (PostgREST 쿼리 문법)
