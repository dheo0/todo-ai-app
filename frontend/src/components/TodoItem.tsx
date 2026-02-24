import { useState } from 'react'
import type { Todo } from '@/types/todo'

interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)

  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(todo.id, editTitle.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px', border: '1px solid #4a90e2', borderRadius: '4px', marginBottom: '8px' }}>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave()
            if (e.key === 'Escape') handleCancel()
          }}
          style={{ flex: 1, padding: '4px 8px', fontSize: '14px' }}
          autoFocus
        />
        <button onClick={handleSave}>저장</button>
        <button onClick={handleCancel}>취소</button>
      </div>
    )
  }

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
      <button onClick={() => setIsEditing(true)}>수정</button>
      <button onClick={() => onDelete(todo.id)} style={{ color: 'red' }}>삭제</button>
    </div>
  )
}
