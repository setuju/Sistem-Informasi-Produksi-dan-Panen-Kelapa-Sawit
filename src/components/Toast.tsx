import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: ToastType;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-3 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem: React.FC<{ toast: ToastMessage; onDismiss: (id: string) => void }> = ({
  toast,
  onDismiss,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getStyle = (type: ToastType) => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-emerald-900/95 text-white border-emerald-500/50',
          icon: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
          badge: 'bg-emerald-800 text-emerald-200',
        };
      case 'error':
        return {
          bg: 'bg-rose-950/95 text-white border-rose-500/50',
          icon: <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />,
          badge: 'bg-rose-900 text-rose-200',
        };
      case 'warning':
        return {
          bg: 'bg-amber-950/95 text-white border-amber-500/50',
          icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
          badge: 'bg-amber-900 text-amber-200',
        };
      case 'info':
      default:
        return {
          bg: 'bg-slate-900/95 text-white border-slate-700',
          icon: <Info className="w-5 h-5 text-blue-400 shrink-0" />,
          badge: 'bg-slate-800 text-blue-200',
        };
    }
  };

  const style = getStyle(toast.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
      transition={{ duration: 0.25 }}
      className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start justify-between gap-3 backdrop-blur-md ${style.bg}`}
    >
      <div className="flex items-start gap-3 min-w-0">
        {style.icon}
        <div className="min-w-0">
          <p className="text-xs font-bold leading-tight truncate">{toast.title}</p>
          <p className="text-xs text-slate-200 mt-1 leading-snug">{toast.message}</p>
        </div>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition cursor-pointer shrink-0"
        title="Tutup Notifikasi"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
