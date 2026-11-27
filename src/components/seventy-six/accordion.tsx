import { forwardRef } from 'react';
import type { HTMLAttributes, MouseEvent, ReactNode } from 'react';
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
  /**
   * Controlled open state. When set, this section's open state follows the
   * prop and a click only asks `onOpenChange` — the caller decides. Omit
   * for the native uncontrolled behaviour (`defaultOpen`).
   */
  open?: boolean;
  /** The section cannot be opened or closed; its summary reports aria-disabled. */
  disabled?: boolean;
}

export interface AccordionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  sections: AccordionSection[];
  /**
   * One open at a time (native `name` grouping). Omit for independent
   * sections — the default, because closing a section the reader opened
   * is a surprise.
   */
  exclusive?: boolean;
  /** Required when exclusive: the shared native group name. */
  name?: string;
  /**
   * Called when a section asks to open or close. In uncontrolled mode it
   * reports the native toggle after the fact; for a section with `open`
   * set it is the only thing that changes it.
   */
  onOpenChange?: (id: string, open: boolean) => void;
}

export const Accordion = forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  { sections, exclusive = false, name, className, onOpenChange, ...rest },
  ref,
) {
  return (
    <div {...rest} ref={ref} className={cx('sv-accordion', className)}>
      {sections.map((section) => {
        const controlled = section.open !== undefined;
        function onSummaryClick(e: MouseEvent<HTMLElement>) {
          /* A disabled or controlled section never toggles itself natively:
             a controlled one asks the caller, a disabled one stays put. */
          if (section.disabled) {
            e.preventDefault();
            return;
          }
          if (controlled) {
            e.preventDefault();
            onOpenChange?.(section.id, !section.open);
          }
        }
        return (
          <details
            key={section.id}
            className="sv-accordion__item"
            name={exclusive ? (name ?? 'sv-accordion') : undefined}
            open={controlled ? section.open : section.defaultOpen}
            onToggle={
              controlled || !onOpenChange
                ? undefined
                : (e) => onOpenChange(section.id, (e.currentTarget as HTMLDetailsElement).open)
            }
          >
            <summary
              className="sv-accordion__summary"
              aria-disabled={section.disabled || undefined}
              onClick={onSummaryClick}
            >
              <span className="sv-accordion__chevron" aria-hidden="true" />
              <span className="sv-accordion__title">{section.title}</span>
              {section.meta != null && <span className="sv-accordion__meta sv-mono">{section.meta}</span>}
            </summary>
            <div className="sv-accordion__panel">{section.children}</div>
          </details>
        );
      })}
    </div>
  );
});
