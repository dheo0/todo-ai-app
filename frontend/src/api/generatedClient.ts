// 생성된 OpenAPI 클라이언트에 인증 인터셉터 설정
// main.tsx에서 앱 시작 시 임포트하여 실행합니다.
import { client } from '@/generated/client.gen'

client.setConfig({ baseURL: import.meta.env.VITE_API_URL })

// JWT 토큰 자동 첨부
client.instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// 401 응답 시 로그인 페이지로 이동
client.instance.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)
