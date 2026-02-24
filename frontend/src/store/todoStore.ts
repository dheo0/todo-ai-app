import { create } from 'zustand'
import { todoApi } from '@/api/todo'
import type { Todo } from '@/types/todo'

interface TodoStore {
  todos: Todo[]
  isLoading: boolean
  fetchTodos: () => Promise<void>
  addTodo: (title: string) => Promise<void>
  toggleTodo: (id: string, completed: boolean) => Promise<void>
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

  toggleTodo: async (id, completed) => {
    const res = await todoApi.update(id, { completed: !completed })
    set((state) => ({
      todos: state.todos.map((t) => (t.id === id ? res.data.data : t)),
    }))
  },

  deleteTodo: async (id) => {
    await todoApi.delete(id)
    set((state) => ({ todos: state.todos.filter((t) => t.id !== id) }))
  },
}))
