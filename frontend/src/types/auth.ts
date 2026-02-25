export interface AuthResponse {
  accessToken: string
  tokenType: string
  expiresIn: number
  userId: string
  email: string
}

export interface SignupRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}
