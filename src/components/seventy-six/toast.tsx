import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './toast.css';

/**
 * B14 · Toast — bottom-left, success and neutral info ONLY. Errors render
 * inline at their source (Firewall A2). Max 2 stacked, 5s auto-dismiss
 * with pause-on-hover. Never the only path to an action.
 */
export type ToastTone = 'ok' | 'info';

interface ToastItem {
  id: number;
  tone: ToastTone;
  message: string;
}

interface ToastApi {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast requires a <ToastProvider> ancestor.');
  return ctx;
}

const DISMISS_MS = 5000;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const nextId = useRef(1);
  const timers = useRef(new Map<number, { handle: number; remaining: number; started: number }>());

  const remove = useCallback((id: number) => {
    setItems((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current.get(id);
    if (timer) {
      window.clearTimeout(timer.handle);
      timers.current.delete(id);
    }
  }, []);

  const schedule = useCallback(
    (id: number, ms: number) => {
      const handle = window.setTimeout(() => remove(id), ms);
      timers.current.set(id, { handle, remaining: ms, started: Date.now() });
    },
    [remove],
  );

  const toast = useCallback(
    (message: string, tone: ToastTone = 'info') => {
      const id = nextId.current++;
      setItems((prev) => [...prev.slice(-1), { id, tone, message }]); // max 2 stacked
      schedule(id, DISMISS_MS);
    },
    [schedule],
  );

  function pause(id: number) {
    const timer = timers.current.get(id);
    if (!timer) return;
    window.clearTimeout(timer.handle);
    timer.remaining -= Date.now() - timer.started;
  }

  function resume(id: number) {
    const timer = timers.current.get(id);
    if (!timer) return;
    schedule(id, Math.max(timer.remaining, 800));
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="sv-toaster" aria-live="polite" aria-label="Notifications">
        {items.map((t) => (
          <div
            key={t.id}
            className={cx('sv-toast', `sv-toast--${t.tone}`)}
            onMouseEnter={() => pause(t.id)}
            onMouseLeave={() => resume(t.id)}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
