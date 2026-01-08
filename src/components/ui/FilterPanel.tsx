import React from 'react';
import { FunnelIcon } from '@heroicons/react/24/outline';
import { Button } from './Button';

export interface FilterPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onClear?: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  clearButtonText?: string;
}

/**
 * Сворачиваемая панель фильтров.
 *
 * @example
 * <FilterPanel
 *   isOpen={showFilters}
 *   onToggle={() => setShowFilters(!showFilters)}
 *   onClear={clearFilters}
 * >
 *   <FilterPanel.Grid>
 *     <Select label="Статус" ... />
 *     <Select label="Приоритет" ... />
 *   </FilterPanel.Grid>
 * </FilterPanel>
 */
export const FilterPanel: React.FC<FilterPanelProps> & {
  Grid: typeof FilterGrid;
} = ({
  isOpen,
  onToggle,
  onClear,
  title = 'Фильтры',
  children,
  className = '',
  clearButtonText = 'Сбросить фильтры',
}) => {
    const containerClasses = [
      'bg-surface-container-low rounded-xl shadow-elevation-1 transition-colors duration-short3',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        <div className="p-4 border-b border-outline-variant transition-colors">
          <button
            type="button"
            onClick={onToggle}
            className="flex items-center text-sm font-medium text-on-surface hover:text-on-surface/80 transition-colors duration-short3"
          >
            <FunnelIcon className="w-4 h-4 mr-2" />
            {title} {isOpen ? 'Скрыть' : 'Показать'}
          </button>
        </div>

        {isOpen && (
          <div className="p-6">
            {children}

            {onClear && (
              <div className="mt-4 flex justify-end">
                <Button
                  variant="tonal"
                  size="sm"
                  onClick={onClear}
                >
                  {clearButtonText}
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

// Подкомпонент для сетки фильтров
interface FilterGridProps {
  children: React.ReactNode;
  columns?: 1 | 2 | 3 | 4 | 5;
  className?: string;
}

const columnClasses = {
  1: 'grid-cols-1',
  2: 'grid-cols-1 md:grid-cols-2',
  3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  5: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-5',
};

const FilterGrid: React.FC<FilterGridProps> = ({
  children,
  columns = 4,
  className = '',
}) => {
  const gridClasses = [
    'grid gap-4',
    columnClasses[columns],
    className,
  ].filter(Boolean).join(' ');

  return <div className={gridClasses}>{children}</div>;
};

FilterPanel.Grid = FilterGrid;
