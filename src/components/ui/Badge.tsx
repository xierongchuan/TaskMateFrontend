import React from 'react';

/**
 * MD3 Badge variants following the semantic color system
 */
export type BadgeVariant = 'primary' | 'secondary' | 'tertiary' | 'error' | 'success' | 'warning';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  primary: 'bg-primary-container text-on-primary-container',
  secondary: 'bg-secondary-container text-on-secondary-container',
  tertiary: 'bg-tertiary-container text-on-tertiary-container',
  error: 'bg-error-container text-on-error-container',
  success: 'bg-success-container text-on-success-container',
  warning: 'bg-warning-container text-on-warning-container',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-xs gap-1',
  md: 'h-6 px-2.5 text-xs gap-1',
  lg: 'h-7 px-3 text-sm gap-1.5',
};

const iconSizeClasses: Record<BadgeSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

/**
 * Material Design 3 Badge component for displaying statuses, labels, etc.
 * Uses MD3 color containers for appropriate color harmony.
 *
 * @example
 * <Badge variant="success" icon={<CheckCircleIcon />}>Выполнено</Badge>
 * <Badge variant="error">Просрочено</Badge>
 * <Badge variant="warning">Ожидает</Badge>
 */
export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium whitespace-nowrap';

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ');

  const iconClasses = iconSizeClasses[size];

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconClasses} ${iconElement.props.className || ''}`.trim(),
      });
    }
    return iconElement;
  };

  return (
    <span className={classes}>
      {icon && renderIcon(icon)}
      {children}
    </span>
  );
};
