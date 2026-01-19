export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'acknowledged' | 'pending_review' | 'completed' | 'completed_late' | 'overdue';
export type TaskType = 'individual' | 'group';
export type ResponseType = 'acknowledge' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high';
export type TaskResponseStatus = 'acknowledged' | 'pending_review' | 'completed' | 'postponed';

export interface TaskResponseUser {
  id: number;
  full_name: string;
}

export interface TaskResponse {
  id: number;
  user_id: number;
  status: TaskResponseStatus;
  comment: string | null;
  responded_at: string | null;
  user: TaskResponseUser | null;
}

export interface CompletionProgress {
  total_assignees: number;
  completed_count: number;
  percentage: number;
}

export interface Task {
  id: number;
  title: string;
  description: string | null;
  comment: string | null;
  task_type: TaskType;
  response_type: ResponseType;
  recurrence: TaskRecurrence;
  recurrence_time: string | null;
  recurrence_day_of_week: number | null;
  recurrence_day_of_month: number | null;
  appear_date: string | null;
  deadline: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dealership_id: number;
  generator_id: number | null;
  created_by: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    full_name: string;
  };
  dealership?: {
    id: number;
    name: string;
  };
  assignments?: {
    id: number;
    user: {
      id: number;
      full_name: string;
    };
  }[];
  responses?: TaskResponse[];
  completion_progress?: CompletionProgress;
  notification_settings?: Record<string, { enabled?: boolean; offset?: number }>;
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  comment?: string;
  task_type: TaskType;
  response_type: ResponseType;
  recurrence?: TaskRecurrence;
  recurrence_time?: string;
  recurrence_day_of_week?: number;
  recurrence_day_of_month?: number;
  appear_date: string;  // required по StoreTaskRequest
  deadline: string;     // required по StoreTaskRequest
  dealership_id?: number; // nullable по StoreTaskRequest
  tags?: string[];
  assignments?: number[]; // nullable по StoreTaskRequest
  notification_settings?: Record<string, { enabled?: boolean; offset?: number }>;
  priority?: TaskPriority;
}

/**
 * Типы ошибок от API.
 */
export type ApiErrorType = 'duplicate_task' | 'access_denied' | 'validation_error';

export interface ApiErrorResponse {
  success?: boolean;
  message: string;
  error_type?: ApiErrorType;
  errors?: Record<string, string[]>;
}
