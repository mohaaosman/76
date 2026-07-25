import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Card } from './card';
import './plate.css';

/**
 * B24 · Plate — the band-less page. Every other 76° template opens with
 * a Band; a plate has no nav, no sub-tabs, no hero, so it has no band at
 * all. One card on the bare wall, centred both axes, under the mono 76°
 * wordmark. Serves sign-in, sign-up, reset, verify, 404, 500, maintenance
 * and expired links — the wording is the caller's, the anatomy is fixed.
 *
 * NEVER carries nav. NEVER carries a PageHero. The h1 lives inside the
 * card (use PlateHead) because the card IS the page here.
 */
export interface PlateProps extends HTMLAttributes<HTMLElement> {
  /** Overrides the built-in mono 76° mark. The degree sign is never dropped. */
  wordmark?: ReactNode;
  /** Card width: sm = 400px (default), md = 520px for two-column forms. */
  width?: 'sm' | 'md';
  /** One mono line under the card: legal, a support link, an error id. */
  footer?: ReactNode;
  /** The card's contents. Exactly one h1 — normally a PlateHead. */
  children?: ReactNode;
}

/* role="img" + aria-label: the mark is one word to a screen reader, not
   three orphaned characters. Six in seed, ° in soft ink — same recipe as
   the Band wordmark, restated in mono because there is no band to sit on. */
const WORDMARK = (
  <span className="sv-plate__wordmark" role="img" aria-label="Seventy Six Degrees">
    <span aria-hidden="true">7</span>
    <span className="sv-plate__wordmark-six" aria-hidden="true">6</span>
    <span className="sv-plate__wordmark-deg" aria-hidden="true">°</span>
  </span>
);

export function Plate({
  wordmark = WORDMARK,
  width = 'sm',
  footer,
  className,
  children,
  ...rest
}: PlateProps) {
  return (
    <main {...rest} className={cx('sv-plate', className)}>
      <div className={cx('sv-plate__inner', width === 'md' && 'sv-plate__inner--md')}>
        <div className="sv-plate__mark">{wordmark}</div>
        <Card className="sv-plate__card">{children}</Card>
        {footer && <p className="sv-plate__footer">{footer}</p>}
      </div>
    </main>
  );
}

/**
 * The plate's head — the screen's one h1 plus a single sentence of
 * context. Names the task or the condition ("Sign in", "Page not found"),
 * never the app.
 */
export interface PlateHeadProps {
  title: string;
  /** One sentence: what this screen wants, or what went wrong and what's next. */
  context?: string;
  className?: string;
}

export function PlateHead({ title, context, className }: PlateHeadProps) {
  return (
    <header className={cx('sv-plate__head', className)}>
      <h1 className="sv-plate__title">{title}</h1>
      {context && <p className="sv-plate__context">{context}</p>}
    </header>
  );
}
