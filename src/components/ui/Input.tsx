import React, { useState } from 'react';

export type InputVariant = 'filled' | 'outlined';
export type InputSize = 'sm' | 'md' | 'lg';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  inputSize?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
}

const sizeConfig: Record<InputSize, { height: string; labelSize: string; paddingTop: string }> = {
  sm: { height: 'h-12', labelSize: 'text-xs', paddingTop: 'pt-4' },
  md: { height: 'h-14', labelSize: 'text-sm', paddingTop: 'pt-5' },
  lg: { height: 'h-16', labelSize: 'text-base', paddingTop: 'pt-6' },
};

const iconSizeClasses: Record<InputSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  trailingIcon,
  inputSize = 'md',
  variant = 'outlined',
  fullWidth = true,
  className = '',
  id,
  disabled,
  value,
  defaultValue,
  placeholder,
  onFocus,
  onBlur,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  // Determine if label should float
  const shouldFloatLabel = isFocused || hasValue || Boolean(value) || Boolean(placeholder);

  const config = sizeConfig[inputSize];

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

  const inputBaseClasses = [
    'w-full h-full',
    'bg-transparent',
    'text-on-surface',
    'placeholder:text-on-surface-variant',
    'focus:outline-none',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
    'transition-all duration-short3 ease-standard',
    'text-base',
    label ? config.paddingTop : '',
    'pb-1',
    icon ? 'pl-12' : 'pl-4',
    trailingIcon ? 'pr-12' : 'pr-4',
    variant === 'outlined' && isFocused && !error ? '-m-px' : '',
  ].join(' ');

  // Floating label classes
  const labelClasses = [
    'absolute left-0 pointer-events-none',
    'transition-all duration-short3 ease-standard',
    icon ? 'left-12' : 'left-4',
    // Floating state
    shouldFloatLabel
      ? `top-1.5 text-xs ${isFocused ? (error ? 'text-error' : 'text-primary') : (error ? 'text-error' : 'text-on-surface-variant')}`
      : `top-1/2 -translate-y-1/2 ${config.labelSize} ${error ? 'text-error' : 'text-on-surface-variant'}`,
  ].join(' ');

  const renderIcon = (iconElement: React.ReactNode, position: 'left' | 'right') => {
    if (!iconElement) return null;

    const positionClasses = position === 'left'
      ? 'left-4'
      : 'right-4';

    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return (
        <div className={`absolute ${positionClasses} top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none`}>
          {React.cloneElement(iconElement, {
            className: `${iconSizeClasses[inputSize]} ${iconElement.props.className || ''}`.trim(),
          })}
        </div>
      );
    }
    return (
      <div className={`absolute ${positionClasses} top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none`}>
        {iconElement}
      </div>
    );
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className={`${containerClasses} ${variantClasses}`}>
        {renderIcon(icon, 'left')}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          placeholder={shouldFloatLabel ? placeholder : ''}
          className={inputBaseClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label htmlFor={inputId} className={labelClasses}>
            {label}
          </label>
        )}
        {renderIcon(trailingIcon, 'right')}
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

Input.displayName = 'Input';
