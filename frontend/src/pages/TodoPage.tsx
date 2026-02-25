import { useEffect } from 'react'
import {
  Box,
  CircularProgress,
  Container,
  List,
  Paper,
  Typography,
} from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { useTodoStore } from '@/store/todoStore'
import { TodoForm } from '@/components/TodoForm'
import { TodoItem } from '@/components/TodoItem'

export function TodoPage() {
  const { todos, isLoading, fetchTodos, addTodo, toggleTodo, editTodo, deleteTodo } = useTodoStore()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 6 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
          <ChecklistIcon color="primary" fontSize="large" />
          <Typography variant="h4" fontWeight={700} color="primary">
            Todo App
          </Typography>
        </Box>

        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <TodoForm onAdd={addTodo} />

          {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {todos.length === 0 ? (
                <Typography
                  color="text.secondary"
                  align="center"
                  sx={{ py: 4 }}
                >
                  할 일이 없습니다. 새로운 할 일을 추가해보세요!
                </Typography>
              ) : (
                <List disablePadding>
                  {todos.map((todo) => (
                    <TodoItem
                      key={todo.id}
                      todo={todo}
                      onToggle={toggleTodo}
                      onEdit={editTodo}
                      onDelete={deleteTodo}
                    />
                  ))}
                </List>
              )}
            </>
          )}
        </Paper>
      </Container>
    </Box>
  )
}
