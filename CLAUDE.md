# TaskMateClient — CLAUDE.md

Frontend для TaskMate (React 19 + TypeScript + Vite). Общие правила см. в [../CLAUDE.md](../CLAUDE.md).

## Технологический стек

| Пакет | Версия | Назначение |
|-------|--------|------------|
| react | 19.1.1 | UI фреймворк |
| typescript | 5.9.3 | Типизация |
| vite | 7.1.7 | Сборка и dev server |
| tailwindcss | 3.4.18 | CSS фреймворк |
| @tanstack/react-query | 5.90.5 | Server state management |
| zustand | 5.0.8 | Client state management |
| react-router-dom | 7.9.4 | Routing |
| axios | 1.13.0 | HTTP клиент |
| react-hook-form | 7.65.0 | Формы |
| date-fns | 4.1.0 | Работа с датами |
| @heroicons/react | 2.2.0 | Иконки |

## Структура проекта

```
src/
├── api/                    # 15 API модулей
│   ├── client.ts           # Axios instance + interceptors
│   ├── config.ts           # Конфиг загрузки файлов
│   ├── auth.ts             # Аутентификация
│   ├── tasks.ts            # CRUD задач + статусы + доказательства
│   ├── users.ts            # Управление пользователями
│   ├── dealerships.ts      # Автосалоны
│   ├── shifts.ts           # Смены
│   ├── settings.ts         # Настройки (shift, notification, archive, task)
│   ├── dashboard.ts        # Статистика дашборда
│   ├── taskGenerators.ts   # Шаблоны генерации
│   ├── archivedTasks.ts    # Архив + export CSV
│   ├── auditLogs.ts        # Журнал аудита
│   ├── calendar.ts         # Выходные/праздники
│   ├── links.ts            # Быстрые ссылки
│   ├── reports.ts          # Отчёты
│   └── notification-settings.ts
│
├── components/
│   ├── auth/               # Аутентификация
│   │   ├── ProtectedRoute.tsx   # HOC защиты роутов по ролям
│   │   └── LoginForm.tsx
│   │
│   ├── ui/                 # UI Kit (25+ компонентов)
│   │   ├── Button.tsx      # primary|secondary|danger|ghost|outline|warning
│   │   ├── Input.tsx, Select.tsx, Checkbox.tsx, Textarea.tsx
│   │   ├── Badge.tsx       # status, priority, role badges
│   │   ├── Card.tsx, Modal.tsx, Alert.tsx, Toast.tsx
│   │   ├── ConfirmDialog.tsx, Pagination.tsx
│   │   ├── Skeleton.tsx, EmptyState.tsx, ErrorState.tsx
│   │   ├── StatCard.tsx, DonutChart.tsx
│   │   ├── FilterPanel.tsx, SearchInput.tsx
│   │   ├── MultiFileUpload.tsx  # 5 файлов, 200MB
│   │   ├── RateLimitIndicator.tsx
│   │   └── index.ts        # Экспорт всех UI
│   │
│   ├── common/             # Общие компоненты
│   │   ├── DealershipSelector.tsx   # Multi-tenant выбор
│   │   ├── UserSelector.tsx, UserCheckboxList.tsx
│   │   ├── StatusBadge.tsx, PriorityBadge.tsx, RoleBadge.tsx
│   │   ├── WeekDaySelector.tsx, MonthDayPicker.tsx
│   │   └── GeneratorSelector.tsx
│   │
│   ├── layout/             # Layout компоненты
│   │   ├── Layout.tsx      # Основной layout
│   │   ├── Sidebar/        # Многоуровневая навигация
│   │   │   ├── Sidebar.tsx, SidebarExpanded.tsx, SidebarMini.tsx
│   │   │   ├── SidebarGroup.tsx, SidebarItem.tsx
│   │   │   └── SidebarTooltip.tsx
│   │   └── WorkspaceSwitcher.tsx
│   │
│   ├── tasks/              # Компоненты задач
│   │   ├── TaskModal.tsx           # Создание/редактирование
│   │   ├── TaskDetailsModal.tsx    # Просмотр деталей
│   │   ├── TaskEmployeeActions.tsx # Действия сотрудника
│   │   ├── VerificationPanel.tsx   # Проверка ответов
│   │   └── ProofViewer.tsx         # Просмотр файлов (img, video, pdf)
│   │
│   ├── generators/         # Task generators
│   ├── shifts/             # Смены + фото
│   ├── users/              # Пользователи
│   ├── dealerships/        # Автосалоны
│   ├── settings/           # Настройки + календарь
│   ├── reports/            # Отчёты
│   └── notifications/      # Уведомления
│
├── pages/                  # 17 страниц (роуты)
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── TasksPage.tsx
│   ├── TaskGeneratorsPage.tsx
│   ├── ArchivedTasksPage.tsx
│   ├── PendingReviewPage.tsx
│   ├── MyHistoryPage.tsx
│   ├── UsersPage.tsx
│   ├── DealershipsPage.tsx
│   ├── ShiftsPage.tsx
│   ├── SettingsPage.tsx
│   ├── ReportsPage.tsx
│   ├── NotificationSettingsPage.tsx
│   ├── AuditLogPage.tsx
│   ├── ProfilePage.tsx
│   ├── LinksPage.tsx
│   └── MaintenancePage.tsx
│
├── hooks/                  # 13 custom hooks
│   ├── useAuth.ts          # Обёртка над authStore
│   ├── usePermissions.ts   # Role-based access control
│   ├── useWorkspace.ts     # Multi-tenant логика
│   ├── useDealerships.ts   # Список автосалонов
│   ├── useSettings.ts      # TanStack Query hooks для настроек
│   ├── useShifts.ts        # TanStack Query hooks для смен
│   ├── usePagination.ts    # Управление пагинацией
│   ├── useResponsiveViewMode.tsx  # Адаптивность list/table
│   ├── useUnsavedChanges.ts       # Предупреждение при выходе
│   ├── useConfirmDialog.ts        # Диалог подтверждения
│   ├── useCalendar.ts             # Выходные/праздники
│   ├── useFileUploadConfig.ts     # Валидация загрузки
│   └── useRateLimit.ts            # Обработка 429
│
├── stores/                 # Zustand stores (persist в localStorage)
│   ├── authStore.ts        # user, token, isAuthenticated, login/logout
│   ├── workspaceStore.ts   # selectedDealershipId (multi-tenant)
│   └── sidebarStore.ts     # mode (expanded/mini), expandedGroups
│
├── types/                  # 12 TypeScript файлов
│   ├── user.ts             # Role, User, LoginRequest/Response
│   ├── task.ts             # Task, TaskResponse, TaskProof, статусы
│   ├── taskGenerator.ts    # TaskGenerator, статистика
│   ├── dealership.ts       # Dealership, TIMEZONES
│   ├── shift.ts            # Shift структуры
│   ├── setting.ts          # ShiftConfig, NotificationConfig, ArchiveConfig
│   ├── api.ts              # PaginatedResponse, ApiError
│   ├── calendar.ts         # CalendarDay
│   ├── archivedTask.ts     # ArchivedTask
│   ├── link.ts             # Link
│   ├── dashboard.ts        # DashboardData
│   └── navigation.ts       # NavItem, NavGroup, SidebarMode
│
├── utils/                  # 6 утилит
│   ├── dateTime.ts         # UTC <-> Local, formatting (date-fns + ru)
│   ├── phoneFormatter.ts   # Форматирование телефонов
│   ├── roleTranslations.ts # Перевод ролей на русский
│   ├── rateLimitManager.ts # Управление 429 rate limiting
│   ├── errorHandling.ts    # Обработка ошибок
│   └── debug.ts            # Debug логирование
│
├── context/
│   └── ThemeContext.tsx    # Theme (light/dark/system) + Accent color
│
├── constants/
│   ├── app.ts              # APP_NAME
│   └── tasks.ts            # TASK_PRIORITIES, RESPONSE_TYPES, PROOF_MAX_*
│
├── App.tsx                 # Root (routing, providers)
├── main.tsx                # Entry point
└── index.css               # Глобальные стили Tailwind
```

## API модули

### Структура API запросов

```typescript
// src/api/client.ts
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8007/api/v1
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
});

// Interceptors:
// - Request: добавляет Authorization: Bearer {token}
// - Response 401: logout + redirect /login
// - Response 403: console.error("Недостаточно прав")
// - Response 429: Rate limit toast + retry delay
// - Response 503: redirect /maintenance
```

### Основные endpoints

| Модуль | Методы |
|--------|--------|
| auth.ts | `login()`, `logout()`, `getCurrentUser()` |
| tasks.ts | `getTasks()`, `getTask()`, `createTask()`, `updateTask()`, `updateTaskStatus()`, `updateTaskStatusWithProofs()`, `deleteTask()`, `getMyHistory()`, `approveTaskResponse()`, `rejectTaskResponse()`, `rejectAllTaskResponses()` |
| users.ts | `getUsers()`, `getUser()`, `createUser()`, `updateUser()`, `deleteUser()` |
| shifts.ts | `getShifts()`, `getCurrentShifts()`, `getMyShifts()`, `getMyCurrentShift()`, `createShift()`, `updateShift()`, `deleteShift()`, `getStatistics()` |
| taskGenerators.ts | `getGenerators()`, `getGenerator()`, `createGenerator()`, `updateGenerator()`, `deleteGenerator()`, `pauseGenerator()`, `resumeGenerator()`, `pauseAll()`, `resumeAll()`, `getGeneratedTasks()`, `getStatistics()` |
| settings.ts | `getSettings()`, `getShiftConfig()`, `updateShiftConfig()`, `getNotificationConfig()`, `updateNotificationConfig()`, `getArchiveConfig()`, `updateArchiveConfig()`, `getTaskConfig()`, `updateTaskConfig()` |
| archivedTasks.ts | `getArchivedTasks()`, `restoreTask()`, `exportToCsv()`, `getStatistics()` |

## Zustand Stores

### authStore

```typescript
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  hasHydrated: boolean;  // Для проверки восстановления из localStorage
}

// Методы
login(login: string, password: string): Promise<void>
logout(): Promise<void>
refreshUser(): Promise<void>
clearError(): void

// Persistence: localStorage "auth-storage"
```

### workspaceStore

```typescript
interface WorkspaceState {
  selectedDealershipId: number | null;
  hasInitialized: boolean;
}

// Логика выбора:
// - Employee: только dealership_id (без выбора)
// - Owner: может выбрать null (все) или конкретный
// - Manager/Observer: первый из dealerships[]

// Persistence: localStorage "workspace-storage"
```

### sidebarStore

```typescript
interface SidebarState {
  mode: 'expanded' | 'mini';
  isOpen: boolean;  // Для мобильных
  expandedGroups: Record<NavGroupId, boolean>;
}

// Группы навигации:
// - workspace (logo, dealership) - non-collapsible
// - task-management (tasks, generators, archive)
// - organization (employees, dealerships)
// - resources (shifts, links) - non-collapsible
// - administration (settings, reports, audit)

// Persistence: localStorage "sidebar-storage"
```

## Custom Hooks

### usePermissions

```typescript
const {
  // Флаги прав
  canCreateUsers,      // manager | owner
  canEditUsers,        // manager | owner
  canDeleteUsers,      // manager | owner
  canManageTasks,      // manager | owner
  canManageSettings,   // owner only
  canManageDealerships,// owner only
  canWorkShifts,       // owner | employee
  canCompleteAssignedTasks, // !observer

  // Роли
  isOwner, isManager, isObserver, isEmployee,
  role, userId, dealershipId
} = usePermissions();
```

### useWorkspace

```typescript
const {
  dealershipId,           // Текущий выбранный ID
  setDealershipId,        // Установить
  availableDealerships,   // Доступные для пользователя
  currentDealership,      // { id, name, address? }
  canSwitchWorkspace,     // Может ли переключать
  canSelectAll,           // owner only (null = все)
  isAllDealerships,       // dealershipId === null
  isLoading
} = useWorkspace();
```

### useSettings (TanStack Query)

```typescript
// Query hooks
useSettings(dealershipId?)
useSetting(key: string)
useShiftConfig(dealershipId?)
useNotificationConfig(dealershipId?)
useArchiveConfig(dealershipId?)
useTaskConfig(dealershipId?)

// Mutation hooks
useUpdateSetting()
useUpdateSettingByKey()
useUpdateShiftConfig()
useUpdateNotificationConfig()
useUpdateArchiveConfig()
useUpdateTaskConfig()
```

## TypeScript типы

### Task

```typescript
type TaskStatus = 'pending' | 'acknowledged' | 'pending_review' | 'completed' | 'completed_late' | 'overdue';
type TaskType = 'individual' | 'group';
type ResponseType = 'notification' | 'completion' | 'completion_with_proof';
type TaskPriority = 'low' | 'medium' | 'high';

interface Task {
  id: number;
  title: string;
  description: string | null;
  task_type: TaskType;
  response_type: ResponseType;
  appear_date: string | null;  // UTC ISO 8601
  deadline: string | null;     // UTC ISO 8601
  status: TaskStatus;          // Вычисляемый на backend
  priority: TaskPriority;
  dealership_id: number;
  generator_id: number | null;
  tags: string[];

  creator?: { id: number; full_name: string };
  dealership?: { id: number; name: string };
  assignments?: { id: number; user: { id: number; full_name: string } }[];
  responses?: TaskResponse[];
  shared_proofs?: TaskSharedProof[];
  completion_progress?: CompletionProgress;  // Для group tasks
}
```

### User

```typescript
type Role = 'employee' | 'observer' | 'manager' | 'owner';

interface User {
  id: number;
  login: string;
  full_name: string;
  role: Role;
  dealership_id: number | null;
  phone: string | null;
  dealerships?: { id: number; name: string; address?: string }[];
}
```

## Routing

```
/                        → redirect /dashboard
/login                   → LoginPage (публичная)
/maintenance             → MaintenancePage (503)

Protected Routes (требует auth):
├── /dashboard           → DashboardPage (все)
├── /profile             → ProfilePage (все)
├── /tasks               → TasksPage (все)
├── /my-history          → MyHistoryPage (все)
├── /shifts              → ShiftsPage (все)
├── /links               → LinksPage (все)
│
├── /task-generators     → TaskGeneratorsPage (manager | owner)
├── /archived-tasks      → ArchivedTasksPage (manager | owner)
├── /pending-review      → PendingReviewPage (manager | owner)
├── /employees           → UsersPage (manager | owner | observer)
├── /dealerships         → DealershipsPage (manager | owner)
├── /settings            → SettingsPage (owner)
├── /reports             → ReportsPage (manager | owner)
├── /notification-settings → NotificationSettingsPage (manager | owner)
└── /audit-logs          → AuditLogPage (owner)
```

## Паттерны

### API модуль

```typescript
export const exampleApi = {
  getAll: async (params?: Filters): Promise<PaginatedResponse<Data>> => {
    const response = await apiClient.get<PaginatedResponse<Data>>('/endpoint', { params });
    return response.data;
  },
  create: async (data: CreateRequest): Promise<{ data: Data }> => {
    const response = await apiClient.post('/endpoint', data);
    return response.data;
  },
};
```

### TanStack Query hook

```typescript
export const useData = (filters?: Filters) => {
  const { dealershipId } = useWorkspace();

  return useQuery({
    queryKey: ['data', dealershipId, filters],
    queryFn: () => exampleApi.getAll({ ...filters, dealership_id: dealershipId }),
    placeholderData: (prev) => prev,  // Предотвращает мигание
  });
};

export const useCreateData = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: exampleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });
};
```

### Проверка прав в компоненте

```typescript
const { canManageTasks, canCreateUsers } = usePermissions();

return (
  <PageContainer>
    <PageHeader
      title="Задачи"
      action={
        canManageTasks && (
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Создать
          </Button>
        )
      }
    />
    {/* ... */}
  </PageContainer>
);
```

### Modal CRUD

```typescript
// Паттерн использования модальных окон
const [isModalOpen, setIsModalOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState<Item | null>(null);

const handleEdit = (item: Item) => {
  setSelectedItem(item);
  setIsModalOpen(true);
};

const handleCreate = () => {
  setSelectedItem(null);
  setIsModalOpen(true);
};

return (
  <>
    {/* Список/таблица с кнопками */}

    {isModalOpen && (
      <ItemModal
        item={selectedItem}  // null = создание, object = редактирование
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          setIsModalOpen(false);
          // queryClient.invalidateQueries() в mutation
        }}
      />
    )}
  </>
);
```

## Date/Time работа

```typescript
import { parseUtc, formatDateTime, toUtcIso, localInputToUtc } from '@/utils/dateTime';

// Backend возвращает UTC ISO: "2024-01-15T10:30:00Z"

// Отображение пользователю (локальное время)
const displayDate = formatDateTime(task.deadline);  // "15 янв 2024, 15:30"

// Отправка на backend (UTC)
const utcString = toUtcIso(localDate);  // "2024-01-15T10:30:00Z"

// Из datetime-local input
const utcFromInput = localInputToUtc(inputValue);
```

## Загрузка файлов

```typescript
// Конфигурация из API: GET /config/file-upload
const config = {
  extensions: ['jpg', 'png', 'gif', 'webp', 'pdf', 'mp4', 'mov', 'zip', ...],
  limits: {
    max_files: 5,
    max_total_size: 200 * 1024 * 1024,  // 200MB
    max_size_image: 5 * 1024 * 1024,    // 5MB
    max_size_document: 50 * 1024 * 1024,// 50MB
    max_size_video: 100 * 1024 * 1024,  // 100MB
  }
};

// Отправка с файлами
const formData = new FormData();
formData.append('status', 'pending_review');
files.forEach(file => formData.append('proof_files[]', file));

await apiClient.patch(`/tasks/${taskId}/status`, formData, {
  headers: { 'Content-Type': 'multipart/form-data' },
  timeout: 5 * 60 * 1000,  // 5 минут для больших файлов
  onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total!))
});
```

## Theme система

```typescript
// ThemeContext
const { theme, setTheme, accentColor, setAccentColor } = useTheme();

// theme: 'light' | 'dark' | 'system'
// accentColor: 'blue' | 'green' | 'purple' | 'orange' | 'teal'

// Persist в Cookies (365 дней)
// Слушает prefers-color-scheme если system mode
```

## Команды

```bash
npm run dev       # Dev server (localhost:5173 → proxy 8099)
npm run build     # Production build (с tsc -b)
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Особенности

- Русский язык везде (UI, сообщения, date-fns с locale `ru`)
- Tailwind CSS с dark mode (`class` strategy)
- Primary color: blue-600, accent через CSS variables
- Автоматический refetch каждые 30 сек для динамических данных
- Multi-tenant через DealershipSelector + workspaceStore
- Modal-based CRUD операции
- Rate limiting с toast уведомлениями и retry
- Responsive design (mobile-first, sidebar toggle)
