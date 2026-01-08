import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

/**
 * MD3 Page header component with title, optional description, and action buttons.
 * Provides consistent styling across all pages.
 */
export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  actions,
  className = '',
}) => {
  return (
    <div className={`mb-8 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="md3-display-small text-on-surface tracking-tight transition-colors duration-medium2">
            {title}
          </h1>
          {description && (
            <p className="mt-2 md3-body-large text-on-surface-variant transition-colors duration-medium2">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 flex-shrink-0">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};
