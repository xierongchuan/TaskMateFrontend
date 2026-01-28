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
 * Универсальный компонент модального окна.
 *
 * @example
 * <Modal isOpen={isOpen} onClose={onClose} title="Создать задачу" size="lg">
 *   <Modal.Body>
 *     <form>...</form>
 *   </Modal.Body>
 *   <Modal.Footer>
 *     <Button variant="secondary" onClick={onClose}>Отмена</Button>
 *     <Button variant="primary">Сохранить</Button>
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
      'inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:w-full',
      sizeClasses[size],
      className,
    ].filter(Boolean).join(' ');

    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity"
            onClick={handleOverlayClick}
            aria-hidden="true"
          />

          {/* Centering trick */}
          <span className="hidden sm:inline-block sm:h-screen sm:align-middle" aria-hidden="true">
            &#8203;
          </span>

          {/* Modal */}
          <div className={modalClasses} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700">
                {title && (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <XMarkIcon className="w-5 h-5" />
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
  const bodyClasses = ['p-4 sm:p-6', className].filter(Boolean).join(' ');
  return <div className={bodyClasses}>{children}</div>;
};

const ModalFooter: React.FC<ModalFooterProps> = ({
  children,
  className = '',
}) => {
  const footerClasses = [
    'bg-gray-50 dark:bg-gray-700/50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse sm:gap-3 rounded-b-2xl',
    className,
  ].filter(Boolean).join(' ');

  return <div className={footerClasses}>{children}</div>;
};

Modal.Body = ModalBody;
Modal.Footer = ModalFooter;
