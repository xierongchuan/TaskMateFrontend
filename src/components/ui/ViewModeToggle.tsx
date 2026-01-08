import React from 'react';

export interface ViewModeOption {
  value: string;
  icon: React.ReactNode;
  label?: string;
}

export interface ViewModeToggleProps {
  mode: string;
  onChange: (mode: string) => void;
  options: ViewModeOption[];
  className?: string;
}

/**
 * MD3 Segmented Button for view mode selection (list/grid, etc.)
 *
 * @example
 * <ViewModeToggle
 *   mode={viewMode}
 *   onChange={setViewMode}
 *   options={[
 *     { value: 'list', icon: <ListBulletIcon />, label: 'Список' },
 *     { value: 'grid', icon: <Squares2X2Icon />, label: 'Карточки' }
 *   ]}
 * />
 */
export const ViewModeToggle: React.FC<ViewModeToggleProps> = ({
  mode,
  onChange,
  options,
  className = '',
}) => {
  const containerClasses = [
    'inline-flex items-center bg-surface-container rounded-full border border-outline overflow-hidden',
    'transition-colors duration-medium2',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses} role="group" aria-label="Режим отображения">
      {options.map((option, index) => {
        const isActive = mode === option.value;
        const isLast = index === options.length - 1;

        const buttonClasses = [
          // Base styles
          'relative inline-flex items-center justify-center h-10 px-4',
          'md3-label-large font-medium',
          'transition-all duration-short3 ease-standard',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1',
          'md3-state-layer',
          // Active/inactive styles
          isActive
            ? 'bg-secondary-container text-on-secondary-container'
            : 'bg-transparent text-on-surface hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]',
          // Border between buttons (except last)
          !isLast ? 'border-r border-outline' : '',
        ].filter(Boolean).join(' ');

        const iconClasses = 'w-5 h-5';

        const renderIcon = (iconElement: React.ReactNode) => {
          if (React.isValidElement<{ className?: string }>(iconElement)) {
            return React.cloneElement(iconElement, {
              className: `${iconClasses} ${iconElement.props.className || ''}`.trim(),
            });
          }
          return iconElement;
        };

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={buttonClasses}
            title={option.label}
            aria-pressed={isActive}
          >
            {renderIcon(option.icon)}
          </button>
        );
      })}
    </div>
  );
};
