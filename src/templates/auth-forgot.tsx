// 76° template · Forgot password — B24 Plate, band-less, seed cobalt (default root).
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Field, Button, ButtonLink, Banner, Plate, PlateHead } from '@/components/seventy-six';
// v0.3 component; the barrel does not export it yet.

const stack = { display: 'grid', gap: 'var(--sv-s4)' } as const;
const notice = { marginBottom: 'var(--sv-s4)' } as const;
const wide = { width: '100%' } as const;
const prose = { display: 'grid', gap: 'var(--sv-s3)', fontSize: '13px' } as const;
const soft = { color: 'var(--sv-ink-soft)' } as const;
const sentActions = { display: 'grid', gap: 'var(--sv-s4)', marginTop: 'var(--sv-s5)' } as const;
const foot = { marginTop: 'var(--sv-s4)' } as const;
const link = { color: 'var(--sv-seed-text)' } as const;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A3: the message names what is wrong and what to do about it.
function validate(email: string) {
  if (!email.trim()) return 'Enter the email address on the account.';
  if (!EMAIL.test(email))
    return 'That address is missing an @ or a domain. Use the form name@company.co.';
  return undefined;
}

export function AuthForgot() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string>();
  const [failed, setFailed] = useState(false);
  const [sent, setSent] = useState(false);
  const [resent, setResent] = useState(false);

  /* B11 timing: validate on blur, then on every change once the field
     already carries an error — never on the first keystroke. */
  function change(value: string) {
    setEmail(value);
    if (!error) return;
    const found = validate(value);
    setError(found);
    if (!found) setFailed(false);
  }

  /* noValidate: the browser's own bubbles are toasts by another name, and
     A2 refuses toasts for errors. The banner and the field chrome carry it. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(email);
    setError(found);
    setFailed(Boolean(found));
    /* The server answers the same way whether or not the address has an
       account, and so does this screen: one state, one wording, no leak. */
    if (!found) setSent(true);
  }

  return (
    <Plate
      footer={
        <>
          Still stuck? <a href="#support" style={link}>Contact support</a>
        </>
      }
    >
      {sent ? (
        <>
          <PlateHead
            title="Check your email"
            context={`If ${email} has an account, a reset link is on its way.`}
          />
          <div style={prose}>
            <p style={soft}>
              The link works once and stops working after 30 minutes. Opening it lets you set a new
              password without the old one.
            </p>
            <p style={soft}>
              Nothing after a few minutes? Look in spam and junk, confirm the address was typed
              correctly, then send the link again.
            </p>
          </div>
          <div style={{ ...stack, marginTop: 'var(--sv-s5)' }}>
            <Button type="button" variant="ghost" style={wide} onClick={() => setSent(true)}>
              Send the link again
            </Button>
            <ButtonLink href="#sign-in">Back to sign in</ButtonLink>
          </div>
        </>
      ) : (
        <>
          <PlateHead
            title="Reset password"
            context="We send a one-time link to the address on the account."
          />

          {failed && (
            <div style={notice}>
              <Banner tone="bad" title="The reset link was not sent">
                The email address below needs fixing. It names what to change.
              </Banner>
            </div>
          )}

          <form style={stack} onSubmit={submit} noValidate>
            <Field
              label="Email"
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              error={error}
              onChange={(e) => change(e.target.value)}
              onBlur={() => setError(validate(email))}
            />
            {/* A2: the one seed button on this plate. Everything else is a link. */}
            <Button type="submit" variant="primary" style={wide}>
              Send reset link
            </Button>
          </form>

          <div style={foot}>
            <ButtonLink href="#sign-in">Back to sign in</ButtonLink>
          </div>
        </>
      )}
    </Plate>
  );
}
