import React from 'react';
import { CheckCircle2, X } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useCart();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="pointer-events-auto flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0D1B2A] border border-slate-700 text-white shadow-2xl animate-in slide-in-from-bottom-3 duration-200"
        >
          <div className="flex items-center gap-3">
            {toast.image ? (
              <img
                src={toast.image}
                alt=""
                referrerPolicy="no-referrer"
                className="w-10 h-10 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            )}
            <div className="text-xs font-semibold leading-snug text-slate-100">
              {toast.message}
            </div>
          </div>

          <button
            onClick={() => removeToast(toast.id)}
            className="text-slate-400 hover:text-white p-1 transition-colors shrink-0"
            aria-label="Dismiss toast"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};

export const Toast = ToastContainer;
