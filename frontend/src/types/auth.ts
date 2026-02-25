export interface AuthResponse {
  accessToken: string | null
  tokenType: string | null
  expiresIn: number
  userId: string | null
  email: string
  needsEmailConfirmation: boolean
}

/* 이메일/비밀번호 인증 (소셜 로그인으로 대체됨 - 필요 시 주석 해제)
export interface SignupRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}
*/

export type SocialProvider = 'kakao' | 'facebook' | 'apple'
