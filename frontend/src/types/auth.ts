export interface AuthResponse {
  accessToken: string | null
  tokenType: string | null
  expiresIn: number
  userId: string | null
  email: string
  needsEmailConfirmation: boolean
}

export interface SignupRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}
