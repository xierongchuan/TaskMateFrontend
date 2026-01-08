import React from 'react';

export type CardVariant = 'elevated' | 'filled' | 'outlined';

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
  variant?: CardVariant;
}

export interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

export interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
  border?: boolean;
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-5',
  lg: 'p-6',
};

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-surface-container-low shadow-elevation-1',
  filled: 'bg-surface-container-highest',
  outlined: 'bg-surface border border-outline-variant',
};

export const Card: React.FC<CardProps> & {
  Header: typeof CardHeader;
  Body: typeof CardBody;
  Footer: typeof CardFooter;
} = ({
  children,
  className = '',
  hover = false,
  padding = 'none',
  variant = 'elevated',
}) => {
    const cardClasses = [
      'rounded-md overflow-hidden',
      'transition-all duration-short3 ease-standard',
      variantClasses[variant],
      paddingClasses[padding],
      hover ? 'hover:shadow-elevation-2 cursor-pointer' : '',
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className={cardClasses}>
        {children}
      </div>
    );
  };

const CardHeader: React.FC<CardHeaderProps> = ({
  children,
  className = '',
  border = false,
}) => {
  const headerClasses = [
    'p-4 sm:p-5',
    border ? 'border-b border-outline-variant' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={headerClasses}>{children}</div>;
};

const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  const bodyClasses = ['p-4 sm:p-5', className].filter(Boolean).join(' ');
  return <div className={bodyClasses}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  border = false,
}) => {
  const footerClasses = [
    'p-4 sm:p-5',
    border ? 'border-t border-outline-variant' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={footerClasses}>{children}</div>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
