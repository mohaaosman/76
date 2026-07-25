import { createContext, useCallback, useContext, useEffect, useId, useMemo, useRef, useState } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Button } from './button';
import { Drawer } from './drawer';
import './band.css';

/**
 * B1 · Band — the ink container. All navigation and page context live
 * here; the paper below is 100% work (Law 5). Three rows max:
 * Topbar → SubTabs → PageHero.
 *
 * Nav is horizontal at >=1000px — the sidebar is still banned as the
 * DESKTOP primary nav. Below 1000px the nav and sub-tab rows have no
 * honest horizontal home, so they collapse into a left B21 Drawer behind
 * a labelled "Menu" trigger. The row never scrolls sideways at any width
 * and nothing is lost at 320px (C7).
 */

/** Below this width the band nav and sub-tabs move into the drawer. */
const BAND_BREAKPOINT = 1000;

export interface BandNavItem {
  label: string;
  href: string;
  active?: boolean;
}

/** Adapter for router links — keeps the band router-agnostic. */
type RenderLink = (item: BandNavItem, className: string, ariaCurrent?: 'page') => ReactNode;

interface SubTabsSlot {
  items: BandNavItem[];
  renderLink?: RenderLink;
}

const NO_SUBTABS: SubTabsSlot = { items: [] };

/* BandSubTabs is a sibling of BandTopbar, but below 1000px its items
   nest under the active nav item inside the drawer that BandNav owns.
   The band passes them across; the prop shapes of both stay untouched. */
const BandContext = createContext<{
  subtabs: SubTabsSlot;
  register: (slot: SubTabsSlot) => void;
} | null>(null);

export function Band({ className, children, ...rest }: HTMLAttributes<HTMLElement>) {
  const [subtabs, setSubtabs] = useState<SubTabsSlot>(NO_SUBTABS);
  const register = useCallback((slot: SubTabsSlot) => setSubtabs(slot), []);
  const value = useMemo(() => ({ subtabs, register }), [subtabs, register]);

  return (
    <BandContext.Provider value={value}>
      <header {...rest} className={cx('sv-band', className)}>
        {children}
      </header>
    </BandContext.Provider>
  );
}

/* ---------- Topbar ---------- */

export interface BandTopbarProps {
  /** App name shown after the wordmark hairline, e.g. "Warehouse".
      Omitted on the PUBLIC surface (v0.5): a marketing page is not an app,
      so the wordmark stands alone and the hairline has nothing to divide. */
  app?: string;
  /** Omitted on the public surface, where the band carries marketing links
      and one primary rather than product navigation. */
  nav?: ReactNode;
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
          {app && <span className="sv-band__appname">{app}</span>}
        </span>
        {nav}
        {utilities && <div className="sv-band__utilities">{utilities}</div>}
      </div>
    </div>
  );
}

/* ---------- Nav ---------- */

/** Three lines, aria-hidden — the word "Menu" is the label (A2/A4). */
const MENU_GLYPH = (
  <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
    <path
      d="M2 4.5h12M2 8h12M2 11.5h12"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

function fallbackLink(item: BandNavItem, className: string) {
  return (
    <a href={item.href} className={className} aria-current={item.active ? 'page' : undefined}>
      {item.label}
    </a>
  );
}

function toLink(item: BandNavItem, className: string, renderLink?: RenderLink) {
  return renderLink
    ? renderLink(item, className, item.active ? 'page' : undefined)
    : fallbackLink(item, className);
}

export function BandNav({ items, renderLink }: { items: BandNavItem[]; renderLink?: RenderLink }) {
  const subtabs = useContext(BandContext)?.subtabs ?? NO_SUBTABS;
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);
  const panelId = useId();

  /* Focus returns to the trigger on every close path — Esc, scrim, the
     drawer's close control, or following a link. The drawer's own
     close() has already run by the time a parent effect fires. */
  useEffect(() => {
    if (wasOpen.current && !open) triggerRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  /* At >=1000px the horizontal nav is back and the trigger is gone; a
     drawer left open there would trap focus behind visible chrome. */
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${BAND_BREAKPOINT}px)`);
    const sync = () => {
      if (!mq.matches) setOpen(false);
    };
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  return (
    <>
      <nav className="sv-band__nav" aria-label="Primary">
        <ul className="sv-band__navlist">
          {items.map((item) => (
            <li key={item.label}>
              {toLink(
                item,
                cx('sv-band__navlink', item.active && 'sv-band__navlink--active'),
                renderLink,
              )}
            </li>
          ))}
        </ul>
      </nav>

      <Button
        ref={triggerRef}
        type="button"
        variant="ghost"
        className="sv-band__menu"
        iconLeading={MENU_GLYPH}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(true)}
      >
        Menu
      </Button>

      <Drawer open={open} onClose={() => setOpen(false)} title="Menu" side="left" size="sm">
        {/* Delegated: any link in here navigates, so the drawer closes. */}
        <nav
          id={panelId}
          className="sv-band__drawernav"
          aria-label="Primary"
          onClick={() => setOpen(false)}
        >
          <ul className="sv-band__drawerlist">
            {items.map((item) => (
              <li key={item.label}>
                {toLink(
                  item,
                  cx('sv-band__drawerlink', item.active && 'sv-band__drawerlink--active'),
                  renderLink,
                )}
                {item.active && subtabs.items.length > 0 && (
                  <ul className="sv-band__drawersublist">
                    {subtabs.items.map((sub) => (
                      <li key={sub.label}>
                        {toLink(
                          sub,
                          cx(
                            'sv-band__drawersublink sv-mono',
                            sub.active && 'sv-band__drawersublink--active',
                          ),
                          subtabs.renderLink,
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </Drawer>
    </>
  );
}

/* ---------- SubTabs ---------- */

export function BandSubTabs({ items, renderLink }: { items: BandNavItem[]; renderLink?: RenderLink }) {
  const register = useContext(BandContext)?.register;
  const latest = useRef<SubTabsSlot>({ items, renderLink });

  /* An inline items array is a new identity every render; key on the
     content so the drawer re-registers only when the row really changes. */
  const key = items.map((i) => `${i.label}|${i.href}|${i.active ? 1 : 0}`).join('~');

  /* Written after commit, never during render: React may replay or discard
     a render, and a ref written there can carry values from UI that never
     committed. This effect runs before the register effect below, so that
     one always reads the values this commit actually painted. */
  useEffect(() => {
    latest.current = { items, renderLink };
  });

  useEffect(() => {
    if (!register) return;
    register(latest.current);
    return () => register(NO_SUBTABS);
  }, [register, key]);

  if (items.length === 0) return null; // collapses when the section has no children
  return (
    <nav className="sv-band__subtabs" aria-label="Section">
      <ul className="sv-band__container sv-band__subtablist">
        {items.map((item) => (
          <li key={item.label}>
            {toLink(
              item,
              cx('sv-band__subtab sv-mono', item.active && 'sv-band__subtab--active'),
              renderLink,
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------- PageHero ---------- */

export interface PageHeroProps {
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

export function PageHero({ title, titleSoft, context, actions, headingLevel = 1 }: PageHeroProps) {
  const Heading = headingLevel === 1 ? 'h1' : 'h2';
  return (
    <div className="sv-band__container sv-band__hero">
      <div>
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
