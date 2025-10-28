import React, { useState } from 'react';
import { useCreateDealership, useUpdateDealership } from '../../hooks/useDealerships';
import type { Dealership } from '../../types/dealership';

interface DealershipFormProps {
  dealership?: Dealership;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const DealershipForm: React.FC<DealershipFormProps> = ({
  dealership,
  onSuccess,
  onCancel
}) => {
  const [formData, setFormData] = useState({
    name: dealership?.name || '',
    address: dealership?.address || '',
    phone: dealership?.phone || '',
  });

  const createDealership = useCreateDealership();
  const updateDealership = useUpdateDealership();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (dealership) {
        // Обновление существующего автосалона
        await updateDealership.mutateAsync({
          id: dealership.id,
          data: {
            name: formData.name,
            address: formData.address || undefined,
            phone: formData.phone || undefined,
          },
        });
      } else {
        // Создание нового автосалона
        await createDealership.mutateAsync({
          name: formData.name,
          address: formData.address || undefined,
          phone: formData.phone || undefined,
        });
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving dealership:', error);
      alert(error.response?.data?.message || 'Ошибка сохранения автосалона');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="dealership-form">
      <div className="form-group">
        <label>Название *</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          minLength={2}
          placeholder="Название автосалона"
        />
      </div>

      <div className="form-group">
        <label>Адрес</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Адрес автосалона"
        />
      </div>

      <div className="form-group">
        <label>Телефон</label>
        <input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+79001234567"
        />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={createDealership.isPending || updateDealership.isPending}>
          {createDealership.isPending || updateDealership.isPending
            ? 'Сохранение...'
            : dealership
              ? 'Сохранить изменения'
              : 'Создать автосалон'
          }
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};