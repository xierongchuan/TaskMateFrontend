import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { auditLogsApi, type AuditLog } from '../api/auditLogs';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import {
  DocumentMagnifyingGlassIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  UserIcon,
  CalendarIcon,
  TableCellsIcon,
} from '@heroicons/react/24/outline';

import { usePermissions } from '../hooks/usePermissions';

import {
  Button,
  Skeleton,
  EmptyState,
  ErrorState,
  PageContainer,
  Card,
  Pagination,
  PageHeader,
  Badge,
  Modal,
  Select,
} from '../components/ui';

const getActionInfo = (action: string): { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'gray'; icon: React.ReactNode } => {
  switch (action) {
    case 'created':
      return {
        label: 'Создание',
        variant: 'success',
        icon: <PlusCircleIcon className="w-4 h-4" />,
      };
    case 'updated':
      return {
        label: 'Обновление',
        variant: 'warning',
        icon: <PencilSquareIcon className="w-4 h-4" />,
      };
    case 'deleted':
      return {
        label: 'Удаление',
        variant: 'danger',
        icon: <TrashIcon className="w-4 h-4" />,
      };
    default:
      return {
        label: action,
        variant: 'gray',
        icon: <DocumentMagnifyingGlassIcon className="w-4 h-4" />,
      };
  }
};

const getTableLabel = (tableName: string): string => {
  switch (tableName) {
    case 'tasks':
      return 'Задачи';
    case 'task_responses':
      return 'Ответы на задачи';
    case 'shifts':
      return 'Смены';
    default:
      return tableName;
  }
};

export const AuditLogPage: React.FC = () => {
  const permissions = usePermissions();
  const [page, setPage] = useState(1);
  const [tableFilter, setTableFilter] = useState<string>('');
  const [actionFilter, setActionFilter] = useState<string>('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  const { data: logsData, isLoading, error, refetch } = useQuery({
    queryKey: ['audit-logs', page, tableFilter, actionFilter],
    queryFn: () => auditLogsApi.getAuditLogs({
      table_name: tableFilter || undefined,
      action: actionFilter || undefined,
      page,
      per_page: 25,
    }),
    enabled: permissions.isOwner,
  });

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setIsDetailModalOpen(true);
  };

  if (!permissions.isOwner) {
    return (
      <PageContainer>
        <ErrorState
          title="Доступ запрещён"
          description="Страница аудита доступна только владельцу системы"
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageHeader
        title="Журнал аудита"
        description="История всех изменений в системе"
      />

      {/* Фильтры */}
      <Card className="mb-6">
        <Card.Body>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-48">
              <Select
                label="Таблица"
                value={tableFilter}
                onChange={(e) => {
                  setTableFilter(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'Все таблицы' },
                  { value: 'tasks', label: 'Задачи' },
                  { value: 'task_responses', label: 'Ответы на задачи' },
                  { value: 'shifts', label: 'Смены' },
                ]}
              />
            </div>
            <div className="w-full sm:w-48">
              <Select
                label="Действие"
                value={actionFilter}
                onChange={(e) => {
                  setActionFilter(e.target.value);
                  setPage(1);
                }}
                options={[
                  { value: '', label: 'Все действия' },
                  { value: 'created', label: 'Создание' },
                  { value: 'updated', label: 'Обновление' },
                  { value: 'deleted', label: 'Удаление' },
                ]}
              />
            </div>
            <div className="flex items-end">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Найдено: {logsData?.total || 0} записей
              </span>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Контент */}
      {isLoading ? (
        <Card>
          <Card.Body>
            <Skeleton variant="list" count={10} />
          </Card.Body>
        </Card>
      ) : error ? (
        <ErrorState
          title="Ошибка загрузки"
          onRetry={() => refetch()}
        />
      ) : logsData?.data.length === 0 ? (
        <EmptyState
          icon={<DocumentMagnifyingGlassIcon />}
          title="Нет записей"
          description="Журнал аудита пуст или нет записей по выбранным фильтрам"
        />
      ) : (
        <>
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Таблица
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Действие
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      ID записи
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Пользователь
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {logsData?.data.map((log) => {
                    const actionInfo = getActionInfo(log.action);
                    return (
                      <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {format(new Date(log.created_at), 'dd.MM.yyyy HH:mm:ss', { locale: ru })}
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center text-sm">
                            <TableCellsIcon className="w-4 h-4 mr-2 text-gray-400" />
                            <span className="text-gray-900 dark:text-gray-100">
                              {getTableLabel(log.table_name)}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <Badge variant={actionInfo.variant}>
                            <span className="flex items-center gap-1">
                              {actionInfo.icon}
                              {actionInfo.label}
                            </span>
                          </Badge>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 dark:text-gray-400">
                          #{log.record_id}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {log.actor ? (
                            <div className="flex items-center text-sm">
                              <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                              <span className="text-gray-900 dark:text-gray-100">
                                {log.actor.full_name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Система</span>
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-right">
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => handleViewDetails(log)}
                          >
                            Детали
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Пагинация */}
          {logsData && logsData.last_page > 1 && (
            <Pagination
              currentPage={page}
              totalPages={logsData.last_page}
              total={logsData.total}
              perPage={logsData.per_page}
              onPageChange={setPage}
              className="mt-8"
            />
          )}
        </>
      )}

      {/* Модальное окно деталей */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedLog(null);
        }}
        title="Детали записи аудита"
        size="lg"
      >
        <Modal.Body>
          {selectedLog && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Дата</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {format(new Date(selectedLog.created_at), 'dd MMMM yyyy HH:mm:ss', { locale: ru })}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Таблица</label>
                  <p className="text-gray-900 dark:text-gray-100">{getTableLabel(selectedLog.table_name)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Действие</label>
                  <p className="text-gray-900 dark:text-gray-100">{getActionInfo(selectedLog.action).label}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID записи</label>
                  <p className="text-gray-900 dark:text-gray-100">#{selectedLog.record_id}</p>
                </div>
                <div className="col-span-2">
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Пользователь</label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedLog.actor ? `${selectedLog.actor.full_name} (${selectedLog.actor.email})` : 'Система'}
                  </p>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400 block mb-2">Данные</label>
                <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-auto max-h-96 text-sm">
                  {JSON.stringify(selectedLog.payload, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setIsDetailModalOpen(false);
              setSelectedLog(null);
            }}
          >
            Закрыть
          </Button>
        </Modal.Footer>
      </Modal>
    </PageContainer>
  );
};
