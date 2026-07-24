import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './band.css';

/**
 * B1 · Band — the ink container. All navigation and page context live
 * here; the paper below is 100% work (Law 5). Three rows max:
 * Topbar → SubTabs → PageHero. Nav is horizontal — NEVER a sidebar.
 */
export function Band({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <header {...rest} className={cx('sv-band', className)}>
      {children}
    </header>
  );
}

/* ---------- Topbar ---------- */

export interface BandTopbarProps {
  /** App name shown after the wordmark hairline, e.g. "Warehouse". */
  app: string;
  nav: ReactNode;
  /** Right cluster: search trigger, notifications, avatar. */
  utilities?: ReactNode;
}

export function BandTopbar({ app, nav, utilities }: BandTopbarProps) {
  return (
    <div className="sv-band__topbar">
      <div className="sv-band__container sv-band__topbar-inner">
        <span className="sv-band__brand">
          {/* The degree mark is NEVER omitted. Six in seed, ° in band-soft. */}
          <span className="sv-band__wordmark" aria-label="Seventy Six Degrees">
            <span aria-hidden="true">7</span>
            <span className="sv-band__wordmark-six" aria-hidden="true">6</span>
            <span className="sv-band__wordmark-deg" aria-hidden="true">°</span>
          </span>
          <span className="sv-band__appname">{app}</span>
        </span>
        {nav}
        {utilities && <div className="sv-band__utilities">{utilities}</div>}
      </div>
    </div>
  );
}

/* ---------- Nav ---------- */

export interface BandNavItem {
  label: string;
  href: string;
  active?: boolean;
}

export function BandNav({ items, renderLink }: { items: BandNavItem[]; renderLink?: (item: BandNavItem, className: string, ariaCurrent?: 'page') => ReactNode }) {
  return (
    <nav className="sv-band__nav" aria-label="Primary">
      <ul className="sv-band__navlist">
        {items.map((item) => {
          const className = cx('sv-band__navlink', item.active && 'sv-band__navlink--active');
          return (
            <li key={item.label}>
              {renderLink ? (
                renderLink(item, className, item.active ? 'page' : undefined)
              ) : (
                <a href={item.href} className={className} aria-current={item.active ? 'page' : undefined}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- SubTabs ---------- */

export function BandSubTabs({ items, renderLink }: { items: BandNavItem[]; renderLink?: (item: BandNavItem, className: string, ariaCurrent?: 'page') => ReactNode }) {
  if (items.length === 0) return null; // collapses when the section has no children
  return (
    <nav className="sv-band__subtabs" aria-label="Section">
      <ul className="sv-band__container sv-band__subtablist">
        {items.map((item) => {
          const className = cx('sv-band__subtab sv-mono', item.active && 'sv-band__subtab--active');
          return (
            <li key={item.label}>
              {renderLink ? (
                renderLink(item, className, item.active ? 'page' : undefined)
              ) : (
                <a href={item.href} className={className} aria-current={item.active ? 'page' : undefined}>
                  {item.label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ---------- PageHero ---------- */

export interface PageHeroProps {
  /** Mono breadcrumb parts, e.g. ["OPERATIONS", "ORDERS"]. */
  breadcrumb?: string[];
  /** The h1. Pass the secondary word via titleSoft. */
  title: string;
  titleSoft?: string;
  /** One sentence max: date · scope · last sync. */
  context?: string;
  /** Right side: max one mono range control, two ghosts, ONE primary. */
  actions?: ReactNode;
  /** Heading element. Default h1 — one per page. Use 2 ONLY when the
      hero is embedded in a page that already owns its h1 (e.g. docs demos). */
  headingLevel?: 1 | 2;
}

export function PageHero({ breadcrumb, title, titleSoft, context, actions, headingLevel = 1 }: PageHeroProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="sv-band__container sv-band__hero">
      <div>
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="sv-band__breadcrumb sv-mono">
            <ol>
              {breadcrumb.map((part, i) => (
                <li key={part} aria-current={i === breadcrumb.length - 1 ? 'page' : undefined}>
                  {part}
                </li>
              ))}
            </ol>
          </nav>
        )}
        <Heading className="sv-band__title">
          {title}
          {titleSoft && <span className="sv-band__title-soft"> {titleSoft}</span>}
        </Heading>
        {context && <p className="sv-band__context">{context}</p>}
      </div>
      {actions && <div className="sv-band__actions">{actions}</div>}
    </div>
  );
}
