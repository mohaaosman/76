# 76° — Roadmap

What has shipped, what is next, and what we are still weighing. The visual
system is settled; the work now is reach and rigor — never new chrome for its
own sake. Live version: <https://76.zifala.com/#/roadmap>.

## Shipped — v0.5.0 · the public surface

76° dresses the pitch on its own terms, and **not one refusal was repealed to
do it.** No photography, no illustration, no 3D, no logo cloud — F11 survived
the surface it was written against, which is how you find out a refusal was
right.

- **Display tokens** — `--sv-display-1/2/3` (64/48/34, clamping to 34/27/21 at 320px), the system's first type steps above the product ramp. **Firewall rule 17** fences them to the three components that set them, so no dashboard grows a 64px number. B48 and B51 are marketing too and are deliberately off that list: an allowance nobody uses is an allowance somebody will.
- **`Prose` (B45)** — the one component that styles a subtree it does not own: 16/1.6 on a ~66ch measure, a heading ramp that stays *inside* the product ramp, hairline-ruled blockquote, inline mono, seed-underlined links, markdown straight in. It is also where **F1 is answered** — the refused WYSIWYG composes to a textarea plus a preview, and this is the preview.
- **`Masthead` (B47)** — the hero, refused as imagery and rebuilt as type. No image slot, no video slot, no background slot; adding one is a Book change, not a prop. It speaks `PageHero`'s vocabulary one surface up.
- **`FeatureList` (B48)** — the claim itemised as a newspaper column: a rule, an ordinal, a title, one sentence. No icon tiles, because A2 refuses the icon-led card and Law 2 will not spend six colours on decoration.
- **`CallToAction` (B49)** — the only row on a public page that asks, and it asks once. `tone="band"` closes the page on the same ink it opened under; ink takes no shadow, because it is the wall's opposite rather than a card resting on it.
- **`ProofRow` (B50)** — figures at display size between vertical hairlines. **It is not a StatS1**, and the Book says so by name: "generic marketing widget" is the same defect class A2 already named "generic admin widget".
- **`SiteFooter` (B51)** — one named `<nav>`, groups labelled as the lists they are rather than as headings that re-open a closed outline.
- **Pricing is a DataTable** — no tier cards, no "Most popular" pill, no three competing primaries. The plan is the column, the capability is the row, and every capability is stated for every plan instead of implied by its absence from a card.
- **The marketing shell (B1 amendment)** — `app` and `nav` become optional: the band keeps the wordmark and the right cluster, carries marketing links, and drops the sub-tab row. Below 1000px it still swaps to the left Drawer, so the public surface inherits the 320px floor rather than re-solving it.
- **The section break (B2 amendment)** — `Row space="section"`. 14px separates two cards of one dashboard; it does not separate two arguments of one page.
- **Two templates** — `marketing-home` and `pricing-page`, both composed entirely from registered parts, both with the FAQ on the B27 Accordion rather than on a widget invented for it.

## Shipped — v0.4.0 · the taxonomy, closed

The line-by-line audit against Bootstrap, Tailwind UI, shadcn/ui and Material
is now empty of everything Part F does not refuse.

- **The nine that were missing** — `SearchField` (B36), `FileField` (B37), `Tabs` (B38), `Stepper` (B39), `TreeList` (B40), `Timeline` (B41), `Popover` (B42), `CodeBlock` (B43), `DistributionStrip` (B44). Each named, single-jobbed, registered, documented and installable in the same change.
- **The donut finally has a replacement, by name** — `DistributionStrip` divides ONE total into its shares; `MeterList` measures each part against its own maximum. The A2 ban always pointed at B6, and B6 was answering a different question. Every donut a team has drawn was asking B44's.
- **Multi-select, without the chip wall** — the B19 refusal is repealed and replaced with a specification. Pass `multiple` and the list stays open while you pick; the selection is STATED as one mono line in the `FilterLine` voice, never worn as dismissible pills (A2, B23).
- **`FilterBar` (B7 amendment)** — the control row that SETS what `FilterLine` states. The division is now complete and binding: **`CardTabs` switches presets · `FilterBar` sets · `FilterLine` states.**
- **`Trend` states the column it is about (B5 amendment)** — `highlight` prints a chip above the peak and recedes the rest, and `yTicks` labels the four gridlines the plot already drew. Printed, never hovered: C8 forbids hover-dependent information.
- **`Split` (B46)** — the band-less page cut in half, with the card ACROSS the cut. **B2's overlap, finished:** the Sheet pulls its first row 44px over the band edge so the dashboard stat cards straddle ink and wall; a Plate has no Sheet, so the same physics arrive as a page type, with the card centred on the seam. The halves carry nothing at all — no statement, no widget, no screenshot — so they are `aria-hidden` and the page reads as exactly the Plate it composes. Two orientations on one prop: `side` cuts left/right, `stacked` cuts top/bottom.
- **The auth set moved onto it** — all seven screens are a Plate on a cut surface and nothing else. The wordmark and the footer moved into the card, because centred above and below a seam-straddling card they would land half on ink and half on paper.
- **Two more templates** — `analytics-overview` (reconciling stats, wall-level `Tabs` over a stat row that stays put, the full filter stack, and the donut refused in favour of a strip) and `auth-stacked`, the same sign-in on the other orientation so the gallery carries both types.
- **Numbering** — the remainder took B36–B44 and the split page type took B46, so `Prose` moves to **B45**.

## Shipped — v0.4.0-alpha.1 · closing the product taxonomy

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
| **0.4** | Closing the product taxonomy | Shipped |
| **0.5** | The public surface | Shipped |

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

## 0.4 — closing the product taxonomy · what the inventory found

The line-by-line inventory against Bootstrap, Tailwind UI, shadcn/ui, and
Material, minus everything Part F refuses. Every line is now shipped.

| | Asked for | Shipped as |
|---|---|---|
| Inputs | Multi-select Combobox · File upload · Search field | B19 amendment · `FileField` (B37) · `SearchField` (B36) |
| Structure | Page-level Tabs · Stepper · Tree list · Timeline | `Tabs` (B38) · `Stepper` (B39) · `TreeList` (B40) · `Timeline` (B41) |
| Feedback & display | Popover primitive · Code block | `Popover` (B42) · `CodeBlock` (B43) |
| Charts | Distribution strip | `DistributionStrip` (B44) |
| Table | `FilterBar` | B7 amendment |

**Donuts and gauges stay banned forever.** B44 is not a concession to the
donut, it is the component that answers the question the donut was asked —
and it draws a straight line.

## Exploring — later

- **Registry MCP server** — search components, blocks, and templates by metadata from any assistant.
- **Health seed** — a contrast-verified clinical seed, added through the seed rule (both directions ≥ 4.5:1), including its dark `--sv-seed-text` variant.
- **8-state preview files** — the fundamentals state contract shipped as a preview per component.
- **Full type tokenization** — a complete `--sv-text-*` scale replacing the literals across every component. Correct, and large enough to need its own release.
- **More templates** — billing, inbox, and onboarding screens. *(Analytics shipped in v0.4.0 as `analytics-overview`.)*
- **Theming playground** — swap the seed and the mode live and watch a real screen re-theme.
- **Token sync** — a Figma ⇄ `tokens.css` bridge so design and code share one source.

## Quality gates — every item, every phase

Native element first · zero runtime dependencies · the 8-state + 4-lifecycle
contract · AA on **both** surfaces · registry item + llms doc + demo in the
same change · `firewall`, `tsc -b`, `build`, and `check-sync` green.

---

*76° — Seventy Six Degrees · the product is the design.*
