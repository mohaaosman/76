import type { DocEntry } from './types';

/**
 * v0.4.0 · closing the product taxonomy — the input half. Three fields
 * B11 always implied and never shipped: the quantity stepper, the range
 * slider, and the date range that Part F (F4) refuses to draw as a
 * calendar.
 */
export const inputs: DocEntry[] = [
  /* ================================================================ B33 */
  {
    slug: 'number-field',
    name: 'NumberField',
    book: 'B33',
    category: 'forms',
    tagline: 'The quantity input — native number, B11 chrome, a − / + pair, stated unit.',
    job: 'Enter a bounded QUANTITY.',
    tags: ['number', 'stepper', 'quantity', 'input', 'spinner', 'form'],
    exports: ['NumberField'],
    files: ['components/seventy-six/number-field.tsx', 'components/seventy-six/number-field.css'],
    registryDeps: ['field'],
    intro: [
      'A native <code>&lt;input type="number"&gt;</code> wearing B11 chrome — label above, optional hint, an error that says <b>what</b> and <b>how to fix it</b> — with a square − / + pair replacing the browser spinners, which duplicate the job and cannot be styled to system. The figure is tabular and right-aligned; the unit is stated beside the field in mono, never hidden inside it as a placeholder.',
      'The bounds are enforced, not merely announced: typing past <code>max</code> clamps, the − button disables at <code>min</code>, and the + at <code>max</code>. A control that lets you enter an impossible value and then scolds you for it has failed twice.',
    ],
    examples: [
      {
        title: 'Quantity with a unit',
        demoKey: 'number-basic',
        surface: 'paper',
        code: `import { NumberField } from '@/components/seventy-six';

<NumberField
  label="Pallet positions"
  hint="Whole pallets only — partials go on the overflow line."
  value={qty}
  onValueChange={setQty}
  min={1}
  max={48}
  unit="pallets"
/>`,
      },
      {
        title: 'Error state',
        description: 'The error names what and how to fix — never "invalid input" (A3).',
        demoKey: 'number-error',
        surface: 'paper',
        code: `<NumberField
  label="Reorder point"
  value={value}
  onValueChange={setValue}
  error="Reorder point must be below the maximum stock level of 4,700."
/>`,
      },
    ],
    props: [
      {
        component: 'NumberField',
        rows: [
          { name: 'label', type: 'string', description: 'Above the field, always. Also names the − / + buttons.' },
          { name: 'value', type: 'number', description: 'Controlled value.' },
          { name: 'onValueChange', type: '(value: number) => void', description: 'Receives the CLAMPED value — never an out-of-bounds one, and never a parse of an empty box.' },
          { name: 'min', type: 'number', defaultValue: '0', description: 'Enforced, not just announced.' },
          { name: 'max', type: 'number', description: 'Enforced. Defaults to the safe-integer ceiling.' },
          { name: 'step', type: 'number', defaultValue: '1', description: 'What the − / + pair adds and removes.' },
          { name: 'unit', type: 'string', description: 'Mono uppercase, beside the field — never a placeholder.' },
          { name: 'hint', type: 'string', description: 'One line under the label stating the rule up front.' },
          { name: 'error', type: 'string', description: 'What went wrong AND how to fix it. Wires aria-invalid + describedby.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '↑ / ↓', action: 'Native step, honouring min/max/step.' },
        { keys: 'Tab', action: 'Enters the input; the − / + buttons are separate stops with their own labels.' },
      ],
      notes: [
        'The step buttons carry aria-labels naming the object ("Decrease pallet positions") — never bare "+" and "−" (A4).',
        'The input keeps inputmode="numeric" so touch keyboards open on digits.',
        'The figure is tabular (A4), so a changing quantity does not shift the field width.',
        'Errors are wired through aria-describedby with aria-invalid="true", stated below the field (B11).',
        'Clearing the box leaves it empty while you retype. A number prop cannot express "empty", so the field holds what you typed until blur and reconciles then — <code>Number(\'\')</code> is <code>0</code>, and 0 is an entry, not an absence.',
      ],
    },
    donts: [
      'No unit inside the input as a placeholder — the placeholder is never a label (B11).',
      'No unbounded stepper on a value that has real bounds; state them and enforce them.',
      'No stepper for a value people type in full (a price, a year) — that is a plain Field.',
      'No validation on the first keystroke; blur first, then on change once an error exists (B11).',
    ],
    faq: [
      { q: 'Why replace the native spinners?', a: 'They are unstyleable across browsers, invisible on touch, and 12px tall. The − / + pair is the same behaviour at a real hit area (C8).' },
      { q: 'Currency?', a: 'A plain Field with a mono prefix. A stepper implies nudging; nobody nudges a price by one cent.' },
    ],
  },

  /* ================================================================ B34 */
  {
    slug: 'slider',
    name: 'Slider',
    book: 'B34',
    category: 'forms',
    tagline: 'A native range in 76° clothes — position matters, and the number is still printed.',
    job: 'Set a value whose POSITION in a range matters more than its digits.',
    tags: ['slider', 'range', 'threshold', 'input', 'form'],
    exports: ['Slider'],
    files: ['components/seventy-six/slider.tsx', 'components/seventy-six/slider.css'],
    registryDeps: ['field'],
    intro: [
      'A native <code>&lt;input type="range"&gt;</code> on the B4 bar geometry: a 3px track, a 14px seed thumb, the standard focus ring. Keyboard, touch and screen-reader behaviour are the platform\'s, unmodified.',
      'The readout is not optional. B4\'s rule holds here — the bar illustrates, the printed figure informs — so the mono value sits beside the label and updates as the thumb moves. Note what is missing: there is no filled track, because a two-tone fill needs a gradient and gradients are banned (A1). The number carries what the fill would have.',
    ],
    examples: [
      {
        title: 'Threshold with a formatted readout',
        demoKey: 'slider-basic',
        surface: 'paper',
        code: `import { Slider } from '@/components/seventy-six';

<Slider
  label="Alert threshold"
  hint="Below this, the warehouse raises a replenishment task."
  value={threshold}
  onValueChange={setThreshold}
  min={0}
  max={100}
  step={5}
  format={(v) => \`\${v}%\`}
/>`,
      },
    ],
    props: [
      {
        component: 'Slider',
        rows: [
          { name: 'label', type: 'string', description: 'Above the track, with the readout on the same line.' },
          { name: 'value', type: 'number', description: 'Controlled value.' },
          { name: 'onValueChange', type: '(value: number) => void', description: 'Fires on every input event.' },
          { name: 'min', type: 'number', defaultValue: '0', description: 'Range floor.' },
          { name: 'max', type: 'number', defaultValue: '100', description: 'Range ceiling.' },
          { name: 'step', type: 'number', defaultValue: '1', description: 'Granularity — coarse steps beat false precision.' },
          { name: 'format', type: '(value: number) => string', description: 'Formats the readout AND aria-valuetext.' },
          { name: 'hint', type: 'string', description: 'One line stating what the value does.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: '← / →', action: 'Moves by one step (native).' },
        { keys: 'Home / End', action: 'Jumps to min / max (native).' },
      ],
      notes: [
        'Native range semantics: role="slider" with valuemin/max/now supplied by the element itself.',
        'When format is given it also becomes aria-valuetext, so "40%" is announced rather than "40".',
        'The printed readout is aria-hidden — the input already announces its value, and twice is noise.',
        'The thumb is 14px with a 2px offset focus ring (C3); on touch the whole 14px row is draggable.',
        'The track uses <code>--sv-field-line-strong</code>, not B4\'s wall: with no fill to identify it, the track IS the affordance and owes the 3:1 non-text bar (1.4.11). Wall would be 1.06:1 on paper.',
      ],
    },
    donts: [
      'No slider for a value people know exactly — that is a NumberField (B33).',
      'No dual-thumb range slider; two bounds are two fields (see B35 for dates).',
      'No hiding the number: a bar with no figure states nothing (B4).',
      'No gradient fill on the track, ever (A1).',
    ],
    faq: [
      { q: 'Why no filled track?', a: 'It requires a gradient, which A1 bans outright. The printed value carries the information the fill would have, at AA contrast, at any zoom.' },
      { q: 'Slider or NumberField?', a: 'Ask whether the exact digits matter. Threshold, weighting, opacity: Slider. Quantity, reorder point, headcount: NumberField.' },
    ],
  },

  /* ================================================================ B35 */
  {
    slug: 'date-range-field',
    name: 'DateRangeField',
    book: 'B35',
    category: 'forms',
    tagline: 'Two native date inputs, a mono preset row, and a context line — no month grid, ever.',
    job: 'Choose a DATE RANGE.',
    tags: ['date range', 'date', 'calendar', 'presets', 'filter', 'form'],
    exports: ['DateRangeField', 'presetRange'],
    files: ['components/seventy-six/date-range-field.tsx', 'components/seventy-six/date-range-field.css'],
    registryDeps: ['field'],
    intro: [
      'Part F is binding here: <b>76° draws no month grid</b> (F4). A range is a mono preset row — <code>7D · 30D · QTD · YTD · CUSTOM</code> — over two native <code>&lt;input type="date"&gt;</code> fields welded into one Field, under a mono context line that states what the range actually means: "24 days · ends today".',
      'The browser draws the picker, and it is better than any we would ship: localized, keyboard-complete, screen-reader-tested, and free. What 76° adds is the part that products actually reach for — the presets, which cover the overwhelming majority of selections without opening a picker at all. <code>presetRange</code> is exported so a Menu, a URL parameter or a saved view can compute the same ranges.',
    ],
    examples: [
      {
        title: 'Presets, fields, context',
        demoKey: 'daterange-basic',
        surface: 'paper',
        code: `import { DateRangeField } from '@/components/seventy-six';

<DateRangeField
  label="Reporting period"
  value={range}
  onValueChange={setRange}
  today="2026-07-25"
/>`,
      },
      {
        title: 'Order enforced',
        description: 'A start after the end is caught by the field itself, in B11 voice.',
        demoKey: 'daterange-error',
        surface: 'paper',
        code: `<DateRangeField
  label="Reporting period"
  value={{ from: '2026-07-30', to: '2026-07-02' }}
  onValueChange={setRange}
/>
// → "The start date is after the end date. Move the start date back."`,
      },
    ],
    props: [
      {
        component: 'DateRangeField',
        rows: [
          { name: 'label', type: 'string', description: 'The legend of the fieldset; also names each input for screen readers.' },
          { name: 'value', type: '{ from: string; to: string }', description: 'ISO YYYY-MM-DD pair.' },
          { name: 'onValueChange', type: '(value: DateRange) => void', description: 'Fires on preset click and on either input.' },
          { name: 'presets', type: 'DateRangePreset[]', defaultValue: "['7D','30D','QTD','YTD','CUSTOM']", description: 'Pass a subset to drop any. CUSTOM is always last.' },
          { name: 'today', type: 'string', defaultValue: "today's date", description: 'ISO date the presets count back from — pass it to keep renders deterministic.' },
          { name: 'context', type: 'string', description: 'Replaces the derived "24 days · ends today" line.' },
          { name: 'error', type: 'string', description: 'Overrides the built-in start-after-end check.' },
          { name: 'min / max', type: 'string', description: 'ISO bounds passed to both native inputs.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Tab', action: 'Walks the presets, then the start field, then the end field.' },
        { keys: 'Native', action: 'Each date input keeps the browser\'s own segment editing and picker keys.' },
      ],
      notes: [
        'A real <fieldset>/<legend> groups the pair; each input adds its own aria-label ("Reporting period, start date").',
        'Presets are buttons with aria-pressed, so the active range is announced as a state, not implied by colour (C5).',
        'The context line is aria-live="polite" — changing the range announces the new span once.',
        'The end field takes the start date as its min, so the invalid half of the calendar is unreachable rather than merely rejected.',
      ],
    },
    donts: [
      'No month grid, no scheduler, no "compare to previous period" overlay — F4 is binding.',
      'No relative-only ranges ("Last quarter") without the absolute dates beside them (C9).',
      'No preset row longer than five; the sixth is a saved view, not a preset.',
      'No silent clamping of an inverted range — say what is wrong and how to fix it (B11).',
    ],
    faq: [
      { q: 'Why refuse a calendar component?', a: 'F4. A month grid carries an internal toolbar and a sub-taxonomy, which by the Part F test makes it a screen, not a part — and the browser already ships an accessible, localized one for free.' },
      { q: 'How do I add a fiscal-year preset?', a: 'Compute the range yourself and pass it through onValueChange; presetRange covers the calendar-based four.' },
    ],
  },
];
