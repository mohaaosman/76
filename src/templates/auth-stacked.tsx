// 76° template · Sign in, stacked band — B46 Split orientation="stacked", seed cobalt.
import { useState } from 'react';
import type { FormEvent } from 'react';
import {
  Field, Checkbox, Button, ButtonLink, Banner, Split, PlateHead, SocialButton,
} from '@/components/seventy-six';

/* The same screen as auth-sign-in, on the other orientation: the ink is a
   full-width band across the top and the card climbs 44px over its edge —
   B2's overlap, spent here because a Plate has no Sheet to spend it in.
   Which orientation a product picks is one prop, not two codebases.
   The panel is type only, exactly as on the side orientation. */

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

export function AuthStacked() {
  const [values, setValues] = useState<Values>({ email: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [refused, setRefused] = useState(false);

  /* B11 timing: on blur, then on change once the field already has an error. */
  function change(key: keyof Values, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (errors[key]) setErrors({ ...errors, [key]: validate(next)[key] });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found = validate(values);
    setErrors(found);
    setRefused(!Object.values(found).some(Boolean));
  }

  return (
    <Split
      orientation="stacked"
      footer={
        <>
          Trouble signing in? <a href="#support" style={link}>Contact support</a>
        </>
      }
    >
      <PlateHead title="Sign in" context="Northwind operations console" />

      {refused && (
        <div style={notice}>
          <Banner tone="bad" title="That email and password do not match">
            Retype the password, or use the reset link below to set a new one. After five failed
            tries the account locks for 15 minutes.
          </Banner>
        </div>
      )}

      <div style={providers}>
        <SocialButton provider="google" />
        <SocialButton provider="github" />
      </div>

      <div style={rule}>
        <span style={hairline} aria-hidden="true" />
        <span className="sv-mono" style={word}>
          Or
        </span>
        <span style={hairline} aria-hidden="true" />
      </div>

      {/* noValidate: the browser's bubbles are toasts by another name (A2). */}
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
          onBlur={() => setErrors({ ...errors, email: validate(values).email })}
        />
        <Field
          label="Password"
          type="password"
          required
          autoComplete="current-password"
          value={values.password}
          error={errors.password}
          onChange={(e) => change('password', e.target.value)}
          onBlur={() => setErrors({ ...errors, password: validate(values).password })}
        />
        <Checkbox label="Keep me signed in" name="persist" />
        {/* A2: the one seed button on this plate. Everything else is a link. */}
        <Button type="submit" variant="primary" style={wide}>
          Sign in
        </Button>
      </form>

      <div style={foot}>
        <ButtonLink href="#reset">Forgot password?</ButtonLink>
        <ButtonLink href="#sign-up">Create an account</ButtonLink>
      </div>
    </Split>
  );
}
