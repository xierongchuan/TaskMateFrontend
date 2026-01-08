import React from 'react';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

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
        className={`flex items-start cursor-pointer group ${disabled ? 'opacity-[0.38] cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center h-5">
          <div className="relative">
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              className="peer sr-only"
              {...props}
            />
            <div className={`
              w-[18px] h-[18px] rounded-xs border-2
              transition-all duration-short3 ease-standard
              ${error ? 'border-error' : 'border-on-surface-variant'}
              peer-checked:bg-primary peer-checked:border-primary
              peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
              group-hover:border-on-surface
              peer-disabled:opacity-[0.38] peer-disabled:cursor-not-allowed
            `}>
              <svg
                className="w-full h-full text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-short2"
                viewBox="0 0 18 18"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M4 9l3 3 7-7" className="peer-checked:block hidden" />
              </svg>
            </div>
            <svg
              className="absolute inset-0 w-[18px] h-[18px] text-on-primary opacity-0 peer-checked:opacity-100 transition-opacity duration-short2 pointer-events-none"
              viewBox="0 0 18 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 9l3 3 7-7" />
            </svg>
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span className="text-sm font-medium text-on-surface group-hover:text-on-surface transition-colors duration-short3 ease-standard">
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-on-surface-variant mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-error ml-[30px]">{error}</p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
