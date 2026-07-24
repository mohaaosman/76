import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './banner.css';

/**
 * B22 · Banner — the INLINE notice. Where toasts drift, banners sit in
 * the flow at the point of relevance: a form's failed submit, a page's
 * degraded sync, a record's pending approval. This is the surface B14's
 * discipline points errors at. Tones follow the three-color law:
 * ok/bad words, ink for info/warn — no amber surface enters the system.
 */
export type BannerTone = 'info' | 'ok' | 'warn' | 'bad';

export interface BannerProps {
  tone?: BannerTone;
  title: string;
  /** Full sentences: what happened and how to fix it. */
  children?: ReactNode;
  /** One text-link action, e.g. "Retry sync". */
  action?: ReactNode;
  /** Renders a dismiss control. Persistent conditions omit it. */
  onDismiss?: () => void;
  className?: string;
}

const TONE_ICONS: Record<BannerTone, ReactNode> = {
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

export function Banner({ tone = 'info', title, children, action, onDismiss, className }: BannerProps) {
  return (
    <div
      role={tone === 'bad' ? 'alert' : 'status'}
      className={cx('sv-banner', `sv-banner--${tone}`, className)}
    >
      <span className="sv-banner__icon" aria-hidden="true">
        {TONE_ICONS[tone]}
      </span>
      <div className="sv-banner__text">
        <p className="sv-banner__title">{title}</p>
        {children && <div className="sv-banner__body">{children}</div>}
      </div>
      {action && <span className="sv-banner__action">{action}</span>}
      {onDismiss && (
        <button
          type="button"
          className="sv-banner__dismiss"
          aria-label={`Dismiss: ${title}`}
          onClick={onDismiss}
        >
          <svg viewBox="0 0 10 10" width="10" height="10" aria-hidden="true">
            <path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      )}
    </div>
  );
}
