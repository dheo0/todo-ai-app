import { apiClient } from './client'
import type { Todo, TodoCreateRequest, TodoUpdateRequest } from '@/types/todo'

export const todoApi = {
  getAll: () =>
    apiClient.get<{ data: Todo[] }>('/api/v1/todos'),
  getById: (id: string) =>
    apiClient.get<{ data: Todo }>(`/api/v1/todos/${id}`),
  create: (body: TodoCreateRequest) =>
    apiClient.post<{ data: Todo }>('/api/v1/todos', body),
  update: (id: string, body: TodoUpdateRequest) =>
    apiClient.patch<{ data: Todo }>(`/api/v1/todos/${id}`, body),
  delete: (id: string) =>
    apiClient.delete(`/api/v1/todos/${id}`),
}
