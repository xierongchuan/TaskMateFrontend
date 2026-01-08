# CLAUDE.md

## Project Overview

TaskMate is a Russian-language task management system frontend built with React 19, TypeScript, and Vite. The application features role-based access control for managing tasks, users, shifts, and automotive dealerships. It connects to a Laravel backend API using Bearer token authentication.

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

## Technology Stack

- **React 19** with TypeScript for UI development
- **Vite** as build tool and development server
- **Tailwind CSS** with custom primary color scheme (blue-600)
- **Zustand** for client-side state management with persistence
- **TanStack Query (React Query v5)** for server state management
- **React Router v7** for navigation and protected routes
- **Axios** for HTTP requests with interceptors
- **React Hook Form** for form handling and validation
- **date-fns** with Russian locale for date formatting
- **Heroicons** for UI icons

## Architecture Overview

### Authentication & Authorization
- **Bearer Token Authentication** using Laravel Sanctum
- **Zustand Store** (`src/stores/authStore.ts`) with localStorage persistence
- **Role-Based Access Control**: employee, observer, manager, owner
- **Protected Routes** (`src/components/auth/ProtectedRoute.tsx`) with role requirements
- **Automatic token management** via Axios interceptors

### API Layer Architecture
- **Centralized Axios Client** (`src/api/client.ts`) with auth and error interceptors
- **Modular API Structure**: Separate files for each domain (auth, tasks, users, dealerships, etc.)
- **Consistent Error Handling**: 401 auto-logout, 403 permission checking, user-friendly error messages
- **TypeScript Interfaces** for all API requests and responses
- **Environment Configuration** via `VITE_API_BASE_URL`

### State Management Patterns
- **Zustand** for client-side state (authentication, user preferences)
- **TanStack Query** for server state with intelligent caching and background refetching
- **Real-time Updates**: Automatic refetching every 30 seconds for tasks and other dynamic data
- **Query Invalidation** patterns after mutations to maintain data consistency
- **Optimistic Updates** for better user experience

### Component Organization
```
src/
├── api/              # API client modules by domain
├── components/       # Reusable React components
│   ├── auth/        # Authentication components
│   ├── common/      # Cross-cutting UI elements
│   ├── layout/      # Layout and navigation
│   └── [feature]/   # Feature-specific components
├── pages/           # Route-level page components
├── stores/          # Zustand state stores
├── hooks/           # Custom React hooks
├── types/           # TypeScript type definitions
└── utils/           # Utility functions
```

## Key Development Patterns

### Permission-Based UI Rendering
Use the `usePermissions` hook to conditionally render features based on user roles:
```typescript
const { canManageTasks, canCreateUsers } = usePermissions();
```

Navigation menu items and action buttons should respect these permissions.

### API Integration Patterns
Follow established patterns when creating new API modules:
```typescript
export const exampleApi = {
  getData: async (params?: DataFilters): Promise<PaginatedResponse<Data>> => {
    const response = await apiClient.get<PaginatedResponse<Data>>('/endpoint', { params });
    return response.data;
  },
  createData: async (data: CreateDataRequest): Promise<{ data: Data }> => {
    const response = await apiClient.post<{ data: Data }>('/endpoint', data);
    return response.data;
  },
};
```

### React Query Integration
Use consistent query keys and mutation patterns:
```typescript
export const useData = (filters?: DataFilters) => {
  return useQuery({
    queryKey: ['data', filters],
    queryFn: () => exampleApi.getData(filters),
  });
};

export const useCreateData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDataRequest) => exampleApi.createData(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['data'] });
    },
  });
};
```

### Modal-Based CRUD Operations
Create/edit operations use modal patterns with form validation and proper error handling.

### Dealership Context
The application supports multi-tenancy through dealership-based data filtering. Many operations require dealership selection and filter data accordingly.

## Environment Setup

- **Node.js 18+** required
- **Environment Variables**: `VITE_API_BASE_URL` (default: http://localhost:8000/api/v1)
- **Docker Support**: Multi-stage build configuration available

## Backend Integration

- **Laravel API Backend** with RESTful endpoints
- **Sanctum Authentication** with Bearer tokens stored in localStorage
- **Role-Based Permissions** enforced at both frontend and API level
- **Russian Language** throughout the application

## File Structure Highlights

- `/src/api/client.ts` - Centralized Axios configuration with interceptors
- `/src/stores/authStore.ts` - Authentication state management
- `/src/hooks/usePermissions.ts` - Permission checking logic
- `/src/components/layout/Layout.tsx` - Main layout with navigation
- `/src/components/auth/ProtectedRoute.tsx` - Route protection wrapper
- `/src/components/common/DealershipSelector.tsx` - Reusable dealership dropdown
- `/src/types/` - Comprehensive TypeScript definitions matching backend models

## Development Notes

- The application uses Russian language throughout (labels, messages, etc.)
- All date formatting uses Russian locale (`ru`)
- Error messages are user-friendly and localized
- Component styling follows Tailwind CSS patterns with consistent design tokens
- Form validation includes both client-side and server-side error handling

---

Issue to solve: https://github.com/xierongchuan/TaskMateFrontend/issues/60
Your prepared branch: issue-60-5af97b55bbd8
Your prepared working directory: /tmp/gh-issue-solver-1767862183931
Your forked repository: konard/xierongchuan-TaskMateFrontend
Original repository (upstream): xierongchuan/TaskMateFrontend

Proceed.


Run timestamp: 2026-01-08T08:49:48.786Z