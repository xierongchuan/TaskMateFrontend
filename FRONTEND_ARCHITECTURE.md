# TaskMate Frontend Architecture

## Overview

This is a **frontend-only** admin panel implementation for TaskMate. All data is fetched via AJAX requests from the external Telegram Bot API. **No backend logic is implemented in Laravel** except for basic user authentication.

## Key Principles

1. **Frontend-Only Data Handling**: All TaskMate business data (tasks, shifts, dealerships, etc.) is fetched via AJAX from the Telegram Bot API
2. **Laravel Authentication Only**: Laravel handles only user authentication (login/register/password) - no business logic
3. **API Client**: JavaScript `apiClient` module handles all API communication
4. **Alpine.js for Interactivity**: Views use Alpine.js for dynamic data binding and updates
5. **Real-time Updates**: Dashboard and other views refresh data periodically via AJAX

## Architecture Components

### 1. API Client (`resources/js/api-client.js`)

The `ApiClient` class provides methods to communicate with the Telegram Bot API:

```javascript
// Example usage
const tasks = await window.apiClient.getTasks({ status: 'active' });
const dashboard = await window.apiClient.getDashboard();
const shifts = await window.apiClient.getCurrentShifts();
```

**Available Methods:**

#### Authentication
- `login(login, password)` - POST /session
- `logout()` - DELETE /session
- `register(login, password)` - POST /register

#### Users
- `getUsers(params)` - GET /users
- `getUser(id)` - GET /users/{id}
- `getUserStatus(id)` - GET /users/{id}/status

#### Dealerships
- `getDealerships(params)` - GET /dealerships
- `getDealership(id)` - GET /dealerships/{id}
- `createDealership(data)` - POST /dealerships
- `updateDealership(id, data)` - PUT /dealerships/{id}

#### Shifts
- `getShifts(params)` - GET /shifts
- `getShift(id)` - GET /shifts/{id}
- `getCurrentShifts(dealershipId)` - GET /shifts/current
- `getShiftStatistics(params)` - GET /shifts/statistics

#### Tasks
- `getTasks(params)` - GET /tasks
- `getTask(id)` - GET /tasks/{id}
- `createTask(data)` - POST /tasks
- `updateTask(id, data)` - PUT /tasks/{id}
- `deleteTask(id)` - DELETE /tasks/{id}
- `getTaskStatistics(params)` - GET /tasks/statistics
- `getOverdueTasks(params)` - GET /tasks/overdue
- `getPostponedTasks(params)` - GET /tasks/postponed

#### Dashboard
- `getDashboard(params)` - GET /dashboard

#### Settings
- `getSettings(params)` - GET /settings
- `getSetting(key)` - GET /settings/{key}
- `updateSetting(key, value)` - PUT /settings/{key}
- `bulkUpdateSettings(settings)` - POST /settings/bulk

### 2. Configuration

The API URL is configured via environment variables in `.env`:

```env
# Backend API URL (used by Laravel proxy)
API_URL=http://localhost:8007/api/v1
API_TIMEOUT=30

# Frontend API URL (used by JavaScript, defaults to API_URL)
VITE_API_URL="${API_URL}"
```

The Vite build system automatically injects the `VITE_API_URL` into the compiled JavaScript as `import.meta.env.VITE_API_URL`. This is configured in `vite.config.js`:

```javascript
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    return {
        define: {
            'import.meta.env.VITE_API_URL': JSON.stringify(
                env.VITE_API_URL || env.API_URL || 'http://localhost:8007/api/v1'
            ),
        },
    };
});
```

The API client automatically exposes this URL as `window.API_URL` for use in views and inline scripts.

### 3. View Implementation Pattern

All views use Alpine.js to fetch and display data dynamically. Example pattern:

```blade
<div x-data="tasksList">
    <!-- Loading State -->
    <div x-show="loading">Loading...</div>

    <!-- Data Display -->
    <template x-for="task in tasks" :key="task.id">
        <div x-text="task.title"></div>
    </template>

    <!-- Empty State -->
    <div x-show="!loading && tasks.length === 0">No tasks found</div>
</div>

<script>
document.addEventListener('alpine:init', () => {
    Alpine.data('tasksList', () => ({
        tasks: [],
        loading: true,
        async init() {
            await this.loadTasks();
        },
        async loadTasks() {
            try {
                const data = await window.apiClient.getTasks();
                this.tasks = data.data || [];
            } catch (error) {
                console.error('Error loading tasks:', error);
            } finally {
                this.loading = false;
            }
        }
    }));
});
</script>
```

### 4. Routes

All routes in `routes/web.php` are simple view routes - **no controller logic**:

```php
Route::get('tasks', function () {
    return view('tasks.index');
})->name('tasks.index');
```

The view itself handles data fetching via AJAX.

### 5. Authentication Flow

1. User logs in via Laravel's authentication system
2. Upon successful login, the frontend can optionally call the Telegram Bot API's `/session` endpoint to get an API token
3. The API token is stored in localStorage for subsequent API calls
4. All API requests include the token via `Authorization: Bearer {token}` header

## File Structure

```
app/
├── Http/Controllers/
│   ├── Auth/              # Laravel authentication controllers (kept)
│   └── Settings/          # User profile/password settings (kept)
└── Models/
    └── User.php           # Only User model for Laravel auth (kept)

resources/
├── js/
│   ├── api-client.js      # API client for Telegram Bot API (new)
│   ├── app.js             # Main JS entry point
│   └── bootstrap.js       # Bootstrap and dependencies
└── views/
    ├── dashboard.blade.php    # Uses AJAX to load dashboard data
    ├── tasks/                 # Task views - AJAX data loading
    ├── dealerships/           # Dealership views - AJAX data loading
    ├── users/                 # User management views - AJAX data loading
    └── links/                 # Quick links - AJAX data loading

routes/
└── web.php                # Simple view routes only (no controllers)
```

## What Was Removed

The following backend components were **removed** because they would duplicate the Telegram Bot API logic:

- ❌ `app/Http/Controllers/DashboardController.php`
- ❌ `app/Http/Controllers/TaskController.php`
- ❌ `app/Http/Controllers/DealershipController.php`
- ❌ `app/Http/Controllers/UserManagementController.php`
- ❌ `app/Http/Controllers/LinkController.php`
- ❌ `app/Http/Controllers/Settings/SystemSettingsController.php`
- ❌ `app/Models/Task.php`, `Company.php`, `Dealership.php`, etc.
- ❌ All TaskMate-specific database migrations

## What Was Kept

The following are **kept** for Laravel authentication:

- ✅ `app/Http/Controllers/Auth/*` - Authentication controllers
- ✅ `app/Http/Controllers/Settings/ProfileController.php` - User profile
- ✅ `app/Http/Controllers/Settings/PasswordController.php` - Password management
- ✅ `app/Models/User.php` - User model for authentication
- ✅ Default Laravel migrations (users, cache, jobs)

## Development Workflow

### 1. Start Development Server

```bash
composer dev  # Starts both Laravel and Vite
```

Or separately:

```bash
php artisan serve
npm run dev
```

### 2. Configure API Endpoint

Set the Telegram Bot API URL in your environment:

```env
VITE_API_BASE_URL=https://your-telegram-bot-api.com/api/v1
```

### 3. Test API Connectivity

Open browser console and test:

```javascript
// Check API health
await window.apiClient.healthCheck();

// Get dashboard data
await window.apiClient.getDashboard();
```

### 4. Implement New Views

When creating new views:

1. Create route in `routes/web.php` that returns a view
2. Create Blade view file
3. Use Alpine.js `x-data` to create component
4. Call `window.apiClient.*` methods to fetch data
5. Bind data to view using Alpine.js directives (`x-text`, `x-for`, etc.)

## API Integration Points

### Dashboard (`/dashboard`)
- Calls `GET /dashboard` for statistics
- Calls `GET /shifts/current` for active shifts
- Auto-refreshes every 30 seconds

### Tasks (`/tasks`)
- Calls `GET /tasks` with filters
- Supports pagination, search, status, dealership filters
- Create/Edit/Delete operations call respective API endpoints

### Dealerships (`/dealerships`)
- Calls `GET /dealerships` for list
- Create/Update operations call API
- Shows related users and shifts

### Users (`/users`)
- Calls `GET /users` for employee list
- Shows roles and dealership assignments
- All data comes from API

### Quick Links (`/links`)
- Fetches bookmarks from API
- CRUD operations via API calls

### System Settings (`/settings/system`)
- Fetches settings from API
- Updates shift times and parameters
- All settings stored in Telegram Bot backend

## Error Handling

The API client includes basic error handling:

```javascript
try {
    const data = await window.apiClient.getTasks();
} catch (error) {
    console.error('API Error:', error);
    // Show error message to user
}
```

Consider implementing:
- Toast notifications for errors
- Retry logic for failed requests
- Offline detection
- Loading states

## Security Considerations

1. **API Token Storage**: Tokens stored in localStorage - consider using httpOnly cookies for production
2. **CORS**: Ensure Telegram Bot API has proper CORS headers configured
3. **Token Refresh**: Implement token refresh mechanism if needed
4. **Rate Limiting**: Handle API rate limits gracefully
5. **Input Validation**: Validate data before sending to API

## Future Enhancements

- [ ] Add comprehensive error handling with user feedback
- [ ] Implement pagination components
- [ ] Add loading skeletons for better UX
- [ ] Create reusable Alpine.js components
- [ ] Add form validation before API calls
- [ ] Implement real-time updates via WebSockets
- [ ] Add offline support with service workers
- [ ] Create unit tests for API client
- [ ] Add API response caching
- [ ] Implement optimistic UI updates

## Testing

Since this is a frontend-only implementation, testing focuses on:

1. **Integration Tests**: Test API client methods
2. **Browser Tests**: Test views render correctly with API data
3. **Manual Testing**: Verify all AJAX calls work with actual API

Example test:

```php
test('dashboard loads data from API', function () {
    $this->actingAs(User::factory()->create())
        ->get('/dashboard')
        ->assertOk()
        ->assertSee('Dashboard');

    // View should render with empty data initially
    // JavaScript will load actual data from API
});
```

## Troubleshooting

### API Calls Failing

1. Check browser console for errors
2. Verify API_BASE_URL is configured correctly
3. Ensure CORS is enabled on API server
4. Check authentication token is valid

### Data Not Loading

1. Open browser DevTools Network tab
2. Check if API requests are being made
3. Verify API responses are successful (200 OK)
4. Check console for JavaScript errors

### Alpine.js Not Working

1. Ensure Alpine.js is loaded before custom scripts
2. Check `Alpine.data()` is called within `alpine:init` event
3. Verify x-data attribute matches registered component name

## Contributing

When contributing to views:

1. **No Backend Logic**: Keep all business logic in API, frontend only displays data
2. **Use API Client**: Always use `window.apiClient.*` methods
3. **Alpine.js Pattern**: Follow established Alpine.js component pattern
4. **Loading States**: Always show loading indicators
5. **Error Handling**: Catch and display errors appropriately
6. **Responsive Design**: Use Tailwind CSS utility classes
7. **Dark Mode**: Support both light and dark modes

## References

- [Laravel Documentation](https://laravel.com/docs)
- [Alpine.js Documentation](https://alpinejs.dev/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Telegram Bot API Specification](link-to-api-spec)
- [Issue #19](https://github.com/xierongchuan/TaskMateFrontend/issues/19)
