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
| **0.6** | The promises already made | Shipped |
| **0.7** | Motion, money, and posting the work | In progress |
| **0.8** | The number in relation | Planned |
| **0.9** | The record and the console | Planned |

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

## The 0.6 audit — what stops a management system

The programme was re-scoped against one question, asked six ways: what stops a
team building an **ERP, a CRM, a finance system, an admin console, a BI
dashboard or any long-lived management product** on 76° without reaching
outside it? Six independent inventories produced 47 candidates; 25 survived an
adversarial vet against the shipped taxonomy and Part F. They sequence into
four releases, in the order the programme has always used — **what is broken,
then what was asked for, then breadth, then new surface.**

## 0.6 — the promises already made

The gaps that stop a build hardest are not new ideas. They are **the Book's own
binding text with nothing behind it.** B11 mandates a top-of-form error summary
that is not in the barrel. C7 promises tables scroll and never truncate, and
there is not one `@media print` rule in the repository, so on paper the promise
is structurally unkeepable. F2 refuses the Kanban board and cites a replacement
template `src/templates/` does not contain. B28 defers record editing to "a
Drawer with a form" and no screen has ever drawn the pairing. Nothing new is
built on a floor that leaks, and this floor leaks in the system's own voice.

| | Name | One job |
|---|---|---|
| **B52** | `ErrorSummary` | Index a failed submit's field errors as one list of links to the fields that caused them. |
| **B7 amd** | `totals` | State a table's closing figures in a real `<tfoot>`, keyed to the same columns and outside the row, focus, selection and pagination models. |
| **B7 amd** | `leadHold` | Hold the row's identity column in place while the rest of a wide table scrolls under it. |
| **surface** | The printed surface | State what every 76° surface becomes on paper — in `tokens.css` and `base.css` only, so no component branches on the medium. |
| **template** | `erp-purchase-order` | Hold ONE named operational document on its own page: its identity, its facts, its lines, its history and its verbs. |
| **template** | `crm-deal-board` | Show every open deal in the column of the stage it sits in, moved between stages by a named verb rather than by drag. |

**F3 survives, and is argued rather than assumed.** F3 refuses the configurable
data grid — column resize, pin, group, a toolbar the reader drives at runtime.
A `<tfoot>` is not resizable, pinnable or groupable: it is authored, keyed to
the same `Column` array, and outside every model F3 protects. `leadHold` is not
a pin either — not caller-configurable, not draggable, and applied to the first
column only when that column is already `kind: 'id'`, which is the row's
identity B7 already names. **F3 protects against a table whose shape the reader
rearranges; neither of these lets the reader rearrange anything.**

## 0.7 — posting the work

B1–B51 will render a warehouse, a ledger or a service desk beautifully, and
cannot **run** one. The system reads an operation: it lists, filters, drills,
charts and states. The act it has no vocabulary for is the one a procurement
clerk performs forty times an hour — type a bounded number into a row, scan the
next identifier, watch the row acknowledge, post the lot, and find out ninety
seconds later what became of it. B7 is a reader by spec: `Column.render` returns
a node, Enter opens the row and Space selects it, which are the two keys a
typist presses most.

| | Name | One job |
|---|---|---|
| **B53** | `EntryTable` | Type one bounded number into every row of a fixed list of lines, and post the lot once. |
| **B54** | `ScanField` | Take one identifier at a time, scanned or typed, and state what the last one resolved to. |
| **B55** | `SumList` | **Shipped.** State a set of amounts and the figure they add up to. |
| **B56** | `JobList` | State what became of each background operation this reader started, and where its result landed. |
| **B7 amd** | `rowSync` | State that a row's change has not been saved yet, or failed to save. |
| **surface** | Density | Re-tokenize spacing, row height and control minimum into three registered postures, declared on a wrapper and resolved at the nearest declaration. |

`SumList` is B44's arithmetic sibling and the pairing is the point: **B44
divides ONE total into its shares; `SumList` builds ONE total from its lines.**
Density belongs here because this is the release where it becomes load-bearing —
forty entry lines at one fixed row height serve neither a warehouse floor at
arm's length nor an analyst at 27 inches. The system has already solved it once
per-component: B10 carries a bespoke POS variant with its own height and type
ramp, which is exactly the ad-hoc branching the dark-surface amendment exists to
forbid. It becomes a posture on a wrapper, exactly as `data-seed` and
`data-mode` are.

## 0.8 — the number in relation

76° has an excellent vocabulary for a number that is **measured** (B4, B6, B44)
and a number that **changed** (`Delta`). It has almost none for a number read
**against** something else — a hierarchy that rolls up, a second dimension, the
step before it, or the path the reader took to reach it. Every delta in the
system asserts a change without naming what it changed from: `analytics-overview`
prints ▲12.8% with no baseline stated anywhere on the screen, and Ship Gate
point 12 is not checkable against a denominator nobody printed.

| | Name | One job |
|---|---|---|
| **B57** | `TreeTable` | State a hierarchy of rows in which every parent is the sum of its children, across the same numeric columns at every depth. |
| **B58** | `CrossTable` | State ONE measure at every intersection of two dimensions. |
| **B59** | `FunnelList` | State how one total narrows through an ordered sequence of steps. |
| **B35 amd** | The stated baseline | Print what a comparison is against, so no delta on any 76° screen is an unsourced assertion. |
| **surface** | `saved-view-line` | State that the view on screen has drifted from the view that was saved. |

**`PathLine` was withdrawn before it was built.** The 0.6 review named it for
what it was — a breadcrumb — and breadcrumbs are now refused outright as
**F13**: where you are is the Band's job, and a record's parent is a *fact* in
its own `DescriptionList`, a link the reader can follow rather than a trail of
chevrons above the title.

`TreeTable` takes the same F3 reading: a trial balance is not grouped at
runtime — its depth **is** the chart of accounts, which B40 already accepted as
legitimate structure. It is `role="treegrid"`, takes B40's keyboard model,
indent and chevron verbatim, and carries pre-formatted column strings the
component never computes (C9). The heatmap stays refused: `CrossTable` states
the matrix in figures, and a colour scale is six colours on one surface.

## 0.9 — the record and the console

Two screens a person is inside all day and the system has never drawn: the
**conversation** and the **administration console**. 0.6 draws the record page
as a document — identity, lines, totals, paper. This draws it as a
relationship: a thread of attributed, directional messages, facts edited in a
Drawer without leaving the page, history beside them. And it draws the settable
twin of B28, which is exactly the right anatomy and refuses editing controls by
name — leaving `settings-account` shipping four bare switches with no statement
of what flipping one does, an A3 failure the system has no component to prevent.

| | Name | One job |
|---|---|---|
| **B61** | `MessageThread` | State one conversation as an ordered list of messages, each attributed to a person and marked with its direction. |
| **B62** | `SettingList` | State one setting's consequence beside the instant-effect control that changes it. |
| **template** | `crm-deal` | Open ONE record from its list and hold its facts, its history and its verbs on one page, editing in a Drawer rather than on another screen. |
| **template** | `settings-team` | Administer one workspace's people — who is a member, what each may do, and which invitations are outstanding. |

B41 forbids the message thread by its own Don't list — "never two sentences of
body", "never an interactive row" — and its tones are lifecycle, not direction.
`settings-team` is also the screen that unblocks the inbox template listed
below, and it is the first administration console in a set of fifteen templates
that has never held one.

## Part F · refused during the 0.6 audit

Every lens proposed more than survived. These were tested and killed by name, so
they are not proposed again. Part F's test is unchanged: **if a widget's job
needs more than one sentence, or it carries an internal toolbar or
sub-taxonomy, it is a screen composed of 76° parts — not a component.**

| Proposed | Why it is not a gap |
|---|---|
| Approval chain / workflow | B41 `pending` plus a mono actor is exactly this; B39 states position. |
| Exception queue | B7 + `FilterBar` + `FilterLine` + `CardTabs`. The division is complete and binding. |
| Shift handover note | A multiline B11 Field plus B41. |
| BOM hierarchy · chart-of-accounts nav | B40 names a bill of materials in its own spec. |
| Batch-job progress bar | B4 + B31 `Busy` + B22. `JobList` is the lifecycle and the result, not the bar. |
| Month-end close checklist | B39's five-step cap correctly makes it a B7 + B12 screen. |
| Variance vs plan | The extracted `Delta`, with `polarity`. |
| AR ageing · plan split · pipeline mix | B44, absolute figures required in the legend. The donut stays dead. |
| Person picker | `ComboOption` already carries `meta`; owner assignment composes. |
| Inline editing in a `<dl>` | B28 rules it out by name and points at a Drawer with a form — a stated answer, not a gap. |
| Saved-view *picker* | B42 names it as a reason the component exists. The gap was the LINE that states drift. |
| Sparkline inside a `StatS1` | A2 stands. A stat that needs a shape is a B5 `Trend`. |
| Heatmap | `CrossTable` states the matrix in figures. A colour scale is six colours on one surface. |
| Kanban board **widget** | F2 stands unamended. Only the template ships — F2's second column becomes true. |
| Drag to move a card between stages | F10's reasoning holds: the verb is named, in a B20 Menu, and works from the keyboard. |
| `PageHero` record-identity amendment | Declined. B1's Don't is right: no stat numbers in the hero, one sentence of context. A live tone on the ink band puts colour on the one surface that carries none. |
| `Amount` component | Declined. C9 puts formatting at the caller's layer; alignment is the `kind: 'num'` discipline B7 and B28 already carry. |
| `Folio` (printed issuer head) | Declined. The printed surface prints the screen's own head. |
| `GrantMatrix` (roles × permissions) | Declined. The shape is `CrossTable`, the cells are B11 Checkboxes, and `indeterminate` is a one-prop B11 change. |
| API-key / secret reveal | Declined. B43 prints the value exactly and owns the copy control; a one-time secret is B22 + B43 in a Drawer. |
| `ConfirmDialog` | Declined. B13 + B11 + B10 Danger is the composition B10 already mandates. |
| `ErrorState` as a fourth lifecycle component | Declined. The failed region is a B22 Banner at the region's head with B15's anatomy. |
| Impersonation / sandbox chrome | Declined. Nothing new attaches to the band; an impersonated session is a Banner at the top of `<main>`. |
| `DueBy` / relative deadline chip | Declined. A deadline is a mono absolute date beside a B12 `StatusWord`. |
| @mentions · merge/dedupe UI | Declined. Screens or fields composed of shipped parts, not widgets. |
| `print.css` as its own stylesheet | Refused. Print goes in `tokens.css` + `base.css`, for the same reason dark did: no component branches on the medium. |
| Density as a per-component prop | Refused. It is a token-layer posture on a wrapper, resolved at the nearest declaration. |
| `PathLine` (the drill path) | **Refused as F13** after the 0.6 review: it is a breadcrumb. The Band carries `aria-current`, the sub-tab row names the section and the h1 names the page — a fourth voice restating all three grows the nesting F6 already refuses. |
| The kicker above a title · the mono note under an actions cluster | **Refused as F12.** A header is a title, ONE line, and ONE or TWO buttons. Both slots were removed from B47 and B49 rather than documented, because a slot that exists is a slot that gets filled. |
| A stat in the same colour as a call to action | **Refused as F14.** The seed fill is the action's; every figure is ink. If the number is as loud as the button, the reader has two primaries and the screen has none. |

## Exploring — later

- **Registry MCP server** — search components, blocks, and templates by metadata from any assistant.
- **Health seed** — a contrast-verified clinical seed, added through the seed rule (both directions ≥ 4.5:1), including its dark `--sv-seed-text` variant.
- **8-state preview files** — the fundamentals state contract shipped as a preview per component.
- **Full type tokenization** — a complete `--sv-text-*` scale replacing the literals across every component. Correct, and large enough to need its own release.
- **More templates** — billing and onboarding screens. *(Analytics shipped in v0.4.0. The inbox is unblocked by `MessageThread` in 0.9, and the purchase order, deal board, deal record and team console are scheduled in 0.6 and 0.9.)*
- **Theming playground** — swap the seed and the mode live and watch a real screen re-theme.
- **Token sync** — a Figma ⇄ `tokens.css` bridge so design and code share one source.

*Full type tokenization is still listed above, and 0.7's density postures will
touch the same layer. If the two land together the `--sv-text-*` scale is the
cheaper half of that change, not a separate release.*

## Quality gates — every item, every phase

Native element first · zero runtime dependencies · the 8-state + 4-lifecycle
contract · AA on **both** surfaces · registry item + llms doc + demo in the
same change · `firewall`, `tsc -b`, `build`, `check-sync`, and `test` green.

---

*76° — Seventy Six Degrees · the product is the design.*
