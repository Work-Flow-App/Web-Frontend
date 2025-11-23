import React, { createContext, useState, useMemo, useCallback, type ReactNode } from 'react';
import type { ITableRow, ITableColumn, ISortConfig, SortDirection } from '../ITable';

// ============================================
// Pagination Context
// ============================================

interface IPaginationModalContext {
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

const PaginationModalContext = createContext<IPaginationModalContext | undefined>(undefined);

// ============================================
// DataRows Context
// ============================================

interface IDataRowsContext<T = ITableRow> {
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

const DataRowsContext = createContext<IDataRowsContext | undefined>(undefined);

// ============================================
// DataColumn Context
// ============================================

interface IDataColumnContext<T = ITableRow> {
  columns: ITableColumn<T>[];
  columnSearchQueries: Record<string, string>;
  setColumns: (columns: ITableColumn<T>[]) => void;
  setColumnSearchQuery: (columnId: string, query: string) => void;
  clearColumnSearchQuery: (columnId: string) => void;
  clearAllColumnSearches: () => void;
}

const DataColumnContext = createContext<IDataColumnContext | undefined>(undefined);

// ============================================
// Provider Props
// ============================================

interface IDataTableContextProviderProps<T = ITableRow> {
  children: ReactNode;
  initialData?: T[];
  initialColumns?: ITableColumn<T>[];
  initialRowsPerPage?: number;
}

// ============================================
// Combined Provider
// ============================================

export const DataTableContextProvider = <T extends ITableRow = ITableRow>({
  children,
  initialData = [],
  initialColumns = [],
  initialRowsPerPage = 10,
}: IDataTableContextProviderProps<T>) => {
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(initialRowsPerPage);
  const [totalRows, setTotalRows] = useState(initialData.length);

  // DataRows State
  const [rows, setRows] = useState<T[]>(initialData);
  const [selectedRows, setSelectedRows] = useState<(string | number)[]>([]);
  const [sortConfig, setSortConfig] = useState<ISortConfig | null>(null);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');

  // DataColumn State
  const [columns, setColumns] = useState<ITableColumn<T>[]>(initialColumns);
  const [columnSearchQueries, setColumnSearchQueries] = useState<Record<string, string>>({});

  // ============================================
  // Pagination Logic
  // ============================================

  const totalPages = useMemo(() => {
    return Math.ceil(totalRows / rowsPerPage);
  }, [totalRows, rowsPerPage]);

  const goToPage = useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
      }
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  // ============================================
  // DataRows Logic
  // ============================================

  // Filter rows based on global search and column searches
  const filteredRows = useMemo(() => {
    let filtered = [...rows];

    // Apply global search
    if (globalSearchQuery) {
      const query = globalSearchQuery.toLowerCase();
      filtered = filtered.filter((row) => {
        return Object.values(row).some((value) => {
          if (value === null || value === undefined) return false;
          return String(value).toLowerCase().includes(query);
        });
      });
    }

    // Apply column-specific searches
    Object.entries(columnSearchQueries).forEach(([columnId, query]) => {
      if (query) {
        const column = columns.find((col) => col.id === columnId);
        if (column && column.accessor) {
          const queryLower = query.toLowerCase();
          filtered = filtered.filter((row) => {
            const value = row[column.accessor as keyof T];
            if (value === null || value === undefined) return false;
            return String(value).toLowerCase().includes(queryLower);
          });
        }
      }
    });

    // Apply sorting
    if (sortConfig && sortConfig.direction) {
      const column = columns.find((col) => col.id === sortConfig.columnId);
      if (column && column.accessor) {
        filtered.sort((a, b) => {
          const aValue = a[column.accessor as keyof T];
          const bValue = b[column.accessor as keyof T];

          if (aValue === null || aValue === undefined) return 1;
          if (bValue === null || bValue === undefined) return -1;

          let comparison = 0;
          if (aValue > bValue) comparison = 1;
          if (aValue < bValue) comparison = -1;

          return sortConfig.direction === 'asc' ? comparison : -comparison;
        });
      }
    }

    return filtered;
  }, [rows, globalSearchQuery, columnSearchQueries, sortConfig, columns]);

  const toggleRowSelection = useCallback((id: string | number) => {
    setSelectedRows((prev) => {
      if (prev.includes(id)) {
        return prev.filter((rowId) => rowId !== id);
      }
      return [...prev, id];
    });
  }, []);

  const toggleAllRows = useCallback(() => {
    if (selectedRows.length === filteredRows.length && filteredRows.length > 0) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredRows.map((row) => row.id));
    }
  }, [filteredRows, selectedRows.length]);

  const clearSelection = useCallback(() => {
    setSelectedRows([]);
  }, []);

  const isAllSelected = useMemo(() => {
    return filteredRows.length > 0 && selectedRows.length === filteredRows.length;
  }, [filteredRows.length, selectedRows.length]);

  const isIndeterminate = useMemo(() => {
    return selectedRows.length > 0 && selectedRows.length < filteredRows.length;
  }, [filteredRows.length, selectedRows.length]);

  // ============================================
  // DataColumn Logic
  // ============================================

  const setColumnSearchQuery = useCallback((columnId: string, query: string) => {
    setColumnSearchQueries((prev) => ({
      ...prev,
      [columnId]: query,
    }));
  }, []);

  const clearColumnSearchQuery = useCallback((columnId: string) => {
    setColumnSearchQueries((prev) => {
      const updated = { ...prev };
      delete updated[columnId];
      return updated;
    });
  }, []);

  const clearAllColumnSearches = useCallback(() => {
    setColumnSearchQueries({});
  }, []);

  // ============================================
  // Context Values
  // ============================================

  const paginationValue = useMemo<IPaginationModalContext>(
    () => ({
      currentPage,
      totalPages,
      rowsPerPage,
      totalRows,
      setCurrentPage,
      setRowsPerPage,
      setTotalRows,
      goToPage,
      nextPage,
      prevPage,
    }),
    [currentPage, totalPages, rowsPerPage, totalRows, goToPage, nextPage, prevPage]
  );

  const dataRowsValue = useMemo<IDataRowsContext<T>>(
    () => ({
      rows,
      filteredRows,
      selectedRows,
      sortConfig,
      globalSearchQuery,
      setRows,
      setSelectedRows,
      setSortConfig,
      setGlobalSearchQuery,
      toggleRowSelection,
      toggleAllRows,
      clearSelection,
      isAllSelected,
      isIndeterminate,
    }),
    [
      rows,
      filteredRows,
      selectedRows,
      sortConfig,
      globalSearchQuery,
      toggleRowSelection,
      toggleAllRows,
      clearSelection,
      isAllSelected,
      isIndeterminate,
    ]
  );

  const dataColumnValue = useMemo<IDataColumnContext<T>>(
    () => ({
      columns,
      columnSearchQueries,
      setColumns,
      setColumnSearchQuery,
      clearColumnSearchQuery,
      clearAllColumnSearches,
    }),
    [columns, columnSearchQueries, setColumnSearchQuery, clearColumnSearchQuery, clearAllColumnSearches]
  );

  return (
    <PaginationModalContext.Provider value={paginationValue}>
      <DataRowsContext.Provider value={dataRowsValue}>
        <DataColumnContext.Provider value={dataColumnValue}>{children}</DataColumnContext.Provider>
      </DataRowsContext.Provider>
    </PaginationModalContext.Provider>
  );
};

// Export contexts for custom hooks
export { PaginationModalContext, DataRowsContext, DataColumnContext };
