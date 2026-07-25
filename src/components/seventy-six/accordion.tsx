import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './accordion.css';

/**
 * B27 · Accordion — native <details>/<summary>. One list of sections that
 * open in place. It hides SECONDARY detail; it never hides the primary
 * job of a screen, and it is never navigation (that is the Band).
 */
export interface AccordionSection {
  id: string;
  title: string;
  /** Mono metadata rendered right of the title — a count, a date, a status. */
  meta?: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export interface AccordionProps {
  sections: AccordionSection[];
  /**
   * One open at a time (native `name` grouping). Omit for independent
   * sections — the default, because closing a section the reader opened
   * is a surprise.
   */
  exclusive?: boolean;
  /** Required when exclusive: the shared native group name. */
  name?: string;
  className?: string;
}

export function Accordion({ sections, exclusive = false, name, className }: AccordionProps) {
  return (
    <div className={cx('sv-accordion', className)}>
      {sections.map((section) => (
        <details
          key={section.id}
          className="sv-accordion__item"
          name={exclusive ? (name ?? 'sv-accordion') : undefined}
          open={section.defaultOpen}
        >
          <summary className="sv-accordion__summary">
            <span className="sv-accordion__chevron" aria-hidden="true" />
            <span className="sv-accordion__title">{section.title}</span>
            {section.meta != null && <span className="sv-accordion__meta sv-mono">{section.meta}</span>}
          </summary>
          <div className="sv-accordion__panel">{section.children}</div>
        </details>
      ))}
    </div>
  );
}
