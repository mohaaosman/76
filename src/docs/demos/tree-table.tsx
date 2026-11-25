import { useState } from 'react';
import type { ComponentType } from 'react';
import { TreeTable } from '@/components/seventy-six/tree-table';
import type { TreeTableColumn, TreeTableNode } from '@/components/seventy-six/tree-table';
import { Button } from '@/components/seventy-six/button';

/* A balance sheet, July 2026, USD. Every parent is exactly the sum of its
   children in every column, and closing = opening + movement on every row:
     1100  765,550.00 + 45,615.00 = 811,165.00
     1200  1,124,800.00 − 12,870.00 = 1,111,930.00
     1000  1,890,350.00 + 32,745.00 = 1,923,095.00
     2100  300,050.00 + 9,655.00 = 309,705.00
     2200  704,600.00 − 28,400.00 = 676,200.00
     2000  1,004,650.00 − 18,745.00 = 985,905.00
     Net   885,700.00 + 51,490.00 = 937,190.00 */
const BALANCE_COLUMNS: TreeTableColumn[] = [
  { key: 'open', header: 'Opening' },
  { key: 'move', header: 'Movement' },
  { key: 'close', header: 'Closing' },
];

const c = (open: string, move: string, close: string) => ({ open, move, close });

const BALANCE: TreeTableNode[] = [
  {
    id: '1000',
    code: '1000',
    label: 'Assets',
    cells: c('1,890,350.00', '32,745.00', '1,923,095.00'),
    children: [
      {
        id: '1100',
        code: '1100',
        label: 'Current assets',
        cells: c('765,550.00', '45,615.00', '811,165.00'),
        children: [
          { id: '1110', code: '1110', label: 'Cash at bank', cells: c('184,200.00', '22,640.00', '206,840.00') },
          { id: '1120', code: '1120', label: 'Trade receivables', cells: c('312,450.00', '−18,300.00', '294,150.00') },
          { id: '1130', code: '1130', label: 'Inventory', cells: c('268,900.00', '41,275.00', '310,175.00') },
        ],
      },
      {
        id: '1200',
        code: '1200',
        label: 'Non-current assets',
        cells: c('1,124,800.00', '−12,870.00', '1,111,930.00'),
        children: [
          { id: '1210', code: '1210', label: 'Plant and machinery', cells: c('940,000.00', '−15,600.00', '924,400.00') },
          { id: '1220', code: '1220', label: 'Vehicles', cells: c('126,500.00', '−4,250.00', '122,250.00') },
          { id: '1230', code: '1230', label: 'Computer equipment', cells: c('58,300.00', '6,980.00', '65,280.00') },
        ],
      },
    ],
  },
  {
    id: '2000',
    code: '2000',
    label: 'Liabilities',
    cells: c('1,004,650.00', '−18,745.00', '985,905.00'),
    children: [
      {
        id: '2100',
        code: '2100',
        label: 'Current liabilities',
        cells: c('300,050.00', '9,655.00', '309,705.00'),
        children: [
          { id: '2110', code: '2110', label: 'Trade payables', cells: c('214,800.00', '12,460.00', '227,260.00') },
          { id: '2120', code: '2120', label: 'Accrued expenses', cells: c('48,350.00', '−6,120.00', '42,230.00') },
          { id: '2130', code: '2130', label: 'VAT payable', cells: c('36,900.00', '3,315.00', '40,215.00') },
        ],
      },
      {
        id: '2200',
        code: '2200',
        label: 'Non-current liabilities',
        cells: c('704,600.00', '−28,400.00', '676,200.00'),
        children: [
          { id: '2210', code: '2210', label: 'Bank loan', cells: c('620,000.00', '−25,000.00', '595,000.00') },
          { id: '2220', code: '2220', label: 'Lease liabilities', cells: c('84,600.00', '−3,400.00', '81,200.00') },
        ],
      },
    ],
  },
];

function TreeTableBalance() {
  return (
    <TreeTable
      label="Balance sheet, July 2026, USD"
      labelHeader="Account"
      columns={BALANCE_COLUMNS}
      nodes={BALANCE}
      defaultExpanded={['1000', '1100']}
      totals={[
        {
          label: 'Net assets',
          cells: c('885,700.00', '51,490.00', '937,190.00'),
          strong: true,
        },
      ]}
    />
  );
}

/* Operating expenses against budget, Q3 2026, USD. Remaining = budget −
   actual on every row, and every parent is the sum of its children:
     6100  206,000 − 200,630 = 5,370
     6200  467,000 − 461,350 = 5,650
     6300  114,500 − 115,940 = −1,440
     6000  787,500 − 777,920 = 9,580 */
const BUDGET_COLUMNS: TreeTableColumn[] = [
  { key: 'budget', header: 'Budget' },
  { key: 'actual', header: 'Actual' },
  { key: 'left', header: 'Remaining' },
];

const b = (budget: string, actual: string, left: string) => ({ budget, actual, left });

const BUDGET: TreeTableNode[] = [
  {
    id: '6000',
    code: '6000',
    label: 'Operating expenses',
    cells: b('787,500', '777,920', '9,580'),
    children: [
      {
        id: '6100',
        code: '6100',
        label: 'Logistics',
        cells: b('206,000', '200,630', '5,370'),
        children: [
          { id: '6110', code: '6110', label: 'Freight', cells: b('120,000', '112,480', '7,520') },
          { id: '6120', code: '6120', label: 'Warehousing', cells: b('86,000', '88,150', '−2,150') },
        ],
      },
      {
        id: '6200',
        code: '6200',
        label: 'People',
        cells: b('467,000', '461,350', '5,650'),
        children: [
          { id: '6210', code: '6210', label: 'Salaries', cells: b('410,000', '402,300', '7,700') },
          { id: '6220', code: '6220', label: 'Contractors', cells: b('45,000', '51,600', '−6,600') },
          { id: '6230', code: '6230', label: 'Training', cells: b('12,000', '7,450', '4,550') },
        ],
      },
      {
        id: '6300',
        code: '6300',
        label: 'Facilities',
        cells: b('114,500', '115,940', '−1,440'),
        children: [
          { id: '6310', code: '6310', label: 'Rent', cells: b('96,000', '96,000', '0') },
          { id: '6320', code: '6320', label: 'Utilities', cells: b('18,500', '19,940', '−1,440') },
        ],
      },
    ],
  },
];

const ALL_PARENTS = ['6000', '6100', '6200', '6300'];

function TreeTableControlled() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(['6000']));
  const [opened, setOpened] = useState<string>();
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12 }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        <Button variant="ghost" onClick={() => setExpanded(new Set(ALL_PARENTS))}>
          Expand all accounts
        </Button>
        <Button variant="ghost" onClick={() => setExpanded(new Set())}>
          Collapse all accounts
        </Button>
      </div>
      <TreeTable
        label="Operating expenses against budget, Q3 2026, USD"
        labelHeader="Cost centre"
        columns={BUDGET_COLUMNS}
        nodes={BUDGET}
        expanded={expanded}
        onExpandedChange={setExpanded}
        onRowOpen={(node) => setOpened(`${node.code} ${node.label}`)}
      />
      <p className="sv-mono" aria-live="polite" style={{ color: 'var(--sv-ink-soft)' }}>
        {opened ? `Opened ${opened}` : 'Enter on a row opens it'}
      </p>
    </div>
  );
}

export const treeTableDemos: Record<string, ComponentType> = {
  'tree-table-balance': TreeTableBalance,
  'tree-table-controlled': TreeTableControlled,
};
