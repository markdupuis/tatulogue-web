'use client';

import { useMemo, useState } from 'react';

import {
  applyFilters,
  getNextSort,
  sortRows,
  type FilterRule,
  type MatchMode,
  type SortState,
  type TableColumn,
} from './table-controls';

export interface TableControls<T> {
  rows: T[];
  sort: SortState | null;
  toggleSort: (key: string) => void;
  rules: FilterRule[];
  setRules: (rules: FilterRule[]) => void;
  matchMode: MatchMode;
  setMatchMode: (mode: MatchMode) => void;
}

/** Column-click sorting plus AND/OR filter rules over rows the page already loaded. */
export function useTableControls<T>(
  rows: T[],
  columns: TableColumn<T>[],
  initialSort: SortState | null = null
): TableControls<T> {
  const [sort, setSort] = useState<SortState | null>(initialSort);
  const [rules, setRules] = useState<FilterRule[]>([]);
  const [matchMode, setMatchMode] = useState<MatchMode>('and');

  const visibleRows = useMemo(
    () => sortRows(applyFilters(rows, columns, rules, matchMode), columns, sort),
    [rows, columns, rules, matchMode, sort]
  );

  return {
    rows: visibleRows,
    sort,
    toggleSort: (key) => setSort((current) => getNextSort(current, key)),
    rules,
    setRules,
    matchMode,
    setMatchMode,
  };
}
