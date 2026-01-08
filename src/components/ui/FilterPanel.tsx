import React from 'react';
import { FunnelIcon, ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';
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
 * MD3 Collapsible Filter Panel with surface container styling.
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
      'bg-surface-container rounded-xl shadow-elevation-1 border border-outline-variant',
      'transition-all duration-medium2',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={containerClasses}>
        {/* Header */}
        <button
          type="button"
          onClick={onToggle}
          className="w-full p-4 flex items-center justify-between text-on-surface transition-colors duration-short3 hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12] rounded-t-xl md3-state-layer"
        >
          <div className="flex items-center gap-3">
            <FunnelIcon className="w-5 h-5 text-on-surface-variant" />
            <span className="md3-title-small font-medium">{title}</span>
          </div>
          {isOpen ? (
            <ChevronUpIcon className="w-5 h-5 text-on-surface-variant" />
          ) : (
            <ChevronDownIcon className="w-5 h-5 text-on-surface-variant" />
          )}
        </button>

        {/* Content */}
        {isOpen && (
          <div className="p-6 pt-2 border-t border-outline-variant md3-animate-fade-in">
            {children}

            {onClear && (
              <div className="mt-6 flex justify-end">
                <Button
                  variant="text"
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

// Subcomponent for filter grid
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
