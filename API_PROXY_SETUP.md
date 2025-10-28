# API Proxy Setup Documentation

## Overview

The TaskMate Frontend now includes an API proxy system that allows secure communication with external Telegram Bot APIs through the Laravel application. This approach provides several benefits:

- Enhanced security (tokens are stored server-side)
- CORS handling
- Request logging and monitoring
- Centralized API configuration

## How It Works

1. **Frontend** makes requests to local endpoints (`/api/proxy/*`) without tokens
2. **Laravel Controller** intercepts these requests and retrieves user-specific API settings
3. **Proxy** automatically adds the `Authorization: Bearer {token}` header and forwards requests to the external API
4. **Response** is returned to the frontend through the proxy

## Configuration

### User Settings

Each user can configure their own API settings in the settings panel:

- **API URL**: The base URL of the external Telegram Bot API
- **Auth Token**: Authentication token for the external API

Access the settings at: `/settings/bot-api`

### Settings Keys

The proxy uses these setting keys:

- `api_url`: External API base URL
- `auth_token`: Authentication token for the external API

## API Routes

### Main Proxy Endpoint
```
ANY /api/proxy/{endpoint}
```
Handles all HTTP methods (GET, POST, PUT, DELETE, etc.) and forwards them to the external API.

### Upload Endpoint
```
POST /api/proxy/upload/{endpoint}
```
Special endpoint for handling file uploads with multipart form data.

## Frontend Usage

The `api-client.js` is automatically configured to use the proxy for all API requests:

```javascript
// All requests go through the local proxy
this.baseUrl = '/api/proxy';

// The external API URL is configured via .env and exposed as window.API_URL
// This is used for direct health checks and testing connections
this.externalApiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8007/api/v1';
window.API_URL = this.externalApiUrl;
```

### Configuration in .env

```env
# Backend API URL (used by Laravel proxy)
API_URL=http://localhost:8007/api/v1
API_TIMEOUT=30

# Frontend API URL (exposed to JavaScript)
VITE_API_URL="${API_URL}"
```

## Security Features

- **Authentication**: All proxy routes require `auth` and `verified` middleware
- **Token Isolation**: Each user has their own API settings
- **Server-side Token Management**: Tokens are never exposed to frontend, automatically added by proxy
- **CSRF Protection**: All proxy requests are protected by Laravel CSRF middleware
- **Request Validation**: Proper header and request validation
- **Error Handling**: Comprehensive error logging and user-friendly error messages
- **Timeout Protection**: Configurable timeouts for external requests

## Token Security

- **No Frontend Exposure**: API tokens are never stored or transmitted to the frontend
- **Server-side Injection**: Tokens are automatically injected into external requests by the proxy
- **User Isolation**: Each authenticated user has their own token configuration
- **Secure Storage**: Tokens are stored in the database with user settings, encrypted by Laravel

## CSRF Protection

All proxy requests are protected by Laravel's CSRF middleware:

- **Automatic Token Inclusion**: The client automatically includes `X-CSRF-TOKEN` header
- **Token Refresh**: Automatic token refresh on CSRF validation failures
- **Same-origin Requests**: All requests use `credentials: 'same-origin'` for proper cookie handling
- **Error Handling**: Graceful handling of CSRF token expiration with automatic retry

## Error Handling

The proxy provides detailed error responses:

- **401**: When API token is not configured
- **500**: When external API is unreachable
- **422**: For validation errors

## Testing the Connection

The settings panel includes a "Test Connection" button that verifies:

1. API URL accessibility
2. Valid response from the external API
3. Network connectivity

## Implementation Details

### Controller: `ApiProxyController`

- **proxy()**: Handles standard API requests
- **proxyUpload()**: Handles file upload requests

### Model: `Setting`

Uses the existing Settings model with user-specific configurations.

### Routes: `web.php`

All proxy routes are protected by authentication middleware:

```php
Route::middleware(['auth', 'verified'])->group(function () {
    Route::prefix('api/proxy')->group(function () {
        Route::any('{endpoint}', [ApiProxyController::class, 'proxy'])
            ->where('endpoint', '.*');
        Route::post('upload/{endpoint}', [ApiProxyController::class, 'proxyUpload'])
            ->where('endpoint', '.*');
    });
});
```

## Migration from Direct API

If migrating from direct API calls:

1. **Frontend**: No changes needed in API usage, the `api-client.js` handles the routing
2. **Settings**: Users need to configure their API URL and token
3. **Testing**: Use the connection test feature to verify setup

## Troubleshooting

### Common Issues

1. **404 Errors**: Check that routes are properly registered
2. **401 Errors**: Verify user is authenticated and has configured API token
3. **Connection Timeouts**: Check external API URL and network connectivity
4. **CORS Issues**: The proxy handles CORS automatically

### Debug Mode

Enable debug mode in `.env` to see detailed error messages:

```env
APP_DEBUG=true
```

## Monitoring

All proxy requests are logged with:

- Request endpoint and method
- User ID
- Response status
- Error details (if any)

This provides audit trails and helps with troubleshooting.