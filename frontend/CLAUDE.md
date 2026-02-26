# 프론트엔드 개요
React 18 + TypeScript + Vite 기반 SPA.
상태 관리는 Zustand, API 통신은 hey-api OpenAPI 생성 클라이언트(Axios 기반)를 사용한다.

# 스킬 참조
| 주제 | 문서 |
|------|------|
| 기술 스택·파일 구조·환경변수·실행 명령어 | @skills/frontend/overview.md |
| OpenAPI 클라이언트 코드 생성·SDK 사용법 | @skills/frontend/api-client.md |
| 인증 흐름·authStore·소셜 로그인 | @skills/frontend/auth.md |
| Zustand 스토어 패턴 | @skills/frontend/store.md |
| 컴포넌트 작성·MUI 사용 규칙 | @skills/frontend/components.md |
| 라우팅·PrivateRoute | @skills/frontend/routing.md |

# 핵심 특이사항
- API 호출은 `src/generated/sdk.gen.ts` 함수 사용 (수동 Axios 파일 없음)
- `src/generated/` 는 자동 생성 파일 — `.gitignore` 등록, 커밋 불필요
- `main.tsx` 최상단에서 `import '@/api/generatedClient'` 필수 (인터셉터 초기화)
- 소셜 로그인: Supabase SDK 미사용, implicit flow 직접 구현 (URL 해시 파싱)
- `vite-env.d.ts` 가 있어야 `import.meta.env` TypeScript 타입 인식

# API 변경 시 클라이언트 재생성
```bash
# 1. 백엔드 서버 실행 후:
curl http://localhost:8080/v3/api-docs -o frontend/openapi.json

# 2. 코드 재생성:
cd frontend && npm run generate
```

# 현재 페이지 구성
| 경로 | 컴포넌트 | 인증 필요 |
|------|----------|-----------|
| `/` | TodoPage | O (PrivateRoute) |
| `/login` | LoginPage | X |
| `/register` | RegisterPage | X |

# 명령어
```bash
npm install         # 의존성 설치
npm run dev         # 개발 서버 (http://localhost:5173)
npm run build       # 프로덕션 빌드
npm run generate    # OpenAPI 클라이언트 재생성
npm test            # 테스트
```
