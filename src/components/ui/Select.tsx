import React from 'react';

export type SelectSize = 'sm' | 'md' | 'lg';
export type SelectVariant = 'filled' | 'outlined';

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
  sm: 'h-10 px-3 text-sm',
  md: 'h-12 px-4 text-base',
  lg: 'h-14 px-4 text-base',
};

/**
 * Material Design 3 Select/Dropdown component.
 * Supports filled and outlined variants per MD3 spec.
 *
 * @example
 * <Select
 *   label="Статус"
 *   options={[
 *     { value: '', label: 'Все статусы' },
 *     { value: 'pending', label: 'Ожидает' },
 *     { value: 'completed', label: 'Выполнено' },
 *   ]}
 * />
 */
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
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = `
    block transition-all duration-short3 ease-standard
    focus:outline-none
    disabled:opacity-38 disabled:cursor-not-allowed
    appearance-none cursor-pointer
    bg-no-repeat bg-right
  `;

  // Dropdown arrow using CSS
  const arrowStyles = `
    bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2379747e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")]
    bg-[length:20px_20px]
    bg-[position:right_12px_center]
    pr-10
  `;

  const variantClasses = variant === 'filled'
    ? `
      bg-surface-container-highest border-b-2 border-on-surface-variant rounded-t-xs rounded-b-none
      focus:border-primary focus:bg-surface-container-high
      ${error ? 'border-error focus:border-error' : ''}
    `
    : `
      bg-transparent border border-outline rounded-xs
      focus:border-2 focus:border-primary
      ${error ? 'border-error focus:border-error' : ''}
    `;

  const colorClasses = 'text-on-surface';

  const selectClasses = [
    baseClasses,
    sizeClasses[selectSize],
    variantClasses,
    colorClasses,
    arrowStyles,
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={selectId}
          className={`block md3-body-small font-medium mb-1 ${error ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {label}
        </label>
      )}
      <select
        ref={ref}
        id={selectId}
        className={selectClasses}
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
      {error && (
        <p className="mt-1 md3-body-small text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 md3-body-small text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
