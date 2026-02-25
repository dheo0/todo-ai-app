import { create } from 'zustand'
import { authApi } from '@/api/auth'
import type { LoginRequest, SignupRequest } from '@/types/auth'

interface AuthStore {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  signup: (body: SignupRequest) => Promise<void>
  login: (body: LoginRequest) => Promise<void>
  logout: () => void
}

// 스토어 생성 시 즉시 localStorage 읽어 초기 상태 설정 (새로고침 깜빡임 방지)
const token = localStorage.getItem('accessToken')
const savedUserId = localStorage.getItem('userId')
const savedEmail = localStorage.getItem('email')

export const useAuthStore = create<AuthStore>((set) => ({
  userId: savedUserId,
  email: savedEmail,
  isAuthenticated: !!(token && savedUserId && savedEmail),

  signup: async (body) => {
    const res = await authApi.signup(body)
    const { accessToken, userId, email } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userId', userId)
    localStorage.setItem('email', email)
    set({ userId, email, isAuthenticated: true })
  },

  login: async (body) => {
    const res = await authApi.login(body)
    const { accessToken, userId, email } = res.data.data
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('userId', userId)
    localStorage.setItem('email', email)
    set({ userId, email, isAuthenticated: true })
  },

  logout: () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('userId')
    localStorage.removeItem('email')
    set({ userId: null, email: null, isAuthenticated: false })
  },
}))
