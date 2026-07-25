# 76° — Roadmap

What has shipped, what is next, and what we are still weighing. The visual
system is settled; the work now is reach and rigor — never new chrome for its
own sake. Live version: <https://76.zifala.com/#/roadmap>.

## Shipped — v0.4.0 · closing the product taxonomy

- **The table's missing half** — `SelectionHead` swaps the CardHead in place while rows are selected (mono count, the verbs, "Clear"); `FilterLine` states active filters as one mono line of running text with a single "Clear all" that doubles as the `aria-live` announcement. No floating bar, no chips.
- **Structure & display** — `Accordion` (B27, native `<details>`), `DescriptionList` (B28), `Divider` (B29), `Avatar` + `AvatarGroup` (B30), `Spinner` + `Busy` (B31), `Kbd` (B32).
- **The three missing inputs** — `NumberField` (B33), `Slider` (B34, native range, no gradient fill), and `DateRangeField` (B35): the F4 range as presets plus two native date fields, still with no month grid.
- **Charts** — stacked-bar `Trend`, the cell-sized `Sparkline`, and the `Delta` chip extracted from B3 so one implementation serves the card, the cell and the record row. `polarity` states inverse metrics honestly instead of flipping the sign.
- **The Ship Gate reconciled** — Part D of the Book now carries all fourteen points, matching the skill.

## Shipped — v0.3.0 · the floor and the auth surface

- **The 320px floor** — below 1000px the band's nav moves into a left Drawer opened by a labelled "Menu" button, with sub-tabs nested inside it. A2 is amended to be desktop-scoped; C7 verified at 320px and 200% zoom.
- **The Plate (B24)** — the first band-less page type, carrying auth, 404, 500, maintenance and expired-link pages.
- **The auth set** — six templates (T6–T11) on one anatomy, plus `PinField` (B25) and `SocialButton` (B26): one `currentColor` path per provider, no brand hexes.
- **Part F · The Refused** — eleven refusals documented by name, each with the composition that replaces it.

## Shipped — v0.2.1 · the dark chrome hotfix

- **`--sv-on-dark`** — a new token for every mark on the band or on a seed fill; `--sv-paper` returns to meaning only "card surface".
- **Firewall rules 16 + reach** — `color: var(--sv-paper)` outside `tokens.css` is a defect, and the color-literal rule now tests `.tsx` as well as `.css`.
- **A2 resolved** — the dark-mode ban is restated as "light-first stands; dark is opt-in and token-only", so the Book no longer contradicts its own amendment.

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

## The bodies of work

The programme was scoped against one question: what stops a team building
*any* product on 76° without reaching outside it? The audit found four
answers, and they ship in this order — **what is broken, then what was asked
for, then breadth, then new surface.** Nothing new is built on a floor that
leaks.

| Release | Body of work | State |
|---|---|---|
| **0.2.1** | The dark chrome regression — a shipped AA failure | Shipped |
| **0.3** | The 320px floor + the auth surface | Shipped |
| **0.4** | Closing the product taxonomy | Shipped in part — remainder below |
| **0.5** | The public surface | Next |

---

## Part F · The Refused

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
localized, and accessible. That composition shipped in v0.4.0 as **B35
`DateRangeField`** — the refusal now has a component, and it still contains no
grid.

## Stated scope boundary

**76° is LTR only.** The component layer uses physical direction properties and
does not support RTL. Arabic, Hebrew, Persian, and Urdu products are out of
scope until this line is repealed. *(Weighed and deliberately declined: the
conversion is ~29 declarations today and grows with every component shipped.)*

## 0.4 — closing the product taxonomy · the remainder

The line-by-line inventory against Bootstrap, Tailwind UI, shadcn/ui, and
Material, minus everything Part F refuses. Each enters through the Book: named,
single-jobbed, registered. The first pass shipped in v0.4.0 (see Shipped,
above); these are what it did not reach.

**Inputs.** Multi-select Combobox · File upload (drop zone + rows + progress) · Search field.

**Structure.** Page-level Tabs · Stepper/wizard header · Tree list · Timeline.

**Feedback & display.** Popover primitive · Code block.

**Charts.** Distribution strip — donuts and gauges stay banned forever.

**Table.** `FilterBar` — the control row above the shipped filter line.

## 0.5 — the public surface

76° dresses the pitch as well as the product — on 76°'s terms, not the
marketing industry's. **The surface is typographic: no photography, no
illustration, no 3D, no logo clouds.** A2's illustration and stock-photo bans
stand unamended; F11 states the refusal outright.

- **Display tokens** — `--sv-display-1/2/3` (≈64/48/34), the system's first type tokens, since the product ramp tops out at 27px. **Firewall rule 17** bans them outside marketing block CSS, so no dashboard grows a 64px number.
- **`Prose` (B36)** — one registered component styling its whole subtree: 16px body, ~66ch measure, heading ramp, lists, hairline-ruled blockquote, inline mono, seed-underlined links. Markdown drops straight in. It is also the only place Part E permits italic. *(Numbered B36: B25 and B26 went to PinField and SocialButton in v0.3.0, B27–B35 in v0.4.0.)*
- **Marketing blocks** — hero (type only) · feature list · FAQ (on the B27 Accordion) · footer · CTA · stat band.
- **Pricing is a DataTable.** No tier cards, no "Most popular" pill, no three competing primaries: one row per feature, one column per plan, and a single primary beneath. C7 governs it on mobile — the table scrolls, it never truncates.
- **Marketing shell** — the band without product nav.

## Exploring — later

- **Registry MCP server** — search components, blocks, and templates by metadata from any assistant.
- **Health seed** — a contrast-verified clinical seed, added through the seed rule (both directions ≥ 4.5:1), including its dark `--sv-seed-text` variant.
- **8-state preview files** — the fundamentals state contract shipped as a preview per component.
- **Full type tokenization** — a complete `--sv-text-*` scale replacing the literals across every component. Correct, and large enough to need its own release.
- **More templates** — analytics, billing, inbox, and onboarding screens.
- **Theming playground** — swap the seed and the mode live and watch a real screen re-theme.
- **Token sync** — a Figma ⇄ `tokens.css` bridge so design and code share one source.

## Quality gates — every item, every phase

Native element first · zero runtime dependencies · the 8-state + 4-lifecycle
contract · AA on **both** surfaces · registry item + llms doc + demo in the
same change · `firewall`, `tsc -b`, `build`, and `check-sync` green.

---

*76° — Seventy Six Degrees · the product is the design.*
