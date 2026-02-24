import { useEffect } from 'react'
import { useTodoStore } from '@/store/todoStore'
import { TodoForm } from '@/components/TodoForm'
import { TodoItem } from '@/components/TodoItem'

export function TodoPage() {
  const { todos, isLoading, fetchTodos, addTodo, toggleTodo, editTodo, deleteTodo } = useTodoStore()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '0 16px' }}>
      <h1>Todo App</h1>
      <TodoForm onAdd={addTodo} />
      {isLoading ? (
        <p>불러오는 중...</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {todos.map((todo) => (
            <li key={todo.id}>
              <TodoItem
                todo={todo}
                onToggle={toggleTodo}
                onEdit={editTodo}
                onDelete={deleteTodo}
              />
            </li>
          ))}
          {todos.length === 0 && <p>할 일이 없습니다.</p>}
        </ul>
      )}
    </div>
  )
}
