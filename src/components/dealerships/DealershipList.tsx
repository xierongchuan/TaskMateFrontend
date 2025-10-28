import React, { useState } from 'react';
import { useDealerships, useDeleteDealership } from '../../hooks/useDealerships';
import type { Dealership } from '../../types/dealership';

interface DealershipListProps {
  onEdit?: (dealership: Dealership) => void;
}

export const DealershipList: React.FC<DealershipListProps> = ({ onEdit }) => {
  const [filters, setFilters] = useState({
    search: '',
    page: 1,
  });

  const { data, isLoading, error } = useDealerships(filters);
  const deleteDealership = useDeleteDealership();

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Удалить автосалон "${name}"?`)) return;

    try {
      await deleteDealership.mutateAsync(id);
      alert('Автосалон удален');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ошибка удаления');
    }
  };

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка: {error.message}</div>;

  return (
    <div className="dealership-list">
      {/* Фильтры */}
      <div className="filters">
        <input
          type="text"
          placeholder="Поиск по названию или адресу"
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
          className="search-input"
        />
      </div>

      {/* Таблица автосалонов */}
      <table className="dealership-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Название</th>
            <th>Адрес</th>
            <th>Телефон</th>
            <th>Создан</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {data?.data.map((dealership) => (
            <tr key={dealership.id}>
              <td>{dealership.id}</td>
              <td className="dealership-name">{dealership.name}</td>
              <td className="dealership-address">
                {dealership.address || '—'}
              </td>
              <td className="dealership-phone">
                {dealership.phone || '—'}
              </td>
              <td className="dealership-created">
                {new Date(dealership.created_at).toLocaleDateString('ru-RU')}
              </td>
              <td className="dealership-actions">
                <button
                  onClick={() => onEdit?.(dealership)}
                  className="edit-button"
                >
                  Редактировать
                </button>
                <button
                  onClick={() => handleDelete(dealership.id, dealership.name)}
                  disabled={deleteDealership.isPending}
                  className="delete-button"
                >
                  Удалить
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Пагинация */}
      {data && data.last_page > 1 && (
        <div className="pagination">
          <button
            disabled={filters.page === 1}
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            className="pagination-button"
          >
            Назад
          </button>
          <span className="pagination-info">
            Страница {data.current_page} из {data.last_page}
          </span>
          <button
            disabled={filters.page === data.last_page}
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            className="pagination-button"
          >
            Вперед
          </button>
        </div>
      )}

      {/* Пустое состояние */}
      {data?.data.length === 0 && (
        <div className="empty-state">
          <p>Автосалоны не найдены</p>
          {filters.search && (
            <button
              onClick={() => setFilters({ ...filters, search: '', page: 1 })}
              className="clear-filters-button"
            >
              Очистить фильтры
            </button>
          )}
        </div>
      )}
    </div>
  );
};