# 라우팅 가이드

## 현재 라우트 구조 (`App.tsx`)
```tsx
<Routes>
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegisterPage />} />
  <Route path="/" element={
    <PrivateRoute>
      <TodoPage />
    </PrivateRoute>
  } />
</Routes>
```

## PrivateRoute
인증 여부 확인 후 미인증 시 `/login`으로 리다이렉트.

```tsx
import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'

interface PrivateRouteProps {
  children: React.ReactNode
}

export function PrivateRoute({ children }: PrivateRouteProps) {
  const { isAuthenticated } = useAuthStore()
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />
}
```

## 새 라우트 추가 순서
1. `src/pages/` 에 페이지 컴포넌트 작성 (named export)
2. `App.tsx` 의 `<Routes>` 에 `<Route>` 추가
3. 인증이 필요한 페이지는 `<PrivateRoute>`로 감싸기

## 페이지 간 이동
```typescript
import { useNavigate } from 'react-router-dom'
const navigate = useNavigate()

navigate('/')       // Todo 페이지로
navigate('/login')  // 로그인 페이지로
navigate(-1)        // 뒤로 가기
```
