import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * MD3 Empty State component with proper surface styling.
 *
 * @example
 * <EmptyState
 *   icon={<CalendarIcon />}
 *   title="Задачи не найдены"
 *   description="Создайте первую задачу для начала работы"
 *   action={<Button onClick={handleCreate}>Создать</Button>}
 * />
 */
export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const containerClasses = [
    'bg-surface-container rounded-xl shadow-elevation-1 border border-outline-variant',
    'p-12 text-center',
    'transition-colors duration-medium2',
    className,
  ].filter(Boolean).join(' ');

  const iconClasses = 'w-16 h-16';

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconClasses} mx-auto text-on-surface-variant/50 mb-6 ${iconElement.props.className || ''}`.trim(),
      });
    }
    return iconElement;
  };

  return (
    <div className={containerClasses}>
      {icon && renderIcon(icon)}
      <h3 className="md3-headline-small text-on-surface mb-2">
        {title}
      </h3>
      {description && (
        <p className="md3-body-medium text-on-surface-variant mb-6 max-w-md mx-auto">
          {description}
        </p>
      )}
      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
};
