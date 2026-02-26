# Supabase 설정 가이드

## 키 종류 및 용도
| 키 | 환경변수 | 용도 |
|----|----------|------|
| anon key | `SUPABASE_ANON_KEY` | Supabase Auth API 호출 (회원가입/로그인) |
| service_role key | `SUPABASE_SERVICE_ROLE_KEY` | PostgREST DB 접근 (RLS 우회) |
| JWT Secret | `SUPABASE_JWT_SECRET` | 사용자 JWT 검증 (HS256) |

**주의**: `SUPABASE_SERVICE_ROLE_KEY`에 anon key 혼용 시 RLS가 적용되어 DB 접근 실패.

## Dashboard 위치 안내
- API 키 조회: Settings → API → Project API keys
- JWT Secret: Settings → API → JWT Settings
- DB 연결 정보: Settings → Database → Connection string
- 소셜 로그인 설정: Authentication → Providers
- Redirect URL 설정: Authentication → URL Configuration → Redirect URLs
- SQL 실행: SQL Editor

## 소셜 로그인 Provider 설정 (최초 1회)

### 카카오
1. [카카오 개발자](https://developers.kakao.com) → 앱 생성 → 카카오 로그인 활성화
2. Redirect URI: `{SUPABASE_URL}/auth/v1/callback` 등록
3. Supabase: Authentication → Providers → Kakao → Client ID/Secret 입력

### Google
1. [Google Cloud Console](https://console.cloud.google.com) → OAuth 2.0 클라이언트 생성
2. 승인된 리디렉션 URI: `{SUPABASE_URL}/auth/v1/callback` 등록
3. Supabase: Authentication → Providers → Google → Client ID/Secret 입력

### 공통 설정
- Authentication → URL Configuration → Redirect URLs에 `http://localhost:5173` 추가 (개발용)
- 운영 배포 시 실제 도메인 추가

## Supabase Auth API 흐름 (백엔드 경유)
```
회원가입: POST {SUPABASE_URL}/auth/v1/signup           (anonKey)
로그인:   POST {SUPABASE_URL}/auth/v1/token?grant_type=password  (anonKey)
JWKS:     GET  {SUPABASE_URL}/auth/v1/.well-known/jwks.json      (공개키 조회)
```

## 소셜 로그인 OAuth 흐름 (프론트엔드 직접)
```
1. 프론트엔드 → {SUPABASE_URL}/auth/v1/authorize?provider={provider}&redirect_to={origin}
2. Supabase → 소셜 OAuth 인증
3. 완료 → {origin}/#access_token=xxx&type=signup (URL 해시로 토큰 전달)
4. 프론트엔드: 해시에서 토큰 파싱 → localStorage 저장
```
