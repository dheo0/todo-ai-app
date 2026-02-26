# Zustand 스토어 가이드

## 작성 규칙
- 스토어 파일: `src/store/{domain}Store.ts`
- 인터페이스 먼저 선언, `create<Interface>()` 로 생성
- API 호출은 생성된 SDK 함수 (`src/generated/sdk.gen.ts`) 사용

## todoStore 패턴
```typescript
import { create } from 'zustand'
import { getAll, create as createTodo, update as updateTodo, delete_ as deleteTodo } from '@/generated/sdk.gen'
import type { Todo } from '@/types/todo'

interface TodoStore {
  todos: Todo[]
  isLoading: boolean
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => Promise<void>
  toggleTodo: (id: string, completed: boolean) => Promise<void>
  editTodo: (id: string, title: string) => Promise<void>
  deleteTodo: (id: string) => Promise<void>
}

export const useTodoStore = create<TodoStore>((set) => ({
  todos: [],
  isLoading: false,

  fetchTodos: async () => {
    set({ isLoading: true })
    const res = await getAll()
    set({ todos: (res.data?.data ?? []) as unknown as Todo[], isLoading: false })
  },

  addTodo: async (title) => {
    const res = await createTodo({ body: { title } })
    const todo = res.data?.data as unknown as Todo
    if (todo) set((state) => ({ todos: [...state.todos, todo] }))
  },

  toggleTodo: async (id, completed) => {
    const res = await updateTodo({ path: { id }, body: { completed: !completed } })
    const todo = res.data?.data as unknown as Todo
    if (todo) set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? todo : t)),
    }))
  },

  deleteTodo: async (id) => {
    await deleteTodo({ path: { id } })
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }))
  },
}))
```

## SDK 응답 타입 캐스팅
생성된 타입(`TodoResponse`)은 모든 필드가 optional이지만 실제 API는 항상 값을 반환.
로컬 타입(`Todo`)과 구조가 동일하므로 `as unknown as Todo`로 캐스팅.

## 스토어 사용 (컴포넌트)
```typescript
const { todos, isLoading, fetchTodos, addTodo, deleteTodo } = useTodoStore()

useEffect(() => {
  fetchTodos()
}, [fetchTodos])
```
