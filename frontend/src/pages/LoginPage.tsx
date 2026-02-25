import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import {
  Alert,
  Box,
  Button,
  Container,
  Divider,
  Link,
  Paper,
  SvgIcon,
  TextField,
  Typography,
} from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { useAuthStore } from '@/store/authStore'
import type { SocialProvider } from '@/types/auth'

interface SocialButtonConfig {
  provider: SocialProvider
  label: string
  bgcolor: string
  color: string
  hoverBgcolor: string
  icon: React.ReactNode
  border?: string
}

function KakaoIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ width: 20, height: 20 }}>
      <path
        fill="#3C1E1E"
        d="M12 3C6.477 3 2 6.477 2 10.8c0 2.717 1.706 5.1 4.27 6.497l-1.09 4.05a.3.3 0 0 0 .458.32L10.2 19.2c.588.085 1.19.13 1.8.13 5.523 0 10-3.477 10-7.8S17.523 3 12 3z"
      />
    </SvgIcon>
  )
}

function GoogleIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ width: 20, height: 20 }}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </SvgIcon>
  )
}

export function LoginPage() {
  const navigate = useNavigate()
  const { login, socialLogin } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)
    try {
      await login({ email, password })
      navigate('/')
    } catch {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.')
    } finally {
      setIsLoading(false)
    }
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
            로그인
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
              label="비밀번호"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
            >
              {isLoading ? '로그인 중...' : '로그인'}
            </Button>
          </Box>
          <Typography align="center" sx={{ mt: 2 }} variant="body2">
            계정이 없으신가요?{' '}
            <Link component={RouterLink} to="/register">
              회원가입
            </Link>
          </Typography>

          <Divider sx={{ my: 2 }}>또는</Divider>

          {(
            [
              {
                provider: 'kakao' as SocialProvider,
                label: '카카오로 로그인',
                bgcolor: '#FEE500',
                color: '#3C1E1E',
                hoverBgcolor: '#E6CF00',
                icon: <KakaoIcon />,
              },
              {
                provider: 'google' as SocialProvider,
                label: 'Google로 로그인',
                bgcolor: '#ffffff',
                color: '#000000',
                hoverBgcolor: '#f5f5f5',
                border: '1px solid #dadce0',
                icon: <GoogleIcon />,
              },
            ] as SocialButtonConfig[]
          ).map(({ provider, label, bgcolor, color, hoverBgcolor, border, icon }) => (
            <Button
              key={provider}
              fullWidth
              variant="contained"
              onClick={() => socialLogin(provider)}
              startIcon={icon}
              sx={{
                mb: 1,
                bgcolor,
                color,
                border: border ?? 'none',
                boxShadow: 'none',
                '&:hover': { bgcolor: hoverBgcolor, boxShadow: 'none' },
              }}
            >
              {label}
            </Button>
          ))}
        </Paper>
      </Container>
    </Box>
  )
}
