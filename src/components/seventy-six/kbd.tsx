import { Fragment } from 'react';
import { cx } from '@/lib/cx';
import './kbd.css';

/**
 * B32 · Kbd — a key, printed. Documentation of a shortcut that exists;
 * never a button, never the only way to reach an action (C4).
 */
export interface KbdProps {
  /** One key per string: ['⌘', 'K']. Rendered as separate caps. */
  keys: string[];
  /** Shown between caps for a sequence ("then"); omit for a chord. */
  separator?: string;
  className?: string;
}

export function Kbd({ keys, separator, className }: KbdProps) {
  return (
    <span className={cx('sv-kbd', className)}>
      {keys.map((key, i) => (
        <Fragment key={key}>
          {i > 0 && separator && <span className="sv-kbd__sep">{separator}</span>}
          <kbd className="sv-kbd__cap sv-mono">{key}</kbd>
        </Fragment>
      ))}
    </span>
  );
}
