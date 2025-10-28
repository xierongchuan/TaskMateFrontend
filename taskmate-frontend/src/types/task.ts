export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';
export type TaskStatus = 'pending' | 'acknowledged' | 'completed' | 'overdue' | 'postponed';
export type TaskType = 'individual' | 'group';
export type ResponseType = 'acknowledge' | 'complete';

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
  dealership_id: number;
  created_by: number;
  tags: string[];
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    full_name: string;
  };
  assignments?: Array<{
    id: number;
    user_id: number;
    status: string;
  }>;
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
}
