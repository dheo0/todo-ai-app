import { create } from 'zustand'
import { createClient } from '@supabase/supabase-js'
import type { SocialProvider } from '@/types/auth'

export const supabase = createClient(
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
  supabase.auth.onAuthStateChange((event, session) => {
    // PKCE 코드 교환 중: URL에 ?code=가 있고 INITIAL_SESSION에서 세션이 없으면
    // 코드 교환이 완료될 때까지 초기화를 보류한다
    const hasCode = new URLSearchParams(window.location.search).has('code')
    if (event === 'INITIAL_SESSION' && !session && hasCode) {
      return
    }

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
  signup: async (body) => { ... },
  login: async (body) => { ... },
*/
