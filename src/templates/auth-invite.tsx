// 76° template · Accept invitation — B46 Split, seed cobalt (default root).
import { useState } from 'react';
import type { FormEvent } from 'react';
import { Field, Button, ButtonLink, Banner, Split, PlateHead } from '@/components/seventy-six';

/* Type only. An invitation with no author is a phish, so the panel names
   the room — the card names who invited whom, to what. */

const INVITER = 'Maria Okonjo';
const WORKSPACE = 'Acme Operations';
const INVITED_EMAIL = 'maya@northwind.co';
const SIGNED_IN_AS = 'maya@northwind.co';

/* F7 refuses the strength meter: the rule is stated once, up front, as the
   field's hint — then the error names the gap if the rule is not met. */
const MIN_PASSWORD = 12;
const PASSWORD_RULE = `At least ${MIN_PASSWORD} characters. A phrase you have not used elsewhere works well.`;

type Values = { name: string; password: string };
type Errors = Partial<Record<keyof Values, string>>;
type Status = 'idle' | 'invalid' | 'failed';

/** Whether the invited address already has an account decides the anatomy. */
type Account = 'new' | 'existing';

const context = { marginBottom: 'var(--sv-s5)', color: 'var(--sv-ink-soft)' } as const;
const stack = { display: 'grid', gap: 'var(--sv-s4)' } as const;
const notice = { marginBottom: 'var(--sv-s5)' } as const;
const wide = { width: '100%' } as const;
const foot = { marginTop: 'var(--sv-s4)' } as const;

// A3: every message names what is wrong and what to do about it.
function validate({ name, password }: Values): Errors {
  const found: Errors = {};
  if (!name.trim()) found.name = 'Enter the name your colleagues will see.';
  if (!password) found.password = `Enter a password of ${MIN_PASSWORD} characters or more.`;
  else if (password.length < MIN_PASSWORD)
    found.password = `This password is ${password.length} characters. Add ${MIN_PASSWORD - password.length} more to reach ${MIN_PASSWORD}.`;
  return found;
}

const BANNERS: Record<Exclude<Status, 'idle'>, { title: string; body: string }> = {
  invalid: {
    title: 'The invitation was not accepted',
    body: 'One or more fields below need fixing. Each field names what to change.',
  },
  failed: {
    title: 'The invitation was not accepted',
    body: `The server did not answer in time and nothing was saved. Select Accept invitation again in a moment, or ask ${INVITER} to send a fresh invitation.`,
  },
};

export function AuthInvite({ account = 'new' }: { account?: Account }) {
  const [values, setValues] = useState<Values>({ name: '', password: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>('idle');

  /* B11 timing: validate on blur, then on every change once that field
     already carries an error — never on the first keystroke. */
  function change(key: keyof Values, value: string) {
    const next = { ...values, [key]: value };
    setValues(next);
    if (errors[key]) setErrors({ ...errors, [key]: validate(next)[key] });
  }

  function touched(key: keyof Values) {
    setErrors({ ...errors, [key]: validate(values)[key] });
  }

  /* noValidate: the browser's own bubbles are toasts by another name, and
     A2 refuses toasts for errors. The banner and the field chrome carry it. */
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (account === 'existing') {
      setStatus('failed');
      return;
    }
    const found = validate(values);
    setErrors(found);
    setStatus(Object.values(found).some(Boolean) ? 'invalid' : 'failed');
  }

  return (
    <Split>
      <PlateHead
        title="Accept invitation"
        context={`Join ${WORKSPACE} and start where ${INVITER} left off.`}
      />

      {status !== 'idle' && (
        <div style={notice}>
          <Banner tone="bad" title={BANNERS[status].title}>
            {BANNERS[status].body}
          </Banner>
        </div>
      )}

      {/* Natural case in the DOM so names and addresses are read correctly;
          sv-mono sets the uppercase presentation. The line states who is
          asking and for what — an invitation with no author is a phish. */}
      <p className="sv-mono" style={context}>
        {INVITER} invited {INVITED_EMAIL} to {WORKSPACE}
      </p>

      <form style={stack} onSubmit={submit} noValidate>
        {/* An existing account needs no fields: the decision IS the form. */}
        {account === 'new' && (
          <>
            <Field
              label="Full name"
              required
              autoComplete="name"
              value={values.name}
              error={errors.name}
              onChange={(e) => change('name', e.target.value)}
              onBlur={() => touched('name')}
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
              onBlur={() => touched('password')}
            />
          </>
        )}

        {/* A2: the one seed button on this plate. Everything else is a link. */}
        <Button type="submit" variant="primary" style={wide}>
          Accept invitation
        </Button>
      </form>

      <div style={foot}>
        {account === 'existing' ? (
          <ButtonLink href="#switch-account">
            Signed in as {SIGNED_IN_AS} — accept as someone else
          </ButtonLink>
        ) : (
          <ButtonLink href="#decline">Decline this invitation</ButtonLink>
        )}
      </div>
    </Split>
  );
}
