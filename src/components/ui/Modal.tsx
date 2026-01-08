import React, { useEffect, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { IconButton } from './IconButton';

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

/**
 * Material Design 3 Dialog component.
 * Features MD3 styling with proper animations, scrim, and elevation.
 *
 * @example
 * <Modal isOpen={isOpen} onClose={onClose} title="Создать задачу" size="lg">
 *   <Modal.Body>
 *     <form>...</form>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="text" onClick={onClose}>Отмена</Button>
 *     <Button variant="filled">Сохранить</Button>
 *   </Modal.Footer>
 * </Modal>
 */
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
}) => {
    // Handle escape key
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
      'inline-block align-bottom bg-surface-container-high rounded-xl text-left overflow-hidden shadow-elevation-3 transform transition-all sm:my-8 sm:align-middle sm:w-full md3-animate-scale-in',
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Scrim */}
          <div
            className="fixed inset-0 bg-scrim/32 backdrop-blur-[1px] transition-opacity md3-animate-fade-in"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Centering trick */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>

          {/* Dialog */}
          <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-6">
                {title && (
                  <h3 className="md3-headline-small text-on-surface">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <IconButton
                    icon={<XMarkIcon />}
                    variant="standard"
                    size="sm"
                    onClick={onClose}
                    tooltip="Закрыть"
                    className="-mr-2"
                  />
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
  const bodyClasses = ['px-6 pb-6', className].filter(Boolean).join(' ');
  return <div className={bodyClasses}>{children}</div>;
};

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
}) => {
  const footerClasses = [
    'px-6 py-4 flex justify-end gap-2',
    className,
  ].filter(Boolean).join(' ');

  return <div className={footerClasses}>{children}</div>;
};

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
