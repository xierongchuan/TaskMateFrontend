import React from 'react';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'filled' | 'outlined';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  inputSize?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
}

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-10 px-3 text-sm',
  md: 'h-12 px-4 text-base',
  lg: 'h-14 px-4 text-base',
};

const iconPaddingLeft: Record<InputSize, string> = {
  sm: 'pl-9',
  md: 'pl-11',
  lg: 'pl-12',
};

const iconPaddingRight: Record<InputSize, string> = {
  sm: 'pr-9',
  md: 'pr-11',
  lg: 'pr-12',
};

const iconPositionClasses: Record<InputSize, { left: string; right: string }> = {
  sm: { left: 'left-3', right: 'right-3' },
  md: { left: 'left-4', right: 'right-4' },
  lg: { left: 'left-4', right: 'right-4' },
};

const iconSizeClasses: Record<InputSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-5 h-5',
};

/**
 * Material Design 3 Text Field component.
 * Supports filled and outlined variants per MD3 spec.
 *
 * @example
 * <Input label="Поиск" icon={<MagnifyingGlassIcon />} placeholder="Введите текст..." />
 * <Input label="Email" type="email" error="Неверный формат" variant="outlined" />
 */
export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  icon,
  iconPosition = 'left',
  inputSize = 'md',
  variant = 'outlined',
  fullWidth = true,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseInputClasses = `
    block rounded-xs transition-all duration-short3 ease-standard
    focus:outline-none
    disabled:opacity-38 disabled:cursor-not-allowed
    placeholder:text-on-surface-variant
  `;

  const variantClasses = variant === 'filled'
    ? `
      bg-surface-container-highest border-b-2 border-on-surface-variant rounded-t-xs rounded-b-none
      focus:border-primary focus:bg-surface-container-high
      ${error ? 'border-error focus:border-error' : ''}
    `
    : `
      bg-transparent border border-outline rounded-xs
      focus:border-2 focus:border-primary focus:px-[15px]
      ${error ? 'border-error focus:border-error' : ''}
    `;

  const colorClasses = 'text-on-surface';

  const inputClasses = [
    baseInputClasses,
    sizeClasses[inputSize],
    variantClasses,
    colorClasses,
    icon && iconPosition === 'left' ? iconPaddingLeft[inputSize] : '',
    icon && iconPosition === 'right' ? iconPaddingRight[inputSize] : '',
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconSizeClasses[inputSize]} text-on-surface-variant ${iconElement.props.className || ''}`.trim(),
      });
    }
    return iconElement;
  };

  return (
    <div className={fullWidth ? 'w-full' : ''}>
      {label && (
        <label
          htmlFor={inputId}
          className={`block md3-body-small font-medium mb-1 ${error ? 'text-error' : 'text-on-surface-variant'}`}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className={`absolute ${iconPositionClasses[inputSize].left} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
            {renderIcon(icon)}
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          {...props}
        />
        {icon && iconPosition === 'right' && (
          <div className={`absolute ${iconPositionClasses[inputSize].right} top-1/2 transform -translate-y-1/2 pointer-events-none`}>
            {renderIcon(icon)}
          </div>
        )}
      </div>
      {error && (
        <p className="mt-1 md3-body-small text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 md3-body-small text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
