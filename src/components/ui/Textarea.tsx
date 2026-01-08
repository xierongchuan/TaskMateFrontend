import React from 'react';

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
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const textareaBaseClasses = [
    'w-full rounded-xs',
    'px-4 py-3',
    'text-on-surface text-base',
    'placeholder:text-on-surface-variant',
    'transition-all duration-short3 ease-standard',
    'focus:outline-none',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
    'resize-y min-h-[100px]',
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
    'block mb-2 text-sm font-medium',
    error ? 'text-error' : 'text-on-surface-variant',
  ].join(' ');

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {label && (
        <label htmlFor={textareaId} className={labelClasses}>
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        disabled={disabled}
        className={`${textareaBaseClasses} ${variantClasses}`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-xs text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1.5 text-xs text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
