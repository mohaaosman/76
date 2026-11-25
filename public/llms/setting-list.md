# SettingList · 76° UI (B63)

Settings that say what they do — a consequence sentence beside the instant-effect control that changes it.

**One job:** State one setting’s consequence beside the instant-effect control that changes it.
**Category:** forms · **Exports:** SettingList, SettingRow, SettingControl · **Tags:** settings, preferences, toggle, switch, admin, console, configuration, instant

## Installation

```bash
npx shadcn@latest add https://76.zifala.com/r/setting-list.json
```

Manual: copy components/seventy-six/setting-list.tsx, components/seventy-six/setting-list.css into your project (plus styles/tokens.css and lib/cx.ts).
Registry dependencies: field, status-word.

## Overview

**It is B28 DescriptionList’s settable twin.** B28 states facts and refuses editing controls by name; this states a setting and carries the one control that changes it. A bare switch labelled "Public projects" says what the control is called, not what flipping it does — an A3 failure the system had no part to prevent.

**The sentence is the point.** Each row states what the _current_ value does — "New members can see every project in the workspace." — and the sentence changes with the value. Pass `{ on, off }` for a toggle or checkbox, or a `consequence` on each select option.

**Instant effect, so no Save button.** A change applies the moment it is made, and the row says so in words: SAVING while it travels, NOT SAVED with a fix sentence when it did not arrive. A set of fields that applies on submit is a B11 form with one B10 primary, not this.

**It composes B11.** Toggle and Checkbox are the field.tsx controls; the select is B11’s native select anatomy. The row title names each control, so B11’s own label is hidden and the control is named once. A locked row disables its control and says why, in a sentence.

## Examples

### Workspace access

Toggle, select and checkbox. Change one and watch the consequence and the sync word.

```tsx
import { SettingList } from '@/components/seventy-six';

const [visible, setVisible] = useState(true);
const [role, setRole] = useState('viewer');

<SettingList
  label="Workspace access"
  rows={[
    {
      id: 'visibility',
      title: 'Open project visibility',
      consequence: {
        on: 'New members can see every project in the workspace.',
        off: 'New members see only the projects they are invited to.',
      },
      control: { kind: 'toggle', checked: visible, onChange: (v) => { setVisible(v); save('visibility', v); } },
      sync: sync.visibility, // 'saving' while the request is in flight
    },
    {
      id: 'role',
      title: 'Default role',
      control: {
        kind: 'select',
        value: role,
        onChange: (v) => { setRole(v); save('role', v); },
        options: [
          { value: 'viewer', label: 'Viewer', consequence: 'New members can read every shared record and change none of them.' },
          { value: 'editor', label: 'Editor', consequence: 'New members can create and edit records, but cannot delete them.' },
        ],
      },
    },
  ]}
/>
```

### Saving, not saved, locked

The three states a row can be in besides settled.

```tsx
<SettingList
  label="Data and sharing"
  rows={[
    { id: 'export', title: 'Weekly export to storage', consequence: { on: '…', off: '…' },
      control: { kind: 'toggle', checked: true, onChange }, sync: 'saving' },
    { id: 'sharing', title: 'Public share links', consequence: { on: '…', off: '…' },
      control: { kind: 'toggle', checked: false, onChange },
      sync: 'failed',
      failure: 'The change did not reach the server, so share links are still members-only. Turn it on again to retry.' },
    { id: 'region', title: 'Data region',
      control: { kind: 'select', value: 'eu', options, onChange },
      lockedReason: 'Set when the workspace was created. Contact support to move the data to another region.' },
  ]}
/>
```

## Props

### SettingList

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `rows` | `SettingRow[]` | — | One row per setting, in the order a reader should meet them. |
| `label` | `string` | — | Accessible name of the list. Usually the CardHead title. |

### SettingRow

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `id` | `string` | — | Stable identity. |
| `title` | `string` | — | What the setting is called — bold, and the control’s accessible name. |
| `consequence` | `string | { on: string; off: string }` | — | What the CURRENT value does, as a sentence. For a select, prefer consequence on each option. |
| `control` | `SettingControl` | — | { kind: 'toggle' | 'checkbox', checked, onChange(checked) } or { kind: 'select', value, options: { value, label, consequence? }[], onChange(value) }. |
| `sync` | `'saving' | 'failed'` | — | Stated as a B12 StatusWord ("Saving", "Not saved — retry") in a polite live region. |
| `failure` | `string` | — | With failed: what the value is now and how to retry, in one sentence. |
| `lockedReason` | `string` | — | Disables the control and states why. A disabled row is never unexplained. |

## Accessibility

| Keys | Action |
| --- | --- |
| Tab | Moves from control to control in row order. |
| Space | Flips a toggle or checkbox; the change applies at once. |
| ↑ / ↓ | Changes a select’s value (native behaviour); the change applies at once. |

- Each control is named by its row title (aria-labelledby) and described by the consequence, the locked reason and the sync word (aria-describedby).
- The consequence sentence is a polite live region, so the new consequence is read the moment the value flips.
- Sync words are B12 StatusWords — word plus dot — never colour alone (C5).
- A locked control is disabled, drawn on the wall with a hairline frame, never bare opacity, and its reason is a sentence in soft ink.
- Rows follow the density posture: --sv-row-y between rows and --sv-control-min on each control, so the touch posture reaches 48px.
- Logical properties throughout: under dir="rtl" the control sits on the left with no component change.
- It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).

## Don't

- Never a setting without its consequence sentence — the control’s name is not what it does.
- Never a Save button. A change that waits for submit is a B11 form.
- Never a locked row without the reason and who can change it.
- Never two controls in one row — that is two settings.
- Never a toast for a failed save — the failure is stated in the row it belongs to.
- Never a consequence written in the future tense of the other value ("Turning this on will…") — state what the current value does.

## FAQ

**SettingList or a form?**

Does the change apply the moment it is made? Then it is a SettingList with a Toggle or Select. If several fields must be checked together and applied on submit, it is a B11 form with one B10 primary named for its object, "Save billing details".

**Toggle or Checkbox?**

A Toggle for an on/off setting — it is B11’s instant-effect control. Use the Checkbox kind only where the product already speaks in opt-ins, such as "include archived projects", and never where a Save button would follow.

**How do I show a failed save?**

Revert the control to the value the server still holds, set sync to failed, and say in failure what the value is now and how to retry. The consequence sentence then already describes the real state.

**Can a row hold a text field?**

No. Typed values need validation and a moment of commit, which is a B11 form in a Drawer. SettingList holds controls whose every value is valid.
