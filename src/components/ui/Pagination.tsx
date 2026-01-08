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

/**
 * MD3 Pagination component with segmented button styling.
 *
 * @example
 * <Pagination
 *   currentPage={page}
 *   totalPages={data.last_page}
 *   onPageChange={setPage}
 *   showInfo={true}
 *   total={data.total}
 *   perPage={data.per_page}
 * />
 */
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

  // Generate page numbers to show
  const getVisiblePages = () => {
    const pages: (number | 'ellipsis')[] = [];
    const delta = 1; // Number of pages to show around current page

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

    // Remove duplicate ellipsis
    return pages.filter((page, index, arr) => {
      if (page === 'ellipsis') {
        return arr[index - 1] !== 'ellipsis';
      }
      return true;
    });
  };

  const visiblePages = getVisiblePages();

  // MD3 Segmented Button styling
  const baseButtonClasses = `
    relative inline-flex items-center justify-center min-w-[40px] h-10 px-3
    md3-label-large font-medium
    transition-all duration-short3 ease-standard
    focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2
    disabled:opacity-38 disabled:pointer-events-none
    md3-state-layer
  `;

  const activeClasses = 'bg-secondary-container text-on-secondary-container';
  const inactiveClasses = 'bg-surface text-on-surface hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]';

  return (
    <div className={`flex items-center justify-between border-t border-outline-variant pt-6 ${className}`}>
      {/* Mobile pagination */}
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface md3-label-large font-medium transition-all duration-short3 ease-standard hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12] disabled:opacity-38 disabled:pointer-events-none md3-state-layer"
        >
          <ChevronLeftIcon className="w-4 h-4" />
          Назад
        </button>
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface-container text-on-surface md3-label-large font-medium transition-all duration-short3 ease-standard hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12] disabled:opacity-38 disabled:pointer-events-none md3-state-layer"
        >
          Вперед
          <ChevronRightIcon className="w-4 h-4" />
        </button>
      </div>

      {/* Desktop pagination */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        {showInfo && startItem && endItem && total && (
          <div>
            <p className="md3-body-medium text-on-surface-variant">
              Показано с <span className="font-medium text-on-surface">{startItem}</span> по{' '}
              <span className="font-medium text-on-surface">{endItem}</span> из{' '}
              <span className="font-medium text-on-surface">{total}</span> результатов
            </p>
          </div>
        )}

        <div>
          <nav
            className="inline-flex items-center bg-surface-container rounded-full border border-outline-variant overflow-hidden"
            aria-label="Pagination"
          >
            {/* Previous button */}
            <button
              onClick={() => onPageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className={`${baseButtonClasses} ${inactiveClasses} border-r border-outline-variant`}
            >
              <span className="sr-only">Назад</span>
              <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
            </button>

            {/* Page numbers */}
            {visiblePages.map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="inline-flex items-center justify-center min-w-[40px] h-10 px-2 text-on-surface-variant md3-body-medium border-r border-outline-variant"
                  >
                    ...
                  </span>
                );
              }

              const isActive = currentPage === page;
              return (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`${baseButtonClasses} ${isActive ? activeClasses : inactiveClasses} border-r border-outline-variant`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {page}
                </button>
              );
            })}

            {/* Next button */}
            <button
              onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className={`${baseButtonClasses} ${inactiveClasses}`}
            >
              <span className="sr-only">Вперед</span>
              <ChevronRightIcon className="w-5 h-5" aria-hidden="true" />
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
