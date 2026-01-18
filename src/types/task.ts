export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'acknowledged' | 'pending_review' | 'completed' | 'completed_late' | 'overdue';
export type TaskType = 'individual' | 'group';
export type ResponseType = 'acknowledge' | 'complete';
export type TaskPriority = 'low' | 'medium' | 'high';

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
  appear_date?: string;
  deadline?: string;
  dealership_id: number;
  tags?: string[];
  assignments: number[];
  notification_settings?: Record<string, { enabled?: boolean; offset?: number }>;
  priority?: TaskPriority;
}
