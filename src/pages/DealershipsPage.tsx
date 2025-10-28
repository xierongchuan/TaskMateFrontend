import React, { useState } from 'react';
import type { Dealership } from '../types/dealership';
import { DealershipForm } from '../components/dealerships/DealershipForm';
import { DealershipList } from '../components/dealerships/DealershipList';

export const DealershipsPage: React.FC = () => {
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
    <div className="dealerships-page">
      <div className="page-header">
        <h1>Автосалоны</h1>
        <button
          onClick={handleCreateDealership}
          className="create-button"
        >
          + Создать автосалон
        </button>
      </div>

      {isFormOpen ? (
        <div className="form-container">
          <div className="form-header">
            <h2>
              {editingDealership ? 'Редактировать автосалон' : 'Создать автосалон'}
            </h2>
            <button onClick={handleFormClose} className="close-button">
              ×
            </button>
          </div>
          <DealershipForm
            dealership={editingDealership}
            onSuccess={handleFormSuccess}
            onCancel={handleFormClose}
          />
        </div>
      ) : (
        <DealershipList onEdit={handleEditDealership} />
      )}
    </div>
  );
};