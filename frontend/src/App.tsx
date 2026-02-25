import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { TodoPage } from '@/pages/TodoPage'

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#1976d2' },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <TodoPage />
    </ThemeProvider>
  )
}

export default App
