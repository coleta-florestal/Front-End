'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type ToastVariant = 'error' | 'warning' | 'success' | 'info';

export interface ToastOptions {
  id?: string;
  title: string;
  message?: string;
  variant?: ToastVariant;
  durationMs?: number;
}

interface ToastItem {
  id: string;
  title: string;
  message?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (options: ToastOptions) => void;
  dismissToast: (id: string) => void;
}

const DEFAULT_DURATION_MS = 5000;

const VARIANT_STYLES: Record<
  ToastVariant,
  { container: string; title: string; message: string; iconBg: string; iconColor: string }
> = {
  error: {
    container: 'border-[#E5B8AD] bg-[#FAF8F3]',
    title: 'text-[#8C3420]',
    message: 'text-[#5C4B47]',
    iconBg: 'bg-[#FBECE8]',
    iconColor: '#A64B35',
  },
  warning: {
    container: 'border-[#E5D3AD] bg-[#FAF8F3]',
    title: 'text-[#7A5A20]',
    message: 'text-[#5F5647]',
    iconBg: 'bg-[#F6EEDB]',
    iconColor: '#7A5A20',
  },
  success: {
    container: 'border-[#B8D8BE] bg-[#FAF8F3]',
    title: 'text-[#245225]',
    message: 'text-[#536053]',
    iconBg: 'bg-[#E4F0E6]',
    iconColor: '#2C5F2D',
  },
  info: {
    container: 'border-[#D7D0C2] bg-[#FAF8F3]',
    title: 'text-verde-mata',
    message: 'text-[#6E776B]',
    iconBg: 'bg-[#EAE6DF]',
    iconColor: '#2C5F2D',
  },
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const dismissToast = useCallback((id: string) => {
    const existingTimer = timersRef.current.get(id);
    if (existingTimer) {
      clearTimeout(existingTimer);
      timersRef.current.delete(id);
    }

    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  const showToast = useCallback(
    ({ id, title, message, variant = 'info', durationMs = DEFAULT_DURATION_MS }: ToastOptions) => {
      const toastId = id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

      const existingTimer = timersRef.current.get(toastId);
      if (existingTimer) {
        clearTimeout(existingTimer);
      }

      setToasts((current) => {
        const nextToast: ToastItem = { id: toastId, title, message, variant };
        const exists = current.some((item) => item.id === toastId);

        return exists
          ? current.map((item) => (item.id === toastId ? nextToast : item))
          : [...current, nextToast];
      });

      if (durationMs > 0) {
        const timer = setTimeout(() => {
          dismissToast(toastId);
        }, durationMs);

        timersRef.current.set(toastId, timer);
      }
    },
    [dismissToast],
  );

  useEffect(() => {
    const timers = timersRef.current;

    return () => {
      timers.forEach((timer) => clearTimeout(timer));
      timers.clear();
    };
  }, []);

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}

      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="pointer-events-none fixed right-4 top-20 z-50 flex w-[calc(100%-2rem)] max-w-md flex-col gap-3 lg:right-6 lg:top-6"
        >
          {toasts.map((toast) => {
            const styles = VARIANT_STYLES[toast.variant];

            return (
              <div
                key={toast.id}
                role={toast.variant === 'error' ? 'alert' : 'status'}
                className={`pointer-events-auto flex items-start gap-3 rounded-2xl border p-4 shadow-lg ${styles.container}`}
              >
                <div
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${styles.iconBg}`}
                  aria-hidden="true"
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={styles.iconColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                </div>

                <div className="flex flex-1 flex-col gap-0.5">
                  <p className={`text-sm font-bold ${styles.title}`}>{toast.title}</p>
                  {toast.message && (
                    <p className={`text-xs leading-relaxed ${styles.message}`}>{toast.message}</p>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => dismissToast(toast.id)}
                  aria-label="Fechar alerta"
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#6E776B] transition-colors hover:bg-black/5 hover:text-[#20221E] cursor-pointer"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast deve ser usado dentro de um ToastProvider.');
  }

  return context;
}
