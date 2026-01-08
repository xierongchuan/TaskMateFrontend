import React from 'react';

/**
 * MD3 Card variants:
 * - elevated: Default card with shadow
 * - filled: Card with surface container color
 * - outlined: Card with border outline
 */
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
  md: 'p-6',
  lg: 'p-8',
};

const variantClasses: Record<CardVariant, string> = {
  elevated: 'bg-surface shadow-elevation-1 hover:shadow-elevation-2',
  filled: 'bg-surface-container-highest',
  outlined: 'bg-surface border border-outline-variant',
};

/**
 * Material Design 3 Card component.
 * Supports elevated, filled, and outlined variants per MD3 spec.
 *
 * @example
 * <Card variant="elevated" hover>
 *   <Card.Header>Заголовок</Card.Header>
 *   <Card.Body>Контент</Card.Body>
 *   <Card.Footer>Действия</Card.Footer>
 * </Card>
 */
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
      'rounded-md transition-all duration-medium2 ease-standard overflow-hidden',
      variantClasses[variant],
      paddingClasses[padding],
      hover ? 'cursor-pointer' : '',
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
  border = true,
}) => {
  const headerClasses = [
    'p-4 sm:p-6',
    border ? 'border-b border-outline-variant' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={headerClasses}>{children}</div>;
};

const CardBody: React.FC<CardBodyProps> = ({
  children,
  className = '',
}) => {
  const bodyClasses = ['p-4 sm:p-6', className].filter(Boolean).join(' ');
  return <div className={bodyClasses}>{children}</div>;
};

const CardFooter: React.FC<CardFooterProps> = ({
  children,
  className = '',
  border = true,
}) => {
  const footerClasses = [
    'p-4 sm:p-6',
    border ? 'border-t border-outline-variant' : '',
    className,
  ].filter(Boolean).join(' ');

  return <div className={footerClasses}>{children}</div>;
};

Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;
