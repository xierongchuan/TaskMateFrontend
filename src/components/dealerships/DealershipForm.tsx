import React, { useState } from 'react';
import { useCreateDealership, useUpdateDealership } from '../../hooks/useDealerships';
import type { Dealership } from '../../types/dealership';
import { BuildingOfficeIcon, PhoneIcon, MapPinIcon } from '@heroicons/react/24/outline';
import { sanitizePhoneNumber } from '../../utils/phoneFormatter';

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

  const [errors, setErrors] = useState<Record<string, string>>({});

  const createDealership = useCreateDealership();
  const updateDealership = useUpdateDealership();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Название обязательно для заполнения';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Название должно содержать минимум 2 символа';
    }

    if (formData.phone && formData.phone.trim()) {
      // More flexible validation: just check if it has + at the start and contains digits
      const phonePattern = /^\+?[0-9\s()\-\.]+$/;
      if (!phonePattern.test(formData.phone)) {
        newErrors.phone = 'Введите корректный номер телефона';
      } else {
        // Check sanitized version has minimum length
        const sanitized = sanitizePhoneNumber(formData.phone);
        if (sanitized.length < 8 || sanitized.length > 20) {
          newErrors.phone = 'Номер телефона должен содержать от 8 до 20 цифр';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      // Sanitize phone number before sending
      const sanitizedPhone = formData.phone.trim()
        ? sanitizePhoneNumber(formData.phone)
        : undefined;

      if (dealership) {
        // Обновление существующего автосалона
        await updateDealership.mutateAsync({
          id: dealership.id,
          data: {
            name: formData.name.trim(),
            address: formData.address.trim() || undefined,
            phone: sanitizedPhone,
          },
        });
      } else {
        // Создание нового автосалона
        await createDealership.mutateAsync({
          name: formData.name.trim(),
          address: formData.address.trim() || undefined,
          phone: sanitizedPhone,
        });
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Error saving dealership:', error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          general: error.response?.data?.message || 'Ошибка сохранения автосалона'
        });
      }
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {errors.general && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4">
          <p className="text-sm text-red-800">{errors.general}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Название автосалона <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <BuildingOfficeIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              required
              minLength={2}
              placeholder="Например: Автомир Premium"
              className={`block w-full rounded-lg border ${errors.name ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 pr-3 py-2 ${errors.name ? 'focus:border-red-500 focus:ring-red-500' : ''
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            />
          </div>
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Адрес
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPinIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              placeholder="Например: г. Москва, ул. Ленинградская, д. 15"
              className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 pr-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Необязательно для заполнения
          </p>
        </div>

        {/* Phone Field */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Телефон
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <PhoneIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              placeholder="+998 99 495 85 14"
              className={`block w-full rounded-lg border ${errors.phone ? 'border-red-300' : 'border-gray-300 dark:border-gray-600'
                } shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 pr-3 py-2 ${errors.phone ? 'focus:border-red-500 focus:ring-red-500' : ''
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
            />
          </div>
          {errors.phone && (
            <p className="mt-2 text-sm text-red-600">{errors.phone}</p>
          )}
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Необязательно для заполнения
          </p>
        </div>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
        <button
          type="submit"
          disabled={createDealership.isPending || updateDealership.isPending}
          className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {createDealership.isPending || updateDealership.isPending ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Сохранение...
            </>
          ) : (
            <>
              {dealership ? 'Сохранить изменения' : 'Создать автосалон'}
            </>
          )}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
          >
            Отмена
          </button>
        )}
      </div>
    </form>
  );
};
