import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import type { SocialProvider } from '@/types/auth'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
)

interface AuthStore {
  userId: string | null
  email: string | null
  isAuthenticated: boolean
  isInitialized: boolean
  socialLogin: (provider: SocialProvider) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthStore>((set) => {
  // 앱 시작 시 현재 세션 확인 + 인증 상태 변화 구독
  supabase.auth.getSession().then(({ data: { session } }) => {
    if (session) {
      localStorage.setItem('accessToken', session.access_token)
      set({
        userId: session.user.id,
        email: session.user.email ?? session.user.id.substring(0, 8),
        isAuthenticated: true,
        isInitialized: true,
      })
    } else {
      localStorage.removeItem('accessToken')
      set({ isInitialized: true })
    }
  })

  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      localStorage.setItem('accessToken', session.access_token)
      set({
        userId: session.user.id,
        email: session.user.email ?? session.user.id.substring(0, 8),
        isAuthenticated: true,
        isInitialized: true,
      })
    } else {
      localStorage.removeItem('accessToken')
      set({ userId: null, email: null, isAuthenticated: false, isInitialized: true })
    }
  })

  return {
    userId: null,
    email: null,
    isAuthenticated: false,
    isInitialized: false,

    socialLogin: async (provider) => {
      await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      })
    },

    logout: async () => {
      await supabase.auth.signOut()
      localStorage.removeItem('accessToken')
      set({ userId: null, email: null, isAuthenticated: false })
    },
  }
})

/* 이메일/비밀번호 인증 (소셜 로그인으로 대체됨 - 필요 시 주석 해제)
import { authApi } from '@/api/auth'
import type { AuthResponse, LoginRequest, SignupRequest } from '@/types/auth'

  signup: async (body) => { ... },
  login: async (body) => { ... },
*/
