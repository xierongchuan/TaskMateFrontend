import React from 'react';
import { useRipple } from '../../hooks/useRipple';
import { RippleContainer } from './Ripple';

export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  tooltip?: string;
  isLoading?: boolean;
  selected?: boolean;
  disableRipple?: boolean;
}

const variantClasses: Record<IconButtonVariant, string> = {
  standard: 'text-on-surface-variant hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]',
  filled: 'bg-primary text-on-primary hover:shadow-elevation-1 active:shadow-elevation-0',
  tonal: 'bg-secondary-container text-on-secondary-container hover:shadow-elevation-1 active:shadow-elevation-0',
  outlined: 'text-on-surface-variant border border-outline hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12]',
};

const selectedVariantClasses: Record<IconButtonVariant, string> = {
  standard: 'text-primary bg-primary/[0.12]',
  filled: 'bg-primary text-on-primary',
  tonal: 'bg-secondary-container text-on-secondary-container',
  outlined: 'text-primary bg-primary/[0.12] border-primary',
};

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
};

const iconSizeClasses: Record<IconButtonSize, string> = {
  sm: 'w-4 h-4',
  md: 'w-5 h-5',
  lg: 'w-6 h-6',
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'standard',
  size = 'md',
  tooltip,
  isLoading = false,
  selected = false,
  disabled,
  disableRipple = false,
  className = '',
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
    'rounded-full',
    'transition-all duration-short3 ease-standard',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed disabled:shadow-none',
    'relative overflow-hidden',
    'select-none',
  ].join(' ');

  const classes = [
    baseClasses,
    sizeClasses[size],
    selected ? selectedVariantClasses[variant] : variantClasses[variant],
    className,
  ].filter(Boolean).join(' ');

  const iconClasses = iconSizeClasses[size];

  const renderIcon = () => {
    if (isLoading) {
      return (
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
      );
    }

    if (React.isValidElement<{ className?: string }>(icon)) {
      return React.cloneElement(icon, {
        className: `${iconClasses} ${icon.props.className || ''}`.trim(),
      });
    }
    return icon;
  };

  return (
    <button
      className={classes}
      disabled={disabled || isLoading}
      title={tooltip}
      onClick={handleClick}
      {...props}
    >
      {!disableRipple && <RippleContainer ripples={ripples} />}
      {renderIcon()}
    </button>
  );
};
