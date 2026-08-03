import { type ReactNode, createContext, useContext, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Toast } from '../components/ui/Toast';
import { type ToastVariant, type Toast as ToastType } from '../types';

interface ToastContextType {
  addToast: (toast: Omit<ToastType, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastType[]>([]);

  const addToast = (toastData: Omit<ToastType, 'id'>) => {
    const id = Date.now().toString();
    const newToast: ToastType = { ...toastData, id };
    setToasts(prev => [...prev, newToast]);

    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      {/* Toasts container */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 p-4">
        {toasts.map(toast => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, translateX: 20 }}
            animate={{ opacity: 1, translateX: 0 }}
            exit={{ opacity: 0, translateX: 20 }}
            transition={{ duration: 0.2 }}
          >
            <Toast toast={toast} onDismiss={() => removeToast(toast.id)} />
          </motion.div>
        ))}
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