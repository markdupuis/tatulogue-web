'use client';

import { useEffect, useRef, useState } from 'react';

import {
  OPERATOR_LABELS,
  OPERATORS_BY_KIND,
  getDistinctValues,
  isRuleComplete,
  operatorNeedsValue,
  type FilterOperator,
  type FilterRule,
  type MatchMode,
  type TableColumn,
} from '../../lib/admin/table-controls';

interface TableFilterButtonProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rules: FilterRule[];
  onRulesChange: (rules: FilterRule[]) => void;
  matchMode: MatchMode;
  onMatchModeChange: (mode: MatchMode) => void;
}

const FIELD_CLASS =
  'rounded-lg border border-white/15 bg-[#0c0c14] px-2 py-1.5 text-xs text-white focus:border-violet-400 focus:outline-none';

export default function TableFilterButton<T>({
  columns,
  rows,
  rules,
  onRulesChange,
  matchMode,
  onMatchModeChange,
}: TableFilterButtonProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const activeCount = rules.filter(isRuleComplete).length;

  useEffect(() => {
    if (!isOpen) return;
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setIsOpen(false);
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setIsOpen(false);
    }
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  function handleAddRule() {
    const column = columns[0];
    if (!column) return;
    onRulesChange([
      ...rules,
      { id: crypto.randomUUID(), columnKey: column.key, operator: OPERATORS_BY_KIND[column.kind][0], value: '' },
    ]);
  }

  function handleUpdateRule(id: string, patch: Partial<FilterRule>) {
    onRulesChange(rules.map((rule) => (rule.id === id ? { ...rule, ...patch } : rule)));
  }

  function handleColumnChange(rule: FilterRule, columnKey: string) {
    const column = columns.find((c) => c.key === columnKey);
    if (!column) return;
    handleUpdateRule(rule.id, { columnKey, operator: OPERATORS_BY_KIND[column.kind][0], value: '' });
  }

  return (
    <div ref={containerRef} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
          activeCount > 0
            ? 'border-violet-400/60 bg-violet-500/10 text-violet-200'
            : 'border-white/8 bg-white/[0.03] text-white/70 hover:text-white'
        }`}
      >
        Filter{activeCount > 0 ? ` (${activeCount})` : ''}
      </button>

      {isOpen && (
        <div className="absolute left-0 z-20 mt-2 w-[min(36rem,calc(100vw-2rem))] rounded-xl border border-white/10 bg-[#0c0c14] p-4 shadow-2xl">
          {rules.length > 1 && (
            <div className="mb-3 flex items-center gap-2 text-xs text-white/60">
              <span>Show rows that match</span>
              <div className="inline-flex overflow-hidden rounded-lg border border-white/15">
                {(['and', 'or'] as const).map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => onMatchModeChange(mode)}
                    className={`px-2.5 py-1 font-medium ${
                      matchMode === mode ? 'bg-violet-600 text-white' : 'text-white/60 hover:text-white'
                    }`}
                  >
                    {mode === 'and' ? 'ALL (AND)' : 'ANY (OR)'}
                  </button>
                ))}
              </div>
              <span>of these filters</span>
            </div>
          )}

          {rules.length === 0 ? (
            <p className="mb-3 text-xs text-white/40">No filters yet.</p>
          ) : (
            <ul className="mb-3 space-y-2">
              {rules.map((rule, index) => {
                const column = columns.find((c) => c.key === rule.columnKey) ?? columns[0];
                return (
                  <li key={rule.id} className="flex flex-wrap items-center gap-2">
                    <span className="w-9 text-right text-[11px] uppercase text-white/30">
                      {index === 0 ? 'Where' : matchMode}
                    </span>
                    <select
                      aria-label="Filter by column"
                      value={column.key}
                      onChange={(e) => handleColumnChange(rule, e.target.value)}
                      className={FIELD_CLASS}
                    >
                      {columns.map((c) => (
                        <option key={c.key} value={c.key}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <select
                      aria-label="Condition"
                      value={rule.operator}
                      onChange={(e) => handleUpdateRule(rule.id, { operator: e.target.value as FilterOperator })}
                      className={FIELD_CLASS}
                    >
                      {OPERATORS_BY_KIND[column.kind].map((op) => (
                        <option key={op} value={op}>
                          {OPERATOR_LABELS[op]}
                        </option>
                      ))}
                    </select>
                    {operatorNeedsValue(rule.operator) && (
                      <RuleValueInput
                        column={column}
                        rows={rows}
                        value={rule.value}
                        onChange={(value) => handleUpdateRule(rule.id, { value })}
                      />
                    )}
                    <button
                      type="button"
                      aria-label="Remove filter"
                      onClick={() => onRulesChange(rules.filter((r) => r.id !== rule.id))}
                      className="ml-auto px-1 text-white/40 hover:text-red-400"
                    >
                      ×
                    </button>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={handleAddRule}
              className="text-xs font-medium text-violet-300 hover:text-violet-200"
            >
              + Add filter
            </button>
            {rules.length > 0 && (
              <button
                type="button"
                onClick={() => onRulesChange([])}
                className="text-xs text-white/40 hover:text-white"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface RuleValueInputProps<T> {
  column: TableColumn<T>;
  rows: T[];
  value: string;
  onChange: (value: string) => void;
}

function RuleValueInput<T>({ column, rows, value, onChange }: RuleValueInputProps<T>) {
  if (column.kind === 'choice') {
    return (
      <select aria-label="Value" value={value} onChange={(e) => onChange(e.target.value)} className={FIELD_CLASS}>
        <option value="">Choose…</option>
        {getDistinctValues(rows, column).map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    );
  }

  const inputType = column.kind === 'number' ? 'number' : column.kind === 'date' ? 'date' : 'text';
  return (
    <input
      aria-label="Value"
      type={inputType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Value"
      className={`${FIELD_CLASS} min-w-0 flex-1 [color-scheme:dark]`}
    />
  );
}
