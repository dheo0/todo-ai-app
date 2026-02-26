# DB 개요

## Supabase 연결 방식
- 백엔드(Spring Boot)에서 Supabase **REST API(PostgREST)**로 HTTP 연결
- **JPA/Hibernate 미사용** — RestTemplate + Supabase REST API
- 프론트엔드에서 Supabase SDK/API 직접 호출 **금지** → 반드시 백엔드 API 경유

## PostgREST 쿼리 패턴
```
# 목록 조회 (필터 + 정렬)
GET /rest/v1/todos?user_id=eq.{userId}&select=*&order=created_at.desc

# 단건 조회
GET /rest/v1/todos?id=eq.{id}&select=*

# 생성 (Prefer: return=representation 필수)
POST /rest/v1/todos
Headers: Prefer: return=representation

# 수정 (Prefer: return=representation 필수)
PATCH /rest/v1/todos?id=eq.{id}
Headers: Prefer: return=representation

# 삭제
DELETE /rest/v1/todos?id=eq.{id}
```

## 백엔드 RestTemplate 헤더
```java
headers.set("apikey", supabase.serviceRoleKey());
headers.set("Authorization", "Bearer " + supabase.serviceRoleKey());
headers.setContentType(MediaType.APPLICATION_JSON);
// 생성/수정 시 추가:
headers.set("Prefer", "return=representation");
```

**주의**: `serviceRoleKey`는 anon key가 아닌 **service_role key** 사용 (RLS 우회 필요).

## 환경변수
```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<service_role JWT>
SUPABASE_ANON_KEY=<anon JWT>
SUPABASE_JWT_SECRET=<base64-encoded JWT secret>
```
- `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`: Dashboard → Settings → API
- `SUPABASE_JWT_SECRET`: Dashboard → Settings → API → JWT Secret
