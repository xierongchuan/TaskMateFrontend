import type { Task } from './task';

export interface DashboardData {
  total_users: number;
  active_users: number;
  total_tasks: number;
  active_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  overdue_tasks_list?: Task[];
  open_shifts: number;
  late_shifts_today: number;
  active_shifts?: Array<{
    id: number;
    user?: {
      id: number;
      full_name: string;
    };
    replacement?: {
      id: number;
      full_name: string;
    };
    status: string;
    opened_at: string;
    closed_at: string | null;
    scheduled_start: string | null;
    scheduled_end: string | null;
    is_late: boolean;
    late_minutes: number | null;
  }>;
  recent_tasks: Array<{
    id: number;
    title: string;
    status: string;
    created_at: string;
  }>;
}
