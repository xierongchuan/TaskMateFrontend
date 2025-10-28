export interface DashboardData {
  total_users: number;
  active_users: number;
  total_tasks: number;
  active_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  open_shifts: number;
  late_shifts_today: number;
  recent_tasks: Array<{
    id: number;
    title: string;
    status: string;
    created_at: string;
  }>;
}
