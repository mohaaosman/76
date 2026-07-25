# FileField · 76° UI (B37)

The attachment field — a dashed target, a real file input behind a named button, one row per file stating its outcome.

**One job:** Attach files, and state what happened to each one.
**Category:** forms · **Exports:** FileField · **Tags:** file, upload, attachment, drop zone, progress, form

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/file-field.json
```

Manual: copy components/seventy-six/file-field.tsx, components/seventy-six/file-field.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field, progress, button.

## Overview

B11 chrome over a dashed zone: a prompt, a named "Choose files" button, and a mono constraint line stating what is accepted and the ceiling — `CSV · XLSX · MAX 10 MB`. Under it, one row per file: the name, the size in mono, and the state. The zone is a **target, not a control**. A real `<input type="file">` and the button carry the whole interaction, so the keyboard reaches everything without a fake `tabIndex` on a div, and the picker people already know is the picker that opens. The dashed border is `--sv-field-line-strong`, not `--sv-line`: the border is the zone's only affordance, so it owes the 3:1 non-text bar (WCAG 1.4.11) — the same reasoning that sets B25 PinField's box.

The component owns **no transport**. Uploading, retrying, cancelling and measuring progress are the product's work; FileField renders the list it is handed and says each state in words. A part that owns the network cannot be installed from a registry — it would arrive with an opinion about your endpoint, your auth and your retry policy, none of which are design-system business (Law 3).

Every row states its outcome in language. A finished row reads **Uploaded** in `--sv-ok`, with the word carrying the meaning and the colour and tick only agreeing with it (C5). A failed row states what and how — "Over the 10 MB limit. Compress it or split it into two files." — never "Upload failed", which tells a user nothing they had not already worked out. An uploading row wears B4's bar directly: `progress.css` is imported rather than restated, so one bar exists in the system and its single 160ms fill transition is defined in one place. That is the `progress` registry dependency, and it is deliberate.

## Examples

### Three files, three states

```tsx
import { FileField } from '@/components/seventy-six';

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
/>
```

### A rejected file

The row states the ceiling and the fix — never "Upload failed" (B11).

```tsx
<FileField
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
/>
```

## Props

### FileField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Above the zone, always. Labels the real file input. |
| `hint` | `string` | — | One line under the label stating what happens to what you attach. |
| `constraint` | `string` | — | Mono line naming what is accepted and the ceiling: "CSV · XLSX · MAX 10 MB". |
| `accept` | `string` | — | Native picker filter. A hint to the picker, not a guarantee — a drop bypasses it. |
| `multiple` | `boolean` | `true` | Also decides whether the prompt and the button read singular or plural. |
| `files` | `FileRow[]` | — | The rows to render. The caller owns this list and every status in it. |
| `onAdd` | `(files: File[]) => void` | — | Fires for both the picker and a drop. The input is reset afterwards, so choosing the same file twice still fires. |
| `onRemove` | `(id: string) => void` | — | What "Remove" means — cancel, delete, forget — is the product's decision. |
| `error` | `string` | — | Field-level error: what is wrong AND how to fix it (B11). |
| `disabled` | `boolean` | — | Disables the button and the input, and refuses drops. |

### FileRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | React key, and what onRemove receives. |
| `name` | `string` | — | Truncates with an ellipsis; the row never wraps. |
| `size` | `string` | — | Pre-formatted, e.g. "2.4 MB" — byte formatting is a locale concern (C9). |
| `status` | `'uploading' | 'done' | 'error'` | — | Bar and percentage, the word "Uploaded", or the error text. |
| `percent` | `number` | — | 0–100 for uploading rows, clamped and rounded before it reaches the bar. |
| `error` | `string` | — | For error rows: what is wrong AND how to fix it. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | The hidden file input (the zone draws its focus ring), then "Choose files", then each row's Remove. |
| Enter / Space | Opens the native picker from the input or the button. |

- The drop zone carries no role and no tabIndex. Everything reachable by pointer is reachable by keyboard through the real input and the named button — dragging is an addition, never the only way in.
- The input is visually hidden but still focusable, so the zone draws the focus ring on its behalf via `:has()` — never a focus stop with no ring (C3).
- Each uploading row's bar is a role="progressbar" labelled with the file ("Uploading july-actuals.csv") carrying valuenow/valuemin/valuemax, and the percentage is printed in mono beside it.
- A finished row reads the word "Uploaded"; `--sv-ok` and the tick agree with the word rather than replacing it (C5).
- Remove buttons name their object through aria-label ("Remove july-actuals.csv") while reading "Remove" on screen, so the accessible name is specific and the visible one stays short (A3, A4).
- The row list is `aria-live="polite"` and rendered from the start, empty or not, for the same reason as B36's result line: a region that appears with its first row is routinely missed.
- hint, constraint and error are all wired into the input's aria-describedby; an error also sets aria-invalid="true".

## Don't

- No fetch, no XHR, no retry timer inside the component — a part that owns the network cannot be installed from a registry (Law 3).
- No tabIndex on the drop zone; the input and the button already carry the interaction (C3).
- No "Upload failed" and no bare "Error" — state the ceiling, the format, or the fix (B11).
- No bare "×" for remove; the button reads "Remove" and names its file (A4).
- No byte arithmetic in the component — size arrives pre-formatted (C9).
- No colour-only outcome: the tick without the word "Uploaded" states nothing (C5).
- No drag-only affordance. A zone that cannot be operated from the keyboard is not a field.

## FAQ

**Why does it not upload the file?**

Because your endpoint, auth, chunking and retry policy are yours. FileField hands you File objects through onAdd and renders whatever statuses you hand back — which is also why it works identically against a presigned S3 PUT, a multipart form and a queue.

**Where does the row progress bar come from?**

B4. The component imports `progress.css` and wears the track and fill as-is, so there is exactly one bar in the system and one place its 160ms fill transition lives. That is the `progress` registry dependency.

**Does accept enforce the file type?**

No. It filters the native picker and nothing else — a drop ignores it entirely. Validate on the product side and hand back an error row that names the accepted formats.

**How do I show a file that is queued but not yet started?**

An uploading row at `percent: 0`. There is no fourth status, because "queued" and "0% uploaded" are the same fact to the person reading the row.
