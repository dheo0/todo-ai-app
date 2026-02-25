import { useState } from 'react'
import { Box, Button, TextField } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'

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
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', gap: 1, mb: 2 }}
    >
      <TextField
        fullWidth
        size="small"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="할 일을 입력하세요"
        variant="outlined"
      />
      <Button
        type="submit"
        variant="contained"
        startIcon={<AddIcon />}
        sx={{ whiteSpace: 'nowrap' }}
      >
        추가
      </Button>
    </Box>
  )
}
