import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './toast.css';

/**
 * B14 · Notification (toast) — bottom-left, paper card, left status rule.
 * v0.2.0 grows the anatomy: title + description + optional 16px icon,
 * four tones, two sizes, and a dismiss control. The B14 discipline holds:
 * errors ALWAYS render inline at their source first — a `bad` toast may
 * echo a failure, never replace its inline surface. Max 3 stacked, 5s
 * auto-dismiss with pause-on-hover; `bad`/`warn` persist until dismissed.
 */
export type ToastTone = 'ok' | 'info' | 'warn' | 'bad';

export interface NotifyOptions {
  title: string;
  /** One sentence of context under the title. */
  description?: string;
  tone?: ToastTone;
  /** 16px stroke icon in the tone color. */
  icon?: ReactNode;
  /** default 360px · lg 440px for two-line descriptions. */
  size?: 'default' | 'lg';
  /** Auto-dismiss in ms. Defaults: 5000 for ok/info; 0 (sticky) for warn/bad. */
  duration?: number;
}

interface ToastItem extends Required<Pick<NotifyOptions, 'title' | 'tone' | 'size'>> {
  id: number;
  description?: string;
  icon?: ReactNode;
  duration: number;
}

interface ToastApi {
  /** Full notification: title, description, icon, tone, size, duration. */
  notify: (options: NotifyOptions) => void;
  /** 0.1.x shorthand — a one-line ok/info notification. */
  toast: (message: string, tone?: Extract<ToastTone, 'ok' | 'info'>) => void;
}

const ToastContext = createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast requires a <ToastProvider> ancestor.');
  return ctx;
}

const DISMISS_MS = 5000;
const MAX_STACK = 3;

const TONE_ICONS: Record<ToastTone, ReactNode> = {
  ok: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M3 8.5l3.2 3L13 4.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  info: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 7.2v4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="4.8" r="0.9" fill="currentColor" />
    </svg>
  ),
  warn: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path d="M8 2l6.5 11.5h-13L8 2z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M8 6.5v3.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="8" cy="11.6" r="0.9" fill="currentColor" />
    </svg>
  ),
  bad: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5.6 5.6l4.8 4.8M10.4 5.6l-4.8 4.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
};

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

  const notify = useCallback(
    ({ title, description, tone = 'info', icon, size = 'default', duration }: NotifyOptions) => {
      const id = nextId.current++;
      const ms = duration ?? (tone === 'warn' || tone === 'bad' ? 0 : DISMISS_MS);
      setItems((prev) => [
        ...prev.slice(-(MAX_STACK - 1)),
        { id, title, description, tone, icon: icon ?? TONE_ICONS[tone], size, duration: ms },
      ]);
      if (ms > 0) schedule(id, ms);
    },
    [schedule],
  );

  const toast = useCallback(
    (message: string, tone: Extract<ToastTone, 'ok' | 'info'> = 'info') =>
      notify({ title: message, tone }),
    [notify],
  );

  /* Both callbacks are stable, so the API object must be too — an inline
     literal would re-render every useToast() consumer in the tree each time
     a toast appears or expires. */
  const api = useMemo<ToastApi>(() => ({ notify, toast }), [notify, toast]);

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
    <ToastContext.Provider value={api}>
      {children}
      <div className="sv-toaster" aria-label="Notifications">
        {items.map((t) => (
          <div
            key={t.id}
            role={t.tone === 'bad' || t.tone === 'warn' ? 'alert' : 'status'}
            className={cx('sv-toast', `sv-toast--${t.tone}`, t.size === 'lg' && 'sv-toast--lg')}
            onMouseEnter={() => pause(t.id)}
            onMouseLeave={() => resume(t.id)}
          >
            <span className="sv-toast__icon" aria-hidden="true">
              {t.icon}
            </span>
            <div className="sv-toast__text">
              <p className="sv-toast__title">{t.title}</p>
              {t.description && <p className="sv-toast__desc">{t.description}</p>}
            </div>
            <button
              type="button"
              className="sv-toast__dismiss"
              aria-label={`Dismiss: ${t.title}`}
              onClick={() => remove(t.id)}
            >
              <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
                <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
