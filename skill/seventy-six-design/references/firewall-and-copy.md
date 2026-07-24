# Firewall & Copy — the legal-code reference

The machine-checkable banned-CSS/pattern list (A1–A4), the registered exceptions, the voice rules, and the full Ship Gate. Read this when reviewing code or when unsure whether something is legal.

---

## A1 · Banned CSS (the Slop Firewall)

`scripts/slop-firewall.mjs` scans every `.css`, `.ts`, `.tsx` under `SCAN_DIRS` (`src/components`, `src/styles`, `src/docs/site`) line by line. Any hit is a defect; the script exits non-zero so CI gates on it. These are the exact rules it enforces, in source order.

| # | Rule (flag name) | What triggers it | Why it's banned | Legal alternative |
|---|---|---|---|---|
| 1 | **gradient** | `linear-gradient` \| `radial-gradient` \| `conic-gradient` anywhere on the line | 76° is flat ink on paper — gradients are decoration that "performs" | Flat token fills: `var(--sv-wall)`, `var(--sv-paper)`, `var(--sv-seed)`, `var(--sv-seed-tint)` |
| 2 | **glassmorphism** | `backdrop-filter` \| `blur(` | Frosted glass floats and glows; the scrim is flat by law | `--sv-scrim: rgba(27,31,38,0.4)` — flat, no blur (Dialog only) |
| 3 | **text/drop shadow** | `text-shadow` \| `drop-shadow` | Type must sit on the surface, not hover above it | None. Use weight/size/color hierarchy |
| 4 | **!important** | `!important` | Specificity war = the design has lost control | Fix the selector / layer order (`@layer sv-tokens/sv-base/…`) |
| 5 | **color literal outside tokens.css** | `#[0-9a-fA-F]{3,8}` in any `.css` file whose basename is **not** `tokens.css` | One palette, one source of truth; stray hexes are how a fourth color sneaks in | Reference a token var; add the literal to `tokens.css` only (the sole file allowed to hold literals) |
| 6 | **non-token box-shadow** | a `box-shadow:` line that does **not** contain `var(--sv-shadow)`, is **not** `inset`, and is **not** `none` | Custom elevation = things floating; the system has exactly one shadow | `var(--sv-shadow)` (`0 1px 2px rgba(16,20,28,.05)`), a structural `inset` rule, or `none` |
| 7 | **unregistered border-radius** | any token in the `border-radius:` value not in the legal set | One corner radius keeps the geometry coherent | Legal set only: **`var(--sv-r)` (4px), `50%`, `0`, `2px`, `3px`**. (Note: `9px` appears in the source array but is truncated by `.slice(0,5)` — it is **not** legal.) |
| 8 | **animation > 200ms** | `animation: … <N>ms` where `N > 200`, unless the line contains `sv-rotate` | Long motion performs; 76° motion is functional and brief | Keep ≤200ms; use `var(--sv-t)` (160ms) / `var(--sv-t-fast)` (120ms), both of which collapse to 0ms under `prefers-reduced-motion` |
| 9 | **transition on layout property** | a `transition:` line naming `width` \| `height` \| `top` \| `left` \| `margin` \| `padding`, unless it's a `width` transition in `progress.css` or `meter-list.css` | Animating layout causes reflow and jank; fades are opacity/color only | Transition `opacity`/`color`/`background` only. Layout is instant |
| 10 | **unregistered font-family** | a `font-family:` line without `var(--sv-font-ui)`, `var(--sv-font-mono)`, or `inherit` | Two typefaces, no more: one UI, one mono | `var(--sv-font-ui)` (Hanken Grotesk), `var(--sv-font-mono)` (Fragment Mono), or `inherit` |

---

## Registered exceptions

Three, each allowlisted in the lint and traceable to a Component Book spec:

1. **`sv-rotate` spinner — B10.** The loading spinner is the one continuous animation in the system, so the `animation > 200ms` check skips any line containing `sv-rotate`. Nothing else may run a long/looping animation.
2. **`inset` box-shadows as structural rules — B7 / B11.** Inset shadows are allowed by the `box-shadow` check because they draw *structure*, not *elevation*: B7 the selected-row left rule, B11 the focus border. A non-inset custom shadow is still a defect.
3. **The single width-fill transition — B4 (bar fill).** Only `progress.css` and `meter-list.css` may transition `width`; that's B4's single 160ms (`var(--sv-t)`) fill animation on progress bars and meters. Any other layout-property transition, and any width transition in any other file, is a defect.

---

## A2–A4 · Pattern rules

These are the 76° laws that a line-by-line lint can't catch — enforced by eye at review and in the Ship Gate.

### A2 · Color discipline — three colors, total
- **Neutrals** (the wall and the ink) + **one seed** per product + **functional green/red**. That's the whole palette.
- **Functional color lives on words and 6px dots ONLY** — never on surfaces, fills, backgrounds, or large areas. `--sv-ok` (#14804A) and `--sv-bad` (#C43D2E) are contrast-verified on white; they colour text and tiny status dots, nothing else.
- The seed is Layer 3, one per product (Cobalt/ERP, Verdigris/CRM, Signal/POS). No second accent. `--sv-compare` (#D6DAE0) is the only permitted non-token chart color, and it's aliased.
- Colour is never the sole carrier of meaning (C2): pair it with a word, icon, or shape.

### A3 · Widget discipline — one job each
- **Every widget does exactly one job and is a registered type.** If a component isn't a registered Book type, register it *before* you build it — new types get specified first, not retrofitted.
- No multi-purpose mystery components. A thing that shows status, a thing that takes input, a thing that navigates — separate, named, registered.

### A4 · Layout & typography discipline
- **Mono speaks metadata.** `.sv-mono` (Fragment Mono, 10px, 0.13em, uppercase) is the voice of timestamps, IDs, codes, labels — machine facts. Prose and content are `--sv-font-ui`.
- **Numbers are tabular instrumentation.** Any number that can change wears `.sv-num` (`font-variant-numeric: tabular-nums`) so digits align like an instrument readout.
- **The band is the chrome.** Primary navigation is the horizontal ink band (`--sv-band`, header). A sidebar used as the primary nav is a defect — the band is the chrome, the sidebar is not a substitute for it.

---

## Voice — banned copy

76° speaks like a competent colleague: plain, specific, unhurried. Banned:

- **No exclamation marks.** Anywhere.
- **No "Oops / Whoops / Something went wrong"** without saying *what* went wrong. Name the failure.
- **No "Please" opening an error, and no blame.** Don't apologise or accuse the user; state the situation.
- **No empty enthusiasm** — no "Great!", "Awesome!", "You're all set!" filler.
- **No vague CTAs.** A button names the object of its action: **"Approve PO-2291"**, not "Approve"/"Submit"/"OK".
- **Errors state what + how to fix.** Example: **"Quantity must be a whole number above 0."** — the fact and the remedy, in one line.

---

## Ship Gate — run before showing anything

Nine points. All must pass before the work is shown.

1. **Zero firewall hits.** `node scripts/slop-firewall.mjs` exits clean.
2. **Count the colors.** Exactly neutrals + one seed + functional (words/dots) — nothing else. If you can point at a fourth color, it fails.
3. **Every widget is a registered type.** New types were registered *first*, before being built.
4. **Every S1 footnote passes the "so what" test.** It adds new information, not a paraphrase of what's already on screen.
5. **Keyboard pass.** Visible focus on every interactive element (C3), sane tab order, a skip-link (`.sv-skip`, first tab stop), and ⌘K works.
6. **Squint test.** Squint at it: ink band + white paper on a platinum wall. Nothing glows, floats, or performs.
7. **Copy audit.** Run the "Voice — banned copy" list above over every string.
8. **New colors contrast-checked.** New seeds pass the seed rule: **seed-on-white ≥ 4.5:1 AND white-on-seed ≥ 4.5:1** (C1). Functional/neutral additions are contrast-verified too.
9. **Every wordmark reads `76°`, never bare `76`.** The degree sign is part of the name.

---

Run `node scripts/slop-firewall.mjs` from a project root (adjust `SCAN_DIRS`) to lint A1 automatically; it exits non-zero on any hit.
