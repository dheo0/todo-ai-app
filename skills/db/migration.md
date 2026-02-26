# 마이그레이션 가이드

## 규칙
- DDL을 JPA 자동 생성(`create`/`create-drop`)으로 관리하지 말 것
- 스키마 변경은 **Supabase Dashboard SQL Editor에서 직접 실행**
- 모든 변경 이력은 `sql/migrations/` 폴더에 파일로 관리

## 파일 네이밍 규칙
```
sql/migrations/
  001_create_todos.sql
  002_add_tags.sql
  003_add_todo_tags.sql
```
- 순번 3자리 + 언더스코어 + 설명 (소문자, 언더스코어)
- 순번은 단조 증가 — 기존 파일 수정 금지

## 마이그레이션 파일 작성 예시
```sql
-- 002_add_tags.sql
-- 목적: 태그 기능 추가
-- 적용일: 2024-02-01

CREATE TABLE tags (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL,
  name       VARCHAR(50) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE todo_tags (
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
  tag_id  UUID REFERENCES tags(id)  ON DELETE CASCADE,
  PRIMARY KEY (todo_id, tag_id)
);
```

## 현재 적용된 마이그레이션
| 파일 | 내용 |
|------|------|
| `001_create_todos.sql` | todos 테이블 + updated_at 트리거 |

## 적용 절차
1. `sql/migrations/NNN_description.sql` 파일 작성
2. Supabase Dashboard → SQL Editor → 파일 내용 붙여넣기 후 실행
3. `git add sql/migrations/NNN_description.sql && git commit`
