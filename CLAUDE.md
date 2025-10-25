# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**TaskMateFrontend** is a Laravel-based web application with a modern tech stack for task management. The project uses Laravel 12, Tailwind CSS, Vite, and Alpine.js to create a responsive and intuitive interface.

## Архитектура и технологии

### Бэкенд стек
- **Laravel 12** - PHP фреймворк
- **PHP 8.2+** - Серверный язык программирования
- **PostgreSQL** - Основная база данных (в продакшене)
- **SQLite** - База данных для разработки и тестирования
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

## Development Commands

### Start Development Environment
```bash
# Start all development services (PHP server, queue, logs, Vite)
composer dev

# Start individual services
php artisan serve          # Laravel development server
npm run dev               # Vite frontend build server
php artisan queue:listen  # Queue worker
php artisan pail          # Real-time logs
```

### Build and Deployment
```bash
npm run build             # Production build
composer install --no-dev # Production dependencies
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Testing
```bash
composer test             # Run all tests
php artisan test          # Alternative test command
./vendor/bin/pest         # Direct Pest execution
```

### Code Quality
```bash
php artisan pint          # PHP code formatting (Laravel Pint)
./vendor/bin/phpstan      # Static analysis (PHPStan)
npx prettier --write .    # Format frontend files
```

### Database
```bash
php artisan migrate       # Run migrations
php artisan migrate:fresh # Fresh migration with rollback
php artisan db:seed       # Seed database
php artisan tinker        # Interactive REPL
```

## Architecture

### Frontend Build System
- **Vite** processes CSS and JavaScript with hot reload
- **Tailwind CSS** integrated via Vite plugin v4.1.7
- **Alpine.js** imported as dependency for reactive components
- **Blade Icons** and **FontAwesome** for iconography

### Authentication Flow
- Uses Laravel's built-in authentication with custom controllers
- Email verification required for dashboard access
- Password confirmation for sensitive actions
- Session-based authentication with database driver

### Settings Architecture
- Modular settings system in `app/Http/Controllers/Settings/`
- Each setting area has dedicated controller (Profile, Password, Appearance, BotApi)
- Uses form requests for validation
- Flash notifications for user feedback

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

---

Issue to solve: undefined
Your prepared branch: issue-22-730b5bd2
Your prepared working directory: /tmp/gh-issue-solver-1761350613404
Your forked repository: konard/TaskMateFrontend
Original repository (upstream): xierongchuan/TaskMateFrontend

Proceed.