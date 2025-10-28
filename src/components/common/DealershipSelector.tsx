import React from 'react';
import { useDealerships } from '../../hooks/useDealerships';

interface DealershipSelectorProps {
  value?: number | null;
  onChange: (dealershipId: number | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

export const DealershipSelector: React.FC<DealershipSelectorProps> = ({
  value,
  onChange,
  placeholder = "Выберите автосалон",
  className = "",
  disabled = false,
  required = false,
  showAllOption = false,
  allOptionLabel = "Все салоны"
}) => {
  const { data: dealershipsData, isLoading, error } = useDealerships();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === "") {
      onChange(null);
    } else {
      onChange(parseInt(newValue));
    }
  };

  if (error) {
    return (
      <div className={`text-red-600 text-sm ${className}`}>
        Ошибка загрузки автосалонов
      </div>
    );
  }

  return (
    <select
      value={value || ""}
      onChange={handleChange}
      disabled={disabled || isLoading}
      required={required}
      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
    >
      {isLoading ? (
        <option value="">Загрузка...</option>
      ) : (
        <>
          {!required && (
            <option value="">
              {placeholder}
            </option>
          )}
          {showAllOption && (
            <option value="">
              {allOptionLabel}
            </option>
          )}
          {dealershipsData?.data.map((dealership) => (
            <option key={dealership.id} value={dealership.id}>
              {dealership.name}
              {dealership.address && ` (${dealership.address})`}
            </option>
          ))}
        </>
      )}
    </select>
  );
};