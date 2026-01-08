import React, { useState } from 'react';

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

const sizeConfig: Record<SelectSize, { height: string; labelSize: string; paddingTop: string }> = {
  sm: { height: 'h-12', labelSize: 'text-xs', paddingTop: 'pt-4' },
  md: { height: 'h-14', labelSize: 'text-sm', paddingTop: 'pt-5' },
  lg: { height: 'h-16', labelSize: 'text-base', paddingTop: 'pt-6' },
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
  value,
  defaultValue,
  onFocus,
  onBlur,
  onChange,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

  const handleFocus = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  // Determine if label should float
  const shouldFloatLabel = isFocused || hasValue || Boolean(value) || Boolean(placeholder);

  const config = sizeConfig[selectSize];

  const containerClasses = [
    'relative',
    config.height,
    fullWidth ? 'w-full' : '',
    'transition-all duration-short3 ease-standard',
  ].join(' ');

  // Variant-specific styles
  const variantClasses = variant === 'filled'
    ? [
      'bg-surface-container-highest',
      'rounded-t-xs rounded-b-none',
      'border-b-2',
      isFocused
        ? (error ? 'border-error' : 'border-primary')
        : (error ? 'border-error' : 'border-on-surface-variant'),
    ].join(' ')
    : [
      'bg-transparent',
      'rounded-xs',
      'border',
      isFocused
        ? `border-2 ${error ? 'border-error' : 'border-primary'}`
        : `border ${error ? 'border-error' : 'border-outline'}`,
    ].join(' ');

  const selectBaseClasses = [
    'w-full h-full appearance-none cursor-pointer',
    'bg-transparent',
    'text-on-surface',
    'focus:outline-none',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
    'transition-all duration-short3 ease-standard',
    'text-base',
    label ? config.paddingTop : '',
    'pb-1 pl-4 pr-10',
    variant === 'outlined' && isFocused && !error ? '-m-px' : '',
  ].join(' ');

  // Floating label classes
  const labelClasses = [
    'absolute left-4 pointer-events-none',
    'transition-all duration-short3 ease-standard',
    // Floating state
    shouldFloatLabel
      ? `top-1.5 text-xs ${isFocused ? (error ? 'text-error' : 'text-primary') : (error ? 'text-error' : 'text-on-surface-variant')}`
      : `top-1/2 -translate-y-1/2 ${config.labelSize} ${error ? 'text-error' : 'text-on-surface-variant'}`,
  ].join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className={`${containerClasses} ${variantClasses}`}>
        <select
          ref={ref}
          id={selectId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          className={selectBaseClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
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
        {label && (
          <label htmlFor={selectId} className={labelClasses}>
            {label}
          </label>
        )}
        <div className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-short3 ease-standard ${isFocused ? 'rotate-180' : ''}`}>
          <svg
            className={`w-5 h-5 ${isFocused ? (error ? 'text-error' : 'text-primary') : 'text-on-surface-variant'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        {/* Active indicator for filled variant */}
        {variant === 'filled' && isFocused && (
          <span
            className={`absolute bottom-0 left-0 right-0 h-0.5 ${error ? 'bg-error' : 'bg-primary'} transform scale-x-100 transition-transform duration-short3 ease-standard`}
          />
        )}
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-error flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
});

Select.displayName = 'Select';
