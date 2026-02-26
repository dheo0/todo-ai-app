# OpenAPI 클라이언트 가이드

## 개요
`@hey-api/openapi-ts`로 백엔드 OpenAPI 스펙(`openapi.json`)에서 TypeScript SDK를 자동 생성.
수동 Axios API 파일 대신 생성된 `src/generated/sdk.gen.ts` 함수를 사용한다.

## 코드 생성 절차

1. 백엔드 서버 실행 후 스펙 저장:
   ```bash
   curl http://localhost:8080/v3/api-docs -o frontend/openapi.json
   ```

2. 코드 생성 실행:
   ```bash
   cd frontend && npm run generate
   ```

3. `src/generated/` 에 생성 파일 확인:
   - `types.gen.ts` — 모든 API 타입
   - `sdk.gen.ts` — API 호출 함수
   - `client.gen.ts` — 기본 client 인스턴스

## 설정 파일 (`openapi-ts.config.ts`)
```typescript
import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './openapi.json',
  output: { path: 'src/generated' },
  plugins: ['@hey-api/client-axios', '@hey-api/typescript', '@hey-api/sdk'],
})
```

## 클라이언트 초기화 (`src/api/generatedClient.ts`)
```typescript
import { client } from '@/generated/client.gen'

// baseURL 환경변수로 재설정 (생성된 기본값 덮어씀)
client.setConfig({ baseURL: import.meta.env.VITE_API_URL })

// JWT 토큰 자동 첨부
client.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 응답 시 로그인 페이지로 이동
client.instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
```

`main.tsx` 최상단에서 import하여 앱 시작 시 인터셉터 초기화:
```typescript
import '@/api/generatedClient'   // ← 반드시 다른 import보다 먼저
```

## SDK 함수 사용 패턴

### 응답 구조
```
res.data       → ApiResponse<T>  (HTTP 응답 body)
res.data?.data → 실제 데이터 페이로드
res.error      → 에러 정보 (있을 경우)
```

### Zustand 스토어에서 사용
```typescript
import { getAll, create as createTodo, update as updateTodo, delete_ as deleteTodo } from '@/generated/sdk.gen'
import type { Todo } from '@/types/todo'

// 목록 조회
const res = await getAll()
const todos = (res.data?.data ?? []) as unknown as Todo[]

// 생성 (body 객체로 전달)
const res = await createTodo({ body: { title } })
const todo = res.data?.data as unknown as Todo

// 수정 (path + body)
const res = await updateTodo({ path: { id }, body: { completed: !completed } })

// 삭제 (path만)
await deleteTodo({ path: { id } })
```

## 주의사항
- `src/generated/` 는 `.gitignore` 에 등록 (자동 생성 파일이므로 커밋 불필요)
- 백엔드 API가 변경되면 `openapi.json` 갱신 후 `npm run generate` 재실행
- `create` 함수명이 zustand의 `create`와 충돌 → import alias 사용:
  ```typescript
  import { create as createTodo } from '@/generated/sdk.gen'
  ```
