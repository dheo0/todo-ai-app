import { apiClient } from './client'
import type { AuthResponse, SignupRequest, LoginRequest } from '@/types/auth'

export const authApi = {
  signup: (body: SignupRequest) =>
    apiClient.post<{ data: AuthResponse }>('/api/v1/auth/signup', body),
  login: (body: LoginRequest) =>
    apiClient.post<{ data: AuthResponse }>('/api/v1/auth/login', body),
}
