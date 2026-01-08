import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_DURATION = 4000;

const typeConfig: Record<ToastType, { icon: React.ElementType; classes: string }> = {
  success: {
    icon: CheckCircleIcon,
    classes: 'bg-success-container text-on-success-container',
  },
  error: {
    icon: XCircleIcon,
    classes: 'bg-error-container text-on-error-container',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    classes: 'bg-warning-container text-on-warning-container',
  },
  info: {
    icon: InformationCircleIcon,
    classes: 'bg-tertiary-container text-on-tertiary-container',
  },
};

/**
 * MD3 Snackbar/Toast Provider - wraps the app to provide notification context.
 *
 * @example
 * // In App.tsx:
 * <ToastProvider>
 *   <App />
 * </ToastProvider>
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

/**
 * Hook for showing Toast/Snackbar notifications.
 *
 * @example
 * const { showToast } = useToast();
 * showToast({ type: 'success', message: 'Сохранено!' });
 */
export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

// Individual Toast/Snackbar component
const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const { icon: Icon, classes } = typeConfig[toast.type];

  useEffect(() => {
    const duration = toast.duration ?? DEFAULT_DURATION;
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3 rounded-xs shadow-elevation-3
        min-w-[288px] max-w-[560px]
        md3-animate-slide-up
        ${classes}
      `}
      role="alert"
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="md3-body-medium flex-1">{toast.message}</p>
      <button
        onClick={onRemove}
        className="flex-shrink-0 w-8 h-8 -mr-2 rounded-full flex items-center justify-center hover:bg-on-surface/[0.08] active:bg-on-surface/[0.12] transition-colors duration-short3 ease-standard"
        aria-label="Закрыть"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  );
};

// Container for all toasts - positioned at bottom center per MD3 spec
const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col gap-2 items-center">
      {toasts.map((toast) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          onRemove={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
};
