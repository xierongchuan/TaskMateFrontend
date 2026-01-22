# TaskMateFrontend — CLAUDE.md

Frontend для TaskMate (React 19 + TypeScript + Vite). Общие правила см. в [../CLAUDE.md](../CLAUDE.md).

## Структура проекта

```
src/
├── api/           # API клиент и модули по доменам
├── components/
│   ├── auth/      # Аутентификация (ProtectedRoute)
│   ├── common/    # Общие компоненты (DealershipSelector)
│   ├── layout/    # Layout, навигация
│   └── ui/        # UI kit (Button, Card, Input, Badge)
├── pages/         # Страницы (роуты)
├── stores/        # Zustand stores
├── hooks/         # Custom hooks
├── types/         # TypeScript типы
└── utils/         # Утилиты
```

## Ключевые файлы

- `src/api/client.ts` — Axios с interceptors (auth, errors)
- `src/stores/authStore.ts` — Аутентификация (Zustand + localStorage)
- `src/hooks/usePermissions.ts` — Проверка ролей
- `src/components/auth/ProtectedRoute.tsx` — Защита роутов

## Паттерны

### API модули

```typescript
export const exampleApi = {
  getAll: async (params?: Filters): Promise<PaginatedResponse<Data>> => {
    const response = await apiClient.get<PaginatedResponse<Data>>('/endpoint', { params });
    return response.data;
  },
};
```

### React Query hooks

```typescript
export const useData = (filters?: Filters) => {
  return useQuery({
    queryKey: ['data', filters],
    queryFn: () => exampleApi.getAll(filters),
    placeholderData: (prev) => prev, // Предотвращает мигание при рефетче
  });
};

export const useCreateData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: exampleApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['data'] }),
  });
};
```

### Проверка прав

```typescript
const { canManageTasks, canCreateUsers } = usePermissions();
// Используй для условного рендеринга UI элементов
```

## Команды

```bash
npm run dev       # Dev server (localhost:5173)
npm run build     # Production build
npm run lint      # ESLint
npm run preview   # Preview production build
```

## Особенности

- Русский язык везде (UI, сообщения, date-fns с locale `ru`)
- Tailwind CSS с primary color (blue-600)
- Автоматический refetch каждые 30 сек для динамических данных
- Multi-tenant через DealershipSelector
- Modal-based CRUD операции
