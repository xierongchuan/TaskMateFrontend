import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  total?: number;
  perPage?: number;
  showInfo?: boolean;
  className?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  total,
  perPage,
  showInfo = true,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  const startItem = perPage ? (currentPage - 1) * perPage + 1 : null;
  const endItem = perPage && total ? Math.min(currentPage * perPage, total) : null;

  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        pages.push(i);
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push('ellipsis');
      }
    }

    return pages.filter((page, index, arr) => {
      if (page === 'ellipsis') {
        return arr[index - 1] !== 'ellipsis';
      }
      return true;
    });
  };

  const visiblePages = getVisiblePages();

  const baseButtonClasses = [
    'relative inline-flex items-center justify-center',
    'w-10 h-10',
    'text-sm font-medium',
    'transition-all duration-short3 ease-standard',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
  ].join(' ');

  const activeClasses = 'bg-secondary-container text-on-secondary-container rounded-full';
  const inactiveClasses = 'text-on-surface-variant hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12] rounded-full';

  return (
    <div className={`flex items-center justify-between border-t border-outline-variant pt-6 ${className}`}>
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="relative inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container disabled:opacity-[0.38]"
        >
          Назад
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="relative ml-3 inline-flex items-center rounded-full px-4 py-2 text-sm font-medium text-on-surface-variant bg-surface-container-low hover:bg-surface-container disabled:opacity-[0.38]"
        >
          Вперед
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showInfo && startItem && endItem && total && (
          <div>
            <p className="text-sm text-on-surface-variant">
              Показано с <span className="font-medium text-on-surface">{startItem}</span> по{' '}
              <span className="font-medium text-on-surface">{endItem}</span> из{' '}
              <span className="font-medium text-on-surface">{total}</span> результатов
            </p>
          </div>
        )}

        <div>
          <nav className="isolate inline-flex items-center gap-1" aria-label="Pagination">
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`${baseButtonClasses} ${inactiveClasses}`}
            >
              <span className="sr-only">Назад</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>

            {visiblePages.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-2 text-sm font-medium text-on-surface-variant"
                  >
                    ...
                  </span>
                );
              }

              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`${baseButtonClasses} ${currentPage === page ? activeClasses : inactiveClasses}`}
                >
                  {page}
                </button>
              );
            })}

            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`${baseButtonClasses} ${inactiveClasses}`}
            >
              <span className="sr-only">Вперед</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
