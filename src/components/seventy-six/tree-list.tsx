import { useMemo, useRef, useState } from 'react';
import type { CSSProperties, KeyboardEvent } from 'react';
import { cx } from '@/lib/cx';
import './tree-list.css';

/**
 * B40 · TreeList — one job: move through a HIERARCHY whose depth is itself
 * the information. A chart of accounts, a bill of materials, a folder tree,
 * an org. It is NOT B27 Accordion, which folds SECONDARY detail on one flat
 * list and explicitly never nests and never navigates; it is NOT B7
 * DataTable, which holds flat records that all share the same columns. A
 * tree is neither, so it gets the full ARIA tree pattern hand-rolled: one
 * tab stop for the whole widget, arrow keys that walk the VISIBLE nodes, and
 * a roving tabindex — no dependency, because the platform has no <tree>.
 *
 * Don'ts: no checkbox tree in v1 (bulk selection over a hierarchy is a
 * different problem and needs tri-state); no inline row verbs (acting on a
 * record is a B20 Menu on that record's page); no lazy-load spinners inside
 * rows (fetch the branch, then render it); never render the tree deeper than
 * the data genuinely is — a one-child level is a lie about the structure.
 */
export interface TreeNode {
  id: string;
  label: string;
  /** Mono metadata right of the label — a count, a code, a total. */
  meta?: string;
  children?: TreeNode[];
}

export interface TreeListProps {
  /** Accessible name for the tree, e.g. "Chart of accounts". */
  label: string;
  nodes: TreeNode[];
  /** Ids of the OPEN parents. Fully controlled — the tree owns no data state. */
  expanded: Set<string>;
  onExpandedChange: (next: Set<string>) => void;
  /** The selected node's id, or null for "a selection exists, none made". */
  selected?: string | null;
  onSelect?: (id: string, node: TreeNode) => void;
  className?: string;
}

interface Row {
  node: TreeNode;
  depth: number;
  parentId: string | null;
}

const OWNED_KEYS = new Set([
  'ArrowUp',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'Home',
  'End',
  'Enter',
  ' ',
]);

const hasKids = (node: TreeNode) => (node.children?.length ?? 0) > 0;

/** Depth-first list of the VISIBLE nodes — the axis every arrow key moves along. */
function flatten(
  nodes: TreeNode[],
  expanded: Set<string>,
  depth = 0,
  parentId: string | null = null,
  out: Row[] = [],
) {
  for (const node of nodes) {
    out.push({ node, depth, parentId });
    if (hasKids(node) && expanded.has(node.id)) {
      flatten(node.children ?? [], expanded, depth + 1, node.id, out);
    }
  }
  return out;
}

export function TreeList({
  label,
  nodes,
  expanded,
  onExpandedChange,
  selected,
  onSelect,
  className,
}: TreeListProps) {
  const rows = useMemo(() => flatten(nodes, expanded), [nodes, expanded]);
  const byId = useMemo(() => new Map(rows.map((r) => [r.node.id, r])), [rows]);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const els = useRef(new Map<string, HTMLLIElement>());

  /* One tab stop for the whole tree: the roving index lands on the last
     focused row, else the selection, else the first row. Both fallbacks
     matter — collapsing a parent can take the focused node off screen. */
  const active =
    (focusedId && byId.has(focusedId) ? focusedId : null) ??
    (selected && byId.has(selected) ? selected : null) ??
    rows[0]?.node.id ??
    null;

  function move(row: Row | undefined) {
    if (!row) return;
    setFocusedId(row.node.id);
    els.current.get(row.node.id)?.focus();
  }

  function setOpen(id: string, open: boolean) {
    const next = new Set(expanded);
    if (open) next.add(id);
    else next.delete(id);
    onExpandedChange(next);
  }

  function onKeyDown(e: KeyboardEvent<HTMLLIElement>, row: Row) {
    if (!OWNED_KEYS.has(e.key)) return;
    /* Treeitems nest, so without this a child's keystroke would run every
       ancestor's handler on the way up and move focus twice. */
    e.stopPropagation();
    e.preventDefault();
    const { node } = row;
    const open = hasKids(node) && expanded.has(node.id);
    const i = rows.indexOf(row);
    switch (e.key) {
      case 'ArrowDown':
        move(rows[i + 1]);
        break;
      case 'ArrowUp':
        move(rows[i - 1]);
        break;
      case 'ArrowRight':
        /* Closed parent opens; open parent steps in — depth-first order
           makes the next visible row its first child. A leaf does nothing. */
        if (hasKids(node) && !open) setOpen(node.id, true);
        else if (open) move(rows[i + 1]);
        break;
      case 'ArrowLeft':
        if (open) setOpen(node.id, false);
        else if (row.parentId) move(byId.get(row.parentId));
        break;
      case 'Home':
        move(rows[0]);
        break;
      case 'End':
        move(rows[rows.length - 1]);
        break;
      case 'Enter':
      case ' ':
        onSelect?.(node.id, node);
        break;
    }
  }

  function renderLevel(list: TreeNode[], depth: number) {
    return list.map((node, i) => {
      const parent = hasKids(node);
      const open = parent && expanded.has(node.id);
      const row = byId.get(node.id);
      const isSelected = selected === undefined ? undefined : selected === node.id;
      return (
        <li
          key={node.id}
          ref={(el) => {
            if (el) els.current.set(node.id, el);
            else els.current.delete(node.id);
          }}
          role="treeitem"
          className={cx('sv-tree__item', isSelected && 'sv-tree__item--selected')}
          style={{ '--sv-tree-depth': depth } as CSSProperties}
          tabIndex={active === node.id ? 0 : -1}
          aria-expanded={parent ? open : undefined}
          aria-selected={isSelected}
          aria-level={depth + 1}
          aria-setsize={list.length}
          aria-posinset={i + 1}
          onKeyDown={row ? (e) => onKeyDown(e, row) : undefined}
          onClick={(e) => {
            /* A pointer on a parent both selects it and reveals its branch —
               there is no separate chevron button, because a control inside
               a treeitem breaks the one-tab-stop contract. */
            e.stopPropagation();
            move(row);
            onSelect?.(node.id, node);
            if (parent) setOpen(node.id, !open);
          }}
        >
          <span className="sv-tree__row">
            <span
              className={cx('sv-tree__chevron', !parent && 'sv-tree__chevron--leaf')}
              aria-hidden="true"
            />
            <span className="sv-tree__label">{node.label}</span>
            {node.meta && <span className="sv-tree__meta sv-mono sv-num">{node.meta}</span>}
          </span>
          {open && (
            <ul role="group" className="sv-tree__group">
              {renderLevel(node.children ?? [], depth + 1)}
            </ul>
          )}
        </li>
      );
    });
  }

  return (
    <ul role="tree" aria-label={label} className={cx('sv-tree', className)}>
      {renderLevel(nodes, 0)}
    </ul>
  );
}
