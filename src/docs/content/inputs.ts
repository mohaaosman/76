import type { DocEntry } from './types';

/**
 * v0.4.0 · closing the product taxonomy — the input half. Five fields
 * B11 always implied and never shipped: the quantity stepper, the range
 * slider, and the date range that Part F (F4) refuses to draw as a
 * calendar. The last two close the remainder — the in-place filter that
 * B16's ⌘K was never going to cover, and the attachment list that states
 * what happened to every file while owning none of the transport.
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

  /* ================================================================ B36 */
  {
    slug: 'search-field',
    name: 'SearchField',
    book: 'B36',
    category: 'forms',
    tagline: 'The in-place filter — native search, B11 chrome, one named clear, a live count.',
    job: 'Filter a set that is ALREADY on screen by typing.',
    tags: ['search', 'filter', 'input', 'live region', 'clear', 'form'],
    exports: ['SearchField'],
    files: ['components/seventy-six/search-field.tsx', 'components/seventy-six/search-field.css'],
    registryDeps: ['field'],
    intro: [
      'A native <code>&lt;input type="search"&gt;</code> wearing B11 chrome — label above, optional hint, an error that says <b>what</b> and <b>how to fix it</b> — with a magnifier on the left and one clear button on the right. The right padding is reserved from the first paint, so the text does not shift when the clear appears on the first keystroke. The only native part removed is WebKit\'s cancel button: it is unstyleable, unlabelled, and invisible on the wall. Ours is a real button whose <code>aria-label</code> names the field it empties ("Clear search orders"), and it hands focus back to the input.',
      'The boundary is the rule. <b>This is not B16 SearchCommand.</b> ⌘K is the keyboard front door to the whole application — a dialog, opened over the page, that takes you somewhere else. SearchField filters what you are already looking at, in place, on every keystroke: no button to press, no page to wait for, no destination. They answer different questions, and shipping one does not excuse skipping the other.',
      'The result line is a mono <code>aria-live="polite"</code> region under the field, and it is rendered even when <code>resultText</code> is empty. A live region inserted at the same moment as its first text is routinely missed, so the region sits in the accessibility tree from the start and only its text changes. Empty, it collapses to zero height and eats the field gap, so an absent count leaves no hole.',
    ],
    examples: [
      {
        title: 'Filtering a list in place',
        demoKey: 'search-basic',
        surface: 'paper',
        code: `import { useState } from 'react';
import { SearchField } from '@/components/seventy-six';

const [query, setQuery] = useState('');
const matches = orders.filter((o) => o.ref.includes(query));

<SearchField
  label="Search orders"
  placeholder="Reference, customer, or PO number"
  hint="Filters the list below as you type."
  value={query}
  onValueChange={setQuery}
  resultText={\`\${matches.length} of \${orders.length} match\`}
/>`,
      },
      {
        title: 'Inside a FilterBar',
        description: 'labelHidden is legal here: the FilterBar already names the set on screen (B7).',
        demoKey: 'search-inline',
        surface: 'paper',
        code: `<FilterBar
  label="Order filters"
  active={query !== ''}
  onClearAll={() => setQuery('')}
  controls={
    <SearchField
      label="Search orders"
      labelHidden
      placeholder="Search orders"
      value={query}
      onValueChange={setQuery}
    />
  }
/>
// No resultText here — the FilterLine below the bar announces the change.`,
      },
    ],
    props: [
      {
        component: 'SearchField',
        rows: [
          { name: 'label', type: 'string', description: 'Names the set being filtered: "Search orders", not "Search". Also names the clear button.' },
          { name: 'value', type: 'string', description: 'Controlled value.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Fires on every keystroke, and with an empty string on clear and on Esc.' },
          { name: 'placeholder', type: 'string', defaultValue: "'Search'", description: 'States the scope. Never the label — it vanishes on the first keystroke.' },
          { name: 'labelHidden', type: 'boolean', description: 'Registered exception. Hides the label visually, legal only where a CardHead or a FilterBar already names the set.' },
          { name: 'hint', type: 'string', description: 'One line under the label stating what the field filters.' },
          { name: 'resultText', type: 'string', description: 'Mono count under the field, announced politely: "12 OF 248 MATCH". The caller counts; the field states.' },
          { name: 'error', type: 'string', description: 'What went wrong AND how to fix it. Wires aria-invalid + describedby.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Esc', action: 'Clears the filter and keeps focus in the input. On an already empty field it does nothing, so Esc still reaches an enclosing Dialog or Popover.' },
        { keys: 'Tab', action: 'The input, then the clear button — which exists only while there is something to clear.' },
      ],
      notes: [
        '<code>type="search"</code> keeps the platform semantics and the search-shaped touch keyboard; only WebKit\'s cancel button is suppressed, and a named button replaces it.',
        'The clear button carries an aria-label naming its field ("Clear search orders") — never a bare "×" (A4) — and returns focus to the input it emptied.',
        'The result line owns its own <code>aria-live="polite"</code> region and is deliberately left out of aria-describedby: naming it there would read the count again on every focus.',
        'That region is rendered empty rather than removed. <code>display: none</code> would drop it out of the accessibility tree and lose the first announcement.',
        'labelHidden moves the label into <code>sv-visually-hidden</code>: it is still the accessible name, still in the tree, and the placeholder is still not the label (B11).',
        'Errors are wired through aria-describedby with aria-invalid="true", stated below the field (B11).',
      ],
    },
    donts: [
      'No placeholder standing in for the label — the placeholder is never a label (B11).',
      'No labelHidden without a CardHead or a FilterBar naming the set on screen; it is a registered exception, not a shortcut.',
      'No bare "Search" as the label; name the set being filtered (A4).',
      'No submit button and no Enter-to-search — a filter that needs a round trip and a wait is a form, not this.',
      'No resultText on a SearchField that sits in a FilterBar beside a FilterLine; two live regions for one change is a defect (B7).',
      'No SearchField as the app\'s only search. Filtering a table is not navigating the product (B16).',
    ],
    faq: [
      { q: 'SearchField or SearchCommand (B16)?', a: 'Ask what the typing does. Narrows a set that is already rendered: SearchField. Crosses the app and lands you somewhere else: SearchCommand. A product that filters well and cannot be navigated from the keyboard is still missing B16.' },
      { q: 'Where is the debounce?', a: 'In your query layer, not here. The field fires onValueChange on every keystroke because its job is filtering what is already loaded; deferring a network call is the caller\'s decision, and a component that guesses the delay is wrong for half its uses.' },
      { q: 'Why is the count a separate line instead of text in the field?', a: 'The count is an announcement, not part of the value. It lives in a live region so it is read when it changes, and stays out of the input so typing never has to compete with it.' },
    ],
  },

  /* ================================================================ B37 */
  {
    slug: 'file-field',
    name: 'FileField',
    book: 'B37',
    category: 'forms',
    tagline: 'The attachment field — a dashed target, a real file input behind a named button, one row per file stating its outcome.',
    job: 'Attach files, and state what happened to each one.',
    tags: ['file', 'upload', 'attachment', 'drop zone', 'progress', 'form'],
    exports: ['FileField'],
    files: ['components/seventy-six/file-field.tsx', 'components/seventy-six/file-field.css'],
    registryDeps: ['field', 'progress', 'button'],
    intro: [
      'B11 chrome over a dashed zone: a prompt, a named "Choose files" button, and a mono constraint line stating what is accepted and the ceiling — <code>CSV · XLSX · MAX 10 MB</code>. Under it, one row per file: the name, the size in mono, and the state. The zone is a <b>target, not a control</b>. A real <code>&lt;input type="file"&gt;</code> and the button carry the whole interaction, so the keyboard reaches everything without a fake <code>tabIndex</code> on a div, and the picker people already know is the picker that opens. The dashed border is <code>--sv-field-line-strong</code>, not <code>--sv-line</code>: the border is the zone\'s only affordance, so it owes the 3:1 non-text bar (WCAG 1.4.11) — the same reasoning that sets B25 PinField\'s box.',
      'The component owns <b>no transport</b>. Uploading, retrying, cancelling and measuring progress are the product\'s work; FileField renders the list it is handed and says each state in words. A part that owns the network cannot be installed from a registry — it would arrive with an opinion about your endpoint, your auth and your retry policy, none of which are design-system business (Law 3).',
      'Every row states its outcome in language. A finished row reads <b>Uploaded</b> in <code>--sv-ok</code>, with the word carrying the meaning and the colour and tick only agreeing with it (C5). A failed row states what and how — "Over the 10 MB limit. Compress it or split it into two files." — never "Upload failed", which tells a user nothing they had not already worked out. An uploading row wears B4\'s bar directly: <code>progress.css</code> is imported rather than restated, so one bar exists in the system and its single 160ms fill transition is defined in one place. That is the <code>progress</code> registry dependency, and it is deliberate.',
    ],
    examples: [
      {
        title: 'Three files, three states',
        demoKey: 'file-basic',
        surface: 'paper',
        code: `import { FileField } from '@/components/seventy-six';

<FileField
  label="Import files"
  hint="The importer reads the first sheet of each workbook."
  constraint="CSV · XLSX · MAX 10 MB"
  accept=".csv,.xlsx"
  files={[
    { id: '1', name: 'july-actuals.csv', size: '2.4 MB', status: 'uploading', percent: 62 },
    { id: '2', name: 'q2-forecast.xlsx', size: '1.1 MB', status: 'done' },
    { id: '3', name: 'depot-codes.csv', size: '318 KB', status: 'uploading', percent: 0 },
  ]}
  onAdd={startUpload}
  onRemove={cancelUpload}
/>`,
      },
      {
        title: 'A rejected file',
        description: 'The row states the ceiling and the fix — never "Upload failed" (B11).',
        demoKey: 'file-error',
        surface: 'paper',
        code: `<FileField
  label="Import files"
  constraint="CSV · XLSX · MAX 10 MB"
  files={[
    {
      id: '1',
      name: 'full-export.xlsx',
      size: '18.2 MB',
      status: 'error',
      error: 'Over the 10 MB limit. Compress it or split it into two files.',
    },
  ]}
  onAdd={startUpload}
  onRemove={drop}
/>`,
      },
    ],
    props: [
      {
        component: 'FileField',
        rows: [
          { name: 'label', type: 'string', description: 'Above the zone, always. Labels the real file input.' },
          { name: 'hint', type: 'string', description: 'One line under the label stating what happens to what you attach.' },
          { name: 'constraint', type: 'string', description: 'Mono line naming what is accepted and the ceiling: "CSV · XLSX · MAX 10 MB".' },
          { name: 'accept', type: 'string', description: 'Native picker filter. A hint to the picker, not a guarantee — a drop bypasses it.' },
          { name: 'multiple', type: 'boolean', defaultValue: 'true', description: 'Also decides whether the prompt and the button read singular or plural.' },
          { name: 'files', type: 'FileRow[]', description: 'The rows to render. The caller owns this list and every status in it.' },
          { name: 'onAdd', type: '(files: File[]) => void', description: 'Fires for both the picker and a drop. The input is reset afterwards, so choosing the same file twice still fires.' },
          { name: 'onRemove', type: '(id: string) => void', description: 'What "Remove" means — cancel, delete, forget — is the product\'s decision.' },
          { name: 'error', type: 'string', description: 'Field-level error: what is wrong AND how to fix it (B11).' },
          { name: 'disabled', type: 'boolean', description: 'Disables the button and the input, and refuses drops.' },
        ],
      },
      {
        component: 'FileRow',
        rows: [
          { name: 'id', type: 'string', description: 'React key, and what onRemove receives.' },
          { name: 'name', type: 'string', description: 'Truncates with an ellipsis; the row never wraps.' },
          { name: 'size', type: 'string', description: 'Pre-formatted, e.g. "2.4 MB" — byte formatting is a locale concern (C9).' },
          { name: 'status', type: "'uploading' | 'done' | 'error'", description: 'Bar and percentage, the word "Uploaded", or the error text.' },
          { name: 'percent', type: 'number', description: '0–100 for uploading rows, clamped and rounded before it reaches the bar.' },
          { name: 'error', type: 'string', description: 'For error rows: what is wrong AND how to fix it.' },
        ],
      },
    ],
    a11y: {
      keyboard: [
        { keys: 'Tab', action: 'The hidden file input (the zone draws its focus ring), then "Choose files", then each row\'s Remove.' },
        { keys: 'Enter / Space', action: 'Opens the native picker from the input or the button.' },
      ],
      notes: [
        'The drop zone carries no role and no tabIndex. Everything reachable by pointer is reachable by keyboard through the real input and the named button — dragging is an addition, never the only way in.',
        'The input is visually hidden but still focusable, so the zone draws the focus ring on its behalf via <code>:has()</code> — never a focus stop with no ring (C3).',
        'Each uploading row\'s bar is a role="progressbar" labelled with the file ("Uploading july-actuals.csv") carrying valuenow/valuemin/valuemax, and the percentage is printed in mono beside it.',
        'A finished row reads the word "Uploaded"; <code>--sv-ok</code> and the tick agree with the word rather than replacing it (C5).',
        'Remove buttons name their object through aria-label ("Remove july-actuals.csv") while reading "Remove" on screen, so the accessible name is specific and the visible one stays short (A3, A4).',
        'The row list is <code>aria-live="polite"</code> and rendered from the start, empty or not, for the same reason as B36\'s result line: a region that appears with its first row is routinely missed.',
        'hint, constraint and error are all wired into the input\'s aria-describedby; an error also sets aria-invalid="true".',
      ],
    },
    donts: [
      'No fetch, no XHR, no retry timer inside the component — a part that owns the network cannot be installed from a registry (Law 3).',
      'No tabIndex on the drop zone; the input and the button already carry the interaction (C3).',
      'No "Upload failed" and no bare "Error" — state the ceiling, the format, or the fix (B11).',
      'No bare "×" for remove; the button reads "Remove" and names its file (A4).',
      'No byte arithmetic in the component — size arrives pre-formatted (C9).',
      'No colour-only outcome: the tick without the word "Uploaded" states nothing (C5).',
      'No drag-only affordance. A zone that cannot be operated from the keyboard is not a field.',
    ],
    faq: [
      { q: 'Why does it not upload the file?', a: 'Because your endpoint, auth, chunking and retry policy are yours. FileField hands you File objects through onAdd and renders whatever statuses you hand back — which is also why it works identically against a presigned S3 PUT, a multipart form and a queue.' },
      { q: 'Where does the row progress bar come from?', a: 'B4. The component imports <code>progress.css</code> and wears the track and fill as-is, so there is exactly one bar in the system and one place its 160ms fill transition lives. That is the <code>progress</code> registry dependency.' },
      { q: 'Does accept enforce the file type?', a: 'No. It filters the native picker and nothing else — a drop ignores it entirely. Validate on the product side and hand back an error row that names the accepted formats.' },
      { q: 'How do I show a file that is queued but not yet started?', a: 'An uploading row at <code>percent: 0</code>. There is no fourth status, because "queued" and "0% uploaded" are the same fact to the person reading the row.' },
    ],
  },
];
