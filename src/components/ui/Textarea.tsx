import React, { useState } from 'react';

export type TextareaVariant = 'filled' | 'outlined';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: TextareaVariant;
  fullWidth?: boolean;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  variant = 'outlined',
  fullWidth = true,
  className = '',
  id,
  rows = 3,
  disabled,
  value,
  defaultValue,
  placeholder,
  onFocus,
  onBlur,
  onChange,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(Boolean(value || defaultValue));

  const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    setIsFocused(false);
    setHasValue(e.target.value.length > 0);
    onBlur?.(e);
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setHasValue(e.target.value.length > 0);
    onChange?.(e);
  };

  // Determine if label should float
  const shouldFloatLabel = isFocused || hasValue || Boolean(value) || Boolean(placeholder);

  const containerClasses = [
    'relative',
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

  const textareaBaseClasses = [
    'w-full',
    'bg-transparent',
    'text-on-surface text-base',
    'placeholder:text-on-surface-variant',
    'focus:outline-none',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
    'transition-all duration-short3 ease-standard',
    'resize-y min-h-[100px]',
    label ? 'pt-6' : 'pt-3',
    'pb-2 px-4',
    variant === 'outlined' && isFocused && !error ? '-m-px' : '',
  ].join(' ');

  // Floating label classes
  const labelClasses = [
    'absolute left-4 pointer-events-none',
    'transition-all duration-short3 ease-standard',
    // Floating state
    shouldFloatLabel
      ? `top-1.5 text-xs ${isFocused ? (error ? 'text-error' : 'text-primary') : (error ? 'text-error' : 'text-on-surface-variant')}`
      : `top-3 text-sm ${error ? 'text-error' : 'text-on-surface-variant'}`,
  ].join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      <div className={`${containerClasses} ${variantClasses}`}>
        <textarea
          ref={ref}
          id={textareaId}
          rows={rows}
          disabled={disabled}
          value={value}
          defaultValue={defaultValue}
          placeholder={shouldFloatLabel ? placeholder : ''}
          className={textareaBaseClasses}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          {...props}
        />
        {label && (
          <label htmlFor={textareaId} className={labelClasses}>
            {label}
          </label>
        )}
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

Textarea.displayName = 'Textarea';
