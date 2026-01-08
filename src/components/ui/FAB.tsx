import React from 'react';
import { useRipple } from '../../hooks/useRipple';
import { RippleContainer } from './Ripple';

export type FABVariant = 'surface' | 'primary' | 'secondary' | 'tertiary';
export type FABSize = 'small' | 'medium' | 'large';

export interface FABProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: FABVariant;
  size?: FABSize;
  extended?: boolean;
  label?: string;
  lowered?: boolean;
}

const variantClasses: Record<FABVariant, string> = {
  surface: 'bg-surface-container-high text-primary hover:shadow-elevation-3',
  primary: 'bg-primary-container text-on-primary-container hover:shadow-elevation-3',
  secondary: 'bg-secondary-container text-on-secondary-container hover:shadow-elevation-3',
  tertiary: 'bg-tertiary-container text-on-tertiary-container hover:shadow-elevation-3',
};

const sizeClasses: Record<FABSize, { button: string; icon: string }> = {
  small: {
    button: 'w-10 h-10 rounded-md',
    icon: 'w-5 h-5',
  },
  medium: {
    button: 'w-14 h-14 rounded-lg',
    icon: 'w-6 h-6',
  },
  large: {
    button: 'w-24 h-24 rounded-xl',
    icon: 'w-9 h-9',
  },
};

export const FAB: React.FC<FABProps> = ({
  icon,
  variant = 'primary',
  size = 'medium',
  extended = false,
  label,
  lowered = false,
  disabled,
  className = '',
  onClick,
  ...props
}) => {
  const { ripples, addRipple } = useRipple();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled) {
      addRipple(event);
    }
    onClick?.(event);
  };

  const sizeConfig = sizeClasses[size];

  const baseClasses = [
    'inline-flex items-center justify-center',
    'transition-all duration-short3 ease-standard',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
    'disabled:opacity-[0.38] disabled:cursor-not-allowed disabled:shadow-none',
    'relative overflow-hidden',
    'select-none',
    lowered ? 'shadow-elevation-1' : 'shadow-elevation-3',
    'active:shadow-elevation-1',
  ].join(' ');

  const buttonClasses = extended
    ? [
        baseClasses,
        variantClasses[variant],
        'h-14 px-4 rounded-lg gap-2',
        className,
      ].filter(Boolean).join(' ')
    : [
        baseClasses,
        variantClasses[variant],
        sizeConfig.button,
        className,
      ].filter(Boolean).join(' ');

  const iconClasses = extended ? 'w-6 h-6' : sizeConfig.icon;

  const renderIcon = () => {
    if (React.isValidElement<{ className?: string }>(icon)) {
      return React.cloneElement(icon, {
        className: `${iconClasses} ${icon.props.className || ''}`.trim(),
      });
    }
    return icon;
  };

  return (
    <button
      className={buttonClasses}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      <RippleContainer ripples={ripples} />
      {renderIcon()}
      {extended && label && (
        <span className="font-medium text-sm whitespace-nowrap">{label}</span>
      )}
    </button>
  );
};
