import React, { useState } from 'react';
import type { TaskResponse } from '../../types/task';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Textarea } from '../ui/Textarea';

export interface VerificationPanelProps {
  response: TaskResponse;
  onApprove: (responseId: number) => Promise<void>;
  onReject: (responseId: number, reason: string) => Promise<void>;
  isLoading?: boolean;
}

export const VerificationPanel: React.FC<VerificationPanelProps> = ({
  response,
  onApprove,
  onReject,
  isLoading = false,
}) => {
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);
  const [approving, setApproving] = useState(false);

  // Only show for pending_review status
  if (response.status !== 'pending_review') {
    // Show verification status if already verified
    if (response.verified_at) {
      return (
        <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              Одобрено
            </span>
          </div>
          {response.verifier && (
            <p className="mt-1 text-xs text-green-700 dark:text-green-300">
              Проверил: {response.verifier.full_name}
            </p>
          )}
          {response.verified_at && (
            <p className="text-xs text-green-600 dark:text-green-400">
              {new Date(response.verified_at).toLocaleString('ru-RU')}
            </p>
          )}
        </div>
      );
    }

    // Show rejection reason if rejected
    if (response.rejection_reason) {
      return (
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium text-red-800 dark:text-red-200">
              Отклонено
            </span>
          </div>
          <p className="mt-2 text-sm text-red-700 dark:text-red-300">
            Причина: {response.rejection_reason}
          </p>
          {response.verifier && (
            <p className="mt-1 text-xs text-red-600 dark:text-red-400">
              Отклонил: {response.verifier.full_name}
            </p>
          )}
        </div>
      );
    }

    return null;
  }

  const handleApprove = async () => {
    setApproving(true);
    try {
      await onApprove(response.id);
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setRejecting(true);
    try {
      await onReject(response.id, rejectReason.trim());
      setShowRejectModal(false);
      setRejectReason('');
    } finally {
      setRejecting(false);
    }
  };

  return (
    <>
      <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
        <div className="flex items-center gap-2 mb-3">
          <svg className="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
            Ожидает проверки
          </span>
        </div>

        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={handleApprove}
            disabled={isLoading || approving || rejecting}
            isLoading={approving}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Одобрить
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => setShowRejectModal(true)}
            disabled={isLoading || approving || rejecting}
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Отклонить
          </Button>
        </div>
      </div>

      {/* Reject Modal */}
      <Modal
        isOpen={showRejectModal}
        onClose={() => {
          setShowRejectModal(false);
          setRejectReason('');
        }}
        title="Отклонить доказательство"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Укажите причину отклонения. Сотрудник сможет загрузить новые доказательства.
          </p>
          <Textarea
            label="Причина отклонения"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Например: Фото нечёткое, необходимо загрузить более качественное изображение"
            rows={3}
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                setShowRejectModal(false);
                setRejectReason('');
              }}
              disabled={rejecting}
            >
              Отмена
            </Button>
            <Button
              variant="danger"
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejecting}
              isLoading={rejecting}
            >
              Отклонить
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default VerificationPanel;
