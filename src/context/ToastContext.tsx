import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  showToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  success: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback(
    (type: ToastType, title: string, message?: string, duration = 4000) => {
      const id = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts(prev => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((title: string, message?: string) => showToast('success', title, message), [showToast]);
  const warning = useCallback((title: string, message?: string) => showToast('warning', title, message), [showToast]);
  const error = useCallback((title: string, message?: string) => showToast('error', title, message), [showToast]);
  const info = useCallback((title: string, message?: string) => showToast('info', title, message), [showToast]);

  return (
    <ToastContext.Provider value={{ showToast, success, warning, error, info, removeToast }}>
      {children}
      {/* Toast Render Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-md w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(toast => {
          const typeStyles = {
            success: 'bg-emerald-50 border-emerald-300 text-emerald-900',
            warning: 'bg-amber-50 border-amber-300 text-amber-900',
            error: 'bg-red-50 border-red-300 text-red-900',
            info: 'bg-blue-50 border-blue-300 text-blue-900',
          }[toast.type];

          const Icon = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
            error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
          }[toast.type];

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-lg border shadow-lg transition-all duration-200 animate-slide-in ${typeStyles}`}
            >
              {Icon}
              <div className="flex-1 text-xs">
                <div className="font-bold text-sm leading-tight">{toast.title}</div>
                {toast.message && <div className="mt-1 text-gray-700 leading-snug">{toast.message}</div>}
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="text-gray-400 hover:text-gray-700 transition-colors p-1 -mr-1 -mt-1"
                aria-label="Close notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
