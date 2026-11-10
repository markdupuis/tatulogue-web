import type { ReactNode } from 'react';

import type { SortState } from '../../lib/admin/table-controls';

interface SortableHeaderProps {
  columnKey: string;
  sort: SortState | null;
  onSort: (key: string) => void;
  className?: string;
  alignRight?: boolean;
  children: ReactNode;
}

export default function SortableHeader({
  columnKey,
  sort,
  onSort,
  className = '',
  alignRight = false,
  children,
}: SortableHeaderProps) {
  const isActive = sort?.key === columnKey;
  const direction = isActive ? sort.direction : null;
  const ariaSort = direction === 'asc' ? 'ascending' : direction === 'desc' ? 'descending' : 'none';

  return (
    <th className={className} aria-sort={ariaSort}>
      <button
        type="button"
        onClick={() => onSort(columnKey)}
        title="Sort by this column (click again to reverse)"
        className={`inline-flex items-center gap-1 uppercase transition-colors hover:text-white ${
          alignRight ? 'flex-row-reverse' : ''
        } ${isActive ? 'text-white' : ''}`}
      >
        <span>{children}</span>
        <span aria-hidden="true" className={isActive ? 'text-violet-300' : 'text-white/20'}>
          {direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↕'}
        </span>
      </button>
    </th>
  );
}
