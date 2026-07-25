import { forwardRef } from 'react';
import type { ReactNode } from 'react';
import { cx } from '@/lib/cx';
import { Button } from './button';
import type { ButtonProps } from './button';
import './social-button.css';

/**
 * B26 · SocialButton — federated identity. Ghost anatomy, composed from
 * B10 rather than redrawn: the plate's card holds a stack of these, then
 * a hairline, then the email field. Full width inside the card.
 *
 * The mark is ONE path in currentColor — no brand hex ever enters the
 * system (A1, Law 2), so the row stays legible on both surfaces and
 * inherits the button's own ink. The label names the provider; the button
 * never says "Login".
 */
export type SocialProvider = 'google' | 'apple' | 'github' | 'microsoft';

const PROVIDER_NAMES: Record<SocialProvider, string> = {
  google: 'Google',
  apple: 'Apple',
  github: 'GitHub',
  microsoft: 'Microsoft',
};

const PROVIDER_MARKS: Record<SocialProvider, ReactNode> = {
  google: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M12.76 5.25A5.5 5.5 0 1 0 13.5 8H8.4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  apple: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M13.05 11.75c-.2.47-.44.9-.72 1.3-.38.54-.7.92-.94 1.13-.37.35-.78.53-1.21.54-.31 0-.68-.09-1.12-.27-.44-.18-.84-.27-1.21-.27-.39 0-.8.09-1.24.27-.44.18-.79.28-1.06.29-.41.02-.82-.17-1.24-.55-.26-.23-.59-.62-.99-1.18-.43-.59-.78-1.28-1.06-2.06-.3-.85-.45-1.67-.45-2.46 0-.91.2-1.69.59-2.34.31-.52.72-.94 1.24-1.24.51-.3 1.07-.46 1.67-.47.33 0 .76.1 1.3.3.54.2.88.3 1.04.3.11 0 .5-.12 1.15-.35.62-.22 1.14-.31 1.57-.27 1.16.09 2.03.55 2.61 1.37-1.04.63-1.55 1.51-1.54 2.64.01.88.33 1.61.96 2.19.28.27.6.48.95.63-.08.22-.16.43-.25.63zM10.6 2.13c0 .68-.25 1.31-.74 1.9-.6.69-1.32 1.09-2.1 1.03a2.1 2.1 0 0 1-.02-.26c0-.65.28-1.35.79-1.92.25-.29.57-.53.96-.72.39-.19.75-.29 1.09-.31.01.09.02.19.02.28z"
        fill="currentColor"
      />
    </svg>
  ),
  github: (
    /* Inset viewBox: the octicon fills its box edge to edge, the other
       three marks sit ~1px in. This equalises optical weight. */
    <svg viewBox="-1.2 -1.2 18.4 18.4" width="16" height="16" aria-hidden="true">
      <path
        d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"
        fill="currentColor"
      />
    </svg>
  ),
  microsoft: (
    <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <path
        d="M2.4 2.4h5.1v5.1H2.4zM8.5 2.4h5.1v5.1H8.5zM2.4 8.5h5.1v5.1H2.4zM8.5 8.5h5.1v5.1H8.5z"
        fill="currentColor"
      />
    </svg>
  ),
};

export interface SocialButtonProps
  extends Omit<ButtonProps, 'variant' | 'pos' | 'iconLeading' | 'loadingLabel' | 'children'> {
  provider: SocialProvider;
  /** Verb phrase before the provider name. Default "Continue with". */
  action?: string;
}

export const SocialButton = forwardRef<HTMLButtonElement, SocialButtonProps>(function SocialButton(
  { provider, action = 'Continue with', type = 'button', className, ...rest },
  ref,
) {
  return (
    <Button
      {...rest}
      ref={ref}
      type={type}
      variant="ghost"
      className={cx('sv-social', className)}
      iconLeading={PROVIDER_MARKS[provider]}
      loadingLabel="Connecting…"
    >
      {`${action} ${PROVIDER_NAMES[provider]}`}
    </Button>
  );
});
