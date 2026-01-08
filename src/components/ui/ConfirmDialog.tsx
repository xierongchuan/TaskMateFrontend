import React from 'react';
import { ExclamationTriangleIcon, TrashIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Modal } from './Modal';
import { Button } from './Button';
import type { ButtonVariant } from './Button';

export type ConfirmDialogVariant = 'danger' | 'warning' | 'info';

export interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message?: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  variant?: ConfirmDialogVariant;
  isLoading?: boolean;
}

const variantConfig: Record<ConfirmDialogVariant, {
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  confirmVariant: ButtonVariant;
}> = {
  danger: {
    icon: TrashIcon,
    iconBg: 'bg-error-container',
    iconColor: 'text-error',
    confirmVariant: 'danger',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-warning-container',
    iconColor: 'text-warning',
    confirmVariant: 'filled',
  },
  info: {
    icon: QuestionMarkCircleIcon,
    iconBg: 'bg-primary-container',
    iconColor: 'text-primary',
    confirmVariant: 'filled',
  },
};

/**
 * MD3 Confirm Dialog with proper styling variants.
 *
 * @example
 * <ConfirmDialog
 *   isOpen={showConfirm}
 *   title="Удалить задачу?"
 *   message="Это действие нельзя отменить"
 *   onConfirm={handleDelete}
 *   onCancel={() => setShowConfirm(false)}
 *   variant="danger"
 * />
 */
export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = 'Подтвердить',
  cancelText = 'Отмена',
  variant = 'danger',
  isLoading = false,
}) => {
  const { icon: Icon, iconBg, iconColor, confirmVariant } = variantConfig[variant];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      size="sm"
      showCloseButton={false}
    >
      <div className="p-6">
        <div className="flex items-start gap-4">
          <div className={`flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full ${iconBg}`}>
            <Icon className={`h-6 w-6 ${iconColor}`} />
          </div>
          <div className="flex-1 text-left">
            <h3 className="md3-headline-small text-on-surface">
              {title}
            </h3>
            {message && (
              <p className="mt-2 md3-body-medium text-on-surface-variant">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal.Footer>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {confirmText}
        </Button>
        <Button
          variant="text"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
