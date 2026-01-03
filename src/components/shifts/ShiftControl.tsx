import React, { useState, useEffect } from 'react';
import { useMyCurrentShift, useCreateShift, useUpdateShift } from '../../hooks/useShifts';
import { useAuth } from '../../hooks/useAuth';
import { usePermissions } from '../../hooks/usePermissions';
import { CameraIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import { DealershipSelector } from '../common/DealershipSelector';
import type { CreateShiftRequest, UpdateShiftRequest } from '../../types/shift';

export const ShiftControl: React.FC = () => {
  const { user } = useAuth();
  const { canWorkShifts } = usePermissions();
  const [selectedDealershipId, setSelectedDealershipId] = useState<number | undefined>(undefined);

  // Initialize selectedDealershipId with user's primary dealership
  useEffect(() => {
    if (user?.dealership_id && selectedDealershipId === undefined) {
      setSelectedDealershipId(user.dealership_id);
    }
  }, [user, selectedDealershipId]);

  const { data: currentShiftData } = useMyCurrentShift(selectedDealershipId);
  const currentShift = currentShiftData?.data;
  const createShiftMutation = useCreateShift();
  const updateShiftMutation = useUpdateShift();

  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [closingPhoto, setClosingPhoto] = useState<File | null>(null);

  const handleOpenShift = async () => {
    if (!openingPhoto || !selectedDealershipId) {
      alert('Необходимо выбрать фото открытия смены и автосалон');
      return;
    }

    const shiftData: CreateShiftRequest = {
      user_id: user!.id,
      dealership_id: selectedDealershipId,
      opening_photo: openingPhoto,
    };

    createShiftMutation.mutate(shiftData, {
      onSuccess: () => {
        setOpeningPhoto(null);
        alert('Смена успешно открыта!');
      },
      onError: (error: any) => {
        alert(`Ошибка открытия смены: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
      },
    });
  };

  const handleCloseShift = async () => {
    if (!currentShift) return;

    const updateData: UpdateShiftRequest = {
      status: 'closed',
    };

    if (closingPhoto) {
      updateData.closing_photo = closingPhoto;
    }

    updateShiftMutation.mutate(
      { id: currentShift.id, data: updateData },
      {
        onSuccess: () => {
          setClosingPhoto(null);
          alert('Смена успешно закрыта!');
        },
        onError: (error: any) => {
          alert(`Ошибка закрытия смены: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
        },
      }
    );
  };

  if (!canWorkShifts) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-end mb-4">
        {currentShift?.status && currentShift.status !== 'closed' ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Смена открыта
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Смена закрыта
          </span>
        )}
      </div>

      <div className="space-y-6">
        {/* Dealership Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Автосалон *
          </label>
          <DealershipSelector
            value={selectedDealershipId}
            onChange={(id) => setSelectedDealershipId(id || undefined)}
            required
          />
        </div>

        {/* Show content based on whether a dealership is selected */}
        {selectedDealershipId ? (
          <>
            {currentShift?.status && currentShift.status !== 'closed' ? (
              // Close Shift Form
              <div className="space-y-4 border-t pt-4">
                <div className="text-sm text-gray-600">
                  <p>Начало смены: {new Date(currentShift.shift_start).toLocaleString('ru-RU')}</p>
                  {currentShift.is_late && (
                    <p className="text-red-600 font-medium">
                      Опоздание: {currentShift.late_minutes} минут
                    </p>
                  )}
                  <p>Автосалон: {currentShift.dealership?.name}</p>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-base font-medium text-gray-900 mb-4">Закрытие смены</h3>

                  <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Фото закрытия смены (необязательно)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => setClosingPhoto(e.target.files?.[0] || null)}
                          className="hidden"
                          id="closing-photo"
                        />
                        <label
                          htmlFor="closing-photo"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <CameraIcon className="w-5 h-5 mr-2 text-gray-500" />
                          {closingPhoto ? (
                            <span className="truncate max-w-[150px]">{closingPhoto.name}</span>
                          ) : (
                            'Выбрать фото'
                          )}
                        </label>
                        {closingPhoto && (
                          <button
                            type="button"
                            onClick={() => setClosingPhoto(null)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium transition-colors"
                          >
                            Удалить
                          </button>
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleCloseShift}
                      disabled={updateShiftMutation.isPending}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-2.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                    >
                      <StopIcon className="w-5 h-5 mr-2" />
                      {updateShiftMutation.isPending ? 'Закрытие...' : 'Закрыть смену'}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Open Shift Form
              <div className="space-y-4 border-t pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Фото открытия смены *
                  </label>
                  <div className="flex items-center space-x-4">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setOpeningPhoto(e.target.files?.[0] || null)}
                      className="hidden"
                      id="opening-photo"
                    />
                    <label
                      htmlFor="opening-photo"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                    >
                      <CameraIcon className="w-4 h-4 mr-2" />
                      {openingPhoto ? openingPhoto.name : 'Выбрать фото'}
                    </label>
                    {openingPhoto && (
                      <button
                        type="button"
                        onClick={() => setOpeningPhoto(null)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Удалить
                      </button>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Сделайте фото экрана компьютера с текущим временем
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleOpenShift}
                  disabled={!openingPhoto || createShiftMutation.isPending}
                  className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  {createShiftMutation.isPending ? 'Открытие...' : 'Открыть смену'}
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    </div>
  );
};
