import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

/**
 * Material Design 3 Checkbox component.
 * Features MD3 styling with proper state layers and animations.
 *
 * @example
 * <Checkbox label="Только повторяемые" description="Задачи с расписанием" />
 */
export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className={className}>
      <label
        htmlFor={checkboxId}
        className={`flex items-start cursor-pointer group ${disabled ? 'cursor-not-allowed opacity-38' : ''}`}
      >
        <div className="relative flex items-center justify-center w-10 h-10 -ml-2 -mt-2">
          {/* State layer */}
          <div className="absolute inset-0 rounded-full transition-colors duration-short3 ease-standard group-hover:bg-on-surface/[0.08] group-active:bg-on-surface/[0.12]" />

          {/* Checkbox container */}
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              className={`
                peer
                appearance-none
                w-[18px] h-[18px]
                border-2 rounded-xs
                transition-all duration-short3 ease-standard
                cursor-pointer
                ${error
                  ? 'border-error checked:bg-error checked:border-error'
                  : 'border-on-surface-variant checked:bg-primary checked:border-primary'
                }
                disabled:border-on-surface/[0.38] disabled:cursor-not-allowed
                disabled:checked:bg-on-surface/[0.38]
              `}
              {...props}
            />
            {/* Checkmark icon */}
            <svg
              className={`
                absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-3 h-3
                text-on-primary
                opacity-0 scale-0
                peer-checked:opacity-100 peer-checked:scale-100
                transition-all duration-short3 ease-standard
                pointer-events-none
              `}
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M1 5L4.5 8.5L11 1"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {(label || description) && (
          <div className="flex-1 pt-2">
            {label && (
              <span className={`
                md3-body-medium font-medium
                transition-colors duration-short3 ease-standard
                ${disabled ? 'text-on-surface/[0.38]' : 'text-on-surface group-hover:text-on-surface'}
              `}>
                {label}
              </span>
            )}
            {description && (
              <p className={`md3-body-small ${disabled ? 'text-on-surface/[0.38]' : 'text-on-surface-variant'}`}>
                {description}
              </p>
            )}
          </div>
        )}
      </label>
      {error && (
        <p className="mt-1 md3-body-small text-error ml-8">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
