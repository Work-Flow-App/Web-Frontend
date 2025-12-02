import type { ReactNode } from 'react';

export interface ITableAction<T = ITableRow> {
  /** Unique identifier for the action */
  id: string;
  /** Action label */
  label: string;
  /** Icon component (optional) */
  icon?: ReactNode;
  /** Click handler for the action */
  onClick: (row: T) => void;
  /** Show/hide action based on row data (optional) */
  show?: (row: T) => boolean;
  /** Disable action based on row data (optional) */
  disabled?: (row: T) => boolean;
  /** Custom styling */
  color?: 'default' | 'primary' | 'error' | 'warning' | 'success';
}

export interface ITableColumn<T = ITableRow> {
  /** Unique identifier for the column */
  id: string;
  /** Column header label */
  label: string;
  /** Key to access data in the row object */
  accessor?: keyof T;
  /** Custom render function for cell content */
  render?: (row: T) => ReactNode;
  /** Enable sorting for this column */
  sortable?: boolean;
  /** Column width (e.g., '200px', '20%', 'auto') */
  width?: string;
  /** Text alignment for the column */
  align?: 'left' | 'center' | 'right';
}

export interface ITableRow {
  /** Unique identifier for the row */
  id: string | number;
  /** Row data as key-value pairs */
  [key: string]: any;
}

export type SortDirection = 'asc' | 'desc' | null;

export interface ISortConfig {
  /** Column ID to sort by */
  columnId: string;
  /** Sort direction */
  direction: SortDirection;
}

export interface ITable<T = ITableRow> {
  /** Array of column configurations */
  columns: ITableColumn<T>[];
  /** Array of data rows */
  data: T[];
  /** Enable row selection with checkboxes */
  selectable?: boolean;
  /** Array of selected row IDs */
  selectedRows?: (string | number)[];
  /** Callback when row selection changes */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;
  /** Enable sorting functionality */
  sortable?: boolean;
  /** Current sort configuration */
  sortConfig?: ISortConfig;
  /** Callback when sort changes */
  onSortChange?: (config: ISortConfig) => void;
  /** Enable row actions menu */
  showActions?: boolean;
  /** Array of action configurations for row actions menu */
  actions?: ITableAction<T>[];
  /** Custom render function for row actions (deprecated - use actions prop instead) */
  renderActions?: (row: T) => ReactNode;
  /** Callback when row action menu is clicked (deprecated - use actions prop instead) */
  onActionClick?: (row: T, event: React.MouseEvent) => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Table container width (default: '100%' for full responsive width) */
  width?: string;
  /** Custom className for the table container */
  className?: string;
}

export interface IStyledTableProps {
  width?: string;
}

export interface IStyledTableCellProps {
  width?: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  hasCheckbox?: boolean;
}

export interface IStyledCheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
}

export interface IStyledStatusPillProps {
  status: 'active' | 'deactivated' | 'pending';
}
