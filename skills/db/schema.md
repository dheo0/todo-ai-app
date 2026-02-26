# 스키마 설계 가이드

## 테이블 설계 규칙
- 테이블명: `snake_case` 복수형 (예: `todos`, `user_profiles`)
- PK: UUID 타입 (`gen_random_uuid()`)
- 모든 테이블에 `created_at`, `updated_at` 컬럼 포함
- soft delete 필요 시 `deleted_at` 컬럼 추가

## todos 테이블 DDL
```sql
CREATE TABLE todos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL,
  title       VARCHAR(255) NOT NULL,
  completed   BOOLEAN     NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER todos_updated_at
  BEFORE UPDATE ON todos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
```

## RLS (Row Level Security) 정책
현재 구조에서는 백엔드가 `service_role key`로 접근하므로 RLS를 우회한다.
사용자별 데이터 분리는 백엔드 서비스 레이어에서 `user_id = eq.{userId}` 필터로 처리.

```sql
-- (참고용) 프론트엔드 직접 접근 시 사용할 RLS 정책 예시
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "유저는 자신의 todo만 접근" ON todos
  FOR ALL USING (auth.uid() = user_id);
```

## 새 테이블 추가 순서
1. Supabase Dashboard → SQL Editor에서 DDL 실행
2. `sql/migrations/` 에 SQL 파일로 기록 (예: `002_create_tags.sql`)
3. 백엔드: 응답 역직렬화 record 작성 (`@JsonProperty`로 snake_case 매핑)
