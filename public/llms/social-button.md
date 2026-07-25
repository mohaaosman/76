# SocialButton · 76° UI (B26)

The federated-identity button — B10 Ghost anatomy, one currentColor mark, no brand hex.

**One job:** Hand authentication to ONE named provider.
**Category:** forms · **Exports:** SocialButton · **Tags:** social-login, oauth, sso, provider, federated-identity, sign-in

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/social-button.json
```

Manual: copy components/seventy-six/social-button.tsx, components/seventy-six/social-button.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: button.

## Overview

Composed from B10 rather than redrawn: a ghost Button, full width inside the plate card, carrying a 16px provider mark before a label that names the act and the provider — "Continue with Google".

The mark is **one path** in `currentColor`. No brand hex ever enters the component layer (A1, Law 2), so the row stays legible on both surfaces, in both modes, and inherits the button's own ink. Providers: `google`, `apple`, `github`, `microsoft`.

The stack goes at the top of the card, at most three, then a hairline rule with a mono `OR`, then the credential form. One verb across the stack: mixing "Sign in with…" and "Continue with…" in one column reads as two systems.

## Examples

### Provider stack

Three at most, above the hairline OR rule.

```tsx
import { SocialButton } from '@/components/seventy-six';

<div style={{ display: 'grid', gap: 'var(--sv-s2)' }}>
  <SocialButton provider="google" onClick={() => start('google')} />
  <SocialButton provider="apple" onClick={() => start('apple')} />
  <SocialButton provider="github" onClick={() => start('github')} />
</div>
```

### One verb per screen

action replaces the verb phrase before the provider name — set it once, for the whole stack.

```tsx
<SocialButton provider="google" action="Sign up with" />
<SocialButton provider="microsoft" action="Sign up with" />
```

### Handing off

B10 loading contract: the label swaps to "Connecting…" at locked width while the redirect is prepared.

```tsx
<SocialButton provider="google" isLoading={handing === 'google'} onClick={() => start('google')} />
```

## Props

### SocialButton

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `provider` | `'google' | 'apple' | 'github' | 'microsoft'` | — | Selects the mark and the provider name in the label. |
| `action` | `string` | `'Continue with'` | Verb phrase before the provider name. Keep it identical across the stack. |
| `isLoading` | `boolean` | — | B10 loading contract: label swaps to "Connecting…", width locks, the button disables and sets aria-busy. |
| `type` | `'button' | 'submit' | 'reset'` | `'button'` | Defaults to button — a provider hand-off is not a form submit. |
| `…rest` | `ButtonHTMLAttributes` | — | onClick, disabled, className and the rest of B10, minus variant, pos, iconLeading, loadingLabel and children — the component owns those. |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter / Space | Starts the hand-off — a native button, per B10. |
| Tab / ⇧Tab | Steps through the stack in visual order. |

- The mark is `aria-hidden="true"` beside its text label (A4); the provider name lives in the text and is never carried by the mark alone.
- It renders a real `&lt;button&gt;` — the focus ring, disabled state and loading behavior are B10's, unchanged.
- Every mark is a single path in `currentColor`, so it inherits contrast from the label instead of needing its own check.

## Don't

- No brand hex, no multi-color mark, no raster logo — one path in currentColor (A1, Law 2).
- No row of icon-only provider tiles; every button names its provider (A2).
- No mixing "Sign in with…" and "Continue with…" in one stack.
- No fourth and fifth provider — three is the ceiling; the rest belong behind the credential form.
- No primary variant; the credential form owns the one seed button on the plate.

## FAQ

**The provider's brand guidelines demand their colors. Now what?**

B26 registers the override: a product bound by a provider's guidelines may restore that mark and its colors LOCALLY, declared in the product's own overrides. The 76° component layer stays currentColor.

**Where does the stack sit relative to the email form?**

Above it, in the plate card, separated by a hairline rule carrying a mono "OR". Users who have a provider account never read past it; users who do not, skip it in one glance.

**Can I change the loading label?**

No — `loadingLabel` is omitted from the props on purpose and fixed at "Connecting…", so every provider in the stack reports the hand-off with the same words.
