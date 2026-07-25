// 76° template · Reset password — B46 Split, seed-neutral → default cobalt root.
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Banner, Button, Field, Split, PlateHead } from '@/components/seventy-six';

/* Two conditions, two panels — type only. Neither is a place to sell: one
   states what the new password must clear, the other that nothing has
   changed yet. */

const EMAIL = 'maya@northwind.co';

/* F7 refuses a strength meter: the rule is STATED before the field, and a
   miss is an inline error naming what failed and how to fix it. */
const PASSWORD_RULE = 'At least 12 characters, including one number';
const MIN_LENGTH = 12;

const stack = { display: 'grid', gap: 'var(--sv-s4)' } as const;
const notice = { marginBottom: 'var(--sv-s5)' } as const;
const full = { width: '100%' } as const;

function passwordError(value: string) {
  if (!value) return 'No password entered. Type one of at least 12 characters, including one number.';
  if (value.length < MIN_LENGTH || !/\d/.test(value))
    return 'That password misses the rule. Use at least 12 characters and include one number.';
  return '';
}

function confirmError(password: string, confirm: string) {
  if (!confirm) return 'The confirmation is empty. Retype the new password here.';
  if (confirm !== password)
    return 'The two passwords do not match. Retype it exactly as the password above.';
  return '';
}

type Errors = { password: string; confirm: string };
const CLEAR: Errors = { password: '', confirm: '' };

function ResetForm() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<Errors>(CLEAR);
  const [failed, setFailed] = useState(false);

  /* B11 timing. Nothing is judged on the first keystroke: `force` is passed
     on blur, and after that the field carries an error, so it re-checks on
     every change and the fix is confirmed the moment it lands. Changing the
     password re-checks the confirmation too — the mismatch is a pair. */
  function check(next: Partial<Errors>, force?: keyof Errors) {
    const p = next.password ?? password;
    const c = next.confirm ?? confirm;
    setErrors((prev) => ({
      password: force === 'password' || prev.password ? passwordError(p) : '',
      confirm: force === 'confirm' || prev.confirm ? confirmError(p, c) : '',
    }));
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const next = { password: passwordError(password), confirm: confirmError(password, confirm) };
    setErrors(next);
    setFailed(Boolean(next.password || next.confirm));
  }

  return (
    <Split
      footer={<a href="#signin">Back to sign in</a>}
    >
      {/* A2: the failure renders here, at its source — never as a toast. */}
      {failed && (
        <div style={notice}>
          <Banner tone="bad" title="Password not set">
            The password was not saved because the fields below do not pass the rule. Fix the ones
            marked, then set the new password again.
          </Banner>
        </div>
      )}

      <PlateHead title="Set a new password" context={`Resetting the password for ${EMAIL}`} />

      <form style={stack} onSubmit={submit} noValidate>
        <Field
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          hint={PASSWORD_RULE}
          value={password}
          error={errors.password || undefined}
          onChange={(e) => {
            setPassword(e.target.value);
            check({ password: e.target.value });
          }}
          onBlur={() => check({}, 'password')}
        />
        <Field
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          error={errors.confirm || undefined}
          onChange={(e) => {
            setConfirm(e.target.value);
            check({ confirm: e.target.value });
          }}
          onBlur={() => check({}, 'confirm')}
        />
        <Button type="submit" variant="primary" style={full}>
          Set new password
        </Button>
      </form>
    </Split>
  );
}

/* The same split, the other condition: the link is dead, so the screen has
   one job left — get a live one sent. No form, one primary. */
function ExpiredLink() {
  return (
    <Split
      footer={<a href="#signin">Back to sign in</a>}
    >
      <div style={notice}>
        <Banner tone="bad" title="This reset link has expired">
          Reset links are single-use and last 30 minutes. Send a fresh link to {EMAIL} and open the
          newest email.
        </Banner>
      </div>

      <PlateHead title="Reset link expired" context="Nothing on the account has changed." />

      <Button variant="primary" style={full}>
        Send reset link
      </Button>
    </Split>
  );
}

export type AuthResetState = 'form' | 'expired';

export interface AuthResetProps {
  /** One screen at a time: one h1, one primary (A2, A4). */
  state?: AuthResetState;
}

export function AuthReset({ state = 'form' }: AuthResetProps) {
  return state === 'expired' ? <ExpiredLink /> : <ResetForm />;
}
