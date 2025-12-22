import type { ReactNode } from 'react';
import type { ITableAction, ITableRow } from '../../ITable';

export interface IDataTableBody<T = ITableRow> {
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Enable actions column */
  showActions?: boolean;
  /** Array of action configurations for row actions menu */
  actions?: ITableAction<T>[];
  /** Custom render function for row actions (deprecated - use actions prop instead) */
  renderActions?: (row: T) => ReactNode;
  /** Callback when row action is clicked (deprecated - use actions prop instead) */
  onActionClick?: (row: T, event: React.MouseEvent) => void;
  /** Callback when row is clicked */
  onRowClick?: (row: T) => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom className for styling */
  className?: string;
  /** Enable sticky left columns (for checkboxes and first column) */
  enableStickyLeft?: boolean;
  /** Enable sticky right columns (for actions) */
  enableStickyRight?: boolean;
}
