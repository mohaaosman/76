// 76° template · Sign in — B46 Split (a B24 Plate beside the ink panel), seed cobalt.
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Field, Checkbox, Button, ButtonLink, Banner, Split, PlateHead, SocialButton,
} from '@/components/seventy-six';

/* The panel is TYPE, and nothing else: a statement and one sentence on ink.
   No widgets, no screenshot, no illustration — F11's answer is "type,
   hairline, and real data", and a sign-in page has no real data yet. */

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
const foot = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 'var(--sv-s3) var(--sv-s4)',
  justifyContent: 'space-between',
  marginTop: 'var(--sv-s4)',
} as const;
const link = { color: 'var(--sv-seed-text)' } as const;

type Values = { email: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'invalid' | 'refused';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// A3: every message names what is wrong and what to do about it.
function validate({ email, password }: Values): Errors {
  const found: Errors = {};
  if (!email.trim()) found.email = 'Enter the email address on the account.';
  else if (!EMAIL.test(email))
    found.email = 'That address is missing an @ or a domain. Use the form name@company.co.';
  if (!password) found.password = 'Enter the password for this account.';
  return found;
}

const BANNERS: Record<Exclude<Status, 'idle'>, { title: string; body: string }> = {
  invalid: {
    title: 'Sign in was not sent',
    body: 'One or more fields below need fixing. Each field names what to change.',
  },
  refused: {
    title: 'That email and password do not match',
    body: 'Retype the password, or use the reset link below to set a new one. After five failed tries the account locks for 15 minutes.',
  },
};

export function AuthSignIn() {
  const [values, setValues] = useState<Values>({ email: '', password: '' });
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
    setStatus(Object.values(found).some(Boolean) ? 'invalid' : 'refused');
  }

  return (
    <Split
      footer={
        <>
          Trouble signing in? <a href="#support" style={link}>Contact support</a>
        </>
      }
    >
      <PlateHead title="Sign in" context="Northwind operations console" />

      {status !== 'idle' && (
        <div style={notice}>
          <Banner tone="bad" title={BANNERS[status].title}>
            {BANNERS[status].body}
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
          value={values.email}
          error={errors.email}
          onChange={(e) => change('email', e.target.value)}
          onBlur={() => blur('email')}
        />
        <Field
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(e) => change('password', e.target.value)}
          onBlur={() => blur('password')}
        />
        <Checkbox label="Keep me signed in" name="persist" />
        {/* A2: the one seed button on this plate. Everything else is a link. */}
        <Button type="submit" variant="primary" style={wide}>
          Sign in
        </Button>
      </form>

      <div style={rule}>
        <span style={hairline} aria-hidden="true" />
        <span className="sv-mono" style={word}>
          Or
        </span>
        <span style={hairline} aria-hidden="true" />
      </div>

      <div style={providers}>
        <SocialButton provider="google" />
        <SocialButton provider="apple" />
        <SocialButton provider="github" />
      </div>

      <div style={foot}>
        <ButtonLink href="#reset">Forgot password?</ButtonLink>
        <ButtonLink href="#sign-up">Create an account</ButtonLink>
      </div>
    </Split>
  );
}
