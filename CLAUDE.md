# TaskMateFrontend - Документация проекта

## Обзор проекта

**TaskMateFrontend** - это веб-приложение на базе Laravel с современным стеком технологий для управления задачами. Проект использует Laravel 12, Tailwind CSS, Vite и Alpine.js для создания отзывчивого и интуитивного интерфейса.

## Архитектура и технологии

### Бэкенд стек
- **Laravel 12** - PHP фреймворк
- **PHP 8.2+** - Серверный язык программирования
- **SQLite** - База данных по умолчанию
- **Pest** - Фреймворк для тестирования

### Фронтенд стек
- **Tailwind CSS 4.1** - Утилитарный CSS фреймворк
- **Vite 6.2** - Сборщик модулей
- **Alpine.js 3.14** - Легковесный JavaScript фреймворк
- **Blade** - Шаблонизатор Laravel

### Инструменты разработки
- **Prettier** - Форматирование кода
- **PHPStan** - Статический анализ PHP
- **Laravel Pint** - Форматирование PHP кода

## Структура проекта

### Основные директории

```
app/
├── Http/Controllers/     # Контроллеры приложения
│   ├── Auth/            # Контроллеры аутентификации
│   └── Settings/        # Контроллеры настроек
├── Models/              # Модели данных
└── Providers/           # Сервис-провайдеры

resources/
├── views/               # Blade шаблоны
│   ├── auth/           # Страницы аутентификации
│   ├── components/     # Компоненты интерфейса
│   ├── settings/       # Страницы настроек
│   └── layouts/        # Макеты страниц
├── css/                # Стили
└── js/                 # JavaScript файлы

routes/
├── web.php             # Веб-маршруты
└── auth.php            # Маршруты аутентификации
```

## Функциональность

### Аутентификация и авторизация
- Регистрация новых пользователей
- Вход в систему
- Восстановление пароля
- Подтверждение email
- Подтверждение пароля для важных действий

### Основные модули

#### Панель управления
- [`dashboard.blade.php`](resources/views/dashboard.blade.php) - Главная панель приложения
- Доступна только для аутентифицированных пользователей

#### Настройки пользователя
- **Профиль** - редактирование имени и email
- **Пароль** - смена пароля с подтверждением текущего
- **Внешний вид** - настройки интерфейса (заглушка)

### Модель данных

#### Пользователь (User)
- **Поля**: name, email, password, email_verified_at, remember_token
- **Методы**: 
  - [`initials()`](app/Models/User.php:53) - получение инициалов пользователя
- **Валидация**: уникальность email, хеширование пароля

## Маршрутизация

### Публичные маршруты
- `/` - Домашняя страница ([`welcome.blade.php`](resources/views/welcome.blade.php))
- `/login` - Страница входа
- `/register` - Страница регистрации
- `/forgot-password` - Восстановление пароля

### Защищенные маршруты
- `/dashboard` - Панель управления (требует аутентификации и верификации)
- `/settings/profile` - Редактирование профиля
- `/settings/password` - Смена пароля
- `/settings/appearance` - Настройки внешнего вида

## Контроллеры

### Контроллеры аутентификации
- [`LoginController`](app/Http/Controllers/Auth/LoginController.php) - Управление входом/выходом
- [`RegistrationController`](app/Http/Controllers/Auth/RegistrationController.php) - Регистрация пользователей
- [`PasswordResetLinkController`](app/Http/Controllers/Auth/PasswordResetLinkController.php) - Запрос сброса пароля
- [`NewPasswordController`](app/Http/Controllers/Auth/NewPasswordController.php) - Установка нового пароля

### Контроллеры настроек
- [`ProfileController`](app/Http/Controllers/Settings/ProfileController.php) - Управление профилем
  - Редактирование имени и email
  - Удаление аккаунта
- [`PasswordController`](app/Http/Controllers/Settings/PasswordController.php) - Смена пароля
  - Требует подтверждения текущего пароля
- [`AppearanceController`](app/Http/Controllers/Settings/AppearanceController.php) - Настройки внешнего вида

## Компоненты интерфейса

### Макеты
- [`app.blade.php`](resources/views/components/layouts/app.blade.php) - Основной макет приложения
- [`auth.blade.php`](resources/views/components/layouts/auth.blade.php) - Макет для страниц аутентификации

### Навигация
- [`sidebar.blade.php`](resources/views/components/layouts/app/sidebar.blade.php) - Боковая панель
- [`header.blade.php`](resources/views/components/layouts/app/header.blade.php) - Верхняя панель

### Формы
- [`input.blade.php`](resources/views/components/forms/input.blade.php) - Поле ввода
- [`checkbox.blade.php`](resources/views/components/forms/checkbox.blade.php) - Чекбокс
- [`button.blade.php`](resources/views/components/button.blade.php) - Кнопка

## Конфигурация

### Сборка фронтенда
- **Vite** настроен для обработки CSS и JavaScript
- **Tailwind CSS** интегрирован через плагин Vite
- **Alpine.js** добавлен как зависимость

### Запуск разработки
```bash
# Запуск всех сервисов разработки
composer dev

# Или по отдельности
php artisan serve
npm run dev
```

### Продакшен сборка
```bash
npm run build
```

## Тестирование

Проект использует Pest для тестирования с готовыми тестами для:
- Аутентификации
- Регистрации
- Сброса пароля
- Обновления профиля и пароля

## Особенности реализации

### Безопасность
- Хеширование паролей
- Защита от CSRF атак
- Middleware для аутентификации
- Валидация входных данных

### Пользовательский опыт
- Отзывчивый дизайн с Tailwind CSS
- Интерактивность с Alpine.js
- Валидация форм в реальном времени
- Уведомления о статусе операций

### Производительность
- Быстрая сборка с Vite
- Оптимизированные стили с Tailwind
- Ленивая загрузка компонентов

## Разработка

### Установка зависимостей
```bash
composer install
npm install
```

### Настройка окружения
```bash
cp .env.example .env
php artisan key:generate
```

### Запуск миграций
```bash
php artisan migrate
```

### Запуск тестов
```bash
composer test
```

## Дальнейшее развитие

Проект готов к расширению функциональности управления задачами. Текущая база включает полную систему аутентификации и базовые настройки пользователя, что обеспечивает прочную основу для добавления модуля задач.
