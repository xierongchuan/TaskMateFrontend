import React from 'react';
import { useDealerships } from '../../hooks/useDealerships';
import { useAuth } from '../../hooks/useAuth';

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

/**
 * MD3 Dealership Selector dropdown with proper styling.
 */
export const DealershipSelector: React.FC<DealershipSelectorProps> = ({
  value,
  onChange,
  placeholder = "Все автосалоны",
  className = "",
  disabled = false,
  required = false,
  showAllOption = false,
  allOptionLabel = "Все салоны"
}) => {
  const { user } = useAuth();
  const { data: dealershipsData, isLoading, error } = useDealerships();

  // If user has assigned dealerships, use them. Otherwise use all dealerships.
  const availableDealerships = user?.dealerships && user.dealerships.length > 0
    ? user.dealerships
    : dealershipsData?.data || [];

  const isDataLoading = !user?.dealerships && isLoading;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value;
    console.log('[DealershipSelector] Selected value:', newValue, 'parsed:', newValue === "" ? null : parseInt(newValue));
    if (newValue === "") {
      onChange(null);
    } else {
      onChange(parseInt(newValue));
    }
  };

  if (error) {
    return (
      <div className={`md3-body-small text-error ${className}`}>
        Ошибка загрузки автосалонов
      </div>
    );
  }

  const selectClasses = [
    // Base styles
    'block w-full h-14 px-4 pt-4 pb-2',
    // MD3 outlined variant styling
    'bg-transparent',
    'border border-outline rounded-xs',
    'text-on-surface md3-body-large',
    // Focus styles
    'focus:outline-none focus:border-primary focus:border-2',
    // Transition
    'transition-all duration-short3 ease-standard',
    // Disabled state
    'disabled:bg-on-surface/[0.04] disabled:border-on-surface/[0.12] disabled:text-on-surface/[0.38] disabled:cursor-not-allowed',
    // Custom className
    className,
  ].filter(Boolean).join(' ');

  return (
    <select
      value={value || ""}
      onChange={handleChange}
      disabled={disabled || isLoading}
      required={required}
      className={selectClasses}
    >
      {isDataLoading ? (
        <option value="">Загрузка...</option>
      ) : (
        <>
          {/* Always show placeholder when no value is selected, even for required fields */}
          {!showAllOption && (
            <option value="" disabled={required}>
              {placeholder}
            </option>
          )}
          {showAllOption && (
            <option value="">
              {allOptionLabel}
            </option>
          )}
          {availableDealerships.map((dealership) => (
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
