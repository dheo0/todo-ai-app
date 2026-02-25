import { useState, useRef, useEffect } from 'react'
import {
  Box,
  Checkbox,
  Divider,
  IconButton,
  ListItem,
  ListItemText,
  TextField,
  Tooltip,
} from '@mui/material'
import CheckIcon from '@mui/icons-material/Check'
import CloseIcon from '@mui/icons-material/Close'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
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
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus()
    }
  }, [isEditing])

  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(todo.id, editTitle.trim())
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditTitle(todo.title)
    setIsEditing(false)
  }

  return (
    <>
      <ListItem disablePadding sx={{ py: 0.5 }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, width: '100%', py: 0.5 }}>
            <TextField
              inputRef={inputRef}
              fullWidth
              size="small"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave()
                if (e.key === 'Escape') handleCancel()
              }}
            />
            <Tooltip title="저장">
              <IconButton color="primary" size="small" onClick={handleSave}>
                <CheckIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="취소">
              <IconButton size="small" onClick={handleCancel}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        ) : (
          <>
            <Checkbox
              checked={todo.completed}
              onChange={() => onToggle(todo.id, todo.completed)}
              color="primary"
              size="small"
            />
            <ListItemText
              primary={todo.title}
              slotProps={{
                primary: {
                  sx: {
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? 'text.disabled' : 'text.primary',
                  },
                },
              }}
            />
            <Tooltip title="수정">
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            <Tooltip title="삭제">
              <IconButton size="small" color="error" onClick={() => onDelete(todo.id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </>
        )}
      </ListItem>
      <Divider component="li" />
    </>
  )
}
