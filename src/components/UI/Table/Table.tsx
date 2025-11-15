import React, { useMemo } from 'react';
import { Box, Checkbox, IconButton } from '@mui/material';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import {
  TableWrapper,
  StyledTable,
  TableHead,
  TableHeaderRow,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  TableCheckboxCell,
  EmptyStateContainer,
  PaginationContainer,
  SortIndicator,
  ActionCell,
  LoadingOverlay,
} from './Table.styles';
import { useSorting, usePagination, useRowSelection } from './useTable';
import type { TableProps, RowData, SortConfig } from './Table.types';
import { floowColors } from '../../../theme/colors';
import { rem } from '../Typography/utility';

/**
 * Table Component
 *
 * A flexible, customizable, reusable React table component with support for:
 * - Custom columns with flexible rendering
 * - Client-side sorting
 * - Pagination
 * - Row selection
 * - Row actions
 * - Custom styling
 *
 * @example
 * ```tsx
 * <Table
 *   data={users}
 *   columns={[
 *     { label: 'Name', accessor: 'name' },
 *     { label: 'Email', accessor: 'email' },
 *     {
 *       label: 'Status',
 *       accessor: 'status',
 *       render: (value) => <span>{value}</span>,
 *     },
 *   ]}
 *   sortable
 *   selectable
 *   pagination={{ pageSize: 10 }}
 *   onRowClick={(row) => console.log(row)}
 * />
 * ```
 */
export const Table = React.forwardRef<HTMLDivElement, TableProps<any>>(
  (
    {
      data,
      columns,
      sortable = false,
      pagination,
      selectable = false,
      actions,
      onRowClick,
      onSelectionChange,
      onSortChange,
      onPageChange,
      isLoading = false,
      emptyMessage = 'No data available',
      className,
      sx,
      rowClassName,
      hoverable = true,
      striped = false,
      dense = false,
    },
    ref
  ) => {
    // Sorting hook
    const { sortedData, sortConfig, handleSort, clearSort } = useSorting(data);

    // Pagination hook
    const {
      paginatedData,
      currentPage,
      totalPages,
      handlePageChange,
      goToNextPage,
      goToPreviousPage,
      hasNextPage,
      hasPreviousPage,
    } = usePagination(sortedData, pagination);

    // Row selection hook
    const {
      selectedIds,
      selectedArray,
      handleSelectRow,
      handleSelectAll,
      isAllSelected,
      isSomeSelected,
    } = useRowSelection(paginatedData);

    // Display data (paginated or all)
    const displayData = pagination ? paginatedData : sortedData;

    // Call callbacks when sort/page changes
    React.useEffect(() => {
      if (sortConfig && onSortChange) {
        onSortChange(sortConfig);
      }
    }, [sortConfig, onSortChange]);

    React.useEffect(() => {
      if (onPageChange) {
        onPageChange(currentPage);
      }
    }, [currentPage, onPageChange]);

    React.useEffect(() => {
      if (onSelectionChange) {
        onSelectionChange(selectedArray);
      }
    }, [selectedArray, onSelectionChange]);

    // Handle sort click
    const handleSortClick = (columnAccessor: string, columnSortable?: boolean) => {
      if (columnSortable === false || !sortable) return;
      handleSort(columnAccessor);
    };

    // Render sort indicator
    const renderSortIndicator = (columnAccessor: string) => {
      if (!sortable || !sortConfig || sortConfig.column !== columnAccessor) {
        return null;
      }

      return (
        <SortIndicator>
          {sortConfig.direction === 'asc' ? '▲' : '▼'}
        </SortIndicator>
      );
    };

    // Calculate columns width including checkbox and actions
    const visibleColumns = useMemo(() => {
      let cols = [...columns];
      if (actions && actions.length > 0) {
        // Actions column will be added in render
      }
      return cols;
    }, [columns, actions]);

    if (displayData.length === 0 && !isLoading) {
      return (
        <TableWrapper ref={ref} className={className} sx={sx}>
          <EmptyStateContainer>{emptyMessage}</EmptyStateContainer>
        </TableWrapper>
      );
    }

    return (
      <Box
        ref={ref}
        sx={{
          position: 'relative',
          ...sx,
        }}
        className={className}
      >
        <TableWrapper dense={dense}>
          <StyledTable>
            {/* Header */}
            <TableHead sticky>
              <TableHeaderRow>
                {/* Selection checkbox */}
                {selectable && (
                  <TableHeaderCell style={{ width: rem(40), textAlign: 'center' }}>
                    <Checkbox
                      checked={isAllSelected}
                      indeterminate={isSomeSelected}
                      onChange={handleSelectAll}
                      size="small"
                      disabled={displayData.length === 0}
                    />
                  </TableHeaderCell>
                )}

                {/* Column headers */}
                {visibleColumns.map((column) => (
                  <TableHeaderCell
                    key={String(column.accessor)}
                    sortable={sortable && column.sortable !== false}
                    align={column.align}
                    onClick={() =>
                      handleSortClick(String(column.accessor), column.sortable)
                    }
                    style={column.width ? { width: column.width } : undefined}
                    title={
                      sortable && column.sortable !== false
                        ? 'Click to sort'
                        : undefined
                    }
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(4) }}>
                      {column.label}
                      {renderSortIndicator(String(column.accessor))}
                    </Box>
                  </TableHeaderCell>
                ))}

                {/* Actions column header */}
                {actions && actions.length > 0 && (
                  <TableHeaderCell style={{ width: rem(80), textAlign: 'center' }}>
                    Actions
                  </TableHeaderCell>
                )}
              </TableHeaderRow>
            </TableHead>

            {/* Body */}
            {!isLoading && (
              <TableBody>
                {displayData.map((row, rowIndex) => (
                  <TableRow
                    key={row.id}
                    striped={striped}
                    hoverable={hoverable}
                    isSelected={selectedIds.has(row.id)}
                    className={rowClassName?.(row, rowIndex)}
                    onClick={() => {
                      if (onRowClick) {
                        onRowClick(row, rowIndex);
                      }
                    }}
                  >
                    {/* Selection checkbox */}
                    {selectable && (
                      <TableCheckboxCell
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onChange={() => handleSelectRow(row.id)}
                          size="small"
                        />
                      </TableCheckboxCell>
                    )}

                    {/* Cells */}
                    {visibleColumns.map((column) => {
                      const value = row[column.accessor];
                      const renderedValue = column.render
                        ? column.render(value, row, rowIndex)
                        : value;

                      return (
                        <TableCell
                          key={`${row.id}-${String(column.accessor)}`}
                          align={column.align}
                          className={column.className}
                          style={column.width ? { width: column.width } : undefined}
                          data-label={column.label}
                        >
                          {renderedValue}
                        </TableCell>
                      );
                    })}

                    {/* Actions */}
                    {actions && actions.length > 0 && (
                      <ActionCell onClick={(e) => e.stopPropagation()}>
                        <Box sx={{ display: 'flex', gap: rem(4) }}>
                          {actions
                            .filter((action) => !action.condition || action.condition(row))
                            .map((action, actionIndex) => (
                              <IconButton
                                key={actionIndex}
                                size="small"
                                onClick={() => action.onClick(row, rowIndex)}
                                title={action.label}
                                sx={{
                                  color: action.danger
                                    ? floowColors.error.main
                                    : floowColors.grey[600],
                                  '&:hover': {
                                    backgroundColor: action.danger
                                      ? 'rgba(251, 44, 54, 0.1)'
                                      : floowColors.grey[100],
                                  },
                                }}
                              >
                                {action.icon || action.label}
                              </IconButton>
                            ))}
                        </Box>
                      </ActionCell>
                    )}
                  </TableRow>
                ))}
              </TableBody>
            )}
          </StyledTable>

          {/* Loading overlay */}
          {isLoading && (
            <LoadingOverlay>
              <Box sx={{ textAlign: 'center' }}>
                <Box sx={{ fontSize: rem(24), mb: rem(12) }}>⏳</Box>
                <Box sx={{ color: floowColors.grey[600] }}>Loading...</Box>
              </Box>
            </LoadingOverlay>
          )}
        </TableWrapper>

        {/* Pagination */}
        {pagination && (
          <PaginationContainer>
            <Box sx={{ fontSize: rem(14), color: floowColors.grey[600] }}>
              Page {currentPage} of {totalPages} • {data.length} total items
            </Box>

            <Box sx={{ display: 'flex', gap: rem(8), alignItems: 'center' }}>
              <button
                onClick={() => goToPreviousPage()}
                disabled={!hasPreviousPage}
                style={{
                  padding: `${rem(6)} ${rem(12)}`,
                  borderRadius: rem(4),
                  border: `${rem(1)} solid ${floowColors.grey[300]}`,
                  backgroundColor: floowColors.white,
                  cursor: hasPreviousPage ? 'pointer' : 'not-allowed',
                  opacity: hasPreviousPage ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  fontSize: rem(13),
                  color: floowColors.grey[700],
                }}
              >
                Previous
              </button>

              <Box sx={{ display: 'flex', gap: rem(4), alignItems: 'center' }}>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        width: rem(32),
                        height: rem(32),
                        borderRadius: rem(4),
                        border:
                          currentPage === page
                            ? `${rem(1)} solid ${floowColors.dark.slate}`
                            : `${rem(1)} solid ${floowColors.grey[300]}`,
                        backgroundColor:
                          currentPage === page
                            ? floowColors.dark.slate
                            : floowColors.white,
                        color: currentPage === page ? floowColors.white : floowColors.grey[700],
                        cursor: 'pointer',
                        fontSize: rem(13),
                        transition: 'all 0.2s ease',
                      }}
                    >
                      {page}
                    </button>
                  );
                })}
              </Box>

              <button
                onClick={() => goToNextPage()}
                disabled={!hasNextPage}
                style={{
                  padding: `${rem(6)} ${rem(12)}`,
                  borderRadius: rem(4),
                  border: `${rem(1)} solid ${floowColors.grey[300]}`,
                  backgroundColor: floowColors.white,
                  cursor: hasNextPage ? 'pointer' : 'not-allowed',
                  opacity: hasNextPage ? 1 : 0.5,
                  transition: 'all 0.2s ease',
                  fontSize: rem(13),
                  color: floowColors.grey[700],
                }}
              >
                Next
              </button>
            </Box>
          </PaginationContainer>
        )}
      </Box>
    );
  }
);

Table.displayName = 'Table';
