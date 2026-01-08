import React from 'react';
import { ExclamationTriangleIcon, TrashIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/outline';
import { Modal } from './Modal';
import { Button } from './Button';

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
  confirmVariant: 'danger' | 'filled';
}> = {
  danger: {
    icon: TrashIcon,
    iconBg: 'bg-error-container',
    iconColor: 'text-on-error-container',
    confirmVariant: 'danger',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    iconBg: 'bg-tertiary-container',
    iconColor: 'text-on-tertiary-container',
    confirmVariant: 'filled',
  },
  info: {
    icon: QuestionMarkCircleIcon,
    iconBg: 'bg-primary-container',
    iconColor: 'text-on-primary-container',
    confirmVariant: 'filled',
  },
};

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
          <div className="text-left flex-1">
            <h3 className="text-on-surface md3-title-large">
              {title}
            </h3>
            {message && (
              <p className="mt-2 text-on-surface-variant md3-body-medium">
                {message}
              </p>
            )}
          </div>
        </div>
      </div>
      <Modal.Footer>
        <Button
          variant="text"
          onClick={onCancel}
          disabled={isLoading}
        >
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          onClick={onConfirm}
          isLoading={isLoading}
          disabled={isLoading}
        >
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
