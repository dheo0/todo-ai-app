# 인증 가이드

## JWT 검증 (`AuthInterceptor`)

`/api/v1/**` 요청에 적용 (단, `/api/v1/auth/**`는 제외).

Supabase는 사용자 JWT를 **ES256**(타원곡선 비대칭 암호화)으로 서명한다.
- **ES256 토큰**: `{SUPABASE_URL}/auth/v1/.well-known/jwks.json`에서 공개키 조회 (첫 요청 시 1회 조회 후 캐싱)
- **HS256 토큰**: `SUPABASE_JWT_SECRET` 환경변수로 검증 (anon key / service role key 등)

검증 성공 시: `request.setAttribute("userId", userId)` 로 userId(JWT sub claim) 전달.
검증 실패 시: `UnauthorizedException` → `GlobalExceptionHandler` → 401 응답.

### keyLocator 패턴 (JJWT 0.12.6)
```java
Claims claims = Jwts.parser()
    .keyLocator(header -> "ES256".equals(header.get("alg"))
            ? getOrFetchPublicKey()      // JWKS에서 EC 공개키
            : buildHmacKey())           // JWT Secret으로 HMAC 키
    .build()
    .parseSignedClaims(token)
    .getPayload();
```

### JWKS 공개키 조회
```java
private PublicKey fetchPublicKeyFromJwks() {
    String jwksUrl = supabaseProperties.url() + "/auth/v1/.well-known/jwks.json";
    String jwksJson = restTemplate.getForObject(jwksUrl, String.class);
    JwkSet jwkSet = Jwks.setParser().build().parse(jwksJson);
    return jwkSet.getKeys().stream()
            .filter(k -> k instanceof PublicJwk)
            .map(k -> ((PublicJwk<?>) k).toKey())
            .findFirst()
            .orElseThrow(() -> new RuntimeException("JWKS에서 공개키를 찾을 수 없습니다."));
}
```

## Supabase Auth API (`AuthService`)

- **회원가입**: `POST {SUPABASE_URL}/auth/v1/signup` (anonKey 사용)
  - Supabase 이메일 인증 활성화 시 → `needsEmailConfirmation: true` 반환
- **로그인**: `POST {SUPABASE_URL}/auth/v1/token?grant_type=password` (anonKey 사용)
  - 성공 시 → `access_token`, `user.id`, `user.email` 반환

### Supabase Auth API 요청 헤더
```
apikey: {SUPABASE_ANON_KEY}
Authorization: Bearer {SUPABASE_ANON_KEY}
Content-Type: application/json
```

## 주의사항
- Supabase 사용자 JWT는 ES256 서명 → HS256만 검증하면 401 발생
- `SUPABASE_SERVICE_ROLE_KEY`에 anon key 사용 시 Supabase RLS 적용되어 Todo 데이터 접근 실패
- `SUPABASE_JWT_SECRET`은 base64 디코딩 후 HMAC 키로 사용
