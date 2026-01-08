import React, { useState } from 'react';
import type { Dealership } from '../types/dealership';
import { DealershipForm } from '../components/dealerships/DealershipForm';
import { DealershipList } from '../components/dealerships/DealershipList';
import { PlusIcon, XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { usePermissions } from '../hooks/usePermissions';

// UI Components
import { PageContainer, Card, Button } from '../components/ui';

export const DealershipsPage: React.FC = () => {
  const { canManageDealerships } = usePermissions();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDealership, setEditingDealership] = useState<Dealership | undefined>();

  const handleCreateDealership = () => {
    setEditingDealership(undefined);
    setIsFormOpen(true);
  };

  const handleEditDealership = (dealership: Dealership) => {
    setEditingDealership(dealership);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingDealership(undefined);
  };

  const handleFormSuccess = () => {
    setIsFormOpen(false);
    setEditingDealership(undefined);
  };

  return (
    <PageContainer>
      {/* Page Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0 w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
            <BuildingOfficeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Автосалоны</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Управление автосалонами вашей компании
            </p>
          </div>
        </div>
        {canManageDealerships && (
          <Button
            variant="primary"
            icon={<PlusIcon />}
            onClick={handleCreateDealership}
          >
            Создать автосалон
          </Button>
        )}
      </div>

      {/* Form View */}
      {isFormOpen && (
        <Card className="mb-8">
          <Card.Header>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {editingDealership ? 'Редактировать автосалон' : 'Создать новый автосалон'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {editingDealership
                    ? 'Обновите информацию об автосалоне'
                    : 'Заполните информацию о новом автосалоне'
                  }
                </p>
              </div>
              <button
                onClick={handleFormClose}
                className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </Card.Header>
          <Card.Body>
            <DealershipForm
              dealership={editingDealership}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </Card.Body>
        </Card>
      )}

      {/* List View */}
      <DealershipList onEdit={handleEditDealership} />
    </PageContainer>
  );
};
