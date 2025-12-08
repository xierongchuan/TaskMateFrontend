import React, { useState } from 'react';
import type { Dealership } from '../types/dealership';
import { DealershipForm } from '../components/dealerships/DealershipForm';
import { DealershipList } from '../components/dealerships/DealershipList';
import { PlusIcon, XMarkIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';
import { usePermissions } from '../hooks/usePermissions';

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
    <div className="max-w-7xl mx-auto px-4 py-6 sm:px-0">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <BuildingOfficeIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Автосалоны</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Управление автосалонами вашей компании
                </p>
              </div>
            </div>
          </div>
          {canManageDealerships && (
            <button
              onClick={handleCreateDealership}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Создать автосалон
            </button>
          )}
        </div>
      </div>

      {/* Form View */}
      {isFormOpen && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {editingDealership ? 'Редактировать автосалон' : 'Создать новый автосалон'}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {editingDealership
                    ? 'Обновите информацию об автосалоне'
                    : 'Заполните информацию о новом автосалоне'
                  }
                </p>
              </div>
              <button
                onClick={handleFormClose}
                className="inline-flex items-center p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-6">
            <DealershipForm
              dealership={editingDealership}
              onSuccess={handleFormSuccess}
              onCancel={handleFormClose}
            />
          </div>
        </div>
      )}

      {/* List View */}
      <DealershipList onEdit={handleEditDealership} />
    </div>
  );
};
