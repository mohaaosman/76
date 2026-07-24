import { forwardRef, useLayoutEffect, useRef, useState } from 'react';
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cx } from '@/lib/cx';
import './button.css';

/**
 * B10 · Button — one primary per view region. Buttons never move or
 * resize on state change; destructive actions confirm with a typed object.
 */
export type ButtonVariant = 'primary' | 'ghost' | 'danger' | 'link';

interface ButtonOwnProps {
  variant?: ButtonVariant;
  /** POS anatomy: same bones at >=48px height, press feedback <100ms. */
  pos?: boolean;
  /** Swaps the label and locks width to the pre-loading size. */
  isLoading?: boolean;
  /** Label shown while loading, e.g. "Saving…". Required if isLoading is used. */
  loadingLabel?: string;
  /** 16px stroke icon before the label. Icon-only buttons need aria-label. */
  iconLeading?: ReactNode;
  children?: ReactNode;
}

export type ButtonProps = ButtonOwnProps & ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'primary',
    pos = false,
    isLoading = false,
    loadingLabel = 'Working…',
    iconLeading,
    className,
    children,
    disabled,
    ...rest
  },
  ref,
) {
  const innerRef = useRef<HTMLButtonElement | null>(null);
  const [lockedWidth, setLockedWidth] = useState<number>();

  /* B10: width locked to pre-loading size while loading. */
  useLayoutEffect(() => {
    if (isLoading && innerRef.current && lockedWidth === undefined) {
      setLockedWidth(innerRef.current.offsetWidth);
    }
    if (!isLoading && lockedWidth !== undefined) {
      setLockedWidth(undefined);
    }
  }, [isLoading, lockedWidth]);

  return (
    <button
      {...rest}
      ref={(node) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) ref.current = node;
      }}
      className={cx('sv-btn', `sv-btn--${variant}`, pos && 'sv-btn--pos', className)}
      style={lockedWidth !== undefined ? { ...rest.style, width: lockedWidth } : rest.style}
      disabled={disabled || isLoading}
      aria-busy={isLoading || undefined}
    >
      {isLoading ? (
        <>
          <svg className="sv-btn__spinner" viewBox="0 0 12 12" width="12" height="12" aria-hidden="true">
            <circle cx="6" cy="6" r="5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="23" strokeDashoffset="8" strokeLinecap="round" />
          </svg>
          <span>{loadingLabel}</span>
        </>
      ) : (
        <>
          {iconLeading != null && (
            <span className="sv-btn__icon" aria-hidden="true">
              {iconLeading}
            </span>
          )}
          {children}
        </>
      )}
    </button>
  );
});

/** Text-link that looks like a button action (B10 "text link action"). */
export type ButtonLinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

export function ButtonLink({ className, children, ...rest }: ButtonLinkProps) {
  return (
    <a {...rest} className={cx('sv-btn sv-btn--link', className)}>
      {children}
    </a>
  );
}
