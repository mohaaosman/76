# System dials & the ecosystem model

Read this when starting a NEW 76° product or choosing a seed. Every 76° product is the *same* system; only one thing is allowed to differ between them. This file names that one thing, defines the rule for choosing it, and gives the per-system-type dials that sit on top.

## The three-layer ecosystem model

76° is one system rendered many times. It stacks in three layers, and only the top one is a per-product variable.

**Layer 1 — the invariant system.** The laws, the widget taxonomy, the band-and-sheet layout, and the a11y contract. Paper on a wall: white cards on the platinum wall, separated by contrast plus one 1px shadow, no borders. Three colors total (ink + one seed + functional green/red on words and 6px dots only). Mono speaks metadata, Hanken Grotesk speaks content. Navigation lives horizontally in the ink band. Numbers are tabular instrumentation. The widget set (DataTable, StatS1, MeterList, ActivityList, Progress, Trend, and the rest of the Book, B1–B18) and the C1–C7 accessibility contract are fixed. **This layer never changes per product.**

**Layer 2 — the shared neutrals, geometry, and motion.** The wall (`--sv-wall`), the ink ladder (`--sv-ink` / `--sv-ink-soft` / `--sv-ink-faint`), the band and its hairlines, the internal hairlines and field lines, the one radius (`--sv-r`, 4px), the one shadow (`--sv-shadow`, `0 1px 2px`), and the two motion durations (`--sv-t-fast` 120ms / `--sv-t` 160ms, opacity/color only, collapsing to 0ms under reduced motion). These are tokens, and they are identical in every product. **This layer never changes per product.**

**Layer 3 — the seed, and only the seed.** One product-scoped variable: the seed color, set with `<html data-seed="...">`. Choosing a product *is* choosing Layer 3. The seed selects a registered block in `tokens.css` (`--sv-seed`, `--sv-seed-deep`, `--sv-seed-tint`, and optionally `--sv-seed-text`) and nothing else moves.

If a product asks to change anything in Layer 1 or Layer 2 — a different radius, a softer shadow, a second accent, a bespoke font, a new law — that is a **defect in the request, not a feature of the product.** Push back and re-scope to Layer 3. The only per-product knobs are the seed and a density posture (below); everything else is inherited unchanged.

## Choosing a seed (the seed rule)

A seed is admissible only if it passes the **C1 contrast gate in both directions on white**:

- **seed-on-white ≥ 4.5:1** (the seed used as text/lines), AND
- **white-on-seed ≥ 4.5:1** (white text on a seed fill, e.g. a primary button).

A seed that fails either direction is **rejected** — do not ship it, do not darken the wall or lighten the text to rescue it. Pick a different hue.

**The fills-pass-but-text-fails case.** A hue can pass white-on-seed (fills are fine) yet fail seed-on-white (the same color as text is too light). This is not a rejection — it is the reason `--sv-seed-text` exists. Ship the passing fill as `--sv-seed`, and a darker verified variant as `--sv-seed-text` for any place the seed is used *as text*. Signal/POS is the canonical case: `--sv-seed` is `#D9531E` (white-on-seed 4.6:1, fills only), while `--sv-seed-text` is `#C24413` (passes seed-on-white). When both directions pass at the same value (Cobalt, Verdigris), `--sv-seed-text` simply equals `--sv-seed`.

**Registering a new seed.** Add one block to the Layer-3 registry in `tokens.css`, keyed by `[data-seed='name']`, with:

1. `--sv-seed` — the verified hue (fills + lines).
2. `--sv-seed-deep` — the same hue darkened ~20%, for the pressed state.
3. `--sv-seed-tint` — the same hue at ~8% on white, for icon tiles and selected rows.
4. `--sv-seed-text` — only when the fill hue fails seed-on-white; otherwise equal to `--sv-seed`.

Then set `<html data-seed="name">`. No other file changes.

**What the seed is allowed to color — the whole list.** Primary buttons, the active-tab weight, links, the 34px icon tiles (as `--sv-seed-tint`), the selected/hover row wash (as `--sv-seed-tint`), and the "now" line in trends. That is all. The seed **never** colors a whole surface, a card, a band, or body text. Functional green/red is not the seed and is not covered by this rule (it lives on words and 6px dots only).

## Per-system dials

Each system type inherits Layers 1–2 unchanged and picks a Layer-3 seed plus a density posture. The dials below tune *emphasis and formatting*, never the laws.

### ERP — seed **Cobalt** (`#2C5BE0`, 5.70:1 both ways)

- **Posture:** compact — the highest density in the system. Instrumentation-first.
- **Dominant widgets:** DataTable (full arrow-key navigation), StatS1 rows, and MeterList carry the screen. Dense grids over cards.
- **Voice/formatting:** absolute timestamps in ActivityList (never "2h ago" — `2026-07-24 14:30`). ⌘K SearchCommand available everywhere. Tabular numbers on every value that can change. Metadata in mono; keep chrome minimal so the data reads as the instrument it is.

### CRM — seed **Verdigris** (`#12836F`, 5.0:1 both ways)

- **Posture:** compact — same density rules as ERP.
- **Dominant widgets:** ActivityList, Progress, and Trend come forward; relationship and pipeline state over raw tables. DataTable still present but supporting.
- **Voice/formatting:** slightly warmer read (the seed does that work — nothing else changes), but the density, spacing, and formatting discipline are identical to ERP. Pipeline stages use Progress; momentum uses Trend with the seed "now" line. Times stay absolute.

### POS — seed **Signal** (fill `#D9531E`; **text `#C24413`** via `--sv-seed-text`)

- **Posture:** scaled-up, touch-first. Body **16–18px**, values **28–40px**, touch targets **≥48px**. Fewer widgets per screen.
- **Dominant widgets:** big StatS1 values dominate; minimal chrome; large single-purpose actions. Avoid dense tables on the transaction surface.
- **Voice/formatting:** the seed fill passes but seed-as-text does not — always use `--sv-seed-text` (`#C24413`) for any Signal-colored text. Scale up type and hit areas; keep one primary action obvious per screen. Everything else is still 76°: same wall, same shadow, same radius.

### Health / clinical — seed **suggested: `#0F6FB2` (clinical blue)**, MUST be contrast-verified before use

- **Seed note:** a calm, legible blue in the cobalt-adjacent family reads right for clinical work. `#0F6FB2` is a *candidate* — run the C1 gate both directions on white before registering it, and if seed-on-white falls short, ship the fill as `--sv-seed` and a darkened `--sv-seed-text`. Do not treat the suggestion as pre-approved.
- **Posture:** comfortable — more breathing room than ERP/CRM, high legibility, generous line-height. Legibility beats density here.
- **Dominant widgets:** StatS1 and MeterList for vitals/ranges; ActivityList for the record. Status is load-bearing.
- **Voice/formatting:** status-word + 6px-dot discipline is **critical** — never color-only (C2); the word carries the meaning and the dot supports it. Conservative motion (lean on `--sv-t-fast`, nothing showy). Absolute times always — clinical records are timestamps, not relative phrases.

**New system types** inherit Layers 1–2 unchanged and only pick a Layer-3 seed (through the gate) plus a density posture from the table below. Nothing else is theirs to set.

## Density postures

| Posture | Systems | Base body | Stat value | Table row height | Touch target |
|---|---|---|---|---|---|
| Compact | ERP, CRM | 13px | 20–24px | 36px | ≥40px |
| Comfortable | Health / clinical | 14–15px | 24–28px | 44px | ≥44px |
| Scaled-up | POS | 16–18px | 28–40px | 52px | ≥48px |

Posture tunes size and spacing only. Radius, shadow, motion, color roles, and the widget taxonomy are identical across every row.

## Don't

- **Don't invent a per-product font.** Hanken Grotesk for content, Fragment Mono for metadata — in every product.
- **Don't add a second accent.** One seed, plus functional green/red on words and dots. Two accents is a Layer-1 violation.
- **Don't change the radius, shadow, or motion per product.** 4px, the one 1px shadow, 120/160ms — Layer 2, invariant.
- **Don't ship a seed that fails the contrast gate.** Both directions ≥4.5:1 on white, or it does not exist. No wall-darkening workarounds.
- **Don't use functional color on surfaces.** Green/red live on words and 6px dots only — never as a card wash, a row fill, or a band. The seed never washes a whole surface or body text either.
