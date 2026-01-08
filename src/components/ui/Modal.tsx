import React, { useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: ModalSize;
  children: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  closeOnEscape?: boolean;
  showCloseButton?: boolean;
  icon?: React.ReactNode;
}

export interface ModalBodyProps {
  children: React.ReactNode;
  className?: string;
}

export interface ModalFooterProps {
  children: React.ReactNode;
  className?: string;
}

const sizeClasses: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  full: 'max-w-full mx-4',
};

export const Modal: React.FC<ModalProps> & {
  Body: typeof ModalBody;
  Footer: typeof ModalFooter;
} = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  className = '',
  closeOnOverlayClick = true,
  closeOnEscape = true,
  showCloseButton = true,
  icon,
}) => {
    const handleEscape = useCallback((e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose();
      }
    }, [closeOnEscape, onClose]);

    useEffect(() => {
      if (isOpen) {
        document.addEventListener('keydown', handleEscape);
        document.body.style.overflow = 'hidden';
      }

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, handleEscape]);

    if (!isOpen) return null;

    const handleOverlayClick = () => {
      if (closeOnOverlayClick) {
        onClose();
      }
    };

    const modalClasses = [
      'inline-block align-bottom',
      'bg-surface-container-high',
      'rounded-xl overflow-hidden',
      'shadow-elevation-3',
      'transform transition-all',
      'sm:my-8 sm:align-middle sm:w-full',
      'md3-animate-scale-in',
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          <div
            className="fixed inset-0 bg-on-surface/32 transition-opacity md3-animate-fade-in"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>

          <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
            {(title || showCloseButton || icon) && (
              <div className="flex items-start justify-between gap-4 p-6">
                <div className="flex items-start gap-4">
                  {icon && (
                    <div className="flex-shrink-0 text-primary">
                      {icon}
                    </div>
                  )}
                  {title && (
                    <h2 className="text-on-surface md3-headline-small">
                      {title}
                    </h2>
                  )}
                </div>
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="flex-shrink-0 p-2 -m-2 text-on-surface-variant hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12] rounded-full transition-colors duration-short3 ease-standard"
                  >
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                )}
              </div>
            )}

            {children}
          </div>
        </div>
      </div>
    );
  };

const ModalBody: React.FC<ModalBodyProps> = ({
  children,
  className = '',
}) => {
  const bodyClasses = [
    'px-6 pb-6',
    'text-on-surface-variant md3-body-medium',
    className,
  ].filter(Boolean).join(' ');
  return <div className={bodyClasses}>{children}</div>;
};

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
}) => {
  const footerClasses = [
    'px-6 pb-6 pt-2',
    'flex flex-row justify-end gap-2',
    className,
  ].filter(Boolean).join(' ');

  return <div className={footerClasses}>{children}</div>;
};

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
