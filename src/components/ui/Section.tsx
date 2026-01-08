import React from 'react';

export interface SectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
}

/**
 * MD3 Section component with header and content areas.
 *
 * @example
 * <Section title="Активные смены" icon={<UserIcon />}>
 *   {content}
 * </Section>
 */
export const Section: React.FC<SectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  action,
  className = '',
}) => {
  const containerClasses = [
    'bg-surface-container rounded-xl shadow-elevation-1 border border-outline-variant',
    'transition-colors duration-medium2',
    className,
  ].filter(Boolean).join(' ');

  const iconClasses = 'w-6 h-6';

  const renderIcon = (iconElement: React.ReactNode) => {
    if (React.isValidElement<{ className?: string }>(iconElement)) {
      return React.cloneElement(iconElement, {
        className: `${iconClasses} mr-3 text-on-surface-variant ${iconElement.props.className || ''}`.trim(),
      });
    }
    return iconElement;
  };

  return (
    <div className={containerClasses}>
      <div className="p-4 sm:p-6 border-b border-outline-variant">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            {icon && renderIcon(icon)}
            <div>
              <h2 className="md3-title-large text-on-surface">
                {title}
              </h2>
              {subtitle && (
                <p className="md3-body-small text-on-surface-variant mt-0.5">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      </div>
      <div className="p-4 sm:p-6">
        {children}
      </div>
    </div>
  );
};
