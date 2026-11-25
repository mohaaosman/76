# ScanField · 76° UI (B54)

The scanner input — one identifier at a time, and what it resolved to.

**One job:** Take one identifier at a time, scanned or typed, and state what the last one resolved to.
**Category:** forms · **Exports:** ScanField, ScanResult, ScanTone, ScanFieldProps · **Tags:** scan, barcode, scanner, sku, receiving, picking, identifier, warehouse, pos

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/scan-field.json
```

Manual: copy components/seventy-six/scan-field.tsx, components/seventy-six/scan-field.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field.

## Overview

A barcode scanner is a keyboard that types an identifier and presses Enter. So this is a B11 text field that treats Enter as "take it": the trimmed value goes to `onScan`, the box empties, and the caret stays where it was, ready for the next carton. **Nothing else submits it** — never a timer, never a length, never a pause in typing — because a clerk typing a smudged label by hand is as legitimate as the gun.

**It never resolves.** The caller looks the identifier up and passes `last`; the field states it beneath the input as one line — the mono id, a word and a 6px dot (`ok`, `bad`, `pending`), and one sentence: "SKU-4471 · Matched · Pallet racking upright, 2.4m · 3 of 12 received". The line is a polite live region, so a reader who never looks up from the pallet still hears what the scan became. Before the first scan it states `scanReady`.

**The boundary against B36 SearchField.** Search narrows a set while you type and keeps the query in the box. A scan is a discrete event that is consumed and answered. If the text should still be there afterwards, it is a search.

## Examples

### Receiving against a purchase order

Type SKU-4471 and press Enter. The lookup states it is checking, then what the carton was. Try SKU-3108 (already complete) and SKU-9999 (not on the order).

```tsx
import { ScanField } from '@/components/seventy-six';

const [last, setLast] = useState<ScanResult>();

<ScanField
  label="Carton barcode"
  hint="Scan or type, then press Enter."
  onScan={async (id) => {
    setLast({ id, tone: 'pending', text: 'Looking up on PO-2291' });
    const line = await lookup(id);
    setLast(
      line
        ? { id, tone: 'ok', text: `${line.item} · ${line.received} of ${line.ordered} received` }
        : { id, tone: 'bad', text: 'Not on PO-2291. Check the label, or set the carton aside for returns.' },
    );
  }}
  last={last}
/>
```

### The states

Ready, matched, not matched, and a closed receipt.

```tsx
<ScanField label="Bin location" onScan={scanBin} />
<ScanField label="Carton barcode" onScan={scan}
  last={{ id: 'SKU-4472', tone: 'ok', text: 'Racking beam, 2.7m · 41 of 48 received' }} />
<ScanField label="Carton barcode" onScan={scan}
  last={{ id: 'SKU-9999', tone: 'bad', text: 'Not on PO-2291. Check the label, or set the carton aside for returns.' }} />
<ScanField label="Carton barcode" onScan={scan} disabled />
```

## Props

### ScanField

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `label` | `string` | — | Visible label above the input (B11). Never a placeholder. |
| `hint` | `string` | — | Soft line under the label. |
| `onScan` | `(value: string) => void` | — | Called with the trimmed identifier on Enter. Empty input does nothing. Never on a timer. |
| `last` | `{ id, tone, text }` | — | What the last identifier resolved to. tone is 'ok' | 'bad' | 'pending'; text is one sentence, pre-formatted. |
| `toneWords` | `Record<ScanTone, string>` | `Matched · Not matched · Checking` | The tone words, until the catalog carries them. |
| `…input props` | `InputHTMLAttributes` | — | id, name, disabled, autoFocus, onKeyDown (runs first; preventDefault stops the scan). |

## Accessibility

| Keys | Action |
| --- | --- |
| Enter | Take the identifier: call onScan, clear the box, keep focus. |

- Enter is prevented from submitting a surrounding form — a scan is not a submission.
- The result line is aria-live="polite" and is also joined to the input by aria-describedby. It opens with the catalog's scanResolved(id) for assistive tech.
- Each new result is re-inserted, so scanning the same identifier twice is announced twice.
- Tone is a word and a dot, never colour alone; green and red reach only the word and the dot.
- autoComplete, autoCorrect and spellcheck are off; a browser suggestion list over a scanner's keystrokes is a mis-scan.
- The result line reserves its height, so the first scan never shifts the form below it.

## Don't

- Never auto-submits on a timer, a length or a pause.
- Never keeps the scanned value in the box — that is a search.
- Never a history of scans; what was received is a DataTable or EntryTable.
- Never resolves the identifier itself; the caller owns the lookup.
- Never autoFocus unless the screen exists to scan.

## FAQ

**My scanner sends Tab, not Enter.**

Configure the scanner's suffix to Enter (CR). Every handheld supports it, and Tab would move focus away from the field after every carton.

**How do I show the lookup in flight?**

Pass last with tone 'pending' and a sentence naming what is being checked, then replace it when the lookup returns.

**Why does it not uppercase what I type?**

The value sent is the value typed. Normalise in onScan if your identifiers are case-insensitive; a CSS transform would show one string and send another.
