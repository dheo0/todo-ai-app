import { useState } from 'react'

interface TodoFormProps {
  onAdd: (title: string) => void
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    onAdd(title.trim())
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일을 입력하세요"
        style={{ flex: 1, padding: '8px', fontSize: '14px' }}
      />
      <button type="submit" style={{ padding: '8px 16px' }}>
        추가
      </button>
    </form>
  )
}
