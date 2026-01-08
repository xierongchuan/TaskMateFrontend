import React from 'react';

/**
 * MD3 Button variants:
 * - filled: High emphasis, primary actions
 * - outlined: Medium emphasis, secondary actions
 * - text: Low emphasis, tertiary actions
 * - elevated: Medium emphasis with elevation
 * - tonal: Medium-low emphasis with container color
 * - danger: High emphasis for destructive actions (custom extension)
 */
export type ButtonVariant = 'filled' | 'outlined' | 'text' | 'elevated' | 'tonal' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  filled: `
    bg-primary text-on-primary
    hover:shadow-elevation-1
    active:shadow-elevation-0
    disabled:bg-on-surface/[0.12] disabled:text-on-surface/[0.38]
  `,
  outlined: `
    bg-transparent text-primary border border-outline
    hover:bg-primary/[0.08]
    active:bg-primary/[0.12]
    disabled:border-on-surface/[0.12] disabled:text-on-surface/[0.38]
  `,
  text: `
    bg-transparent text-primary
    hover:bg-primary/[0.08]
    active:bg-primary/[0.12]
    disabled:text-on-surface/[0.38]
  `,
  elevated: `
    bg-surface-container-low text-primary shadow-elevation-1
    hover:shadow-elevation-2
    active:shadow-elevation-1
    disabled:bg-on-surface/[0.12] disabled:text-on-surface/[0.38] disabled:shadow-elevation-0
  `,
  tonal: `
    bg-secondary-container text-on-secondary-container
    hover:shadow-elevation-1
    active:shadow-elevation-0
    disabled:bg-on-surface/[0.12] disabled:text-on-surface/[0.38]
  `,
  danger: `
    bg-error text-on-error
    hover:shadow-elevation-1
    active:shadow-elevation-0
    disabled:bg-on-surface/[0.12] disabled:text-on-surface/[0.38]
  `,
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-4 text-xs gap-1.5',
  md: 'h-10 px-6 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2.5',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-[18px] h-[18px]',
  lg: 'w-5 h-5',
};

/**
 * Material Design 3 Button component.
 * Supports filled, outlined, text, elevated, tonal, and danger variants.
 *
 * @example
 * <Button variant="filled" size="md" icon={<PlusIcon />}>
 *   Создать задачу
 * </Button>
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  disabled,
  className = '',
  children,
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    font-medium rounded-full
    transition-all duration-short3 ease-standard
    focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
    disabled:cursor-not-allowed
    md3-state-layer md3-ripple
  `;

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

  const iconClasses = iconSizeClasses[size];

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconClasses} ${iconElement.props.className || ''}`.trim(),
      });
    }
    return iconElement;
  };

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className={`animate-spin ${iconClasses}`}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      {!isLoading && icon && iconPosition === 'left' && renderIcon(icon)}
      {children}
      {!isLoading && icon && iconPosition === 'right' && renderIcon(icon)}
    </button>
  );
};
