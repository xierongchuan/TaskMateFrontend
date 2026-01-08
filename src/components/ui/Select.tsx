import React from 'react';

export type SelectVariant = 'filled' | 'outlined';
export type SelectSize = 'sm' | 'md' | 'lg';

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  options: SelectOption[];
  placeholder?: string;
  selectSize?: SelectSize;
  variant?: SelectVariant;
  fullWidth?: boolean;
}

const sizeClasses: Record<SelectSize, string> = {
  sm: 'h-10 text-sm',
  md: 'h-14 text-base',
  lg: 'h-16 text-lg',
};

const labelSizeClasses: Record<SelectSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  options,
  placeholder,
  selectSize = 'md',
  variant = 'outlined',
  fullWidth = true,
  className = '',
  id,
  disabled,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const selectBaseClasses = [
    'w-full rounded-xs appearance-none cursor-pointer',
    'px-4 pr-10',
    'text-on-surface',
    'transition-all duration-short3 ease-standard',
    'focus:outline-none',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
    sizeClasses[selectSize],
  ].join(' ');

  const variantClasses = variant === 'filled'
    ? [
      'bg-surface-container-highest',
      'border-b-2 border-on-surface-variant',
      'rounded-t-xs rounded-b-none',
      'focus:border-primary',
      error ? 'border-error focus:border-error' : '',
    ].join(' ')
    : [
      'bg-transparent',
      'border border-outline',
      'rounded-xs',
      'focus:border-2 focus:border-primary focus:-m-px',
      error ? 'border-error focus:border-error' : '',
    ].join(' ');

  const labelClasses = [
    'block mb-2 font-medium',
    labelSizeClasses[selectSize],
    error ? 'text-error' : 'text-on-surface-variant',
  ].join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={selectId} className={labelClasses}>
          {label}
        </label>
      )}
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          className={`${selectBaseClasses} ${variantClasses}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option
              key={option.value}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
