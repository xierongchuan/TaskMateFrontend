import React from 'react';

interface RoleSelectorProps {
  value: string[];
  onChange: (roles: string[]) => void;
  disabled?: boolean;
}

const AVAILABLE_ROLES = [
  { value: 'employee', label: 'Сотрудники', color: 'bg-blue-100 text-blue-800' },
  { value: 'manager', label: 'Менеджеры', color: 'bg-purple-100 text-purple-800' },
  { value: 'owner', label: 'Владельцы', color: 'bg-indigo-100 text-indigo-800' },
  { value: 'observer', label: 'Наблюдатели', color: 'bg-gray-100 text-gray-800' },
];

export const RoleSelector: React.FC<RoleSelectorProps> = ({ value = [], onChange, disabled = false }) => {
  const handleToggle = (roleValue: string) => {
    if (disabled) return;

    if (value.includes(roleValue)) {
      onChange(value.filter(r => r !== roleValue));
    } else {
      onChange([...value, roleValue]);
    }
  };

  const handleSelectAll = () => {
    if (disabled) return;
    onChange(AVAILABLE_ROLES.map(r => r.value));
  };

  const handleClearAll = () => {
    if (disabled) return;
    onChange([]);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Получатели уведомлений:</p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            disabled={disabled || value.length === AVAILABLE_ROLES.length}
            className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Все
          </button>
          <span className="text-gray-300">|</span>
          <button
            type="button"
            onClick={handleClearAll}
            disabled={disabled || value.length === 0}
            className="text-xs text-indigo-600 hover:text-indigo-800 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            Сбросить
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {AVAILABLE_ROLES.map((role) => {
          const isSelected = value.includes(role.value);
          return (
            <button
              key={role.value}
              type="button"
              onClick={() => handleToggle(role.value)}
              disabled={disabled}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${isSelected
                  ? role.color + ' ring-2 ring-offset-1 ring-indigo-500'
                  : 'bg-white text-gray-700 border border-gray-300 hover:border-indigo-400'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {role.label}
            </button>
          );
        })}
      </div>

      {value.length === 0 && !disabled && (
        <p className="text-xs text-amber-600">⚠️ Без выбора ролей уведомления получат все пользователи</p>
      )}
    </div>
  );
};
