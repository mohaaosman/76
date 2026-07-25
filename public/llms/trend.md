# Trend · 76° UI (B5)

Flat single-weight SVG lines on a hairline grid — seed for now, line-gray for before. No fills; the draw-in is off until the app asks.

**One job:** Answer "which direction."
**Category:** widgets · **Exports:** Trend, Sparkline · **Tags:** chart, line-chart, bar-chart, stacked-bar, sparkline, comparison, svg, no-area-fill

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/trend.json
```

Manual: copy components/seventy-six/trend.tsx, components/seventy-six/trend.css into your project (plus styles/tokens.css and lib/cx.ts).

## Overview

Hand-rolled SVG, no chart library: 2.25px round-joined lines, horizontal hairlines only, a 4px terminal dot on the live series, and the color convention that removes most legends — **seed is this period, line-gray is last period**. Bars are flat seed with faint-ink secondaries and 2px top radius.

Trend cards live on report pages, not overviews (overviews use S1 stats). Maximum three series; a chart needing more is a table wearing a costume.

**v0.4.0** adds two things. `kind="stacked"` sums the series per column and scales the plot to the total — legal only when the segments are parts of ONE total, never unrelated measures sharing an axis. **Sparkline** is the same shape at cell size: no axes, no grid, no labels, and legal only BESIDE a printed figure, because a line with no scale states nothing on its own.

The **v0.4.0 remainder amendment** adds the two things a printed chart was still missing. `yTicks` takes up to four PRE-FORMATTED labels, given bottom-to-top, pinned to the four gridlines the chart already draws at 25, 50, 75 and 100 percent of the plot — the component never formats a number (C9), and the column is `aria-hidden` because the required `ariaLabel` already carries the takeaway. `highlight` names the one column the chart is ABOUT, and it is a **printed statement, never a hover tooltip**: C8 forbids hover-dependent information, so the chip is always visible. The other columns recede to `--sv-compare`, the chip is drawn in HTML rather than SVG because the plot is `preserveAspectRatio="none"` and would stretch any `<text>` inside it, and the matching x label goes ink at 700.

The `ariaLabel` prop is required and must state the takeaway, because a chart's role="img" summary is the accessible content. For decision-critical data, pair the chart with a "View data" affordance or a visually-hidden table.

## Examples

### This period vs last

```tsx
import { Trend, Card, CardHead } from '@/components/seventy-six';

<Card>
  <CardHead title="Revenue" subtitle="Daily · July vs June" />
  <div className="trend-pad">
    <Trend
      ariaLabel="Revenue trending up: $482K month to date against $431K at this point in June"
      series={[
        { label: 'July', data: julyDaily, tone: 'seed' },
        { label: 'June', data: juneDaily, tone: 'compare' },
      ]}
      xLabels={['01 JUL', '08 JUL', '15 JUL', '22 JUL']}
    />
  </div>
</Card>
```

### Bars

```tsx
<Trend
  kind="bar"
  ariaLabel="Orders per weekday peaking Thursday at 312"
  series={[{ label: 'Orders', data: [180, 224, 251, 312, 296, 142, 98], tone: 'seed' }]}
  xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
  height={120}
/>
```

### Stacked — parts of one total

Only when the segments sum to something real. Two unrelated measures are two charts.

```tsx
<Trend
  kind="stacked"
  legend
  ariaLabel="Weekly volume by channel, total peaking Thursday at 412 orders"
  series={[
    { label: 'Direct', data: direct },
    { label: 'Partner', data: partner },
    { label: 'Marketplace', data: marketplace },
  ]}
  xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
  height={140}
/>
```

### The bar the chart is about

Thursday is the point, so Thursday is stated: the chip is printed above the peak, the other six bars recede to compare, and the THU label goes ink at 700. Nothing here waits for a pointer. The yTicks are formatted upstream and land on the gridlines the plot already draws.

```tsx
<Trend
  kind="bar"
  ariaLabel="Orders per weekday peak on Thursday at 312, a quarter above the weekday average"
  series={[{ label: 'Orders', data: [180, 224, 251, 312, 296, 142, 98], tone: 'seed' }]}
  xLabels={['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']}
  yTicks={['90', '180', '270', '360']}
  highlight={{ index: 3, label: 'THU · 312' }}
  height={140}
/>
```

## Props

### Trend

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `ariaLabel` | `string` | — | REQUIRED. The takeaway, stated in words. |
| `series` | `TrendSeries[]` | — | { label, data, tone? } — max 3; first defaults to seed, others to compare. |
| `kind` | `'line' | 'bar' | 'stacked'` | `'line'` | Bars are flat seed / faint-ink; stacked sums the series per column. |
| `xLabels` | `string[]` | — | Mono labels spread under the plot. |
| `height` | `number` | `160` | Plot height in viewBox units. |
| `legend` | `boolean` | `false` | Show 14×2px swatch legend when the seed/gray convention is not enough. |
| `yTicks` | `string[]` | — | Up to four PRE-FORMATTED labels, bottom-to-top, pinned to the 25/50/75/100% gridlines. The chart never formats a number (C9); the column is aria-hidden. |
| `highlight` | `{ index: number; label: string }` | — | The one column the chart is about. Prints a chip above it, recedes the rest to compare, and takes its x label to ink/700. Never a hover state (C8). |

### Sparkline

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `data` | `number[]` | — | The series. Scaled to its own min/max — it shows shape, not level. |
| `ariaLabel` | `string` | — | REQUIRED takeaway, as on Trend. |
| `width / height` | `number` | `72 / 20` | Cell-sized by default. |
| `tone` | `'seed' | 'faint'` | `'seed'` | faint for a secondary row in a dense table. |

## Accessibility

- The SVG is `role="img"` with the takeaway as its label — screen-reader users get the conclusion, not a coordinate dump.
- Series are never referenced by color alone in copy (C5): label them directly or via the legend.
- The y-tick column is `aria-hidden`, and so is the highlight chip: both are ordinary HTML text in the flow rather than stretched SVG, but the required `ariaLabel` already states the takeaway and two readings of one fact is a defect.

## Don't

- No area or gradient fills under lines (A1).
- No dual-axis charts; two units means two charts.
- No animated draw-in **by default** — the chart is simply there. It draws only where a wrapper declares `data-motion="on"`, in 200ms, along a `pathLength`-normalised line whose un-animated state is the finished line. The Sparkline follows it; the highlight chip deliberately does not, because a printed statement does not arrive late.
- No donuts, pies, radials, or gauges anywhere in product (A2) — MeterList replaces them.
- No more than three series.
- No stacked bars for measures that do not sum to a real total.
- No Sparkline standing alone — it sits beside the figure that carries the value.
- No `highlight` standing in for interaction — a chart that only tells the truth on hover has failed C8.

## FAQ

**Which colors do series use?**

tone: "seed" (current), "compare" (line-gray #D6DAE0, the one aliased non-token color), or "faint" for secondary bars. There is no palette to pick from — the convention is the palette.

**Why no chart library?**

A flat line on hairlines is ~60 lines of SVG. A library would add a dependency, its own theme system to fight, and animation defaults that violate the firewall.

**How do users get exact values?**

Pair the card with a "View data" text-link action in the CardHead that opens the underlying table — decision-critical numbers always exist as text somewhere.

**Did the x labels move in v0.4.0?**

Yes, and it was a fix. `.sv-trend__x` went from `space-between` to a real column grid of `xLabels.length` equal columns, matching the columns the bars are centred in. Under space-between only the first and last label ever sat on their bar; every label between them drifted, and the more labels a chart had the further off they were.
