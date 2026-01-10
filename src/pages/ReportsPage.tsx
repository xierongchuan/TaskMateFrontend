import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import {
  DocumentTextIcon,
  ChartBarIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowPathIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import { reportsApi } from '../api/reports';

// Унифицированные компоненты
import {
  Button,
  Select,
  Badge,
  Skeleton,
  EmptyState,
  PageContainer,
  Card,
  Section,
  PageHeader,
} from '../components/ui';

export const ReportsPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'custom'>('week');
  const [dateRange, setDateRange] = useState({
    from: format(startOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
    to: format(endOfWeek(new Date(), { weekStartsOn: 1 }), 'yyyy-MM-dd'),
  });
  const [reportFormat, setReportFormat] = useState<'json' | 'pdf'>('json');

  const { data: reportData, isLoading, refetch } = useQuery({
    queryKey: ['reports', dateRange.from, dateRange.to],
    queryFn: () => reportsApi.getReport(dateRange.from, dateRange.to),
    enabled: !!dateRange.from && !!dateRange.to,
  });

  const handlePeriodChange = (period: 'week' | 'month' | 'custom') => {
    setSelectedPeriod(period);
    const now = new Date();

    switch (period) {
      case 'week':
        setDateRange({
          from: format(startOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
          to: format(endOfWeek(now, { weekStartsOn: 1 }), 'yyyy-MM-dd'),
        });
        break;
      case 'month':
        setDateRange({
          from: format(startOfMonth(now), 'yyyy-MM-dd'),
          to: format(endOfMonth(now), 'yyyy-MM-dd'),
        });
        break;
      case 'custom':
        // оставляем текущие даты
        break;
    }
  };

  const handleExport = () => {
    if (reportFormat === 'pdf') {
      window.print();
    } else {
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `report-${dateRange.from}-${dateRange.to}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const getStatusBadgeVariant = (status: string): 'success' | 'danger' | 'info' | 'warning' | 'gray' => {
    switch (status) {
      case 'completed': return 'success';
      case 'overdue': return 'danger';
      case 'active': return 'info';
      case 'pending_review': return 'warning';
      default: return 'gray';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed': return 'Выполнено';
      case 'overdue': return 'Просрочено';
      case 'active': return 'В работе';
      case 'pending_review': return 'На проверке';
      default: return status;
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'overdue': return 'bg-red-500';
      case 'active': return 'bg-blue-500';
      case 'pending_review': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatOptions = [
    { value: 'json', label: 'JSON' },
    { value: 'pdf', label: 'PDF' },
  ];

  return (
    <PageContainer>
      {/* Header */}
      <PageHeader
        title="Отчетность"
        description="Еженедельные и ежемесячные отчеты по системе управления задачами"
      >
        <div className="flex items-center space-x-3">
          <Select
            value={reportFormat}
            onChange={(e) => setReportFormat(e.target.value as 'json' | 'pdf')}
            options={formatOptions}
            selectSize="sm"
            fullWidth={false}
          />
          <Button
            variant="secondary"
            icon={<ArrowPathIcon />}
            onClick={() => refetch()}
          >
            Обновить
          </Button>
          <Button
            variant="primary"
            icon={<ArrowDownTrayIcon />}
            onClick={handleExport}
            disabled={!reportData}
          >
            Экспорт
          </Button>
        </div>
      </PageHeader>

      {/* Period Selector */}
      <Card className="mb-6">
        <Card.Body>
          <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            {/* Period Buttons */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Период:</span>
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant={selectedPeriod === 'week' ? 'primary' : 'secondary'}
                  onClick={() => handlePeriodChange('week')}
                  fullWidth={false}
                >
                  Эта неделя
                </Button>
                <Button
                  variant={selectedPeriod === 'month' ? 'primary' : 'secondary'}
                  onClick={() => handlePeriodChange('month')}
                  fullWidth={false}
                >
                  Этот месяц
                </Button>
              </div>
            </div>

            {/* Date Range */}
            <div className="flex flex-col gap-2 sm:gap-3">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Диапазон дат:</span>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block sm:hidden">Диапазон дат:</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <input
                  type="date"
                  value={dateRange.from}
                  onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
                  className="w-full sm:w-auto px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <span className="text-gray-500 dark:text-gray-400 text-center sm:text-left hidden sm:block">—</span>
                <div className="text-center sm:hidden text-gray-500 dark:text-gray-400 text-sm mb-1">до</div>
                <input
                  type="date"
                  value={dateRange.to}
                  onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                  className="w-full sm:w-auto px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {isLoading ? (
        <Card>
          <Card.Body>
            <Skeleton variant="card" count={6} />
          </Card.Body>
        </Card>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего задач</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.total_tasks}</p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Выполнено</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.completed_tasks}</p>
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {((reportData.summary.completed_tasks / reportData.summary.total_tasks) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Просрочено</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.overdue_tasks}</p>
                    <p className="text-xs text-red-600 dark:text-red-400">
                      {((reportData.summary.overdue_tasks / reportData.summary.total_tasks) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              </Card.Body>
            </Card>

            <Card>
              <Card.Body>
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
                    <ClockIcon className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Опоздания</p>
                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.late_shifts}</p>
                    <p className="text-xs text-yellow-600 dark:text-yellow-400">смен</p>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>

          {/* Tasks by Status */}
          <Section title="Распределение задач по статусам">
            <div className="space-y-3">
              {reportData.tasks_by_status.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant={getStatusBadgeVariant(item.status)}>
                      {getStatusLabel(item.status)}
                    </Badge>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} задач</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${getProgressBarColor(item.status)}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>

          {/* Employee Performance */}
          <Section title="Эффективность сотрудников">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Сотрудник</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Выполнено</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Просрочено</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Опоздания</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Рейтинг</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {reportData.employees_performance.map((employee) => (
                    <tr key={employee.employee_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {employee.employee_name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                        {employee.completed_tasks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                        {employee.overdue_tasks}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                        {employee.late_shifts}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`text-sm font-semibold ${getPerformanceColor(employee.performance_score)}`}>
                          {employee.performance_score}/100
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Section>

          {/* Top Issues */}
          <Section title="Топ проблем за период">
            <div className="space-y-3">
              {reportData.top_issues.map((issue, index) => (
                <div key={issue.issue_type} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold ${index === 0 ? 'bg-red-500' : index === 1 ? 'bg-yellow-500' : 'bg-orange-500'
                      }`}>
                      {index + 1}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{issue.description}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{issue.count} инцидентов</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">{issue.count}</span>
                  </div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      ) : (
        <EmptyState
          icon={<ChartBarIcon />}
          title="Нет данных для отчета"
          description="Выберите период для генерации отчета"
        />
      )}
    </PageContainer>
  );
};
