# 프론트엔드 작업 가이드 (React 18)

## 새 기능 추가 순서
1. src/types/ → TypeScript 타입 정의
2. src/api/ → API 함수 작성
3. src/store/ → Zustand 스토어 추가
4. src/pages/ or src/components/ → UI 구현
5. src/router/ → 라우트 등록 (페이지인 경우)

## Axios 클라이언트 기본 구조
```ts
// src/api/client.ts
import axios from 'axios'

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { 'Content-Type': 'application/json' },
})

// 요청 인터셉터: JWT 토큰 자동 첨부
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 응답 인터셉터: 공통 에러 처리
apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## API 파일 작성 규칙
도메인별로 src/api/{domain}.ts 파일 생성.
```ts
// src/api/todo.ts
import { apiClient } from './client'
import type { Todo, TodoCreateRequest } from '@/types/todo'

export const todoApi = {
  getAll: () =>
    apiClient.get<{ data: Todo[] }>('/api/v1/todos'),
  getById: (id: string) =>
    apiClient.get<{ data: Todo }>(`/api/v1/todos/${id}`),
  create: (body: TodoCreateRequest) =>
    apiClient.post<{ data: Todo }>('/api/v1/todos', body),
  update: (id: string, body: Partial<TodoCreateRequest>) =>
    apiClient.patch<{ data: Todo }>(`/api/v1/todos/${id}`, body),
  delete: (id: string) =>
    apiClient.delete(`/api/v1/todos/${id}`),
}
```

## Zustand 스토어 작성 규칙
```ts
// src/store/todoStore.ts
import { create } from 'zustand'
import { todoApi } from '@/api/todo'
import type { Todo } from '@/types/todo'

interface TodoStore {
  todos: Todo[]
  isLoading: boolean
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  isLoading: false,
  fetchTodos: async () => {
    set({ isLoading: true })
    const res = await todoApi.getAll()
    set({ todos: res.data.data, isLoading: false })
  },
  addTodo: async (title) => {
    const res = await todoApi.create({ title })
    set((state) => ({ todos: [...state.todos, res.data.data] }))
  },
  deleteTodo: async (id) => {
    await todoApi.delete(id)
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }))
  },
}))
```

## 타입 정의 규칙
```ts
// src/types/todo.ts
export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface TodoCreateRequest {
  title: string
}
```

## 컴포넌트 작성 규칙
```tsx
// named export 사용
interface TodoItemProps {
  todo: Todo
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onDelete }: TodoItemProps) {
  return (
    <div className="flex items-center gap-2 p-3 border rounded">
      <span>{todo.title}</span>
      <button onClick={() => onDelete(todo.id)}>삭제</button>
    </div>
  )
}
```
