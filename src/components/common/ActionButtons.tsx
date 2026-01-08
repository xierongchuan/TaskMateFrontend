import React from 'react';
import { IconButton } from '../ui/IconButton';
import {
  PencilIcon,
  TrashIcon,
  DocumentDuplicateIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';

export interface ActionButtonsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onView?: () => void;
  isDeleting?: boolean;
  showEdit?: boolean;
  showDelete?: boolean;
  showDuplicate?: boolean;
  showView?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Группа кнопок действий для карточек (редактировать, удалить, дублировать, просмотр).
 *
 * @example
 * <ActionButtons
 *   onEdit={() => handleEdit(item)}
 *   onDelete={() => handleDelete(item)}
 *   onDuplicate={() => handleDuplicate(item)}
 *   isDeleting={deleteMutation.isPending}
 * />
 */
export const ActionButtons: React.FC<ActionButtonsProps> = ({
  onEdit,
  onDelete,
  onDuplicate,
  onView,
  isDeleting = false,
  showEdit = true,
  showDelete = true,
  showDuplicate = false,
  showView = false,
  size = 'md',
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {showView && onView && (
        <IconButton
          icon={<EyeIcon />}
          variant="standard"
          size={size}
          onClick={onView}
          tooltip="Просмотр"
        />
      )}
      {showEdit && onEdit && (
        <IconButton
          icon={<PencilIcon />}
          variant="standard"
          size={size}
          onClick={onEdit}
          tooltip="Редактировать"
        />
      )}
      {showDuplicate && onDuplicate && (
        <IconButton
          icon={<DocumentDuplicateIcon />}
          variant="tonal"
          size={size}
          onClick={onDuplicate}
          tooltip="Дублировать"
        />
      )}
      {showDelete && onDelete && (
        <IconButton
          icon={<TrashIcon />}
          variant="standard"
          size={size}
          onClick={onDelete}
          disabled={isDeleting}
          isLoading={isDeleting}
          tooltip="Удалить"
          className="text-error hover:bg-error/[0.08]"
        />
      )}
    </div>
  );
};
