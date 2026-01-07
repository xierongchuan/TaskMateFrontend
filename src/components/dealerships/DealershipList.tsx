import React, { useState, useEffect, useCallback } from 'react';
import { useDealerships, useDeleteDealership } from '../../hooks/useDealerships';
import { usePermissions } from '../../hooks/usePermissions';
import { usePagination } from '../../hooks/usePagination';
import type { Dealership } from '../../types/dealership';
import {
  MagnifyingGlassIcon,
  BuildingOfficeIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

interface DealershipListProps {
  onEdit?: (dealership: Dealership) => void;
}

export const DealershipList: React.FC<DealershipListProps> = ({ onEdit }) => {
  const { canManageDealerships } = usePermissions();
  const { limit } = usePagination();
  const [searchInput, setSearchInput] = useState('');
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [dealershipToDelete, setDealershipToDelete] = useState<Dealership | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);

  const { data, isLoading, error } = useDealerships({ ...filters, per_page: limit });

  // Обработчик изменения ввода с useCallback для оптимизации
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  }, []);

  // Debounce эффект с управлением состоянием загрузки
  useEffect(() => {
    // Устанавливаем состояние загрузки при начале поиска
    if (searchInput !== filters.search) {
      setIsSearchLoading(true);
    }

    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        setFilters(prev => ({ ...prev, search: searchInput, page: 1 }));
      }
      // Сбрасываем состояние загрузки после выполнения запроса
      setIsSearchLoading(false);
    }, 500); // 500ms задержка

    return () => {
      clearTimeout(timer);
    };
  }, [searchInput, filters.search]);
  const deleteDealership = useDeleteDealership();

  const handleDelete = (dealership: Dealership) => {
    setDealershipToDelete(dealership);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!dealershipToDelete) return;

    try {
      await deleteDealership.mutateAsync(dealershipToDelete.id);
      setShowDeleteModal(false);
      setDealershipToDelete(null);
    } catch (error: any) {
      console.error('Delete error:', error);
    }
  };

  const clearSearch = () => {
    setSearchInput('');
    setFilters(prev => ({ ...prev, search: '', page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <div className="animate-pulse space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 mx-auto text-red-300 mb-4">
          <XMarkIcon className="w-full h-full" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Ошибка загрузки</h3>
        <p className="text-sm text-gray-600">{error.message}</p>
      </div>
    );
  }

  return (
    <>
      {/* Search and Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className={`h-5 w-5 ${isSearchLoading ? 'text-blue-500 animate-pulse' : 'text-gray-400'}`} />
            </div>
            <input
              key="dealership-search-input"
              type="text"
              placeholder="Поиск по названию или адресу..."
              value={searchInput}
              onChange={handleSearchChange}
              className="block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm pl-10 pr-10 py-2 border"
            />
            {isSearchLoading && (
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              </div>
            )}
          </div>
          {filters.search && (
            <button
              onClick={clearSearch}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <XMarkIcon className="w-4 h-4 mr-2" />
              Очистить
            </button>
          )}
        </div>
      </div>

      {/* Dealerships Grid */}
      {data?.data.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <div className="w-16 h-16 mx-auto text-gray-300 mb-4">
            <BuildingOfficeIcon className="w-full h-full" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {filters.search ? 'Автосалоны не найдены' : 'Нет автосалонов'}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {filters.search
              ? 'Попробуйте изменить параметры поиска'
              : 'Создайте первый автосалон для начала работы'
            }
          </p>
          {filters.search && (
            <button
              onClick={clearSearch}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Сбросить поиск
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data?.data.map((dealership) => (
              <div
                key={dealership.id}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:border-blue-200"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <BuildingOfficeIcon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {dealership.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        ID: {dealership.id}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  {dealership.address && (
                    <div className="flex items-start space-x-2">
                      <MapPinIcon className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {dealership.address}
                      </p>
                    </div>
                  )}

                  {dealership.phone && (
                    <div className="flex items-center space-x-2">
                      <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      <p className="text-sm text-gray-600">
                        {dealership.phone}
                      </p>
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <p className="text-sm text-gray-600">
                      Создан: {format(new Date(dealership.created_at), 'dd MMM yyyy', { locale: ru })}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-2 mt-6 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => onEdit?.(dealership)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    <PencilIcon className="w-4 h-4 mr-1.5" />
                    Изменить
                  </button>
                  {canManageDealerships && (
                    <button
                      onClick={() => handleDelete(dealership)}
                      disabled={deleteDealership.isPending}
                      className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      <TrashIcon className="w-4 h-4 mr-1.5" />
                      Удалить
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {data && data.last_page > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Показано {(data.current_page - 1) * data.per_page + 1} - {Math.min(data.current_page * data.per_page, data.total)} из {data.total} автосалонов
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={filters.page === 1}
                  onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Назад
                </button>
                <span className="text-sm text-gray-600 px-3 py-2">
                  Страница {data.current_page} из {data.last_page}
                </span>
                <button
                  disabled={filters.page === data.last_page}
                  onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Вперед
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && dealershipToDelete && (
        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowDeleteModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TrashIcon className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Удаление автосалона
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        Вы уверены, что хотите удалить автосалон <strong>{dealershipToDelete.name}</strong>?
                        Это действие нельзя будет отменить.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={deleteDealership.isPending}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                >
                  {deleteDealership.isPending ? 'Удаление...' : 'Удалить'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
