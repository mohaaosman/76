import { useEffect, useRef, useState } from 'react';
import { cx } from '@/lib/cx';
import './code-block.css';

/**
 * B43 · CodeBlock — code or a command, printed exactly as it must be typed.
 * No syntax highlighting, ever. Highlighting is six to nine colours on one
 * surface; Ship Gate point 2 counts the colours on a screen and Law 2 allows
 * neutrals plus one seed, so a rainbow token theme fails the gate before it
 * renders. Code in 76° is monospace, ink, and correct — a reader who needs
 * colour to parse a snippet has been handed a snippet that is too long.
 * The block is a quotation, not a card: an inset panel on --sv-wall, the one
 * place paper carries a bordered inset.
 */
export interface CodeBlockProps {
  code: string;
  /** Filename or language, mono, in the head. */
  label?: string;
  numbered?: boolean;
  copyable?: boolean;
  ariaLabel?: string;
  className?: string;
}

const COPIED_MS = 2000;

export function CodeBlock({
  code,
  label,
  numbered = false,
  copyable = true,
  ariaLabel,
  className,
}: CodeBlockProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const timer = useRef<number>(0);
  const [copied, setCopied] = useState(false);
  const [scrollable, setScrollable] = useState(false);

  /* A control that cannot work is not shown. */
  const canCopy = copyable && typeof navigator !== 'undefined' && !!navigator.clipboard;
  const name = ariaLabel ?? (label ? `Code, ${label}` : 'Code');
  const lines = code.replace(/\n$/, '').split('\n');

  /* Only a block that actually overflows becomes a focusable scroll region —
     an unnecessary tab stop is as much a defect as an unreachable one. */
  useEffect(() => {
    const pre = preRef.current;
    if (!pre) return;
    const measure = () => setScrollable(pre.scrollWidth > pre.clientWidth);
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(pre);
    return () => observer.disconnect();
  }, [code]);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function copy() {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        setCopied(true);
        window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopied(false), COPIED_MS);
      })
      /* A failed write must not claim success — the label stays "Copy". */
      .catch(() => undefined);
  }

  return (
    <div className={cx('sv-code', className)}>
      {(label || canCopy) && (
        <div className="sv-code__head">
          {label && <span className="sv-code__label sv-mono">{label}</span>}
          {canCopy && (
            <button type="button" className="sv-btn sv-btn--link sv-code__copy" onClick={copy}>
              {copied ? 'Copied' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre
        ref={preRef}
        className="sv-code__pre"
        aria-label={name}
        role={scrollable ? 'region' : undefined}
        tabIndex={scrollable ? 0 : undefined}
      >
        {numbered && (
          /* Outside the <code> and unselectable, so a copy never picks up
             the numbers along with the code. */
          <span className="sv-code__gutter sv-mono sv-num" aria-hidden="true">
            {lines.map((_, i) => (
              <span key={i} className="sv-code__num">
                {i + 1}
              </span>
            ))}
          </span>
        )}
        <code className="sv-code__code">{code}</code>
      </pre>
      <span className="sv-visually-hidden" aria-live="polite">
        {copied ? 'Copied to clipboard' : ''}
      </span>
    </div>
  );
}
