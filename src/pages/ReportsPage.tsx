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
      // Экспорт в PDF
      window.print();
    } else {
      // Экспорт в JSON
      const dataStr = JSON.stringify(reportData, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
      const exportFileDefaultName = `report-${dateRange.from}-${dateRange.to}.json`;
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const getPerformanceColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="px-4 py-6 sm:px-0 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Отчетность</h1>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Еженедельные и ежемесячные отчеты по системе управления задачами
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={reportFormat}
              onChange={(e) => setReportFormat(e.target.value as 'json' | 'pdf')}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="json">JSON</option>
              <option value="pdf">PDF</option>
            </select>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowPathIcon className="w-4 h-4 mr-2" />
              Обновить
            </button>
            <button
              onClick={handleExport}
              disabled={!reportData}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <ArrowDownTrayIcon className="w-4 h-4 mr-2" />
              Экспорт
            </button>
          </div>
        </div>
      </div>

      {/* Period Selector */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6 mb-6">
        <div className="space-y-4 sm:space-y-0 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          {/* Period Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden sm:block">Период:</span>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
              <button
                onClick={() => handlePeriodChange('week')}
                className={`flex-1 sm:flex-initial px-4 py-3 text-sm font-medium rounded-lg min-h-[44px] transition-colors ${selectedPeriod === 'week'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                Эта неделя
              </button>
              <button
                onClick={() => handlePeriodChange('month')}
                className={`flex-1 sm:flex-initial px-4 py-3 text-sm font-medium rounded-lg min-h-[44px] transition-colors ${selectedPeriod === 'month'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                  }`}
              >
                Этот месяц
              </button>
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
                inputMode="text"
                className="w-full sm:w-auto px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <span className="text-gray-500 dark:text-gray-400 text-center sm:text-left hidden sm:block">—</span>
              <div className="text-center sm:hidden text-gray-500 dark:text-gray-400 text-sm mb-1">до</div>
              <input
                type="date"
                value={dateRange.to}
                onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
                inputMode="text"
                className="w-full sm:w-auto px-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-[44px] bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
          <div className="animate-pulse space-y-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
            ))}
          </div>
        </div>
      ) : reportData ? (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <DocumentTextIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Всего задач</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.total_tasks}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Выполнено</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.completed_tasks}</p>
                  <p className="text-xs text-green-600 dark:text-green-400">{((reportData.summary.completed_tasks / reportData.summary.total_tasks) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-lg">
                  <XCircleIcon className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Просрочено</p>
                  <p className="text-2xl font-semibold text-gray-900 dark:text-white">{reportData.summary.overdue_tasks}</p>
                  <p className="text-xs text-red-600 dark:text-red-400">{((reportData.summary.overdue_tasks / reportData.summary.total_tasks) * 100).toFixed(1)}%</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
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
            </div>
          </div>

          {/* Tasks by Status */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Распределение задач по статусам</h3>
            <div className="space-y-3">
              {reportData.tasks_by_status.map((item) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {item.status === 'completed' && 'Выполнено'}
                      {item.status === 'overdue' && 'Просрочено'}
                      {item.status === 'active' && 'В работе'}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{item.count} задач</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${item.status === 'completed' ? 'bg-green-500' :
                          item.status === 'overdue' ? 'bg-red-500' :
                            item.status === 'active' ? 'bg-blue-500' : 'bg-gray-500'
                          }`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{item.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Employee Performance */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Эффективность сотрудников</h3>
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
          </div>

          {/* Top Issues */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Топ проблем за период</h3>
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
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <ChartBarIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Нет данных для отчета</h3>
          <p className="text-gray-500 dark:text-gray-400">Выберите период для генерации отчета</p>
        </div>
      )}
    </div>
  );
};
