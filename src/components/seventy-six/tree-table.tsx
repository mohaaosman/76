import { forwardRef, useMemo, useRef, useState } from 'react';
import type { CSSProperties, HTMLAttributes, KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
import { inlineStep, useDirection, useStrings } from '@/lib/i18n';
import './tree-table.css';

/**
 * B59 · TreeTable — one job: state a hierarchy of rows in which every parent
 * is the sum of its children, across the same numeric columns at every
 * depth. A trial balance, a chart of accounts with balances, a cost-centre
 * budget.
 *
 * **The boundary.** B40 `TreeList` moves through a hierarchy and carries at
 * most one mono figure per node; B7 `DataTable` states flat records. This is
 * the two at once — B40's keyboard model, indent and chevron verbatim, B7's
 * mono headers and tabular columns — and it is NOT F3. Nothing here groups at
 * runtime: the depth IS the chart of accounts, set by the data, never by the
 * reader. No resize, no pin, no regroup, no column chooser.
 *
 * **It never computes (C9).** Every cell is a pre-formatted string. A parent
 * that adds up its own children can disagree with the ledger, and the ledger
 * is the document of record — so the caller supplies the parent's figures
 * and owes the reader that they reconcile.
 *
 * Full-bleed like B7: hairline rows to the card's edge, cells inset 18px.
 *
 * Don't: never a column that means something different at another depth;
 * never a one-child level (B40); never inline row verbs; never a parent whose
 * figures do not equal its children's; never a checkbox tree.
 */
export interface TreeTableColumn {
  key: string;
  /** Mono uppercase, B7's column-header voice: "OPENING", "CLOSING". */
  header: string;
  /** 'num' (the default) right-aligns and tabulates. */
  kind?: 'num' | 'text';
}

export interface TreeTableNode {
  id: string;
  label: string;
  /** Mono metadata before the label — the account code "1110". */
  code?: string;
  /** PRE-FORMATTED, keyed by TreeTableColumn.key. A parent states its own sum. */
  cells: Record<string, string>;
  children?: TreeTableNode[];
}

/** A closing row in a real `<tfoot>` — outside the tree, never focused. */
export interface TreeTableTotal {
  label: string;
  cells: Record<string, string>;
  strong?: boolean;
}

export interface TreeTableProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Accessible name for the treegrid, e.g. "Balance sheet, July 2026". */
  label: string;
  /** Header of the hierarchy column, e.g. "ACCOUNT". */
  labelHeader: string;
  columns: TreeTableColumn[];
  nodes: TreeTableNode[];
  /** Ids of the OPEN parents. Pass to control; omit to let the table own it. */
  expanded?: Set<string>;
  /** Initial open parents when uncontrolled. */
  defaultExpanded?: Iterable<string>;
  onExpandedChange?: (next: Set<string>) => void;
  /** Enter / double-click on a row. Without it, Enter toggles a parent. */
  onRowOpen?: (node: TreeTableNode) => void;
  totals?: TreeTableTotal[];
  className?: string;
}

interface Row {
  node: TreeTableNode;
  depth: number;
  parentId: string | null;
  setSize: number;
  posInSet: number;
}

const OWNED_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'Enter']);

const hasKids = (node: TreeTableNode) => (node.children?.length ?? 0) > 0;

/** Depth-first list of the VISIBLE rows — the axis every arrow key moves along. */
function flatten(
  nodes: TreeTableNode[],
  open: Set<string>,
  depth = 0,
  parentId: string | null = null,
  out: Row[] = [],
) {
  nodes.forEach((node, i) => {
    out.push({ node, depth, parentId, setSize: nodes.length, posInSet: i + 1 });
    if (hasKids(node) && open.has(node.id)) flatten(node.children ?? [], open, depth + 1, node.id, out);
  });
  return out;
}

export const TreeTable = forwardRef<HTMLDivElement, TreeTableProps>(function TreeTable({
  label,
  labelHeader,
  columns,
  nodes,
  expanded,
  defaultExpanded,
  onExpandedChange,
  onRowOpen,
  totals,
  className,
  ...rest
}, ref) {
  const t = useStrings();
  const dir = useDirection();
  const [own, setOwn] = useState<Set<string>>(() => new Set(defaultExpanded ?? []));
  const open = expanded ?? own;
  const rows = useMemo(() => flatten(nodes, open), [nodes, open]);
  const byId = useMemo(() => new Map(rows.map((r) => [r.node.id, r])), [rows]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const els = useRef(new Map<string, HTMLTableRowElement>());

  /* One tab stop: the last focused row while it is still visible, else the first. */
  const active = (focusedId && byId.has(focusedId) ? focusedId : null) ?? rows[0]?.node.id ?? null;

  function move(row: Row | undefined) {
    if (!row) return;
    setFocusedId(row.node.id);
    els.current.get(row.node.id)?.focus();
  }

  function setOpen(id: string, next: boolean) {
    const set = new Set(open);
    if (next) set.add(id);
    else set.delete(id);
    if (expanded === undefined) setOwn(set);
    onExpandedChange?.(set);
  }

  function onKeyDown(e: KeyboardEvent<HTMLTableRowElement>, row: Row, i: number) {
    if (!OWNED_KEYS.has(e.key)) return;
    e.preventDefault();
    const { node } = row;
    const parent = hasKids(node);
    const isOpen = parent && open.has(node.id);
    /* ← and → are logical: in RTL the tree opens toward the left. */
    const step = inlineStep(e.key, dir);
    if (step === 1) {
      if (parent && !isOpen) setOpen(node.id, true);
      else if (isOpen) move(rows[i + 1]);
      return;
    }
    if (step === -1) {
      if (isOpen) setOpen(node.id, false);
      else if (row.parentId) move(byId.get(row.parentId));
      return;
    }
    switch (e.key) {
      case 'ArrowDown':
        move(rows[i + 1]);
        break;
      case 'ArrowUp':
        move(rows[i - 1]);
        break;
      case 'Home':
        move(rows[0]);
        break;
      case 'End':
        move(rows[rows.length - 1]);
        break;
      case 'Enter':
        if (onRowOpen) onRowOpen(node);
        else if (parent) setOpen(node.id, !isOpen);
        break;
    }
  }

  const numClass = (col: TreeTableColumn) =>
    (col.kind ?? 'num') === 'num' ? 'sv-ttable__cell--num sv-num' : undefined;

  return (
    <div {...rest} ref={ref} className={cx('sv-ttable', className)}>
      <div className="sv-ttable__scroll">
        <table role="treegrid" aria-label={label} className="sv-ttable__table">
          <thead>
            <tr>
              <th scope="col" className="sv-ttable__th">
                <span className="sv-mono">{labelHeader}</span>
              </th>
              {columns.map((col) => (
                <th key={col.key} scope="col" className={cx('sv-ttable__th', numClass(col))}>
                  <span className="sv-mono">{col.header}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const { node, depth } = row;
              const parent = hasKids(node);
              const isOpen = parent && open.has(node.id);
              return (
                <tr
                  key={node.id}
                  ref={(el) => {
                    if (el) els.current.set(node.id, el);
                    else els.current.delete(node.id);
                  }}
                  className={cx('sv-ttable__row', parent && 'sv-ttable__row--parent')}
                  tabIndex={active === node.id ? 0 : -1}
                  aria-level={depth + 1}
                  aria-setsize={row.setSize}
                  aria-posinset={row.posInSet}
                  aria-expanded={parent ? isOpen : undefined}
                  onKeyDown={(e) => onKeyDown(e, row, i)}
                  onClick={() => move(row)}
                  onDoubleClick={onRowOpen ? () => onRowOpen(node) : undefined}
                >
                  <th
                    scope="row"
                    className="sv-ttable__lead"
                    style={{ '--sv-ttable-depth': depth } as CSSProperties}
                  >
                    <span className="sv-ttable__leadline">
                      {parent ? (
                        /* A pointer target, not a tab stop: the row owns the
                           one roving tabindex, so the chevron is tabIndex -1
                           and the keyboard uses ← / → on the row. */
                        <button
                          type="button"
                          tabIndex={-1}
                          className="sv-ttable__toggle"
                          aria-label={isOpen ? t.collapse(node.label) : t.expand(node.label)}
                          onClick={(e) => {
                            e.stopPropagation();
                            move(row);
                            setOpen(node.id, !isOpen);
                          }}
                        >
                          <span className="sv-ttable__chevron" aria-hidden="true" />
                        </button>
                      ) : (
                        <span className="sv-ttable__toggle sv-ttable__toggle--leaf" aria-hidden="true" />
                      )}
                      {node.code && <span className="sv-ttable__code sv-mono">{node.code}</span>}
                      <span className="sv-ttable__label">{node.label}</span>
                    </span>
                  </th>
                  {columns.map((col) => (
                    <td key={col.key} className={cx('sv-ttable__td', numClass(col))}>
                      {node.cells[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
          {totals && totals.length > 0 && (
            <tfoot>
              {totals.map((total) => (
                <tr
                  key={total.label}
                  className={cx('sv-ttable__footrow', total.strong && 'sv-ttable__footrow--strong')}
                >
                  <th scope="row" className="sv-ttable__footlabel sv-mono">
                    {total.label}
                  </th>
                  {columns.map((col) => (
                    <td key={col.key} className={cx('sv-ttable__td', numClass(col))}>
                      {total.cells[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
});
