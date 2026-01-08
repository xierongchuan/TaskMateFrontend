import React from 'react';

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
  success: 'bg-[#d3f5d3] text-[#1a5d1a] dark:bg-[#1a4d1a] dark:text-[#b3e6b3]',
  warning: 'bg-[#fff3cd] text-[#856404] dark:bg-[#4d4000] dark:text-[#ffe066]',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'h-5 px-2 text-[11px]',
  md: 'h-6 px-3 text-xs',
  lg: 'h-7 px-4 text-sm',
};

const iconSizeClasses: Record<BadgeSize, string> = {
  sm: 'w-3 h-3',
  md: 'w-3.5 h-3.5',
  lg: 'w-4 h-4',
};

export const Badge: React.FC<BadgeProps> = ({
  variant = 'secondary',
  size = 'md',
  icon,
  children,
  className = '',
}) => {
  const baseClasses = [
    'inline-flex items-center justify-center',
    'rounded-sm font-medium',
    'transition-colors duration-short3 ease-standard',
  ].join(' ');

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
      {icon && (
        <span className="mr-1.5 -ml-0.5">
          {renderIcon(icon)}
        </span>
      )}
      {children}
    </span>
  );
};
