import { forwardRef, useId, useLayoutEffect, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { inlineStep, useDirection } from '@/lib/i18n';
import './tabs.css';

/**
 * B38 · Tabs — the sheet's content switch. One job: change WHICH SET OF
 * CARDS the sheet shows, without touching the URL. Three components look
 * alike and are not interchangeable: BandSubTabs (B1) NAVIGATE — they are
 * links, they change the URL, they live on the band; CardTabs (B8) FILTER
 * ONE CARD'S CONTENT in place and live on that card's hairline; Tabs (B38)
 * SWITCH A WHOLE CONTENT REGION OF THE SHEET and live on the wall, directly
 * above the region they switch. Pick by what changes, not by what it looks
 * like.
 *
 * There is no `filters` mode here — aria-pressed buttons are B8's job, and
 * a tablist that sometimes is not a tablist is a defect. If the switch is
 * addressable state a user should be able to link to or reload into, it is
 * navigation and belongs on the band.
 */
export interface Tab {
  id: string;
  label: string;
  /** Optional mono tabular count shown after the label. */
  count?: number;
  /** The tab cannot be chosen; arrow keys step over it. */
  disabled?: boolean;
}

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Cap: five. A sixth section is a band nav item, not a tab. */
  tabs: Tab[];
  /** Controlled: the active tab id. When passed it wins over internal state. */
  active?: string;
  /** Uncontrolled: the tab active on first render. Defaults to the first enabled tab. */
  defaultActive?: string;
  /** Called with the id the user chose — in both modes. */
  onChange?: (id: string) => void;
  /** Ties each tab to its OWN panel: `${idBase}-tab-${id}` / `${idBase}-panel-${id}`.
      Pass it explicitly whenever TabPanel is used — TabPanel requires the same base. */
  idBase?: string;
  /** Accessible name for the tablist, e.g. "Report sections". */
  label: string;
  className?: string;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  { tabs, active: activeProp, defaultActive, onChange, idBase, label, className, onKeyDown: onKeyDownProp, ...rest },
  ref,
) {
  const dir = useDirection();
  const autoId = useId();
  const base = idBase ?? autoId;
  const listRef = useRef<HTMLDivElement | null>(null);
  const [own, setOwn] = useState(() => defaultActive ?? tabs.find((t) => !t.disabled)?.id ?? '');
  const active = activeProp ?? own;

  function choose(id: string) {
    if (activeProp === undefined) setOwn(id);
    onChange?.(id);
  }

  /* A TabPanel rendered WITHOUT `active` follows this tablist on its own:
     the uncontrolled pair needs no state in the caller. React never sets
     `hidden` on such a panel, so writing it here cannot be overwritten. */
  useLayoutEffect(() => {
    const doc = listRef.current?.ownerDocument;
    if (!doc) return;
    for (const t of tabs) {
      const panel = doc.getElementById(`${base}-panel-${t.id}`);
      if (panel && panel.hasAttribute('data-sv-tabpanel-auto')) panel.hidden = t.id !== active;
    }
  }, [tabs, base, active]);

  /* Automatic activation: arrowing moves focus AND switches the region.
     The panels are already mounted client-side, so there is nothing to
     wait for and no reason to make the user press Enter twice. */
  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    onKeyDownProp?.(e);
    if (e.defaultPrevented) return;
    const idx = tabs.findIndex((t) => t.id === active);
    const n = tabs.length;
    /* Walks from `from` in `step` direction to the next enabled tab. */
    const seek = (from: number, step: number) => {
      for (let k = 0, i = from; k < n; k++, i = (i + step + n) % n) if (!tabs[i].disabled) return i;
      return -1;
    };
    let next = -1;
    /* ← and → follow the reading direction: in RTL the next tab is to the left. */
    const step = inlineStep(e.key, dir);
    if (step !== 0) next = seek((idx + step + n) % n, step);
    if (e.key === 'Home') next = seek(0, 1);
    if (e.key === 'End') next = seek(n - 1, -1);
    if (next >= 0) {
      e.preventDefault();
      choose(tabs[next].id);
      const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>('button');
      buttons?.[next]?.focus();
    }
  }

  return (
    <div
      {...rest}
      ref={(node) => {
        listRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx('sv-tabs', className)}
      role="tablist"
      aria-label={label}
      onKeyDown={onKeyDown}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`${base}-tab-${tab.id}`}
            className={cx('sv-tabs__tab', isActive && 'sv-tabs__tab--active')}
            aria-selected={isActive}
            aria-controls={`${base}-panel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => choose(tab.id)}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="sv-tabs__count sv-mono sv-num">{tab.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
});

export interface TabPanelProps extends HTMLAttributes<HTMLDivElement> {
  idBase: string;
  tabId: string;
  /**
   * Whether this panel is showing. Omit it to let the Tabs with the same
   * `idBase` show and hide the panel itself (uncontrolled Tabs).
   */
  active?: boolean;
  children: ReactNode;
  className?: string;
}

/**
 * Every tab owns its OWN panel — unlike B8, where one panel serves the whole
 * card and each tab points at the same id. Render one TabPanel per Tab, all
 * of them, and let `hidden` decide: the id contract only holds if the panel
 * the active tab names is in the document.
 */
export function TabPanel({ idBase, tabId, active, children, className, ...rest }: TabPanelProps) {
  return (
    <div
      {...rest}
      role="tabpanel"
      id={`${idBase}-panel-${tabId}`}
      aria-labelledby={`${idBase}-tab-${tabId}`}
      hidden={active === undefined ? undefined : !active}
      data-sv-tabpanel-auto={active === undefined ? '' : undefined}
      /* A panel of cards holds no focusable content of its own, so it takes
         tabIndex 0 — otherwise the tab key steps straight past the region
         the tabs just switched to. */
      tabIndex={0}
      className={cx('sv-tabs__panel', className)}
    >
      {children}
    </div>
  );
}
