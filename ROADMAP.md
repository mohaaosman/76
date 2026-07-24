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

## Phase 3 — closing the taxonomy (nothing missing)

The line-by-line inventory against Bootstrap, Tailwind UI, shadcn/ui, and
Material, so no software built on 76° ever reaches outside it. Each enters
through the Book: named, single-jobbed, registered.

**Inputs.** Date picker & date-range (native `<input type="date">` first, composed calendar where ranges demand it) · Multi-select Combobox (tokens-in-field) · Number/stepper input · Slider (native `<input type="range">`, tokenized) · File upload (drop zone + file rows + progress) · Pin/OTP input · Search field (the ⌘K trigger's inline sibling).

**Structure.** Accordion (native `<details>`) · Page-level Tabs (the in-card set exists as CardTabs) · Stepper/wizard header · Description list (key-value rows — the ERP workhorse) · Divider with mono label · Pagination + "1–50 of 1,204" range readout for DataTable · Tree list (mono, for folders/orgs) · Timeline (ActivityList's vertical sibling with connectors).

**Feedback & display.** Inline Spinner + full-region Busy state (the B10 spinner, freed) · Avatar + AvatarGroup (50% radius is already registered) · Popover primitive (the Menu's panel, generalized for rich content) · KBD key component · Code block (mono, copy action) · Stat delta chip (S1's delta, standalone).

**Charts.** Bar and stacked-bar Trend variants · Sparkline (cell-sized) · Distribution strip (the honest histogram) — donuts and gauges stay banned forever.

**Quality gates for every Phase 3 item.** Native element first; zero runtime
dependencies; the 8-state + 4-lifecycle contract; AA on both surfaces (light
and dark); registry item + llms doc + demo in the same change.

## Exploring — later

- **Registry MCP server** — search components, blocks, and templates by metadata from any assistant.
- **Health seed** — a contrast-verified clinical seed, added through the seed rule (both directions ≥ 4.5:1) — now including its dark `--sv-seed-text` variant.
- **8-state preview files** — the fundamentals state contract shipped as a preview per component.
- **More templates** — analytics, billing, inbox, and onboarding screens.
- **Theming playground** — swap the seed and the mode live and watch a real screen re-theme.
- **Token sync** — a Figma ⇄ `tokens.css` bridge so design and code share one source.

---

*76° — Seventy Six Degrees · the product is the design.*
