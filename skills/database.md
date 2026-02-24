# Supabase (PostgreSQL) 작업 가이드

## 연결 방식
- 백엔드(Spring Boot)에서 JDBC로 직접 연결
- 프론트엔드에서 Supabase SDK/API 직접 호출 금지
  → 반드시 백엔드 API를 통해서만 DB 접근

## application.yml 설정
```yaml
spring:
  datasource:
    url: ${SUPABASE_DB_URL}
    username: ${SUPABASE_DB_USER}
    password: ${SUPABASE_DB_PASSWORD}
    driver-class-name: org.postgresql.Driver
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate        # 개발: create / 운영: validate
    show-sql: false             # 운영에서는 반드시 false
    properties:
      hibernate:
        format_sql: true
```

## Supabase 연결 정보 확인 위치
Supabase Dashboard → Settings → Database → Connection string (JDBC)

## 테이블 설계 규칙
- 테이블명: snake_case 복수형 (예: todos, user_profiles)
- PK: UUID 타입 사용 권장 (gen_random_uuid())
- 모든 테이블에 created_at, updated_at 컬럼 포함
- soft delete가 필요한 경우 deleted_at 컬럼 추가

## 기본 테이블 DDL 예시
```sql
CREATE TABLE todos (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL,
  title       VARCHAR(255) NOT NULL,
  completed   BOOLEAN NOT NULL DEFAULT false,
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

## JPA BaseEntity 작성
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseEntity {

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
```

## 마이그레이션 규칙
- DDL을 JPA가 자동 생성(create/create-drop)하도록 두지 말 것
- 스키마 변경은 Supabase Dashboard SQL Editor에서 직접 실행
- 변경 이력은 sql/migrations/ 폴더에 파일로 관리
  예) sql/migrations/001_create_todos.sql
```
