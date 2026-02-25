import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  Link,
  Paper,
  TextField,
  Typography,
} from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead'
import { useAuthStore } from '@/store/authStore'

export function RegisterPage() {
  const navigate = useNavigate()
  const { signup } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [emailSent, setEmailSent] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.')
      return
    }
    setIsLoading(true)
    try {
      const data = await signup({ email, password })
      if (data.needsEmailConfirmation) {
        setEmailSent(true)
      } else {
        navigate('/')
      }
    } catch {
      setError('회원가입에 실패했습니다. 이미 사용 중인 이메일일 수 있습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  // 이메일 확인 안내 화면
  if (emailSent) {
    return (
      <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex', alignItems: 'center' }}>
        <Container maxWidth="xs">
          <Paper elevation={2} sx={{ p: 4, borderRadius: 2, textAlign: 'center' }}>
            <MarkEmailReadIcon color="primary" sx={{ fontSize: 64, mb: 2 }} />
            <Typography variant="h6" fontWeight={600} mb={1}>
              이메일을 확인하세요
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={3}>
              <strong>{email}</strong> 로 인증 메일을 보냈습니다.
              <br />
              메일의 <strong>Confirm your mail</strong> 버튼을 클릭하면
              <br />
              자동으로 로그인됩니다.
            </Typography>
            <Alert severity="info" sx={{ textAlign: 'left', mb: 2 }}>
              메일이 오지 않으면 스팸 폴더를 확인해주세요.
            </Alert>
            <Typography variant="body2">
              <Link component={RouterLink} to="/login">
                로그인 페이지로 돌아가기
              </Link>
            </Typography>
          </Paper>
        </Container>
      </Box>
    )
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'grey.100', display: 'flex', alignItems: 'center' }}>
      <Container maxWidth="xs">
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1, mb: 3 }}>
          <ChecklistIcon color="primary" fontSize="large" />
          <Typography variant="h5" fontWeight={700} color="primary">
            Todo App
          </Typography>
        </Box>
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h6" fontWeight={600} align="center" mb={3}>
            회원가입
          </Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="이메일"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              label="비밀번호 (6자 이상)"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              label="비밀번호 확인"
              type="password"
              fullWidth
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
            >
              {isLoading ? '가입 중...' : '회원가입'}
            </Button>
          </Box>
          <Typography align="center" sx={{ mt: 2 }} variant="body2">
            이미 계정이 있으신가요?{' '}
            <Link component={RouterLink} to="/login">
              로그인
            </Link>
          </Typography>
        </Paper>
      </Container>
    </Box>
  )
}
