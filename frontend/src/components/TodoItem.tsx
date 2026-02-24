import type { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #ddd', borderRadius: '4px', marginBottom: '8px' }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id, todo.completed)}
      />
      <span style={{ flex: 1, textDecoration: todo.completed ? 'line-through' : 'none' }}>
        {todo.title}
      </span>
      <button onClick={() => onDelete(todo.id)} style={{ color: 'red' }}>
        삭제
      </button>
    </div>
  )
}
