import React from 'react';
import { XCircleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

export interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  retryText?: string;
  className?: string;
}

/**
 * MD3 Error State component with error container styling.
 *
 * @example
 * <ErrorState
 *   title="Ошибка загрузки"
 *   description="Не удалось загрузить данные"
 *   onRetry={() => refetch()}
 * />
 */
export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ошибка загрузки',
  description,
  onRetry,
  retryText = 'Повторить',
  className = '',
}) => {
  const containerClasses = [
    'bg-error-container border border-error/20 rounded-xl p-6',
    'transition-colors duration-medium2',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="flex items-start gap-3">
        <XCircleIcon className="w-6 h-6 text-error flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="md3-title-medium text-on-error-container font-medium">{title}</p>
          {description && (
            <p className="md3-body-medium text-on-error-container/80 mt-1">{description}</p>
          )}
          {onRetry && (
            <div className="mt-4">
              <Button
                variant="outlined"
                size="sm"
                onClick={onRetry}
                icon={<ArrowPathIcon />}
              >
                {retryText}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
