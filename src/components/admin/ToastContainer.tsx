import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { useAdminData } from '../../context/AdminDataContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAdminData();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-200 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        let Icon = CheckCircle2;
        let bgClass = 'bg-slate-900 border-slate-700 text-white';
        let iconClass = 'text-emerald-400';

        if (toast.type === 'error') {
          bgClass = 'bg-red-950 border-red-800 text-white';
          Icon = AlertCircle;
          iconClass = 'text-red-400';
        } else if (toast.type === 'info') {
          bgClass = 'bg-slate-900 border-amber-500/40 text-white';
          Icon = Info;
          iconClass = 'text-amber-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-4 rounded-xl border shadow-xl flex items-start gap-3 transition-all transform translate-y-0 animate-slide-in ${bgClass}`}
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${iconClass}`} />
            <div className="flex-1 text-xs font-medium leading-relaxed">
              {toast.message}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
              aria-label="Tutup notifikasi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
