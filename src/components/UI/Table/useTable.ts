import { useState, useMemo, useCallback } from 'react';
import type { RowData, SortConfig, PaginationConfig } from './Table.types';

/**
 * Hook for managing table sorting
 */
export function useSorting<T extends RowData>(data: T[], initialSort?: SortConfig) {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(initialSort || null);

  const sortedData = useMemo(() => {
    if (!sortConfig) return data;

    const sorted = [...data].sort((a, b) => {
      const aValue = a[sortConfig.column];
      const bValue = b[sortConfig.column];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === 'asc' ? comparison : -comparison;
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [data, sortConfig]);

  const handleSort = useCallback((column: string) => {
    setSortConfig((prevSort) => {
      if (prevSort?.column === column) {
        // Toggle direction
        return {
          column,
          direction: prevSort.direction === 'asc' ? 'desc' : 'asc',
        };
      }
      // New column
      return {
        column,
        direction: 'asc',
      };
    });
  }, []);

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  return {
    sortedData,
    sortConfig,
    handleSort,
    clearSort,
  };
}

/**
 * Hook for managing table pagination
 */
export function usePagination<T extends RowData>(
  data: T[],
  paginationConfig?: PaginationConfig
) {
  const pageSize = paginationConfig?.pageSize || 10;
  const [currentPage, setCurrentPage] = useState(paginationConfig?.currentPage || 1);

  const paginatedData = useMemo(() => {
    if (!paginationConfig) return data;

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return data.slice(startIndex, endIndex);
  }, [data, currentPage, pageSize, paginationConfig]);

  const totalPages = Math.ceil(data.length / pageSize);

  const handlePageChange = useCallback((page: number) => {
    const validPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(validPage);
  }, [totalPages]);

  const goToNextPage = useCallback(() => {
    handlePageChange(currentPage + 1);
  }, [currentPage, handlePageChange]);

  const goToPreviousPage = useCallback(() => {
    handlePageChange(currentPage - 1);
  }, [currentPage, handlePageChange]);

  return {
    paginatedData,
    currentPage,
    totalPages,
    pageSize,
    handlePageChange,
    goToNextPage,
    goToPreviousPage,
    hasPreviousPage: currentPage > 1,
    hasNextPage: currentPage < totalPages,
  };
}

/**
 * Hook for managing row selection
 */
export function useRowSelection<T extends RowData>(data: T[]) {
  const [selectedIds, setSelectedIds] = useState<Set<string | number>>(new Set());

  const handleSelectRow = useCallback((id: string | number) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectedIds.size === data.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(data.map((row) => row.id)));
    }
  }, [data, selectedIds.size]);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const selectedArray = useMemo(
    () => Array.from(selectedIds),
    [selectedIds]
  );

  return {
    selectedIds,
    selectedArray,
    handleSelectRow,
    handleSelectAll,
    clearSelection,
    isAllSelected: selectedIds.size === data.length && data.length > 0,
    isSomeSelected: selectedIds.size > 0 && selectedIds.size < data.length,
  };
}
