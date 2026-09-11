import React from 'react';
import { useStore } from '../../context/StoreContext';
import { CheckCircle2, AlertCircle, Info, Sparkles, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col space-y-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={`pointer-events-auto p-4 rounded-xl shadow-2xl backdrop-blur-md border flex items-start gap-3.5 ${
              toast.type === 'gold'
                ? 'bg-[#1D1D1D]/95 text-white border-[#C6A56B]/40 gold-border-glow'
                : toast.type === 'success'
                ? 'bg-[#1D1D1D]/95 text-white border-emerald-500/40'
                : toast.type === 'error'
                ? 'bg-[#1D1D1D]/95 text-white border-rose-500/40'
                : 'bg-[#1D1D1D]/95 text-white border-neutral-700/50'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'gold' && <Sparkles className="w-5 h-5 text-[#C6A56B]" />}
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-amber-300" />}
            </div>
            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-semibold uppercase tracking-widest text-[#C6A56B] mb-0.5">
                {toast.title}
              </h4>
              <p className="text-sm text-neutral-200 leading-snug line-clamp-2">{toast.message}</p>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-neutral-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
