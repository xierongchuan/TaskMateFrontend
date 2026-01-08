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

const typeConfig: Record<ToastType, { icon: React.ElementType; bgClass: string; iconClass: string }> = {
  success: {
    icon: CheckCircleIcon,
    bgClass: 'bg-inverse-surface',
    iconClass: 'text-[#4caf50]',
  },
  error: {
    icon: XCircleIcon,
    bgClass: 'bg-inverse-surface',
    iconClass: 'text-error',
  },
  warning: {
    icon: ExclamationTriangleIcon,
    bgClass: 'bg-inverse-surface',
    iconClass: 'text-[#ff9800]',
  },
  info: {
    icon: InformationCircleIcon,
    bgClass: 'bg-inverse-surface',
    iconClass: 'text-primary',
  },
};

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

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const ToastItem: React.FC<{ toast: Toast; onRemove: () => void }> = ({ toast, onRemove }) => {
  const { icon: Icon, bgClass, iconClass } = typeConfig[toast.type];

  useEffect(() => {
    const duration = toast.duration ?? DEFAULT_DURATION;
    const timer = setTimeout(onRemove, duration);
    return () => clearTimeout(timer);
  }, [toast.duration, onRemove]);

  return (
    <div
      className={`
        flex items-center gap-3 px-4 py-3
        rounded-xs shadow-elevation-3
        max-w-sm w-full
        md3-animate-slide-up
        ${bgClass}
      `}
      role="alert"
    >
      <Icon className={`w-6 h-6 flex-shrink-0 ${iconClass}`} />
      <p className="text-sm font-medium flex-1 text-inverse-on-surface">{toast.message}</p>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 text-inverse-on-surface hover:bg-inverse-on-surface/[0.08] active:bg-inverse-on-surface/[0.12] rounded-full transition-colors duration-short3 ease-standard"
        aria-label="Закрыть"
      >
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
};

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
