import type { SortState, TableColumn } from '../../lib/admin/table-controls';

interface SortControlProps<T> {
  columns: TableColumn<T>[];
  sort: SortState | null;
  onSort: (key: string) => void;
}

const NO_SORT = '';

/** Sort picker for card lists that have no column headers to click. */
export default function SortControl<T>({ columns, sort, onSort }: SortControlProps<T>) {
  return (
    <div className="flex shrink-0 items-center gap-2 text-sm text-white/50">
      <label htmlFor="sort-by">Sort by</label>
      <select
        id="sort-by"
        value={sort?.key ?? NO_SORT}
        onChange={(e) => e.target.value && onSort(e.target.value)}
        className="rounded-xl border border-white/8 bg-[#0c0c14] px-3 py-2 text-sm text-white focus:border-violet-400 focus:outline-none"
      >
        {!sort && <option value={NO_SORT}>Default</option>}
        {columns.map((c) => (
          <option key={c.key} value={c.key}>
            {c.label}
          </option>
        ))}
      </select>
      {sort && (
        <button
          type="button"
          onClick={() => onSort(sort.key)}
          title="Reverse the order"
          className="rounded-xl border border-white/8 bg-white/[0.03] px-3 py-2 text-white/70 hover:text-white"
        >
          {sort.direction === 'asc' ? '↑ Asc' : '↓ Desc'}
        </button>
      )}
    </div>
  );
}
