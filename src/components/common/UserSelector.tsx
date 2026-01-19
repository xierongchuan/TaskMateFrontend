import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { usersApi } from '../../api/users';

interface UserSelectorProps {
  dealershipId?: number | null;
  value?: number | null;
  onChange: (userId: number | null) => void;
  placeholder?: string;
  noDealershipMessage?: string;
  className?: string;
  disabled?: boolean;
  showAllOption?: boolean;
  allOptionLabel?: string;
}

/**
 * Компонент выбора сотрудника.
 * Работает только при выбранном автосалоне (dealershipId).
 */
export const UserSelector: React.FC<UserSelectorProps> = ({
  dealershipId,
  value,
  onChange,
  placeholder = "Выберите сотрудника",
  noDealershipMessage = "Сначала выберите автосалон",
  className = "",
  disabled = false,
  showAllOption = false,
  allOptionLabel = "Все сотрудники",
}) => {
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['user-selector-users', dealershipId],
    queryFn: () => usersApi.getUsers({
      per_page: 100,
      dealership_id: dealershipId!,
    }),
    enabled: !!dealershipId,
    staleTime: 1000 * 60,
  });

  const users = usersData?.data || [];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    if (newValue === "") {
      onChange(null);
    } else {
      onChange(parseInt(newValue));
    }
  };

  // Если автосалон не выбран - показываем сообщение
  if (!dealershipId) {
    return (
      <select
        disabled
        className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm sm:text-sm px-3 py-2 border bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 cursor-not-allowed ${className}`}
      >
        <option value="">{noDealershipMessage}</option>
      </select>
    );
  }

  return (
    <select
      value={value || ""}
      onChange={handleChange}
      disabled={disabled || isLoading}
      className={`block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border disabled:bg-gray-100 disabled:cursor-not-allowed bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors ${className}`}
    >
      {isLoading ? (
        <option value="">Загрузка...</option>
      ) : (
        <>
          {showAllOption ? (
            <option value="">{allOptionLabel}</option>
          ) : (
            <option value="">{placeholder}</option>
          )}
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.full_name}
            </option>
          ))}
        </>
      )}
    </select>
  );
};
