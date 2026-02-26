# 인증 가이드

## 이메일/비밀번호 로그인 흐름
1. `LoginPage` → `authStore.login({ email, password })`
2. 생성된 SDK `loginApi({ body })` → `POST /api/v1/auth/login`
3. 응답의 `accessToken`, `userId`, `email` → `localStorage` 저장 + Zustand 상태 갱신
4. `navigate('/')` → `PrivateRoute` 통과 → `TodoPage` 렌더링

## 소셜 로그인 흐름 (카카오 / Google)
SDK 미사용. Supabase OAuth **implicit flow** 직접 활용.

1. `authStore.socialLogin(provider)` → Supabase OAuth URL로 리다이렉트
   ```
   {VITE_SUPABASE_URL}/auth/v1/authorize?provider={provider}&redirect_to={origin}
   ```
2. OAuth 완료 → `http://localhost:5173/#access_token=xxx&type=signup` 으로 복귀
3. `authStore.ts` 모듈 초기화 시 URL 해시 자동 파싱:
   - `access_token` → localStorage 저장 + 해시 제거
   - `isAuthenticated: true` → PrivateRoute 통과 → TodoPage

### Supabase 설정 (최초 1회)
- Dashboard → Authentication → Providers → 각 공급자 활성화
- 각 공급자 콘솔에서 Redirect URI: `https://<project>.supabase.co/auth/v1/callback`
- Dashboard → Authentication → URL Configuration → Redirect URLs: `http://localhost:5173` 추가

## authStore 구조
```typescript
interface AuthStore {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  signup: (body: SignupRequest) => Promise<AuthResponse>
  login: (body: LoginRequest) => Promise<void>
  logout: () => void
  socialLogin: (provider: SocialProvider) => void  // 'kakao' | 'google'
}
```

### 소셜 로그인 액션
```typescript
socialLogin: (provider) => {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const redirectTo = window.location.origin  // http://localhost:5173
  window.location.href =
    `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`
},
```

### URL 해시 파싱 (모듈 초기화 시 실행)
```typescript
const hash = window.location.hash.substring(1)
const hashToken = new URLSearchParams(hash).get('access_token')

if (hashToken) {
  const payload = parseJwt(hashToken)
  if (payload) {
    localStorage.setItem('accessToken', hashToken)
    localStorage.setItem('userId', payload.sub)
    // 이메일 미제공 공급자 대비 fallback
    localStorage.setItem('email', payload.email || `user-${payload.sub.substring(0, 8)}`)
    window.history.replaceState({}, '', window.location.pathname)  // 해시 제거
  }
}
```

## 로그아웃
```typescript
logout: () => {
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userId')
  localStorage.removeItem('email')
  set({ userId: null, email: null, isAuthenticated: false })
},
```

## 토큰 만료 / 미인증 처리
`generatedClient.ts`의 Axios 응답 인터셉터:
```typescript
if (error.response?.status === 401) {
  localStorage.removeItem('accessToken')
  window.location.href = '/login'
}
```
