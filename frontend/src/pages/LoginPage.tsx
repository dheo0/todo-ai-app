import {
  Box,
  Button,
  Container,
  Divider,
  Paper,
  SvgIcon,
  Typography,
} from '@mui/material'
import ChecklistIcon from '@mui/icons-material/Checklist'
import { useAuthStore } from '@/store/authStore'
import type { SocialProvider } from '@/types/auth'

// 카카오 로고 SVG
function KakaoIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        fill="#3C1E1E"
        d="M12 3C6.477 3 2 6.477 2 10.8c0 2.758 1.748 5.186 4.4 6.592l-.892 3.32a.3.3 0 0 0 .438.337L9.8 18.79c.718.1 1.46.152 2.2.152 5.523 0 10-3.477 10-7.8C22 6.477 17.523 3 12 3z"
      />
    </SvgIcon>
  )
}

// 페이스북 로고 SVG
function FacebookIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        fill="white"
        d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
      />
    </SvgIcon>
  )
}

// 애플 로고 SVG
function AppleIcon() {
  return (
    <SvgIcon viewBox="0 0 24 24" sx={{ fontSize: 20 }}>
      <path
        fill="white"
        d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
      />
    </SvgIcon>
  )
}

interface SocialButtonConfig {
  provider: SocialProvider
  label: string
  bgcolor: string
  color: string
  hoverBgcolor: string
  icon: React.ReactNode
}

const socialButtons: SocialButtonConfig[] = [
  {
    provider: 'kakao',
    label: '카카오로 로그인',
    bgcolor: '#FEE500',
    color: '#3C1E1E',
    hoverBgcolor: '#E6CF00',
    icon: <KakaoIcon />,
  },
  {
    provider: 'facebook',
    label: '페이스북으로 로그인',
    bgcolor: '#1877F2',
    color: '#ffffff',
    hoverBgcolor: '#166FE5',
    icon: <FacebookIcon />,
  },
  {
    provider: 'apple',
    label: 'Apple로 로그인',
    bgcolor: '#000000',
    color: '#ffffff',
    hoverBgcolor: '#333333',
    icon: <AppleIcon />,
  },
]

export function LoginPage() {
  const { socialLogin } = useAuthStore()

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
          <Typography variant="h6" fontWeight={600} align="center" mb={1}>
            로그인
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center" mb={3}>
            소셜 계정으로 간편하게 시작하세요
          </Typography>
          <Divider sx={{ mb: 3 }} />
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            {socialButtons.map(({ provider, label, bgcolor, color, hoverBgcolor, icon }) => (
              <Button
                key={provider}
                fullWidth
                size="large"
                startIcon={icon}
                onClick={() => socialLogin(provider)}
                sx={{
                  bgcolor,
                  color,
                  fontWeight: 600,
                  '&:hover': { bgcolor: hoverBgcolor },
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Paper>
      </Container>
    </Box>
  )
}

/* 이메일/비밀번호 로그인 (소셜 로그인으로 대체됨 - 필요 시 주석 해제)
import { useState } from 'react'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { Alert, Link, TextField } from '@mui/material'

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
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
    ...폼 UI...
    <Typography align="center" sx={{ mt: 2 }} variant="body2">
      계정이 없으신가요?{' '}
      <Link component={RouterLink} to="/register">
        회원가입
      </Link>
    </Typography>
  )
}
*/
