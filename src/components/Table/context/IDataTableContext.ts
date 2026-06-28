import { type ReactNode } from 'react';
import type { ITableRow, ITableColumn, ISortConfig } from '../ITable';

// ============================================
// Pagination Context Interface
// ============================================
export interface IPaginationModalContext {
  currentPage: number;
  totalPages: number;
  rowsPerPage: number;
  totalRows: number;
  setCurrentPage: (page: number) => void;
  setRowsPerPage: (rows: number) => void;
  setTotalRows: (total: number) => void;
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
}

// ============================================
// DataRows Context Interface
// ============================================
export interface IDataRowsContext<T = ITableRow> {
  rows: T[];
  filteredRows: T[];
  selectedRows: (string | number)[];
  sortConfig: ISortConfig | null;
  globalSearchQuery: string;
  setRows: (rows: T[]) => void;
  setSelectedRows: (ids: (string | number)[]) => void;
  setSortConfig: (config: ISortConfig | null) => void;
  setGlobalSearchQuery: (query: string) => void;
  toggleRowSelection: (id: string | number) => void;
  toggleAllRows: () => void;
  clearSelection: () => void;
  isAllSelected: boolean;
  isIndeterminate: boolean;
}

// ============================================
// DataColumn Context Interface
// ============================================
export interface IDataColumnContext<T = ITableRow> {
  columns: ITableColumn<T>[];
  columnSearchQueries: Record<string, string>;
  setColumns: (columns: ITableColumn<T>[]) => void;
  setColumnSearchQuery: (columnId: string, query: string) => void;
  clearColumnSearchQuery: (columnId: string) => void;
  clearAllColumnSearches: () => void;
}

// ============================================
// Provider Props Interface
// ============================================
export interface IDataTableContextProviderProps<T = ITableRow> {
  children: ReactNode;
  initialData?: T[];
  initialColumns?: ITableColumn<T>[];
  initialRowsPerPage?: number;
}