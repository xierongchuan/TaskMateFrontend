# TaskMate Frontend

Frontend приложение для системы управления задачами TaskMate, построенное на React + TypeScript + Vite.

## Технологический стек

- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Vite** - Сборщик и dev сервер
- **React Router** - Маршрутизация
- **Zustand** - State management
- **TanStack Query** - Управление серверным состоянием
- **Axios** - HTTP клиент
- **Tailwind CSS** - CSS фреймворк
- **date-fns** - Работа с датами
- **react-hook-form** - Работа с формами

## Требования

- Node.js 18+
- npm или yarn

## Установка

```bash
# Установка зависимостей
npm install

# Создать .env файл на основе .env.example
cp .env.example .env

# Отредактировать .env и указать правильный API URL
# VITE_API_BASE_URL=http://localhost:8000/api/v1
```

## Запуск в режиме разработки

```bash
npm run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

## Сборка для продакшена

```bash
npm run build
```

Собранные файлы будут в папке `dist/`

## Предпросмотр продакшен сборки

```bash
npm run preview
```

## Docker

### Важно: Переменные окружения при сборке

Vite встраивает переменные окружения (начинающиеся с `VITE_`) в JavaScript **во время сборки**, а не во время запуска. Это означает, что переменные должны быть переданы как build arguments при сборке образа.

### Сборка образа

```bash
# Сборка с дефолтным API URL (http://localhost:8007/api/v1)
docker build -t taskmate-frontend .

# Сборка с кастомным API URL
docker build \
  --build-arg VITE_API_BASE_URL=http://your-api-url:8007/api/v1 \
  -t taskmate-frontend .
```

### Запуск контейнера

```bash
docker run -p 80:80 taskmate-frontend
```

Приложение будет доступно по адресу `http://localhost`

### Docker Compose

Добавьте в `docker-compose.yml`:

```yaml
services:
  frontend:
    build:
      context: ./TaskMateFrontend
      dockerfile: Dockerfile
      args:
        # Передаем build argument для Vite
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-http://localhost:8007/api/v1}
    ports:
      - "80:80"
    depends_on:
      - api
```

**Примечание:** Runtime переменные окружения (через `environment:`) НЕ работают для Vite приложений, так как код уже собран. Используйте только `build.args`.

## Структура проекта

```
src/
├── api/                 # API клиент и endpoints
│   ├── client.ts        # Axios instance
│   ├── auth.ts          # Аутентификация
│   ├── users.ts         # Пользователи
│   ├── tasks.ts         # Задачи
│   └── dashboard.ts     # Dashboard
│
├── components/          # React компоненты
│   ├── auth/           # Компоненты аутентификации
│   ├── layout/         # Layout компоненты
│   ├── users/          # Компоненты пользователей
│   └── tasks/          # Компоненты задач
│
├── pages/              # Страницы приложения
│   ├── LoginPage.tsx
│   ├── DashboardPage.tsx
│   ├── UsersPage.tsx
│   └── TasksPage.tsx
│
├── stores/             # Zustand stores
│   └── authStore.ts
│
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   └── usePermissions.ts
│
├── types/              # TypeScript типы
│   ├── user.ts
│   ├── task.ts
│   ├── api.ts
│   └── dashboard.ts
│
├── utils/              # Утилиты
│   ├── debug.ts        # Отладочные функции
│   ├── phoneFormatter.ts  # Форматирование телефонов
│   └── roleTranslations.ts # Перевод ролей на русский
└── constants/          # Константы
```

## Аутентификация

Приложение использует Bearer Token аутентификацию (Laravel Sanctum):

1. Пользователь вводит логин и пароль (Логин: латинские буквы, цифры, макс. одна точка, до 64 символов)
2. После успешного входа токен сохраняется в localStorage
3. Токен автоматически добавляется ко всем API запросам
4. При получении 401 ошибки пользователь перенаправляется на страницу входа

## Роли и права доступа

Система поддерживает следующие роли пользователей (отображаются на русском языке):

| Роль (код)  | Название (RU)  | Описание                                |
|-------------|----------------|-----------------------------------------|
| `employee`  | Сотрудник      | Только доступ к боту                    |
| `observer`  | Наблюдатель    | Только просмотр                         |
| `manager`   | Управляющий    | Создание/редактирование задач и пользователей |
| `owner`     | Владелец       | Полный доступ                           |

### Утилита перевода ролей

Для отображения ролей на русском языке используйте утилиту `src/utils/roleTranslations.ts`:

```typescript
import { getRoleLabel, translateRoles, roleLabels, roleDescriptions } from './utils/roleTranslations';

// Получить русское название роли
getRoleLabel('employee'); // → "Сотрудник"

// Перевести массив ролей
translateRoles(['employee', 'manager']); // → "Сотрудник, Управляющий"

// Использовать маппинг напрямую
roleLabels.owner; // → "Владелец"
roleDescriptions.manager; // → "Управление салонами"
```

## Переменные окружения

- `VITE_API_BASE_URL` - URL API сервера (по умолчанию: `http://localhost:8007/api/v1`)

### Для локальной разработки

Создайте `.env` файл:
```bash
cp .env.example .env
```

Отредактируйте `.env`:
```
VITE_API_BASE_URL=http://localhost:8007/api/v1
```

### Для Docker

При использовании Docker переменные должны передаваться как **build arguments**, а не runtime environment variables. Смотрите раздел "Docker" выше для подробностей.

## Документация API

Смотрите файл `creating_intructions/FRONTEND_GUIDE.md` для подробной документации по интеграции с API.

## Лицензия

Proprietary License
Copyright © 2023-2025 谢榕川 All rights reserved.
