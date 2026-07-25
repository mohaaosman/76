// 76° template · Create account — B46 Split, seed cobalt (default root).
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Field, Button, ButtonLink, Banner, Split, PlateHead, SocialButton,
} from '@/components/seventy-six';

/* Type only — a statement and one sentence on ink. F11's answer is "type,
   hairline, and real data", and a sign-up page has no real data yet. */

/* Type only — a statement and one sentence on ink (F11). */

const providers = { display: 'grid', gap: 'var(--sv-s2)' } as const;
const rule = {
  display: 'grid',
  gridTemplateColumns: '1fr auto 1fr',
  alignItems: 'center',
  gap: 'var(--sv-s3)',
  margin: 'var(--sv-s5) 0',
} as const;
const hairline = { height: '1px', background: 'var(--sv-line)' } as const;
const word = { color: 'var(--sv-ink-soft)' } as const;
const stack = { display: 'grid', gap: 'var(--sv-s4)' } as const;
const notice = { marginBottom: 'var(--sv-s4)' } as const;
const wide = { width: '100%' } as const;
const terms = { marginTop: 'var(--sv-s3)', fontSize: '12px', color: 'var(--sv-ink-soft)' } as const;
const foot = { marginTop: 'var(--sv-s4)' } as const;
const link = { color: 'var(--sv-seed-text)' } as const;

/* F7 refuses the strength meter: the rule is stated once, up front, as the
   field's hint — then the error names the gap if the rule is not met. */
const MIN_PASSWORD = 12;
const PASSWORD_RULE = `At least ${MIN_PASSWORD} characters. A phrase you have not used elsewhere works well.`;

type Values = { name: string; email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'invalid' | 'failed';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A3: every message names what is wrong and what to do about it.
function validate({ name, email, password }: Values): Errors {
  const found: Errors = {};
  if (!name.trim()) found.name = 'Enter the name you want on the account.';
  if (!email.trim()) found.email = 'Enter the email address for this account.';
  else if (!EMAIL.test(email))
    found.email = 'That address is missing an @ or a domain. Use the form name@company.co.';
  if (!password) found.password = `Enter a password of ${MIN_PASSWORD} characters or more.`;
  else if (password.length < MIN_PASSWORD)
    found.password = `This password is ${password.length} characters. Add ${MIN_PASSWORD - password.length} more to reach ${MIN_PASSWORD}.`;
  return found;
}

const BANNERS: Record<Exclude<Status, 'idle'>, { title: string; body: string }> = {
  invalid: {
    title: 'The account was not created',
    body: 'One or more fields below need fixing. Each field names what to change.',
  },
  failed: {
    title: 'The account was not created',
    body: 'The server did not answer in time and nothing was saved. Select Create account again in a moment.',
  },
};

export function AuthSignUp() {
  const [values, setValues] = useState<Values>({ name: '', email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  /* B11 timing: validate on blur, then on every change once that field
     already carries an error — never on the first keystroke. */
  function change(key: keyof Values, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (errors[key]) setErrors({ ...errors, [key]: validate(next)[key] });
  }

  function blur(key: keyof Values) {
    setErrors({ ...errors, [key]: validate(values)[key] });
  }

  /* noValidate: the browser's own bubbles are toasts by another name, and
     A2 refuses toasts for errors. The banner and the field chrome carry it. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setStatus(Object.values(found).some(Boolean) ? 'invalid' : 'failed');
  }

  return (
    <Split
      footer={
        <>
          Setting up a team? <a href="#sales" style={link}>Talk to sales</a>
        </>
      }
    >
      <PlateHead title="Create account" context="Northwind operations console" />

      {status !== 'idle' && (
        <div style={notice}>
          <Banner tone="bad" title={BANNERS[status].title}>
            {BANNERS[status].body}
          </Banner>
        </div>
      )}

      <div style={providers}>
        <SocialButton provider="google" action="Sign up with" />
        <SocialButton provider="apple" action="Sign up with" />
        <SocialButton provider="github" action="Sign up with" />
      </div>

      <div style={rule}>
        <span style={hairline} aria-hidden="true" />
        <span className="sv-mono" style={word}>
          Or
        </span>
        <span style={hairline} aria-hidden="true" />
      </div>

      <form style={stack} onSubmit={submit} noValidate>
        <Field
          label="Full name"
          required
          autoComplete="name"
          value={values.name}
          error={errors.name}
          onChange={(e) => change('name', e.target.value)}
          onBlur={() => blur('name')}
        />
        <Field
          label="Work email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          value={values.email}
          error={errors.email}
          onChange={(e) => change('email', e.target.value)}
          onBlur={() => blur('email')}
        />
        <Field
          label="Password"
          type="password"
          required
          autoComplete="new-password"
          hint={PASSWORD_RULE}
          value={values.password}
          error={errors.password}
          onChange={(e) => change('password', e.target.value)}
          onBlur={() => blur('password')}
        />
        {/* A2: the one seed button on this plate. Everything else is a link. */}
        <Button type="submit" variant="primary" style={wide}>
          Create account
        </Button>
      </form>

      {/* Terms are the contract this account is formed under, not a separate
          consent, so they read as running copy with real links rather than a
          tick-box. Anything that genuinely needs opt-in — marketing mail —
          would be its own unticked Checkbox. */}
      <p style={terms}>
        By creating an account you agree to the{' '}
        <a href="#terms" style={link}>Terms of Service</a> and the{' '}
        <a href="#privacy" style={link}>Privacy Policy</a>.
      </p>

      <div style={foot}>
        <ButtonLink href="#sign-in">Already have an account? Sign in</ButtonLink>
      </div>
    </Split>
  );
}
