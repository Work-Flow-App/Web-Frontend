import type { ReactNode } from 'react';
import type { SxProps, Theme } from '@mui/material';

/**
 * Generic row data type
 */
export interface RowData {
  id: string | number;
  [key: string]: unknown;
}

/**
 * Column definition with accessor and optional custom render
 */
export interface Column<T extends RowData> {
  /**
   * Display label for the column header
   */
  label: string;

  /**
   * Key to access the value from row data
   */
  accessor: keyof T;

  /**
   * Optional custom render function for cell content
   */
  render?: (value: unknown, row: T, index: number) => ReactNode;

  /**
   * Optional custom cell className
   */
  className?: string;

  /**
   * Optional width for the column
   */
  width?: string | number;

  /**
   * Whether column is sortable @default true
   */
  sortable?: boolean;

  /**
   * Align content in cell
   */
  align?: 'left' | 'center' | 'right';
}

/**
 * Pagination configuration
 */
export interface PaginationConfig {
  /**
   * Number of rows per page
   */
  pageSize: number;

  /**
   * Current page number @default 1
   */
  currentPage?: number;
}

/**
 * Sort configuration
 */
export interface SortConfig {
  /**
   * Column accessor to sort by
   */
  column: string;

  /**
   * Sort direction
   */
  direction: 'asc' | 'desc';
}

/**
 * Row action item
 */
export interface RowAction<T extends RowData> {
  /**
   * Action label/text
   */
  label: string;

  /**
   * Action icon or custom render
   */
  icon?: ReactNode;

  /**
   * Callback when action is clicked
   */
  onClick: (row: T, index: number) => void;

  /**
   * Optional condition to show/hide action
   */
  condition?: (row: T) => boolean;

  /**
   * Optional danger/destructive style
   */
  danger?: boolean;
}

/**
 * Main Table component props
 */
export interface TableProps<T extends RowData> {
  /**
   * Array of row data
   */
  data: T[];

  /**
   * Column definitions
   */
  columns: Column<T>[];

  /**
   * Enable sorting functionality @default false
   */
  sortable?: boolean;

  /**
   * Enable pagination @default undefined (disabled)
   */
  pagination?: PaginationConfig;

  /**
   * Enable row selection @default false
   */
  selectable?: boolean;

  /**
   * Optional row actions column
   */
  actions?: RowAction<T>[];

  /**
   * Callback when row is clicked
   */
  onRowClick?: (row: T, index: number) => void;

  /**
   * Callback when rows are selected
   */
  onSelectionChange?: (selectedIds: (string | number)[]) => void;

  /**
   * Callback when sorting changes
   */
  onSortChange?: (sortConfig: SortConfig) => void;

  /**
   * Callback when page changes
   */
  onPageChange?: (pageNumber: number) => void;

  /**
   * Optional loading state
   */
  isLoading?: boolean;

  /**
   * Optional empty state message
   */
  emptyMessage?: string;

  /**
   * Optional className
   */
  className?: string;

  /**
   * Optional MUI sx prop
   */
  sx?: SxProps<Theme>;

  /**
   * Optional row className function
   */
  rowClassName?: (row: T, index: number) => string;

  /**
   * Optional hover effect @default true
   */
  hoverable?: boolean;

  /**
   * Optional striped rows @default false
   */
  striped?: boolean;

  /**
   * Optional dense mode @default false
   */
  dense?: boolean;
}
