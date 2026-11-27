import type { DocEntry } from '../types';

export const settingListEntry: DocEntry = {
  slug: 'setting-list',
  name: 'SettingList',
  book: 'B63',
  category: 'forms',
  tagline: 'Settings that say what they do — a consequence sentence beside the instant-effect control that changes it.',
  job: 'State one setting’s consequence beside the instant-effect control that changes it.',
  tags: ['settings', 'preferences', 'toggle', 'switch', 'admin', 'console', 'configuration', 'instant'],
  exports: ['SettingList', 'SettingRow', 'SettingControl'],
  files: ['components/seventy-six/setting-list.tsx', 'components/seventy-six/setting-list.css'],
  registryDeps: ['field', 'status-word'],
  intro: [
    '<b>It is B28 DescriptionList’s settable twin.</b> B28 states facts and refuses editing controls by name; this states a setting and carries the one control that changes it. A bare switch labelled "Public projects" says what the control is called, not what flipping it does — an A3 failure the system had no part to prevent.',
    '<b>The sentence is the point.</b> Each row states what the <i>current</i> value does — "New members can see every project in the workspace." — and the sentence changes with the value. Pass <code>{ on, off }</code> for a toggle or checkbox, or a <code>consequence</code> on each select option.',
    '<b>Instant effect, so no Save button.</b> A change applies the moment it is made, and the row says so in words: SAVING while it travels, NOT SAVED with a fix sentence when it did not arrive. A set of fields that applies on submit is a B11 form with one B10 primary, not this.',
    '<b>It composes B11.</b> Toggle and Checkbox are the field.tsx controls; the select is B11’s native select anatomy. The row title names each control, so B11’s own label is hidden and the control is named once. A locked row disables its control and says why, in a sentence.',
  ],
  examples: [
    {
      title: 'Workspace access',
      description: 'Toggle, select and checkbox. Change one and watch the consequence and the sync word.',
      demoKey: 'setting-basic',
      code: `import { SettingList } from '@/components/seventy-six';

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
/>`,
    },
    {
      title: 'Saving, not saved, locked',
      description: 'The three states a row can be in besides settled.',
      demoKey: 'setting-states',
      code: `<SettingList
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
/>`,
    },
  ],
  props: [
    {
      component: 'SettingList',
      rows: [
        { name: 'rows', type: 'SettingRow[]', description: 'One row per setting, in the order a reader should meet them.' },
        { name: 'label', type: 'string', description: 'Accessible name of the list. Usually the CardHead title.' },
        { name: '…rest', type: 'HTMLAttributes<HTMLUListElement>', description: 'id, style, data-*, aria-*, event handlers — spread onto the list; ref forwards to it. className is appended.' },
      ],
    },
    {
      component: 'SettingRow',
      rows: [
        { name: 'id', type: 'string', description: 'Stable identity.' },
        { name: 'title', type: 'string', description: 'What the setting is called — bold, and the control’s accessible name.' },
        { name: 'consequence', type: 'string | { on: string; off: string }', description: 'What the CURRENT value does, as a sentence. For a select, prefer consequence on each option.' },
        { name: 'control', type: 'SettingControl', description: "{ kind: 'toggle' | 'checkbox', checked, onChange(checked) } or { kind: 'select', value, options: { value, label, consequence? }[], onChange(value) }." },
        { name: 'sync', type: "'saving' | 'failed'", description: 'Stated as a B12 StatusWord ("Saving", "Not saved — retry") in a polite live region.' },
        { name: 'failure', type: 'string', description: 'With failed: what the value is now and how to retry, in one sentence.' },
        { name: 'lockedReason', type: 'string', description: 'Disables the control and states why. A disabled row is never unexplained.' },
      ],
    },
  ],
  a11y: {
    keyboard: [
      { keys: 'Tab', action: 'Moves from control to control in row order.' },
      { keys: 'Space', action: 'Flips a toggle or checkbox; the change applies at once.' },
      { keys: '↑ / ↓', action: 'Changes a select’s value (native behaviour); the change applies at once.' },
    ],
    notes: [
      'Each control is named by its row title (aria-labelledby) and described by the consequence, the locked reason and the sync word (aria-describedby).',
      'The consequence sentence is a polite live region, so the new consequence is read the moment the value flips.',
      'Sync words are B12 StatusWords — word plus dot — never colour alone (C5).',
      'A locked control is disabled, drawn on the wall with a hairline frame, never bare opacity, and its reason is a sentence in soft ink.',
      'Rows follow the density posture: --sv-row-y between rows and --sv-control-min on each control, so the touch posture reaches 48px.',
      'Logical properties throughout: under dir="rtl" the control sits on the left with no component change.',
      'It carries no inset of its own — inside a Card it takes sv-card__body (firewall rule 18).',
    ],
  },
  donts: [
    'Never a setting without its consequence sentence — the control’s name is not what it does.',
    'Never a Save button. A change that waits for submit is a B11 form.',
    'Never a locked row without the reason and who can change it.',
    'Never two controls in one row — that is two settings.',
    'Never a toast for a failed save — the failure is stated in the row it belongs to.',
    'Never a consequence written in the future tense of the other value ("Turning this on will…") — state what the current value does.',
  ],
  faq: [
    { q: 'SettingList or a form?', a: 'Does the change apply the moment it is made? Then it is a SettingList with a Toggle or Select. If several fields must be checked together and applied on submit, it is a B11 form with one B10 primary named for its object, "Save billing details".' },
    { q: 'Toggle or Checkbox?', a: 'A Toggle for an on/off setting — it is B11’s instant-effect control. Use the Checkbox kind only where the product already speaks in opt-ins, such as "include archived projects", and never where a Save button would follow.' },
    { q: 'How do I show a failed save?', a: 'Revert the control to the value the server still holds, set sync to failed, and say in failure what the value is now and how to retry. The consequence sentence then already describes the real state.' },
    { q: 'Can a row hold a text field?', a: 'No. Typed values need validation and a moment of commit, which is a B11 form in a Drawer. SettingList holds controls whose every value is valid.' },
  ],
};
