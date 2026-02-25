import { create } from 'zustand'
import type { SocialProvider } from '@/types/auth'

interface AuthStore {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  socialLogin: (provider: SocialProvider) => void
  logout: () => void
}

// JWT payload 디코딩 (서명 검증 없음 - 프론트엔드 표시용)
function parseJwt(token: string): { sub: string; email: string } | null {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(window.atob(base64))
  } catch {
    return null
  }
}

// 이메일 확인 링크 or 소셜 로그인 리다이렉트 시 URL 해시에서 access_token 추출
// Supabase가 http://localhost:5173/#access_token=xxx&type=signup 형태로 리다이렉트
const hash = window.location.hash.substring(1)
const hashParams = new URLSearchParams(hash)
const hashToken = hashParams.get('access_token')

let initialToken = localStorage.getItem('accessToken')
let initialUserId = localStorage.getItem('userId')
let initialEmail = localStorage.getItem('email')

if (hashToken) {
  const payload = parseJwt(hashToken)
  if (payload) {
    initialToken = hashToken
    initialUserId = payload.sub
    // 카카오 등 이메일이 없는 제공자 대비 fallback
    initialEmail = payload.email || payload.sub.substring(0, 8)
    localStorage.setItem('accessToken', hashToken)
    localStorage.setItem('userId', payload.sub)
    localStorage.setItem('email', initialEmail)
    // URL에서 해시 제거 (토큰 노출 방지)
    window.history.replaceState({}, '', window.location.pathname)
  }
}

export const useAuthStore = create<AuthStore>((set) => ({
  userId: initialUserId,
  email: initialEmail,
  isAuthenticated: !!(initialToken && initialUserId && initialEmail),

  socialLogin: (provider) => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const redirectTo = window.location.origin
    window.location.href = `${supabaseUrl}/auth/v1/authorize?provider=${provider}&redirect_to=${encodeURIComponent(redirectTo)}`
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    set({ userId: null, email: null, isAuthenticated: false })
  },
}))

/* 이메일/비밀번호 인증 (소셜 로그인으로 대체됨 - 필요 시 주석 해제)
import { authApi } from '@/api/auth'
import type { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth'

interface AuthStore {
  ...
  signup: (body: SignupRequest) => Promise<AuthResponse>
  login: (body: LoginRequest) => Promise<void>
}

  signup: async (body) => {
    const res = await authApi.signup(body)
    const data = res.data.data
    if (!data.needsEmailConfirmation && data.accessToken && data.userId) {
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('userId', data.userId)
      localStorage.setItem('email', data.email)
      set({ userId: data.userId, email: data.email, isAuthenticated: true })
    }
    return data
  },

  login: async (body) => {
    const res = await authApi.login(body)
    const { accessToken, userId, email } = res.data.data
    localStorage.setItem('accessToken', accessToken!)
    localStorage.setItem('userId', userId!)
    localStorage.setItem('email', email)
    set({ userId, email, isAuthenticated: true })
  },
*/
