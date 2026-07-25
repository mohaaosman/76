import type { DocEntry } from './types';

/**
 * v0.3.0 — the auth layer: B24–B26. The band-less page, the
 * verification-code input, and the federated-identity button.
 */
export const auth: DocEntry[] = [
  /* ================================================================ B24 */
  {
    slug: 'plate',
    name: 'Plate',
    book: 'B24',
    category: 'chrome',
    tagline: 'The band-less page — one card on the bare wall, under the mono 76° wordmark.',
    job: 'Carry a single decision on a page that has no navigation.',
    tags: ['plate', 'auth', 'sign-in', 'centered-card', 'error-page', 'band-less'],
    exports: ['Plate', 'PlateHead'],
    files: ['components/seventy-six/plate.tsx', 'components/seventy-six/plate.css'],
    registryDeps: ['card'],
    intro: [
      'Every other 76° screen opens with a Band (B1). A Plate has no nav, no sub-tabs and no hero, so it has no band at all: wall edge to edge, the mono <code>76°</code> wordmark, one card centred on both axes, and an optional mono footer line. Sign in, sign up, reset, verify, invite, 404, 500, maintenance, expired link — the wording is the caller\'s, the anatomy is fixed.',
      'The card is ordinary paper from B12 — radius 4, one <code>--sv-shadow</code>, zero border — self-padded at 24px, so its children are the page and never need <code>sv-card__body</code>. Width is 400px, or 520px with <code>width="md"</code> for a two-column form.',
      '<code>PlateHead</code> supplies the screen\'s one <code>&lt;h1&gt;</code> plus at most one sentence of context, because here the card IS the page. The wordmark is a <code>role="img"</code> label, not a heading, and the skip-link is omitted — a registered exception to C4, since a Plate has nothing to skip.',
    ],
    examples: [
      {
        title: 'Sign-in plate',
        description: 'Head, providers, hairline OR, credential form, one primary at full card width.',
        demoKey: 'plate-basic',
        code: `import { Plate, PlateHead, Field, Button, ButtonLink } from '@/components/seventy-six';

<Plate footer={<>Trouble signing in? <a href="#support">Contact support</a></>}>
  <PlateHead title="Sign in" context="Northwind operations console" />

  <form onSubmit={submit} noValidate>
    <Field label="Email" type="email" required autoComplete="email" />
    <Field label="Password" type="password" required autoComplete="current-password" />
    <Button type="submit" variant="primary" style={{ width: '100%' }}>
      Sign in
    </Button>
  </form>

  <ButtonLink href="#reset">Forgot password?</ButtonLink>
</Plate>`,
      },
      {
        title: 'The condition plate',
        description: '404, 500, maintenance and expired links are the same anatomy: state what happened, then the one way forward.',
        demoKey: 'plate-error',
        code: `<Plate footer="ERR-4041 · 25 JUL 09:14 UTC">
  <PlateHead
    title="Page not found"
    context="The address is right but nothing is filed under it. It may have been renamed or archived."
  />
  <Button variant="primary" onClick={goHome} style={{ width: '100%' }}>
    Back to the dashboard
  </Button>
</Plate>`,
      },
      {
        title: 'Wider card for a two-column form',
        description: 'width="md" takes the card to 520px. Nothing else changes.',
        demoKey: 'plate-wide',
        code: `<Plate width="md" footer={<a href="#signin">Back to sign in</a>}>
  <PlateHead title="Create account" context="Northwind operations console" />
  {/* First name / last name side by side inside the 520px card */}
</Plate>`,
      },
    ],
    props: [
      {
        component: 'Plate',
        rows: [
          { name: 'children', type: 'ReactNode', description: 'The card\'s contents. Exactly one h1 — normally a PlateHead.' },
          { name: 'width', type: "'sm' | 'md'", defaultValue: "'sm'", description: '400px, or 520px for a two-column form.' },
          { name: 'footer', type: 'ReactNode', description: 'One mono line under the card: legal, a support link, an error id.' },
          { name: 'wordmark', type: 'ReactNode', description: 'Overrides the built-in mono 76° mark. The degree sign is never dropped.' },
          { name: '…rest', type: 'HTMLAttributes<HTMLElement>', description: 'Spread onto the <main> element the Plate renders.' },
        ],
      },
      {
        component: 'PlateHead',
        rows: [
          { name: 'title', type: 'string', description: 'The page\'s one h1. Names the task or the condition — never the app.' },
          { name: 'context', type: 'string', description: 'One sentence: what this screen wants, or what went wrong and what is next.' },
        ],
      },
    ],
    a11y: {
      notes: [
        'The Plate renders <code>&lt;main&gt;</code>; <code>PlateHead</code> renders the screen\'s single <code>&lt;h1&gt;</code> inside the card.',
        'The wordmark is <code>role="img"</code> with <code>aria-label="Seventy Six Degrees"</code> — one word to a screen reader, not three orphaned characters, and not a heading.',
        'The skip-link is omitted: a registered exception to C4, because a Plate carries nothing to skip past.',
        'Centering is <code>align-content</code> on a grid, so tall content grows the page instead of clipping — 200% zoom and 320px scroll.',
      ],
    },
    donts: [
      'No nav on a Plate — no band, no tabs, no "back to the app" bar.',
      'No PageHero; the h1 lives inside the card, via PlateHead.',
      'No second card, and no second decision — two decisions are two pages.',
      'No background image and no illustration (F11); the wall stays the wall.',
    ],
    faq: [
      { q: 'Where does the error Banner go?', a: 'Inside the card, above or below the PlateHead — a Plate has no page-level surface. Field errors still render on the Field (B11); the Banner states the failure as a whole.' },
      { q: 'Can the wordmark be the product\'s own?', a: 'Yes — pass <code>wordmark</code>. It stays mono, stays centred, and keeps the degree mark if it is a 76° build.' },
      { q: 'Plate or Dialog for a confirmation?', a: 'A Plate is a page reached by URL with no way back into the app; a Dialog interrupts a page the user is already on. If there is an app behind it, it is a Dialog.' },
    ],
  },

  /* ================================================================ B25 */
  {
    slug: 'pin-field',
    name: 'PinField',
    book: 'B25',
    category: 'forms',
    tagline: 'The verification-code input — N boxes that are one value, with B11 field chrome.',
    job: 'Enter a short fixed-length code.',
    tags: ['pin', 'otp', 'one-time-code', '2fa', 'verification', 'invite-code'],
    exports: ['PinField'],
    files: ['components/seventy-six/pin-field.tsx', 'components/seventy-six/pin-field.css'],
    registryDeps: ['field'],
    intro: [
      'OTP, 2FA, invite code: 4–8 fixed single-character boxes (default 6), wearing B11 field chrome verbatim — label above, optional hint naming the delivery and the window, an error that says <b>what</b> and <b>how to fix it</b>.',
      'The boxes are a <b>view of one string</b>. They sit in a <code>role="group"</code> labelled by the field label, so the error is announced once by the chrome instead of once per box, and the value posts as a single form field via <code>name</code>. Every box carries <code>autocomplete="one-time-code"</code>, so SMS autofill lands wherever the platform drops it.',
      'Paste is the interaction it lives or dies on. A payload as long as the field is treated as the whole code and fills from box one, whichever box received it; anything shorter overwrites from the box that was focused. Separators and spaces are stripped, so <code>123-456</code> and <code>123 456</code> paste clean.',
    ],
    examples: [
      {
        title: 'Six-digit verification code',
        demoKey: 'pin-basic',
        surface: 'paper',
        code: `import { useState } from 'react';
import { PinField, Button } from '@/components/seventy-six';

const [code, setCode] = useState('');

<PinField
  label="Verification code"
  hint="Six digits, valid for 10 minutes"
  value={code}
  onChange={setCode}
  onComplete={(full) => verify(full)}
  autoFocus
/>
<Button type="submit" variant="primary" style={{ width: '100%' }}>
  Verify email
</Button>`,
      },
      {
        title: 'The code fails as a unit',
        description: 'Every box takes the bad border — never one character. The error states what and how to fix.',
        demoKey: 'pin-error',
        surface: 'paper',
        code: `<PinField
  label="Verification code"
  hint="Six digits, valid for 10 minutes"
  value={code}
  onChange={edit}
  error="That code did not match. Retype it from the email, or resend the code."
/>`,
      },
      {
        title: 'Alphanumeric invite code',
        description: 'charset="alphanumeric" allows letters and drops the numeric keypad hint; length clamps to 4–8.',
        demoKey: 'pin-alpha',
        surface: 'paper',
        code: `<PinField
  label="Invitation code"
  length={8}
  charset="alphanumeric"
  hint="Eight characters from the invitation email"
  name="invite_code"
  onComplete={submitInvite}
/>`,
      },
    ],
    props: [
      {
        component: 'PinField',
        rows: [
          { name: 'label', type: 'string', description: 'Field label above the row — never replaced by the boxes (B11).' },
          { name: 'length', type: 'number', defaultValue: '6', description: 'Box count, truncated and clamped to 4–8.' },
          { name: 'charset', type: "'numeric' | 'alphanumeric'", defaultValue: "'numeric'", description: 'numeric drives the phone keypad (inputmode + pattern); alphanumeric allows letters. Everything outside the charset is dropped.' },
          { name: 'value / onChange', type: 'string / (value: string) => void', description: 'Controlled code as ONE string. Omit value for uncontrolled.' },
          { name: 'defaultValue', type: 'string', description: 'Uncontrolled starting value, sanitized to the charset and length.' },
          { name: 'onComplete', type: '(value: string) => void', description: 'Fires the moment every box is filled, with the complete code.' },
          { name: 'error / hint / required', type: 'string / string / boolean', description: 'B11 field chrome; error sets aria-invalid on the boxes and describes the group.' },
          { name: 'disabled / autoFocus', type: 'boolean / boolean', description: 'Locks every box; autoFocus applies to the first box only.' },
          { name: 'name', type: 'string', description: 'Renders a hidden input posting the whole code as one form value.' },
          { name: 'id', type: 'string', description: 'Base id; boxes are <code>{id}-0…n</code> and the label points at box 0.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Type a character', action: 'Writes it into the box and advances to the next.' },
        { keys: 'Backspace', action: 'On a filled box, clears it in place. On an empty box, clears the previous box and moves back to it.' },
        { keys: 'Delete', action: 'Clears the current box without moving.' },
        { keys: '← / →', action: 'Move one box, clamped at the ends — no wrap.' },
        { keys: 'Home / End', action: 'First / last box.' },
        { keys: '⌘V / Ctrl+V', action: 'Paste into ANY box: a full-length code fills from box one; a shorter payload overwrites from the focused box.' },
        { keys: 'Tab / ⇧Tab', action: 'Steps through the boxes and out the end — never trapped.' },
      ],
      notes: [
        'The row is a <code>role="group"</code> labelled by the field label and described by the hint and error, so the failure is announced once for the code, not once per character.',
        'Each box is a real input named for its position — <code>Digit 3 of 6</code> (or <code>Character 3 of 8</code> on the alphanumeric charset).',
        'Every box carries <code>autocomplete="one-time-code"</code>, <code>autocorrect</code>/<code>autocapitalize</code> off and no <code>maxlength</code> — a filled box still accepts an overtype, and iOS can drop the entire autofilled code into whichever box holds focus.',
        'Focus selects the box contents, so the next keystroke overtypes instead of stalling on a full box.',
        'Error state paints every box with <code>--sv-bad</code> and sets <code>aria-invalid</code> on each: the code is wrong as a unit (C2 — the text states it too).',
      ],
    },
    donts: [
      'No masking — a code is not a password. Use a Field (B11) with type="password" for secrets.',
      'No variable-length secret in a PinField; if the length is not fixed, it is a Field.',
      'No auto-submit without a visible primary — <code>onComplete</code> may prefill, the button still commits.',
      'No countdown that hides the resend action; state the wait beside it.',
      'No per-character error tone; the code fails as one value.',
    ],
    faq: [
      { q: 'Why boxes at all, if it is one string?', a: 'The boxes tell the user the length before they start typing, which is the whole reason codes are chunked. Semantically it stays one labelled group with one value and one error.' },
      { q: 'Does it work with SMS autofill?', a: 'Yes. Every box carries autocomplete="one-time-code", and the write path treats a full-length payload as the whole code regardless of which box received it — so iOS dropping six digits into box four still fills the row correctly.' },
      { q: 'How do I submit as soon as the code is complete?', a: 'Use onComplete to fire the request, but keep the primary button visible and enabled: a code can be pasted wrong, and the user needs a control to retry with.' },
    ],
  },

  /* ================================================================ B26 */
  {
    slug: 'social-button',
    name: 'SocialButton',
    book: 'B26',
    category: 'forms',
    tagline: 'The federated-identity button — B10 Ghost anatomy, one currentColor mark, no brand hex.',
    job: 'Hand authentication to ONE named provider.',
    tags: ['social-login', 'oauth', 'sso', 'provider', 'federated-identity', 'sign-in'],
    exports: ['SocialButton'],
    files: ['components/seventy-six/social-button.tsx', 'components/seventy-six/social-button.css'],
    registryDeps: ['button'],
    intro: [
      'Composed from B10 rather than redrawn: a ghost Button, full width inside the plate card, carrying a 16px provider mark before a label that names the act and the provider — "Continue with Google".',
      'The mark is <b>one path</b> in <code>currentColor</code>. No brand hex ever enters the component layer (A1, Law 2), so the row stays legible on both surfaces, in both modes, and inherits the button\'s own ink. Providers: <code>google</code>, <code>apple</code>, <code>github</code>, <code>microsoft</code>.',
      'The stack goes at the top of the card, at most three, then a hairline rule with a mono <code>OR</code>, then the credential form. One verb across the stack: mixing "Sign in with…" and "Continue with…" in one column reads as two systems.',
    ],
    examples: [
      {
        title: 'Provider stack',
        description: 'Three at most, above the hairline OR rule.',
        demoKey: 'social-stack',
        surface: 'paper',
        code: `import { SocialButton } from '@/components/seventy-six';

<div style={{ display: 'grid', gap: 'var(--sv-s2)' }}>
  <SocialButton provider="google" onClick={() => start('google')} />
  <SocialButton provider="apple" onClick={() => start('apple')} />
  <SocialButton provider="github" onClick={() => start('github')} />
</div>`,
      },
      {
        title: 'One verb per screen',
        description: 'action replaces the verb phrase before the provider name — set it once, for the whole stack.',
        demoKey: 'social-signup',
        surface: 'paper',
        code: `<SocialButton provider="google" action="Sign up with" />
<SocialButton provider="microsoft" action="Sign up with" />`,
      },
      {
        title: 'Handing off',
        description: 'B10 loading contract: the label swaps to "Connecting…" at locked width while the redirect is prepared.',
        demoKey: 'social-loading',
        surface: 'paper',
        code: `<SocialButton provider="google" isLoading={handing === 'google'} onClick={() => start('google')} />`,
      },
    ],
    props: [
      {
        component: 'SocialButton',
        rows: [
          { name: 'provider', type: "'google' | 'apple' | 'github' | 'microsoft'", description: 'Selects the mark and the provider name in the label.' },
          { name: 'action', type: 'string', defaultValue: "'Continue with'", description: 'Verb phrase before the provider name. Keep it identical across the stack.' },
          { name: 'isLoading', type: 'boolean', description: 'B10 loading contract: label swaps to "Connecting…", width locks, the button disables and sets aria-busy.' },
          { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", description: 'Defaults to button — a provider hand-off is not a form submit.' },
          { name: '…rest', type: 'ButtonHTMLAttributes', description: 'onClick, disabled, className and the rest of B10, minus variant, pos, iconLeading, loadingLabel and children — the component owns those.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Enter / Space', action: 'Starts the hand-off — a native button, per B10.' },
        { keys: 'Tab / ⇧Tab', action: 'Steps through the stack in visual order.' },
      ],
      notes: [
        'The mark is <code>aria-hidden="true"</code> beside its text label (A4); the provider name lives in the text and is never carried by the mark alone.',
        'It renders a real <code>&lt;button&gt;</code> — the focus ring, disabled state and loading behavior are B10\'s, unchanged.',
        'Every mark is a single path in <code>currentColor</code>, so it inherits contrast from the label instead of needing its own check.',
      ],
    },
    donts: [
      'No brand hex, no multi-color mark, no raster logo — one path in currentColor (A1, Law 2).',
      'No row of icon-only provider tiles; every button names its provider (A2).',
      'No mixing "Sign in with…" and "Continue with…" in one stack.',
      'No fourth and fifth provider — three is the ceiling; the rest belong behind the credential form.',
      'No primary variant; the credential form owns the one seed button on the plate.',
    ],
    faq: [
      { q: 'The provider\'s brand guidelines demand their colors. Now what?', a: 'B26 registers the override: a product bound by a provider\'s guidelines may restore that mark and its colors LOCALLY, declared in the product\'s own overrides. The 76° component layer stays currentColor.' },
      { q: 'Where does the stack sit relative to the email form?', a: 'Above it, in the plate card, separated by a hairline rule carrying a mono "OR". Users who have a provider account never read past it; users who do not, skip it in one glance.' },
      { q: 'Can I change the loading label?', a: 'No — <code>loadingLabel</code> is omitted from the props on purpose and fixed at "Connecting…", so every provider in the stack reports the hand-off with the same words.' },
    ],
  },
];
