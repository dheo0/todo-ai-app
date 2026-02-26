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

  editTodo: async (id, title) => {
    const res = await updateTodo({ path: { id }, body: { title } })
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
