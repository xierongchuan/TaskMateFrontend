# Исправление проблемы с VITE_API_BASE_URL в Docker

## Проблема

При сборке Docker образа переменная окружения `VITE_API_BASE_URL` не была доступна, и приложение использовало неверный URL.

## Причина

Vite (инструмент сборки) встраивает переменные окружения (начинающиеся с `VITE_`) в JavaScript код **во время сборки** (`npm run build`), а не во время запуска приложения.

В предыдущей версии:
- `.env` файлы исключены в `.dockerignore`
- Dockerfile не принимал build arguments
- `docker-compose.yml` передавал переменную через `environment:` (это runtime, а не build-time)
- Результат: Vite не видел переменную и использовал неправильный fallback

## Решение

### 1. Изменения в этом репозитории (TaskMateFrontend)

✅ **Dockerfile** - добавлены ARG и ENV для build-time переменных:
```dockerfile
# Accept build-time arguments for Vite environment variables
ARG VITE_API_BASE_URL=http://localhost:8007/api/v1

# Set as environment variable so Vite can access it during build
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

# Build the application
RUN npm run build
```

✅ **src/api/client.ts** - исправлен fallback URL на localhost вместо Docker internal name:
```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8007/api/v1';
```

✅ **README.md** - добавлена документация о правильном использовании переменных окружения в Docker

### 2. Необходимые изменения в родительском репозитории (TaskMate)

В файле `docker-compose.yml` нужно переместить `VITE_API_BASE_URL` из `environment:` в `build: args:`:

**Было:**
```yaml
src_frontend:
    build:
        context: ./TaskMateFrontend/
        dockerfile: Dockerfile
    environment:
        VITE_API_BASE_URL: ${VITE_API_BASE_URL:-http://localhost:8007/api/v1}
```

**Должно быть:**
```yaml
src_frontend:
    build:
        context: ./TaskMateFrontend/
        dockerfile: Dockerfile
        args:
            VITE_API_BASE_URL: ${VITE_API_BASE_URL:-http://localhost:8007/api/v1}
```

## Использование

### Сборка образа напрямую

```bash
# С дефолтным URL
docker build -t taskmate-frontend .

# С кастомным URL
docker build --build-arg VITE_API_BASE_URL=http://api.example.com/api/v1 -t taskmate-frontend .
```

### Использование с docker-compose

После обновления `docker-compose.yml` в родительском репозитории:

```bash
# Переменная из .env файла или дефолт
docker compose up -d --build src_frontend

# Или явно указать
VITE_API_BASE_URL=http://your-api:8007/api/v1 docker compose up -d --build src_frontend
```

## Проверка

После пересборки образа, переменная будет встроена в JavaScript код и доступна в браузере:

```javascript
console.log(import.meta.env.VITE_API_BASE_URL);
// Должно показать правильный URL
```

## Важно

- **Runtime переменные окружения НЕ работают** для Vite приложений после сборки
- Любое изменение `VITE_API_BASE_URL` требует **пересборки** образа
- Для разных окружений (dev/prod) нужны **разные образы** или использование build arguments
