import React from 'react';

/**
 * MD3 IconButton variants:
 * - standard: No background, used for less prominent actions
 * - filled: Filled background with primary color
 * - tonal: Secondary container background
 * - outlined: Border with no background
 */
export type IconButtonVariant = 'standard' | 'filled' | 'tonal' | 'outlined';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  tooltip?: string;
  isLoading?: boolean;
  selected?: boolean;
}

const variantClasses: Record<IconButtonVariant, { default: string; selected: string }> = {
  standard: {
    default: `
      text-on-surface-variant
      hover:bg-on-surface-variant/[0.08]
      active:bg-on-surface-variant/[0.12]
    `,
    selected: `
      text-primary
      hover:bg-primary/[0.08]
      active:bg-primary/[0.12]
    `,
  },
  filled: {
    default: `
      bg-primary text-on-primary
      hover:shadow-elevation-1
      active:shadow-elevation-0
    `,
    selected: `
      bg-primary text-on-primary
      hover:shadow-elevation-1
      active:shadow-elevation-0
    `,
  },
  tonal: {
    default: `
      bg-secondary-container text-on-secondary-container
      hover:shadow-elevation-1
      active:shadow-elevation-0
    `,
    selected: `
      bg-secondary-container text-on-secondary-container
      hover:shadow-elevation-1
      active:shadow-elevation-0
    `,
  },
  outlined: {
    default: `
      border border-outline text-on-surface-variant
      hover:bg-on-surface/[0.08]
      active:bg-on-surface/[0.12]
    `,
    selected: `
      border border-outline bg-inverse-surface text-inverse-on-surface
      hover:shadow-elevation-1
    `,
  },
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

/**
 * Material Design 3 IconButton component.
 * Supports standard, filled, tonal, and outlined variants.
 *
 * @example
 * <IconButton icon={<PencilIcon />} variant="standard" tooltip="Редактировать" />
 * <IconButton icon={<TrashIcon />} variant="tonal" tooltip="Удалить" />
 */
export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  variant = 'standard',
  size = 'md',
  tooltip,
  isLoading = false,
  selected = false,
  disabled,
  className = '',
  ...props
}) => {
  const baseClasses = `
    inline-flex items-center justify-center
    rounded-full
    transition-all duration-short3 ease-standard
    focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary
    disabled:opacity-38 disabled:cursor-not-allowed disabled:shadow-none
    md3-state-layer md3-ripple
  `;

  const variantClass = selected
    ? variantClasses[variant].selected
    : variantClasses[variant].default;

  const classes = [
    baseClasses,
    variantClass,
    sizeClasses[size],
    className,
  ].filter(Boolean).join(' ').replace(/\s+/g, ' ').trim();

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
      {...props}
    >
      {renderIcon()}
    </button>
  );
};
