import apiClient from './client';

export interface ReportData {
  period: string;
  date_from: string;
  date_to: string;
  summary: {
    total_tasks: number;
    completed_tasks: number;
    overdue_tasks: number;
    total_shifts: number;
    late_shifts: number;
    total_replacements: number;
  };
  tasks_by_status: Array<{
    status: string;
    count: number;
    percentage: number;
  }>;
  employees_performance: Array<{
    employee_id: number;
    employee_name: string;
    completed_tasks: number;
    overdue_tasks: number;
    late_shifts: number;
    performance_score: number;
  }>;
  daily_stats: Array<{
    date: string;
    completed: number;
    overdue: number;
    late_shifts: number;
  }>;
  top_issues: Array<{
    issue_type: string;
    count: number;
    description: string;
  }>;
}

export const reportsApi = {
  getReport: async (dateFrom: string, dateTo: string): Promise<ReportData> => {
    const response = await apiClient.get<ReportData>('/reports', {
      params: {
        date_from: dateFrom,
        date_to: dateTo,
      },
    });
    return response.data;
  },
};
