export type ColumnKind = 'text' | 'number' | 'date' | 'choice';

export type CellValue = string | number | null | undefined;

export interface TableColumn<T> {
  key: string;
  label: string;
  kind: ColumnKind;
  getValue: (row: T) => CellValue;
}

export type SortDirection = 'asc' | 'desc';

export interface SortState {
  key: string;
  direction: SortDirection;
}

export type FilterOperator =
  | 'contains'
  | 'not_contains'
  | 'equals'
  | 'not_equals'
  | 'gt'
  | 'lt'
  | 'before'
  | 'after'
  | 'empty'
  | 'not_empty';

export type MatchMode = 'and' | 'or';

export interface FilterRule {
  id: string;
  columnKey: string;
  operator: FilterOperator;
  value: string;
}

export const OPERATOR_LABELS: Record<FilterOperator, string> = {
  contains: 'contains',
  not_contains: 'does not contain',
  equals: 'is',
  not_equals: 'is not',
  gt: 'greater than',
  lt: 'less than',
  before: 'before',
  after: 'after',
  empty: 'is empty',
  not_empty: 'is not empty',
};

export const OPERATORS_BY_KIND: Record<ColumnKind, FilterOperator[]> = {
  text: ['contains', 'not_contains', 'equals', 'not_equals', 'empty', 'not_empty'],
  choice: ['equals', 'not_equals', 'empty', 'not_empty'],
  number: ['equals', 'not_equals', 'gt', 'lt', 'empty', 'not_empty'],
  date: ['equals', 'before', 'after', 'empty', 'not_empty'],
};

const VALUELESS_OPERATORS: ReadonlySet<FilterOperator> = new Set(['empty', 'not_empty']);

export function operatorNeedsValue(operator: FilterOperator): boolean {
  return !VALUELESS_OPERATORS.has(operator);
}

export function isRuleComplete(rule: FilterRule): boolean {
  return !operatorNeedsValue(rule.operator) || rule.value.trim() !== '';
}

/** Rows that pass the complete rules, combined with AND or OR. Incomplete rules are ignored. */
export function applyFilters<T>(
  rows: T[],
  columns: TableColumn<T>[],
  rules: FilterRule[],
  mode: MatchMode
): T[] {
  const active = rules
    .filter(isRuleComplete)
    .map((rule) => ({ rule, column: columns.find((c) => c.key === rule.columnKey) }))
    .filter((r): r is { rule: FilterRule; column: TableColumn<T> } => Boolean(r.column));
  if (active.length === 0) return rows;

  return rows.filter((row) => {
    const results = active.map(({ rule, column }) => matchesRule(column.getValue(row), column.kind, rule));
    return mode === 'and' ? results.every(Boolean) : results.some(Boolean);
  });
}

/** Empty values always sort to the bottom, whichever direction is chosen. */
export function sortRows<T>(rows: T[], columns: TableColumn<T>[], sort: SortState | null): T[] {
  if (!sort) return rows;
  const column = columns.find((c) => c.key === sort.key);
  if (!column) return rows;

  const factor = sort.direction === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const left = toSortable(column.getValue(a), column.kind);
    const right = toSortable(column.getValue(b), column.kind);
    if (left === null && right === null) return 0;
    if (left === null) return 1;
    if (right === null) return -1;
    return compareSortable(left, right) * factor;
  });
}

/** First click on a column sorts ascending; each later click on the same column flips it. */
export function getNextSort(current: SortState | null, key: string): SortState {
  if (current?.key === key) {
    return { key, direction: current.direction === 'asc' ? 'desc' : 'asc' };
  }
  return { key, direction: 'asc' };
}

export function getDistinctValues<T>(rows: T[], column: TableColumn<T>): string[] {
  const values = new Set<string>();
  for (const row of rows) {
    const value = column.getValue(row);
    if (!isEmpty(value)) values.add(String(value));
  }
  return [...values].sort((a, b) => a.localeCompare(b));
}

function matchesRule(raw: CellValue, kind: ColumnKind, rule: FilterRule): boolean {
  if (rule.operator === 'empty') return isEmpty(raw);
  if (rule.operator === 'not_empty') return !isEmpty(raw);
  if (isEmpty(raw)) return rule.operator === 'not_contains' || rule.operator === 'not_equals';

  if (kind === 'number') return matchesNumber(Number(raw), rule);
  if (kind === 'date') return matchesDate(String(raw), rule);
  return matchesText(String(raw), rule);
}

function matchesText(value: string, rule: FilterRule): boolean {
  const cell = value.toLowerCase();
  const target = rule.value.trim().toLowerCase();
  switch (rule.operator) {
    case 'contains':
      return cell.includes(target);
    case 'not_contains':
      return !cell.includes(target);
    case 'equals':
      return cell === target;
    case 'not_equals':
      return cell !== target;
    default:
      return false;
  }
}

function matchesNumber(value: number, rule: FilterRule): boolean {
  const target = Number(rule.value);
  if (Number.isNaN(target) || Number.isNaN(value)) return false;
  switch (rule.operator) {
    case 'equals':
      return value === target;
    case 'not_equals':
      return value !== target;
    case 'gt':
      return value > target;
    case 'lt':
      return value < target;
    default:
      return false;
  }
}

// Date filters compare calendar days (YYYY-MM-DD, local time) so "on Nov 9" matches any time that day.
function matchesDate(value: string, rule: FilterRule): boolean {
  const day = toLocalDay(value);
  if (!day) return false;
  const target = rule.value.trim();
  switch (rule.operator) {
    case 'equals':
      return day === target;
    case 'before':
      return day < target;
    case 'after':
      return day > target;
    default:
      return false;
  }
}

function toLocalDay(value: string): string | null {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function toSortable(raw: CellValue, kind: ColumnKind): string | number | null {
  if (isEmpty(raw)) return null;
  if (kind === 'number') {
    const n = Number(raw);
    return Number.isNaN(n) ? null : n;
  }
  if (kind === 'date') {
    const time = new Date(String(raw)).getTime();
    return Number.isNaN(time) ? null : time;
  }
  return String(raw).toLowerCase();
}

function compareSortable(left: string | number, right: string | number): number {
  if (typeof left === 'number' && typeof right === 'number') return left - right;
  return String(left).localeCompare(String(right), undefined, { numeric: true });
}

function isEmpty(value: CellValue): value is null | undefined | '' {
  return value === null || value === undefined || value === '';
}
