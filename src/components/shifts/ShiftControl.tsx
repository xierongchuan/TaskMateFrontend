import React, { useState } from 'react';
import { useMyCurrentShift, useCreateShift, useUpdateShift } from '../../hooks/useShifts';
import { useAuth } from '../../hooks/useAuth';
import { CameraIcon, PlayIcon, StopIcon } from '@heroicons/react/24/outline';
import type { CreateShiftRequest, UpdateShiftRequest } from '../../types/shift';

export const ShiftControl: React.FC = () => {
  const { user } = useAuth();
  const { data: currentShiftData } = useMyCurrentShift();
  const currentShift = currentShiftData?.data;
  const createShiftMutation = useCreateShift();
  const updateShiftMutation = useUpdateShift();

  const [openingPhoto, setOpeningPhoto] = useState<File | null>(null);
  const [closingPhoto, setClosingPhoto] = useState<File | null>(null);
  const [breakDuration, setBreakDuration] = useState<number>(0);

  const handleOpenShift = async () => {
    if (!openingPhoto || !user?.dealership_id) {
      alert('Необходимо выбрать фото открытия смены');
      return;
    }

    const shiftData: CreateShiftRequest = {
      user_id: user.id,
      dealership_id: user.dealership_id,
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
    if (breakDuration > 0) {
      updateData.break_duration = breakDuration;
    }

    updateShiftMutation.mutate(
      { id: currentShift.id, data: updateData },
      {
        onSuccess: () => {
          setClosingPhoto(null);
          setBreakDuration(0);
          alert('Смена успешно закрыта!');
        },
        onError: (error: any) => {
          alert(`Ошибка закрытия смены: ${error.response?.data?.message || 'Неизвестная ошибка'}`);
        },
      }
    );
  };

  if (currentShift?.status === 'open') {
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium text-gray-900">Управление сменой</h2>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            Смена открыта
          </span>
        </div>

        <div className="space-y-4">
          <div className="text-sm text-gray-600">
            <p>Начало смены: {new Date(currentShift.shift_start).toLocaleString('ru-RU')}</p>
            {currentShift.is_late && (
              <p className="text-red-600 font-medium">
                Опоздание: {currentShift.late_minutes} минут
              </p>
            )}
          </div>

          <div className="border-t pt-4">
            <h3 className="text-md font-medium text-gray-900 mb-3">Закрытие смены</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Фото закрытия смены (необязательно)
                </label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setClosingPhoto(e.target.files?.[0] || null)}
                    className="hidden"
                    id="closing-photo"
                  />
                  <label
                    htmlFor="closing-photo"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                  >
                    <CameraIcon className="w-4 h-4 mr-2" />
                    {closingPhoto ? closingPhoto.name : 'Выбрать фото'}
                  </label>
                  {closingPhoto && (
                    <button
                      type="button"
                      onClick={() => setClosingPhoto(null)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Удалить
                    </button>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Длительность перерыва (минуты)
                </label>
                <input
                  type="number"
                  min="0"
                  value={breakDuration}
                  onChange={(e) => setBreakDuration(parseInt(e.target.value) || 0)}
                  className="block w-32 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
                />
              </div>

              <button
                type="button"
                onClick={handleCloseShift}
                disabled={updateShiftMutation.isPending}
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <StopIcon className="w-4 h-4 mr-2" />
                {updateShiftMutation.isPending ? 'Закрытие...' : 'Закрыть смену'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-gray-900">Открыть смену</h2>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
          Смена закрыта
        </span>
      </div>

      <div className="space-y-4">
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
    </div>
  );
};