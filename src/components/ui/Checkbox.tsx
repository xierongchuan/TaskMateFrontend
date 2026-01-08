import React from 'react';
import { useRipple } from '../../hooks/useRipple';
import { RippleContainer } from './Ripple';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  description?: string;
  error?: string;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  className = '',
  id,
  disabled,
  onChange,
  ...props
}, ref) => {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;
  const { ripples, addRipple } = useRipple();

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!disabled) {
      addRipple(event);
    }
  };

  return (
    <div className={className}>
      <label
        htmlFor={checkboxId}
        className={`flex items-start cursor-pointer group ${disabled ? 'opacity-[0.38] cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center h-5">
          <div
            className="relative w-10 h-10 flex items-center justify-center -m-[11px] rounded-full overflow-hidden select-none"
            onClick={handleContainerClick}
          >
            <RippleContainer ripples={ripples} />
            {/* Hover state layer */}
            <div className="absolute inset-0 rounded-full bg-on-surface opacity-0 group-hover:opacity-[0.08] transition-opacity duration-short3 ease-standard" />
            <input
              ref={ref}
              type="checkbox"
              id={checkboxId}
              disabled={disabled}
              className="peer sr-only"
              onChange={onChange}
              {...props}
            />
            {/* Checkbox box */}
            <div className={`
              relative w-[18px] h-[18px] rounded-xs border-2
              transition-all duration-short3 ease-standard
              ${error ? 'border-error' : 'border-on-surface-variant'}
              peer-checked:bg-primary peer-checked:border-primary
              peer-focus-visible:ring-2 peer-focus-visible:ring-primary peer-focus-visible:ring-offset-2
              group-hover:border-on-surface
              peer-disabled:opacity-[0.38] peer-disabled:cursor-not-allowed
              flex items-center justify-center
              overflow-hidden
            `}>
              {/* Checkmark SVG with animation */}
              <svg
                className="absolute w-3 h-3 text-on-primary transform scale-0 peer-checked:scale-100 transition-transform duration-short3 ease-emphasized"
                viewBox="0 0 12 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M2 6l3 3 5-6" />
              </svg>
            </div>
          </div>
        </div>
        {(label || description) && (
          <div className="ml-3">
            {label && (
              <span className="text-sm font-medium text-on-surface group-hover:text-on-surface transition-colors duration-short3 ease-standard">
                {label}
              </span>
            )}
            {description && (
              <p className="text-xs text-on-surface-variant mt-0.5">
                {description}
              </p>
            )}
          </div>
        )}
      </label>
      {error && (
        <p className="mt-1.5 text-xs text-error ml-[30px] flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';
