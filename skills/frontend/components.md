# 컴포넌트 & MUI 가이드

## 컴포넌트 작성 규칙
- **named export** 사용 (`export function Foo`, default export 금지)
- Props 타입은 `interface FooProps`로 파일 상단에 선언
- 경로 alias `@/` → `src/` (예: `import { Todo } from '@/types/todo'`)

```tsx
interface TodoItemProps {
  todo: Todo
  onToggle: (id: string, completed: boolean) => void
  onEdit: (id: string, title: string) => void
  onDelete: (id: string) => void
}

export function TodoItem({ todo, onToggle, onEdit, onDelete }: TodoItemProps) {
  // ...
}
```

## MUI 사용 규칙

### 전역 설정 (`App.tsx`)
```tsx
import { ThemeProvider, CssBaseline, createTheme } from '@mui/material'

const theme = createTheme({ /* 커스텀 테마 */ })

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/* 라우트 */}
    </ThemeProvider>
  )
}
```

### 레이아웃
- 레이아웃: `Box`, `Container` 사용
- 스타일: `sx` prop으로 지정 (`className` 사용 금지)
- 리스트: `List` + `ListItem` + `ListItemText` + `Divider` 조합

### 버튼 & 아이콘
```tsx
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'

// 텍스트 포함 버튼
<Button variant="contained" startIcon={<AddIcon />}>추가</Button>

// 아이콘 전용 버튼
<IconButton size="small"><EditIcon fontSize="small" /></IconButton>

// 툴팁
<Tooltip title="수정"><IconButton>...</IconButton></Tooltip>
```

### 커스텀 SVG 아이콘 (외부 라이브러리 없이)
```tsx
import SvgIcon, { SvgIconProps } from '@mui/material/SvgIcon'

function KakaoIcon(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <path d="..." />
    </SvgIcon>
  )
}
```

## TodoItem 인라인 편집 모드
```tsx
export function TodoItem({ todo, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState(todo.title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleSave = () => {
    if (!editTitle.trim()) return
    onEdit(todo.id, editTitle.trim())
    setIsEditing(false)
  }

  // isEditing ? <TextField + 저장/취소 버튼> : <일반 표시 + 수정 버튼>
}
```
- `Enter` → 저장 / `Escape` → 취소
- 저장 시 `onEdit(id, title)` 호출 → `editTodo` 액션 → `PATCH /api/v1/todos/{id}`
