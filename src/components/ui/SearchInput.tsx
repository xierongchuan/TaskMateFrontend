import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Input } from './Input';

export interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
  className?: string;
  fullWidth?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Поиск...',
  debounceMs = 300,
  className = '',
  fullWidth = true,
}) => {
  const [localValue, setLocalValue] = useState(value);
  const isInternalChange = useRef(false);

  useEffect(() => {
    if (!isInternalChange.current) {
      setLocalValue(value);
    }
    isInternalChange.current = false;
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue !== value) {
        isInternalChange.current = true;
        onChange(localValue);
      }
    }, debounceMs);

    return () => clearTimeout(timer);
  }, [localValue, debounceMs, onChange, value]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  }, []);

  return (
    <Input
      value={localValue}
      onChange={handleChange}
      placeholder={placeholder}
      icon={<MagnifyingGlassIcon />}
      inputSize="sm"
      fullWidth={fullWidth}
      className={className}
    />
  );
};
