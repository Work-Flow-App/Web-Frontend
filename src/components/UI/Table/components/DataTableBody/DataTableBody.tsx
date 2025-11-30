import React, { useMemo } from 'react';
import { CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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
  enableStickyLeft = false,
  enableStickyRight = false,
}) => {
  const theme = useTheme();
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

  // Split columns for sticky left: first column goes to sticky left, rest to center
  const firstColumn = columns.length > 0 ? columns[0] : null;
  const remainingColumns = columns.length > 1 ? columns.slice(1) : [];

  // Calculate total columns for colspan
  const totalColumns = columns.length + (selectable ? 1 : 0) + (showActions ? 1 : 0);

  // Show empty state
  if (!loading && paginatedRows.length === 0) {
    return (
      <StyledTableRow>
        <StyledTableCell colSpan={totalColumns} sx={{ textAlign: 'center', padding: '3rem 1.25rem' }}>
          <EmptyState>{emptyMessage}</EmptyState>
        </StyledTableCell>
      </StyledTableRow>
    );
  }

  return (
    <>
      {loading && (
        <LoadingOverlay>
          <CircularProgress size={40} />
        </LoadingOverlay>
      )}

      {paginatedRows.map((row) => (
        <StyledTableRow key={row.id}>
          {enableStickyLeft ? (
            <>
              {/* Sticky Left Section: Checkbox */}
              {selectable && (
                <CheckboxCell
                  sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                    backgroundColor: theme.palette.colors.white,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: theme.palette.colors.grey_50,
                    },
                  }}
                >
                  <CustomCheckbox
                    checked={selectedRows.includes(row.id)}
                    onClick={() => handleRowClick(row.id)}
                  />
                </CheckboxCell>
              )}

              {/* Sticky Left Section: First Column */}
              {firstColumn && (
                <StyledTableCell
                  width={firstColumn.width}
                  align={firstColumn.align}
                  sx={{
                    position: 'sticky',
                    left: selectable ? '48px' : 0,
                    zIndex: 10,
                    backgroundColor: theme.palette.colors.white,
                    boxShadow: `1px 0 0 0 ${theme.palette.colors.grey_100}`,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: theme.palette.colors.grey_50,
                    },
                  }}
                >
                  {firstColumn.render
                    ? firstColumn.render(row)
                    : firstColumn.accessor
                      ? String(row[firstColumn.accessor] ?? '')
                      : ''}
                </StyledTableCell>
              )}

              {/* Center Section: Remaining Columns */}
              {remainingColumns.map((column) => (
                <StyledTableCell key={column.id} width={column.width} align={column.align}>
                  {column.render
                    ? column.render(row)
                    : column.accessor
                      ? String(row[column.accessor] ?? '')
                      : ''}
                </StyledTableCell>
              ))}

              {/* Sticky Right Section: Actions */}
              {showActions && (
                <ActionsCell
                  sx={enableStickyRight ? {
                    position: 'sticky',
                    right: 0,
                    zIndex: 2,
                    backgroundColor: theme.palette.colors.white,
                    borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: theme.palette.colors.grey_50,
                    },
                  } : undefined}
                >
                  {renderActions ? (
                    renderActions(row)
                  ) : (
                    <ActionButton onClick={(e) => handleActionClick(row, e)}>
                      <MoreOptionsIcon />
                    </ActionButton>
                  )}
                </ActionsCell>
              )}
            </>
          ) : (
            <>
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
                <ActionsCell
                  sx={enableStickyRight ? {
                    position: 'sticky',
                    right: 0,
                    zIndex: 2,
                    backgroundColor: theme.palette.colors.white,
                    borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: theme.palette.colors.grey_50,
                    },
                  } : undefined}
                >
                  {renderActions ? (
                    renderActions(row)
                  ) : (
                    <ActionButton onClick={(e) => handleActionClick(row, e)}>
                      <MoreOptionsIcon />
                    </ActionButton>
                  )}
                </ActionsCell>
              )}
            </>
          )}
        </StyledTableRow>
      ))}
    </>
  );
};

export default DataTableBody;
