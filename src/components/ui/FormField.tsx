import React from 'react';

export interface FormFieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

/**
 * MD3 Form Field wrapper with label, error, and supporting text.
 *
 * @example
 * <FormField label="Название" required error={errors.title}>
 *   <Input {...register('title')} />
 * </FormField>
 */
export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  error,
  hint,
  children,
  className = '',
  htmlFor,
}) => {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={htmlFor}
          className="block md3-body-medium font-medium text-on-surface mb-2"
        >
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      {children}
      {error && (
        <p className="mt-1 md3-body-small text-error">{error}</p>
      )}
      {hint && !error && (
        <p className="mt-1 md3-body-small text-on-surface-variant">{hint}</p>
      )}
    </div>
  );
};
