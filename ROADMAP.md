# 76° — Roadmap

What has shipped, what is next, and what we are still weighing. The visual
system is settled; the work now is reach and rigor — never new chrome for its
own sake. Live version: <https://76.zifala.com/#/roadmap>.

## Shipped — v0.2.0 · the interaction layer

- **Combobox (B19)** — the searchable select: ARIA 1.2 pattern, hand-rolled, zero dependencies. Radix stays on the bench after all.
- **Menu & SplitButton (B20)** — actions dropdowns on the native popover top layer, plus the one-primary-verb split button.
- **Drawer (B21)** — the slide-over on native `<dialog>`: sm/md/lg/full, left or right, sticky footer.
- **Full-screen Dialog** — `size="full"` turns the dialog into the page; `wide` becomes a deprecated alias of `size="wide"`.
- **Notifications** — the toast grows a title, description, icon, four tones (warn in ink — no amber), two sizes, and a dismiss; errors still render inline first.
- **Banner (B22)** — the inline notice, the surface errors actually belong on.
- **Badge (B23)** — mono category tags; status stays a StatusWord.
- **The dark surface** — light-first stands; dark is opt-in via `data-mode="dark"`, changes tokens only, re-verified AA, with per-seed dark text variants. Toggle live in the docs band.

## Shipped — v0.1.0

- **18 components** — the full B1–B18 taxonomy, zero runtime dependencies, WCAG 2.2 AA.
- **shadcn registry** — every item installable from `https://76.zifala.com/r/`, with tokens as a shared registry dependency.
- **AI-ready layer** — `llms.txt` index plus a full markdown doc per component and per composition.
- **Design skill** — `seventy-six-design` on skills.sh, carrying the fundamentals discipline layer.
- **Blocks & templates** — 7 composed blocks and 5 full-screen templates (ERP, CRM, POS, Settings, AI control center), all registry-installable.

---

## The four bodies of work

Phase 4 was scoped against one question: what stops a team building *any*
product on 76° without reaching outside it? The audit found four answers, and
they ship in this order — **what is broken, then what was asked for, then
breadth, then new surface.** Nothing new is built on a floor that leaks.

| Release | Body of work |
|---|---|
| **0.2.1** | The dark chrome regression — a shipped AA failure |
| **0.3** | The 320px floor + the auth surface |
| **0.4** | Closing the product taxonomy |
| **0.5** | The public surface |

---

## 0.2.1 — the dark chrome hotfix

`--sv-paper` carried two meanings: *the card surface* and *the white that sits
on dark chrome*. They were the same value in light and diverge in dark, so
thirteen declarations collapsed to **1.15:1** — including the focus ring on the
band, which voids C3 silently.

- **`--sv-on-dark`** — a new token, near-white in both modes, for every mark that sits on the band or on a seed fill. `--sv-paper` returns to meaning only "card surface".
- **Firewall rule 16** — `color: var(--sv-paper)` outside `tokens.css` is a defect.
- **Firewall reach** — the color-literal rule tests `.css` only; extend it to `.tsx` so an inline `fill="#4285F4"` cannot pass.
- **Book** — A2 still bans dark mode ("light-first only until Max repeals this line") while the v0.2.0 amendment specifies it. The Ship Gate reads A2 as binding; resolve it.
- **Gate** — every chrome pair re-verified AA on both surfaces.

## 0.3 — the floor and the auth surface

### The floor

`band.css` has no `overflow`, no `flex-wrap`, no `scroll`, and one media query
that changes padding. Below ~1000px the navigation is unreachable, while C7
requires 320px without content loss.

- **A2 amended** — "Sidebars as primary navigation" is now **desktop-scoped**. Below 1000px, primary nav *is* a sidebar. The band's nav never scrolls, at any width.
- **The mobile sidebar** — a composition of B21 Drawer (`side="left"`, `size="sm"`), not a new component. Trigger is a labelled **"Menu"** ghost button with a glyph beside it, satisfying A2's icon-only ban.
- **Sub-tabs nest** — BandSubTabs leaves the band on mobile and nests, indented, under its parent nav item inside the drawer. One surface holds the whole nav tree.
- **Gate** — C7 verified at 320px and at 200% zoom, on both surfaces.

### The Plate — the first band-less page type

Auth pages have no nav, no hero, no sub-tabs, so they have no band. Every
template until now opened with one.

- **`Plate` (B24)** — wall background, one centered card (≤400px), mono `76°` wordmark above. Nothing else.
- It also carries **404, 500, maintenance, and expired-link** pages for free.

### The auth set

Six screens on one anatomy, so each after the first is nearly free.

| | Template | Notes |
|---|---|---|
| T6 | `auth-sign-in` | Social · rule · email + password · recovery link |
| T7 | `auth-sign-up` | Adds name and the terms line |
| T8 | `auth-forgot` | One field, one verb |
| T9 | `auth-reset` | Two fields, match rule stated up front |
| T10 | `auth-verify` | Pin/OTP |
| T11 | `auth-invite` | Mono context line naming who invited you |

- **`PinField`** — the OTP input, pulled forward from the Phase 3 inventory by T10.
- **`SocialButton`** — Google, Apple, GitHub, Microsoft as ghost buttons with the provider mark drawn in `currentColor`. **One path, no brand hexes** — Law 2 holds and the firewall stays honest. Products bound by strict provider brand guidelines override locally.
- **No password strength meter.** The rule is stated before the field; failure is an inline error naming what and how to fix (see F7).

### Part F · The Refused

The Book documents what is in. It has never documented what is *out*, so every
refusal gets re-litigated. Part F makes each "no" as binding as every "yes".

> **The test.** If a widget's job needs more than one sentence, or it carries an
> internal toolbar or sub-taxonomy, it is a **screen** composed of 76° parts —
> not a component.

| | Refused | Compose instead |
|---|---|---|
| F1 | Rich-text / WYSIWYG toolbar | Textarea + preview |
| F2 | Kanban board widget | A template (CRM already has one) |
| F3 | Data grid (resize, pin, group) | DataTable + Drawer |
| F4 | Calendar / scheduler grid | A screen, never a part |
| F5 | Carousel / slider | A list or a grid |
| F6 | Nested multi-level menus | One level, then a page |
| F7 | Password strength meter | Stated rule + inline error |
| F8 | Tour / coachmark overlays | EmptyState + docs |
| F9 | Colour picker, star rating | Out of taxonomy |
| F10 | Drag-drop dashboard layout | The fixed 12-column grid |
| F11 | Hero imagery, stock photography, illustration | Type, hairline, and real data |

**F4 is binding on the date range.** The Phase 3 escape hatch — "composed
calendar where ranges demand it" — is closed. 76° draws no month grid, ever.
A range is two native `<input type="date">` fields welded into one Field,
preceded by a mono preset row (`7D · 30D · QTD · YTD · CUSTOM`) and followed by
a mono context line. The browser draws the calendar; it is free, native,
localized, and accessible.

### Stated scope boundary

**76° is LTR only.** The component layer uses physical direction properties and
does not support RTL. Arabic, Hebrew, Persian, and Urdu products are out of
scope until this line is repealed. *(Weighed and deliberately declined: the
conversion is ~29 declarations today and grows with every component shipped.)*

## 0.4 — closing the product taxonomy

The line-by-line inventory against Bootstrap, Tailwind UI, shadcn/ui, and
Material, minus everything Part F refuses. Each enters through the Book: named,
single-jobbed, registered.

**The table's missing half.** `DataTable` already ships row selection and the
paginated range readout — what is missing is what a selection *does*, and how
filter state is shown.

- **The selection head** — selecting rows swaps CardHead in place for a mono count, the verbs, and "Clear". No floating bar, no new z-index; the card's own header does the job it already owns. Destructive verbs still route through the typed-object Dialog confirm.
- **The stated filter line** — active filters render as one mono line of running text with a single "Clear all", which doubles as the `aria-live` announcement. No chips, no pills: B23 Badge stays category-only and non-dismissible.
- **`FilterBar`** — the control row above it.

**Inputs.** Date-range field (two natives + presets, per F4) · Multi-select Combobox · Number/stepper input · Slider (native `<input type="range">`, tokenized) · File upload (drop zone + rows + progress) · Search field.

**Structure.** Accordion (native `<details>`) · Page-level Tabs · Stepper/wizard header · Description list · Divider with mono label · Tree list · Timeline.

**Feedback & display.** Inline Spinner + full-region Busy state · Avatar + AvatarGroup · Popover primitive · KBD · Code block · Stat delta chip.

**Charts.** Bar and stacked-bar Trend variants · Sparkline · Distribution strip — donuts and gauges stay banned forever.

## 0.5 — the public surface

76° dresses the pitch as well as the product — on 76°'s terms, not the
marketing industry's. **The surface is typographic: no photography, no
illustration, no 3D, no logo clouds.** A2's illustration and stock-photo bans
stand unamended; F11 states the refusal outright.

- **Display tokens** — `--sv-display-1/2/3` (≈64/48/34), the system's first type tokens, since the product ramp tops out at 27px. **Firewall rule 17** bans them outside marketing block CSS, so no dashboard grows a 64px number.
- **`Prose` (B25)** — one registered component styling its whole subtree: 16px body, ~66ch measure, heading ramp, lists, hairline-ruled blockquote, inline mono, seed-underlined links. Markdown drops straight in. It is also the only place Part E permits italic.
- **Marketing blocks** — hero (type only) · feature list · FAQ (on the 0.4 Accordion) · footer · CTA · stat band.
- **Pricing is a DataTable.** No tier cards, no "Most popular" pill, no three competing primaries: one row per feature, one column per plan, and a single primary beneath. C7 governs it on mobile — the table scrolls, it never truncates.
- **Marketing shell** — the band without product nav.

## Exploring — later

- **Registry MCP server** — search components, blocks, and templates by metadata from any assistant.
- **Health seed** — a contrast-verified clinical seed, added through the seed rule (both directions ≥ 4.5:1), including its dark `--sv-seed-text` variant.
- **8-state preview files** — the fundamentals state contract shipped as a preview per component.
- **Full type tokenization** — a complete `--sv-text-*` scale replacing the literals in all 25 components. Correct, and large enough to need its own release.
- **More templates** — analytics, billing, inbox, and onboarding screens.
- **Theming playground** — swap the seed and the mode live and watch a real screen re-theme.
- **Token sync** — a Figma ⇄ `tokens.css` bridge so design and code share one source.

## Quality gates — every item, every phase

Native element first · zero runtime dependencies · the 8-state + 4-lifecycle
contract · AA on **both** surfaces · registry item + llms doc + demo in the
same change · `firewall`, `tsc -b`, `build`, and `check-sync` green.

---

*76° — Seventy Six Degrees · the product is the design.*
