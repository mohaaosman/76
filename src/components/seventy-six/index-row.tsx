import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './index-row.css';

/**
 * B56 · IndexRow — the numbered contents strip under the masthead. One job:
 * state a publication's sections as a numbered strip, and link to them.
 *
 * It is the cover's contents row: a horizontal strip of cells divided by
 * vertical hairlines, each carrying an ordinal, the section's name, and an
 * optional mono count. F11 is untouched by it — where the reference cover
 * prints a picture, a 76° page prints the places the reader can go next.
 *
 * Three components look alike here and are not interchangeable, so the
 * division is written down before someone reaches for the wrong one. **B1
 * `BandNav` is the SITE's navigation**: it is chrome, it sits on ink, it
 * travels every page, and it names the sections of the product. **B48
 * `FeatureList` states what the product DOES** and nothing in it is
 * clickable. **B56 states what THIS page contains**, and every cell goes
 * somewhere. Pick by what the reader gets: chrome, a claim, or a contents
 * page. A strip that names the app's sections is BandNav wearing a costume.
 *
 * It carries no seed FILL and no coloured block (F14): the one seed
 * rectangle on a public page belongs to the action, and this row asks for
 * nothing — it points. The seed appears here only as the colour the label
 * takes under a pointer, which is B10's text-link behaviour on a link.
 *
 * Don't: no icons or tiles per cell; no ninth section (that is a sitemap);
 * no active/current state — the strip indexes ONE page's contents, and a
 * contents line that marks itself as "where you are" is the band's job
 * (B1) or a breadcrumb by another name (F13); never a horizontal scroller
 * (A2's ban is written for the band and reads on every nav-like row).
 */
export interface IndexItem {
  id: string;
  /** The section's name. One or two words — this is a contents line. */
  label: string;
  href: string;
  /** Mono, under the label: a count, a version, a file type. */
  meta?: string;
}

/** Adapter for router links — keeps the strip router-agnostic, exactly as
    BandNav's does. Same shape, same fallback, so one function wires the
    band, the footer and the contents strip alike. */
type RenderLink = (item: IndexItem, className: string) => ReactNode;

export interface IndexRowProps {
  /** Two to eight. A ninth section is a sitemap, not a contents strip. */
  items: IndexItem[];
  /** REQUIRED, not optional as it is on B48 and B50. Those are statements
      and a name is a courtesy; this is a `<nav>` landmark, and an unnamed
      one is announced as "navigation" beside the band's — two identical
      unlabelled landmarks on one page is the defect B51 exists to make
      impossible (A4). */
  ariaLabel: string;
  /** Router adapter, exactly as BandNav takes one. Falls back to `<a>`. */
  renderLink?: (item: IndexItem, className: string) => ReactNode;
  className?: string;
}

/* The ordinal is derived from POSITION, never passed in — B48's rule and
   its reasoning, which apply with more force here: a hand-written number
   drifts the moment a section is inserted, and a contents page that
   miscounts itself sends the reader to the wrong place rather than merely
   embarrassing itself. Two digits is the ceiling the cap already assumes. */
const ordinal = (index: number) => String(index + 1).padStart(2, '0');

function fallbackLink(item: IndexItem, className: string) {
  return (
    <a href={item.href} className={className}>
      {item.label}
    </a>
  );
}

function toLink(item: IndexItem, className: string, renderLink?: RenderLink) {
  return renderLink ? renderLink(item, className) : fallbackLink(item, className);
}

export function IndexRow({ items, ariaLabel, renderLink, className }: IndexRowProps) {
  return (
    /* A real <nav>, named. The `ol` inside it is ORDERED because the
       ordinals are the point: 03 is the third section, not a decorative
       numeral beside it, and a <ul> would leave the count to the eye. */
    <nav className={cx('sv-index', className)} aria-label={ariaLabel}>
      {/* `role="list"` is not a restated implicit role for its own sake:
          `list-style: none` is what strips the list semantics in WebKit,
          and this is the one list in the system whose COUNT and ORDER are
          the information. The markers are removed because the ordinal is
          printed at display size two lines above where a marker would sit.

          The count travels as data, exactly as B48's column count does — a
          literal in an inline style would put the wrap back in the
          component and out of the stylesheet's reach. */}
      <ol className="sv-index__list" role="list" data-count={items.length}>
        {items.map((item, index) => (
          <li className="sv-index__cell" key={item.id}>
            {/* NOT aria-hidden, for B48's reason: copy refers to sections
                by number ("see 03"), and hiding a visible figure from a
                screen reader is the asymmetry C5 warns about. It is also
                deliberately OUTSIDE the anchor — inside it, the link's
                accessible name would be "01 Components", and a link that
                renames itself every time a section is inserted above it is
                a link nobody can refer to twice. Soft ink, never faint: a
                number that is read is content (C2). */}
            <span className="sv-index__ordinal sv-num">{ordinal(index)}</span>
            {/* The LABEL is the anchor, not the cell. The router adapter's
                shape is BandNav's verbatim — it is handed the item and a
                class and renders the item's own label — so a cell-sized
                anchor would have to compose an anatomy the caller's router
                cannot know about, and the ordinal and meta would vanish
                from every routed page while surviving the fallback. A
                cell-sized hit area with no visible affordance is mystery
                meat besides (A2); the words that name the section are what
                the reader aims at, and they carry their own hit area. */}
            {toLink(item, 'sv-index__link', renderLink)}
            {item.meta && <span className="sv-index__meta sv-mono">{item.meta}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
