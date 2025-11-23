import React, { useState, useCallback } from 'react';
import { CircularProgress } from '@mui/material';
import type { ITable, ITableRow } from './ITable';
import {
  TableWrapper,
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledHeaderCell,
  StyledTableCell,
  HeaderContent,
  CheckboxCell,
  ActionsCell,
  CustomCheckbox,
  ActionButton,
  EmptyState,
  LoadingOverlay,
} from './Table.styles';
import SortIcon from './icons/SortIcon';
import MoreOptionsIcon from './icons/MoreOptionsIcon';
import Pagination from './Pagination';

/**
 * Table component for displaying tabular data with sorting, selection, and pagination
 *
 * @component
 * @example
 * ```tsx
 * const columns = [
 *   { id: 'name', label: 'Name', accessor: 'name', sortable: true },
 *   { id: 'email', label: 'Email', accessor: 'email' },
 *   { id: 'role', label: 'Role', accessor: 'role' },
 * ];
 *
 * const data = [
 *   { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Manager' },
 *   { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Worker' },
 * ];
 *
 * <Table
 *   columns={columns}
 *   data={data}
 *   selectable
 *   sortable
 *   showActions
 * />
 * ```
 */
const Table = <T extends ITableRow = ITableRow>({
  columns,
  data,
  selectable = false,
  selectedRows = [],
  onSelectionChange,
  sortable = false,
  sortConfig,
  onSortChange,
  showActions = false,
  renderActions,
  onActionClick,
  loading = false,
  emptyMessage = 'No data available',
  width = '100%',
  className,
}: ITable<T>) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState<
    (string | number)[]
  >(selectedRows);

  const isControlled = onSelectionChange !== undefined;
  const currentSelectedRows = isControlled ? selectedRows : internalSelectedRows;

  const handleRowSelect = useCallback(
    (rowId: string | number) => {
      const newSelection = currentSelectedRows.includes(rowId)
        ? currentSelectedRows.filter((id) => id !== rowId)
        : [...currentSelectedRows, rowId];

      if (isControlled) {
        onSelectionChange?.(newSelection);
      } else {
        setInternalSelectedRows(newSelection);
      }
    },
    [currentSelectedRows, isControlled, onSelectionChange]
  );

  const handleSelectAll = useCallback(() => {
    const allSelected = currentSelectedRows.length === data.length && data.length > 0;
    const newSelection = allSelected ? [] : data.map((row) => row.id);

    if (isControlled) {
      onSelectionChange?.(newSelection);
    } else {
      setInternalSelectedRows(newSelection);
    }
  }, [currentSelectedRows.length, data, isControlled, onSelectionChange]);

  const handleSort = useCallback(
    (columnId: string) => {
      if (!sortable || !onSortChange) return;

      const currentDirection = sortConfig?.columnId === columnId ? sortConfig.direction : null;
      let newDirection: 'asc' | 'desc' | null = 'asc';

      if (currentDirection === 'asc') {
        newDirection = 'desc';
      } else if (currentDirection === 'desc') {
        newDirection = null;
      }

      onSortChange({
        columnId: newDirection ? columnId : '',
        direction: newDirection,
      });
    },
    [sortable, sortConfig, onSortChange]
  );

  const isAllSelected =
    data.length > 0 && currentSelectedRows.length === data.length;
  const isIndeterminate =
    currentSelectedRows.length > 0 && currentSelectedRows.length < data.length;

  return (
    <TableWrapper width={width} className={className}>
      <StyledTableContainer>
        <StyledTable>
          <StyledTableHead>
            <StyledTableRow>
              {selectable && (
                <CheckboxCell>
                  <CustomCheckbox
                    checked={isAllSelected}
                    indeterminate={isIndeterminate}
                    onClick={handleSelectAll}
                    role="checkbox"
                    aria-checked={isAllSelected ? 'true' : isIndeterminate ? 'mixed' : 'false'}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleSelectAll();
                      }
                    }}
                  />
                </CheckboxCell>
              )}

              {columns.map((column) => (
                <StyledHeaderCell
                  key={column.id}
                  width={column.width}
                  align={column.align}
                  sortable={sortable && column.sortable}
                  onClick={() =>
                    sortable && column.sortable && handleSort(column.id)
                  }
                >
                  <HeaderContent>
                    {column.label}
                    {sortable && column.sortable && (
                      <SortIcon
                        color={
                          sortConfig?.columnId === column.id
                            ? '#525252'
                            : '#A1A1A1'
                        }
                      />
                    )}
                  </HeaderContent>
                </StyledHeaderCell>
              ))}

              {showActions && <ActionsCell />}
            </StyledTableRow>
          </StyledTableHead>

          <StyledTableBody>
            {data.length === 0 ? (
              <StyledTableRow>
                <StyledTableCell
                  colSpan={
                    columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0)
                  }
                >
                  <EmptyState>{emptyMessage}</EmptyState>
                </StyledTableCell>
              </StyledTableRow>
            ) : (
              data.map((row) => (
                <StyledTableRow key={row.id}>
                  {selectable && (
                    <CheckboxCell>
                      <CustomCheckbox
                        checked={currentSelectedRows.includes(row.id)}
                        onClick={() => handleRowSelect(row.id)}
                        role="checkbox"
                        aria-checked={currentSelectedRows.includes(row.id)}
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleRowSelect(row.id);
                          }
                        }}
                      />
                    </CheckboxCell>
                  )}

                  {columns.map((column) => (
                    <StyledTableCell
                      key={`${row.id}-${column.id}`}
                      width={column.width}
                      align={column.align}
                    >
                      {column.render
                        ? column.render(row)
                        : column.accessor
                        ? String(row[column.accessor] ?? '')
                        : ''}
                    </StyledTableCell>
                  ))}

                  {showActions && (
                    <ActionsCell>
                      {renderActions ? (
                        renderActions(row)
                      ) : (
                        <ActionButton
                          onClick={(e) => onActionClick?.(row, e)}
                          role="button"
                          tabIndex={0}
                          aria-label="More actions"
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              onActionClick?.(row, e as any);
                            }
                          }}
                        >
                          <MoreOptionsIcon />
                        </ActionButton>
                      )}
                    </ActionsCell>
                  )}
                </StyledTableRow>
              ))
            )}
          </StyledTableBody>
        </StyledTable>

        {loading && (
          <LoadingOverlay>
            <CircularProgress size={40} sx={{ color: '#00A63E' }} />
          </LoadingOverlay>
        )}
      </StyledTableContainer>
    </TableWrapper>
  );
};

export default Table;
