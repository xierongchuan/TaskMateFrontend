import React from 'react';
import { Badge } from '../ui/Badge';
import {
  UserIcon,
  EyeIcon,
  UserGroupIcon,
  ShieldCheckIcon,
} from '@heroicons/react/24/outline';

export type UserRole = 'employee' | 'observer' | 'manager' | 'owner';

export interface RoleBadgeProps {
  role: UserRole | string;
  showDescription?: boolean;
  className?: string;
}

const roleConfig: Record<UserRole, {
  label: string;
  description: string;
  variant: 'tertiary' | 'secondary' | 'success' | 'error';
  icon: React.ElementType
}> = {
  employee: {
    label: 'Сотрудник',
    description: 'Базовый доступ',
    variant: 'tertiary',
    icon: UserIcon
  },
  observer: {
    label: 'Наблюдатель',
    description: 'Только просмотр',
    variant: 'secondary',
    icon: EyeIcon
  },
  manager: {
    label: 'Управляющий',
    description: 'Расширенные права',
    variant: 'success',
    icon: UserGroupIcon
  },
  owner: {
    label: 'Владелец',
    description: 'Полный доступ',
    variant: 'error',
    icon: ShieldCheckIcon
  },
};

/**
 * Бейдж роли пользователя.
 *
 * @example
 * <RoleBadge role="manager" />
 * <RoleBadge role="owner" showDescription />
 */
export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  showDescription = false,
  className = '',
}) => {
  const config = roleConfig[role as UserRole] || {
    label: role,
    description: '',
    variant: 'secondary' as const,
    icon: UserIcon
  };
  const Icon = config.icon;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <Badge variant={config.variant} icon={<Icon />}>
        {config.label}
      </Badge>
      {showDescription && config.description && (
        <span className="text-xs text-on-surface-variant hidden sm:inline">
          {config.description}
        </span>
      )}
    </div>
  );
};
