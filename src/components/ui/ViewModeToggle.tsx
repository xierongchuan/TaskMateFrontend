import React from 'react';

export interface ViewModeOption<T extends string = string> {
  value: T;
  icon: React.ReactNode;
  label?: string;
}

export interface ViewModeToggleProps<T extends string = string> {
  mode: T;
  onChange: (mode: T) => void;
  options: ViewModeOption<T>[];
  className?: string;
}

/**
 * Переключатель режима отображения (список/карточки и т.д.)
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
export function ViewModeToggle<T extends string = string>({
  mode,
  onChange,
  options,
  className = '',
}: ViewModeToggleProps<T>) {
  const containerClasses = [
    'inline-flex items-center bg-surface-container rounded-full p-1 transition-colors duration-short3',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={containerClasses}>
      {options.map((option) => {
        const isActive = mode === option.value;

        const buttonClasses = [
          'px-4 py-2 text-sm font-medium rounded-full transition-all duration-short3 ease-standard',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isActive
            ? 'bg-secondary-container text-on-secondary-container'
            : 'text-on-surface-variant hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]',
        ].filter(Boolean).join(' ');

        const iconClasses = 'w-4 h-4';

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
          >
            {renderIcon(option.icon)}
          </button>
        );
      })}
    </div>
  );
}
