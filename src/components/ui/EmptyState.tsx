import React from 'react';

export interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  const containerClasses = [
    'bg-surface-container-low rounded-md shadow-elevation-1 p-12 text-center',
    'transition-all duration-short3 ease-standard',
    className,
  ].filter(Boolean).join(' ');

  const iconClasses = 'w-16 h-16';

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconClasses} mx-auto text-outline mb-4 ${iconElement.props.className || ''}`.trim(),
      });
    }
    return iconElement;
  };

  return (
    <div className={containerClasses}>
      {icon && renderIcon(icon)}
      <h3 className="text-on-surface md3-title-large mb-2">
        {title}
      </h3>
      {description && (
        <p className="text-on-surface-variant md3-body-medium mb-4">
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
