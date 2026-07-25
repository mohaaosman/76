// 76° template · Verify email (B24 Plate + B25 PinField, seed-neutral).
import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Banner, Button, Plate, PlateHead, PinField } from '@/components/seventy-six';

const EMAIL = 'maya@northwind.co';
const CODE_LENGTH = 6;
/** The sample "correct" code, so the wrong-code state is reached honestly. */
const SENT_CODE = '418302';
const COOLDOWN = 42;

type Problem = 'short' | 'wrong';

/* Both surfaces of one failure: the banner says what happened at the top of
   the card, the field says it again where the fix happens. Neither is a toast. */
const PROBLEMS: Record<Problem, { title: string; body: string; field: string }> = {
  short: {
    title: 'The code is incomplete',
    body: `Fewer than six digits were entered. Type all six digits from the email sent to ${EMAIL}, then verify again.`,
    field: 'Fewer than six digits. Type all six from the email.',
  },
  wrong: {
    title: 'That code did not match',
    body: `The six digits entered do not match the code sent to ${EMAIL}. Check the newest email and retype them, or resend the code.`,
    field: 'That code did not match. Retype it from the email, or resend the code.',
  },
};

const stack = { display: 'grid', gap: 'var(--sv-s4)' } as const;
const notice = { marginBottom: 'var(--sv-s5)' } as const;
const context = { marginBottom: 'var(--sv-s5)', color: 'var(--sv-ink-soft)' } as const;
const resend = {
  display: 'grid',
  gap: 'var(--sv-s2)',
  justifyItems: 'center',
  marginTop: 'var(--sv-s5)',
} as const;
const full = { width: '100%' } as const;

/** mm:ss for the resend window. Rendered with sv-num — A4, it changes. */
function clock(seconds: number) {
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

function useCooldown(from: number) {
  const [left, setLeft] = useState(from);
  useEffect(() => {
    if (left === 0) return;
    const t = setTimeout(() => setLeft((n) => n - 1), 1000);
    return () => clearTimeout(t);
  }, [left]);
  return [left, () => setLeft(from)] as const;
}

export type AuthVerifyState = 'idle' | 'error';

export interface AuthVerifyProps {
  /** 'error' opens on the wrong-code state; one h1 and one primary either way. */
  state?: AuthVerifyState;
}

export function AuthVerify({ state = 'idle' }: AuthVerifyProps) {
  const wrong = state === 'error';
  const [code, setCode] = useState(wrong ? '418311' : '');
  const [problem, setProblem] = useState<Problem | null>(wrong ? 'wrong' : null);
  const [left, restart] = useCooldown(COOLDOWN);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (code.length < CODE_LENGTH) return setProblem('short');
    setProblem(code === SENT_CODE ? null : 'wrong');
  }

  /* B11 timing, applied to a code: it is judged on submit, never mid-entry.
     Once it HAS been judged wrong, editing clears the verdict — the next
     press re-judges rather than leaving a stale error under live digits. */
  function edit(next: string) {
    setCode(next);
    if (problem) setProblem(null);
  }

  const failure = problem ? PROBLEMS[problem] : null;

  return (
    <Plate footer={<a href="#signin">Back to sign in</a>}>
      {failure && (
        <div style={notice}>
          <Banner tone="bad" title={failure.title}>
            {failure.body}
          </Banner>
        </div>
      )}

      <PlateHead title="Verify your email" context="The code confirms this address is yours." />

      {/* Lowercase in the DOM so the address is read correctly; sv-mono
          carries the uppercase metadata voice on screen (Law 4). */}
      <p className="sv-mono" style={context}>
        Code sent to {EMAIL}
      </p>

      <form style={stack} onSubmit={submit} noValidate>
        <PinField
          label="Verification code"
          length={CODE_LENGTH}
          hint="Six digits, valid for 10 minutes"
          value={code}
          onChange={edit}
          error={failure?.field}
          autoFocus
        />
        <Button type="submit" variant="primary" style={full}>
          Verify email
        </Button>
      </form>

      {/* B25: the cooldown never hides the resend action — it states the
          wait beside it. Tabular figures so the seconds do not jitter. */}
      <div style={resend}>
        <Button variant="ghost" disabled={left > 0} onClick={restart}>
          Resend code
        </Button>
        {left > 0 && (
          <span className="sv-mono sv-num">Resend available in {clock(left)}</span>
        )}
      </div>
    </Plate>
  );
}
