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

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Ошибка загрузки',
  description,
  onRetry,
  retryText = 'Повторить',
  className = '',
}) => {
  const containerClasses = [
    'bg-error-container rounded-md p-6',
    'transition-all duration-short3 ease-standard',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      <div className="flex items-start">
        <XCircleIcon className="w-6 h-6 text-on-error-container mr-3 mt-0.5 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-on-error-container font-medium">{title}</p>
          {description && (
            <p className="text-on-error-container/80 text-sm mt-1">{description}</p>
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
