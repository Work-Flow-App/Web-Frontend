import type { ReactNode } from 'react';

export interface IDataTableBody {
  /** Enable row selection checkboxes */
  selectable?: boolean;
  /** Enable actions column */
  showActions?: boolean;
  /** Custom render function for row actions */
  renderActions?: (row: any) => ReactNode;
  /** Callback when row action is clicked */
  onActionClick?: (row: any, event: React.MouseEvent) => void;
  /** Loading state */
  loading?: boolean;
  /** Empty state message */
  emptyMessage?: string;
  /** Custom className for styling */
  className?: string;
}
