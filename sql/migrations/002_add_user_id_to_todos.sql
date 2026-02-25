-- Migration: 002_add_user_id_to_todos
-- Date: 2026-02-25
-- todos 테이블에 user_id 컬럼 추가 및 Supabase auth.users 참조 FK 설정

-- Step 1: user_id 컬럼 추가 (nullable)
ALTER TABLE todos ADD COLUMN user_id UUID;

-- Step 2: 기존 데이터 정리 (user_id가 없어 식별 불가한 레코드 삭제)
DELETE FROM todos WHERE user_id IS NULL;

-- Step 3: NOT NULL 제약 추가
ALTER TABLE todos ALTER COLUMN user_id SET NOT NULL;

-- Step 4: Supabase auth.users 참조 FK 추가 (사용자 삭제 시 Todo도 CASCADE 삭제)
ALTER TABLE todos
  ADD CONSTRAINT fk_todos_user_id
  FOREIGN KEY (user_id)
  REFERENCES auth.users(id)
  ON DELETE CASCADE;

-- Step 5: user_id 인덱스 추가 (사용자별 조회 성능)
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON todos(user_id);
