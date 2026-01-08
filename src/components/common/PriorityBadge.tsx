import React from 'react';
import { Badge } from '../ui/Badge';
import type { BadgeVariant } from '../ui/Badge';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export type Priority = 'low' | 'medium' | 'high';

export interface PriorityBadgeProps {
  priority: Priority | string;
  showIcon?: boolean;
  className?: string;
}

const priorityConfig: Record<Priority, { label: string; variant: BadgeVariant }> = {
  low: { label: 'Низкий', variant: 'success' },
  medium: { label: 'Средний', variant: 'warning' },
  high: { label: 'Высокий', variant: 'error' },
};

/**
 * MD3 Priority Badge for tasks.
 *
 * @example
 * <PriorityBadge priority="high" />
 * <PriorityBadge priority="medium" showIcon={false} />
 */
export const PriorityBadge: React.FC<PriorityBadgeProps> = ({
  priority,
  showIcon = true,
  className = '',
}) => {
  const normalizedPriority = (priority || 'medium') as Priority;
  const config = priorityConfig[normalizedPriority] || priorityConfig.medium;

  return (
    <Badge
      variant={config.variant}
      icon={showIcon ? <ExclamationTriangleIcon /> : undefined}
      className={className}
    >
      {config.label}
    </Badge>
  );
};
