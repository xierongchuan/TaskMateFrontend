import React from 'react';

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

const sizeClasses: Record<InputSize, string> = {
  sm: 'h-10 text-sm',
  md: 'h-14 text-base',
  lg: 'h-16 text-lg',
};

const labelSizeClasses: Record<InputSize, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
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
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseContainerClasses = [
    'relative',
    'rounded-xs',
    'transition-all duration-short3 ease-standard',
    fullWidth ? 'w-full' : '',
  ].join(' ');

  const inputBaseClasses = [
    'w-full rounded-xs',
    'text-on-surface',
    'placeholder:text-on-surface-variant',
    'transition-all duration-short3 ease-standard',
    'focus:outline-none',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed',
    sizeClasses[inputSize],
    icon ? 'pl-12' : 'pl-4',
    trailingIcon ? 'pr-12' : 'pr-4',
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
    labelSizeClasses[inputSize],
    error ? 'text-error' : 'text-on-surface-variant',
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
      {label && (
        <label htmlFor={inputId} className={labelClasses}>
          {label}
        </label>
      )}
      <div className={baseContainerClasses}>
        {renderIcon(icon, 'left')}
        <input
          ref={ref}
          id={inputId}
          disabled={disabled}
          className={`${inputBaseClasses} ${variantClasses}`}
          {...props}
        />
        {renderIcon(trailingIcon, 'right')}
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

Input.displayName = 'Input';
