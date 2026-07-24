import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './card.css';

/**
 * Card — the paper primitive every widget sits on. Exactly one
 * --sv-shadow, radius --sv-r, background --sv-paper, zero border (A4).
 * Not a widget type itself: widgets (S1, Trend, DataTable…) compose it.
 */
export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: 'div' | 'section' | 'article';
}

export function Card({ as: Tag = 'section', className, children, ...rest }: CardProps) {
  return (
    <Tag {...rest} className={cx('sv-card', className)}>
      {children}
    </Tag>
  );
}

/**
 * The universal card head (Law: bold title + faint subtitle left, one
 * seed text-link action right — never icon-only mystery menus).
 */
export interface CardHeadProps {
  title: string;
  subtitle?: string;
  /** One action, rendered right. Use ButtonLink or a mono range control. */
  action?: ReactNode;
  className?: string;
}

export function CardHead({ title, subtitle, action, className }: CardHeadProps) {
  return (
    <header className={cx('sv-card__head', className)}>
      <div>
        <h3 className="sv-card__title">{title}</h3>
        {subtitle && <p className="sv-card__subtitle">{subtitle}</p>}
      </div>
      {action && <div className="sv-card__action">{action}</div>}
    </header>
  );
}
