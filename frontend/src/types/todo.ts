export interface Todo {
  id: string
  title: string
  completed: boolean
  createdAt: string
}

export interface TodoCreateRequest {
  title: string
}

export interface TodoUpdateRequest {
  title?: string
  completed?: boolean
}
