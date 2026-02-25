import { apiClient } from './client'
import type { AuthResponse } from '@/types/auth'

/* 이메일/비밀번호 인증 (소셜 로그인으로 대체됨 - 필요 시 주석 해제)
import type { AuthResponse, SignupRequest, LoginRequest } from '@/types/auth'

export const authApi = {
  signup: (body: SignupRequest) =>
    apiClient.post<{ data: AuthResponse }>('/api/v1/auth/signup', body),
  login: (body: LoginRequest) =>
    apiClient.post<{ data: AuthResponse }>('/api/v1/auth/login', body),
}
*/

// 소셜 로그인은 Supabase OAuth URL로 직접 리다이렉트하므로 별도 API 불필요
export type { AuthResponse }
