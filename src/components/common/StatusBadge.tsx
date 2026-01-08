import React from 'react';
import { Badge } from '../ui/Badge';
import type { BadgeVariant } from '../ui/Badge';
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

const taskStatusConfig: Record<TaskStatus, { label: string; variant: BadgeVariant; icon: React.ElementType }> = {
  pending: { label: 'Ожидает', variant: 'warning', icon: ClockIcon },
  completed: { label: 'Выполнено', variant: 'success', icon: CheckCircleIcon },
  overdue: { label: 'Просрочено', variant: 'error', icon: XCircleIcon },
  acknowledged: { label: 'Принято', variant: 'tertiary', icon: CheckCircleIcon },
};

const shiftStatusConfig: Record<ShiftStatus, { label: string; variant: BadgeVariant }> = {
  open: { label: 'Открыта', variant: 'success' },
  closed: { label: 'Закрыта', variant: 'secondary' },
  late: { label: 'Открыта (Опоздание)', variant: 'error' },
  replaced: { label: 'Заменена', variant: 'warning' },
};

/**
 * MD3 Status Badge for tasks or shifts.
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
    const config = shiftStatusConfig[status as ShiftStatus] || { label: status, variant: 'secondary' as BadgeVariant };
    return (
      <Badge variant={config.variant} className={className}>
        {config.label}
      </Badge>
    );
  }

  const config = taskStatusConfig[status as TaskStatus] || { label: status, variant: 'secondary' as BadgeVariant, icon: ClockIcon };
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} icon={<Icon />} className={className}>
      {config.label}
    </Badge>
  );
};
