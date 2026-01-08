import React from 'react';
import { Badge } from '../ui/Badge';
import {
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';

export type TaskStatus = 'pending' | 'completed' | 'overdue' | 'acknowledged';
export type ShiftStatus = 'open' | 'closed' | 'late' | 'replaced';

export interface StatusBadgeProps {
  status: TaskStatus | ShiftStatus | string;
  type?: 'task' | 'shift';
  className?: string;
}

const taskStatusConfig: Record<TaskStatus, { label: string; variant: 'warning' | 'success' | 'error' | 'tertiary'; icon: React.ElementType }> = {
  pending: { label: 'Ожидает', variant: 'warning', icon: ClockIcon },
  completed: { label: 'Выполнено', variant: 'success', icon: CheckCircleIcon },
  overdue: { label: 'Просрочено', variant: 'error', icon: XCircleIcon },
  acknowledged: { label: 'Принято', variant: 'tertiary', icon: CheckCircleIcon },
};

const shiftStatusConfig: Record<ShiftStatus, { label: string; variant: 'success' | 'secondary' | 'error' | 'warning' }> = {
  open: { label: 'Открыта', variant: 'success' },
  closed: { label: 'Закрыта', variant: 'secondary' },
  late: { label: 'Открыта (Опоздание)', variant: 'error' },
  replaced: { label: 'Заменена', variant: 'warning' },
};

/**
 * Бейдж статуса задачи или смены.
 *
 * @example
 * <StatusBadge status="pending" type="task" />
 * <StatusBadge status="open" type="shift" />
 */
export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  type = 'task',
  className = '',
}) => {
  if (type === 'shift') {
    const config = shiftStatusConfig[status as ShiftStatus] || { label: status, variant: 'secondary' as const };
    return (
      <Badge variant={config.variant} className={className}>
        {config.label}
      </Badge>
    );
  }

  const config = taskStatusConfig[status as TaskStatus] || { label: status, variant: 'secondary' as const, icon: ClockIcon };
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} icon={<Icon />} className={className}>
      {config.label}
    </Badge>
  );
};
