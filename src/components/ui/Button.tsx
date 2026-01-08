import React from 'react';
import { useRipple } from '../../hooks/useRipple';
import { RippleContainer } from './Ripple';

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
  disableRipple?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  filled: 'bg-primary text-on-primary hover:shadow-elevation-1 active:shadow-elevation-0',
  outlined: 'bg-transparent text-primary border border-outline hover:bg-primary/[0.08] active:bg-primary/[0.12]',
  text: 'bg-transparent text-primary hover:bg-primary/[0.08] active:bg-primary/[0.12]',
  elevated: 'bg-surface-container-low text-primary shadow-elevation-1 hover:shadow-elevation-2 active:shadow-elevation-1',
  tonal: 'bg-secondary-container text-on-secondary-container hover:shadow-elevation-1 active:shadow-elevation-0',
  danger: 'bg-error text-on-error hover:shadow-elevation-1 active:shadow-elevation-0',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-6 text-sm gap-2',
  lg: 'h-12 px-8 text-base gap-2.5',
};

const iconSizeClasses: Record<ButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-[18px] h-[18px]',
  lg: 'w-5 h-5',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'filled',
  size = 'md',
  icon,
  iconPosition = 'left',
  isLoading = false,
  fullWidth = false,
  disabled,
  disableRipple = false,
  className = '',
  children,
  onClick,
  ...props
}) => {
  const { ripples, addRipple } = useRipple();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !disableRipple) {
      addRipple(event);
    }
    onClick?.(event);
  };

  const baseClasses = [
    'inline-flex items-center justify-center',
    'font-medium rounded-full',
    'transition-all duration-short3 ease-standard',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed disabled:shadow-none',
    'relative overflow-hidden',
    'select-none',
  ].join(' ');

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

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
      onClick={handleClick}
      {...props}
    >
      {!disableRipple && <RippleContainer ripples={ripples} />}
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
      {children && <span>{children}</span>}
      {!isLoading && icon && iconPosition === 'right' && renderIcon(icon)}
    </button>
  );
};
