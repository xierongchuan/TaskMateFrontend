import React from 'react';

export type TextareaVariant = 'filled' | 'outlined';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  variant?: TextareaVariant;
  fullWidth?: boolean;
}

/**
 * Material Design 3 Textarea component.
 * Supports filled and outlined variants per MD3 spec.
 *
 * @example
 * <Textarea label="Описание" placeholder="Введите описание..." rows={4} />
 */
export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  label,
  error,
  hint,
  variant = 'outlined',
  fullWidth = true,
  className = '',
  id,
  rows = 3,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses = `
    block px-4 py-3 text-base transition-all duration-short3 ease-standard
    focus:outline-none
    disabled:opacity-38 disabled:cursor-not-allowed
    placeholder:text-on-surface-variant
    resize-y min-h-[80px]
  `;

  const variantClasses = variant === 'filled'
    ? `
      bg-surface-container-highest border-b-2 border-on-surface-variant rounded-t-xs rounded-b-none
      focus:border-primary focus:bg-surface-container-high
      ${error ? 'border-error focus:border-error' : ''}
    `
    : `
      bg-transparent border border-outline rounded-xs
      focus:border-2 focus:border-primary focus:px-[15px] focus:py-[11px]
      ${error ? 'border-error focus:border-error' : ''}
    `;

  const colorClasses = 'text-on-surface';

  const textareaClasses = [
    baseClasses,
    variantClasses,
    colorClasses,
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={textareaId}
          className={`block md3-body-small font-medium mb-1 ${error ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {label}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={textareaClasses}
        {...props}
      />
      {error && (
        <p className="mt-1 md3-body-small text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 md3-body-small text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
