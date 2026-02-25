import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  List,
  Paper,
  Typography,
} from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import LogoutIcon from '@mui/icons-material/Logout'
import { useTodoStore } from '@/store/todoStore'
import { useAuthStore } from '@/store/authStore'
import { TodoForm } from '@/components/TodoForm'
import { TodoItem } from '@/components/TodoItem'

export function TodoPage() {
  const navigate = useNavigate()
  const { todos, isLoading, fetchTodos, addTodo, toggleTodo, editTodo, deleteTodo } = useTodoStore()
  const { email, logout } = useAuthStore()

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', py: 6 }}>
      <Container maxWidth="sm">
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ChecklistIcon color="primary" fontSize="large" />
            <Typography variant="h4" fontWeight={700} color="primary">
              Todo App
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" color="text.secondary">
              {email}
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              로그아웃
            </Button>
          </Box>
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
                <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
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
