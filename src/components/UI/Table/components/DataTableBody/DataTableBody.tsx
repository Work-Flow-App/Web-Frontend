import React, { useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import type { IDataTableBody } from './IDataTableBody';
import { useDataRow, useDataColumn, usePagination } from '../../context';
import {
  StyledTableRow,
  StyledTableCell,
  CheckboxCell,
  ActionsCell,
  CustomCheckbox,
  ActionButton,
  EmptyState,
  LoadingOverlay,
} from '../../Table.styles';
import { MoreOptionsIcon } from '../../icons';
import { Box } from '@mui/material';

/**
 * DataTableBody component for rendering table data rows
 *
 * @component
 * @example
 * ```tsx
 * <DataTableBody
 *   selectable
 *   showActions
 *   renderActions={(row) => <ActionMenu row={row} />}
 * />
 * ```
 */
const DataTableBody: React.FC<IDataTableBody> = ({
  selectable = false,
  showActions = false,
  renderActions,
  onActionClick,
  loading = false,
  emptyMessage = 'No data available',
  className,
}) => {
  const { filteredRows, selectedRows, toggleRowSelection } = useDataRow();
  const { columns } = useDataColumn();
  const { currentPage, rowsPerPage } = usePagination();

  // Paginate the filtered rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, rowsPerPage]);

  const handleRowClick = (rowId: string | number) => {
    if (selectable) {
      toggleRowSelection(rowId);
    }
  };

  const handleActionClick = (row: any, event: React.MouseEvent) => {
    event.stopPropagation();
    if (onActionClick) {
      onActionClick(row, event);
    }
  };

  // Show empty state
  if (!loading && paginatedRows.length === 0) {
    return <EmptyState>{emptyMessage}</EmptyState>;
  }

  return (
    <Box position="relative" className={className}>
      {loading && (
        <LoadingOverlay>
          <CircularProgress size={40} />
        </LoadingOverlay>
      )}

      {paginatedRows.map((row) => (
        <StyledTableRow key={row.id}>
          {selectable && (
            <CheckboxCell>
              <CustomCheckbox
                checked={selectedRows.includes(row.id)}
                onClick={() => handleRowClick(row.id)}
              />
            </CheckboxCell>
          )}

          {columns.map((column) => (
            <StyledTableCell key={column.id} width={column.width} align={column.align}>
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
                <ActionButton onClick={(e) => handleActionClick(row, e)}>
                  <MoreOptionsIcon />
                </ActionButton>
              )}
            </ActionsCell>
          )}
        </StyledTableRow>
      ))}
    </Box>
  );
};

export default DataTableBody;
