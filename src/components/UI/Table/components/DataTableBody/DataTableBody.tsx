import React, { useMemo } from 'react';
import { useTheme } from '@mui/material/styles';
import type { IDataTableBody } from './IDataTableBody';
import { useDataRow, useDataColumn, usePagination } from '../../context';
import { Loader } from '../../../Loader';
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
import { ActionsMenu } from '../ActionsMenu';

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
  actions,
  renderActions,
  onActionClick,
  onRowClick,
  loading = false,
  emptyMessage = 'No data available',
  enableStickyLeft = false,
  enableStickyRight = false,
}) => {
  const theme = useTheme();
  const isDark = theme.palette.mode === 'dark';
  const bodyBg = isDark ? theme.palette.background.paper : theme.palette.colors.white;
  const bodyHoverBg = isDark ? theme.palette.colors.grey_50 : theme.palette.colors.grey_50;
  const borderColor = isDark ? theme.palette.colors.grey_200 : theme.palette.colors.grey_100;
  const { filteredRows, selectedRows, toggleRowSelection } = useDataRow();
  const { columns } = useDataColumn();
  const { currentPage, rowsPerPage } = usePagination();

  // Paginate the filtered rows
  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, rowsPerPage]);

  const handleRowClick = (row: any, event: React.MouseEvent) => {
    // Don't trigger row click when clicking on checkboxes, action buttons, or interactive elements
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input[type="checkbox"]') ||
      target.closest('a') ||
      target.closest('[role="button"]')
    ) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
    } else if (selectable) {
      toggleRowSelection(row.id);
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

  // Show loading state
  if (loading && paginatedRows.length === 0) {
    return (
      <StyledTableRow>
        <StyledTableCell colSpan={totalColumns} sx={{ textAlign: 'center', padding: '3rem 1.25rem', position: 'relative' }}>
          <LoadingOverlay>
            <Loader size={40} centered={false} />
          </LoadingOverlay>
        </StyledTableCell>
      </StyledTableRow>
    );
  }

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
          <Loader size={40} centered={false} />
        </LoadingOverlay>
      )}

      {paginatedRows.map((row) => (
        <StyledTableRow
          key={row.id}
          onClick={(e) => handleRowClick(row, e)}
          title={onRowClick ? 'Click to view details' : undefined}
          sx={{
            cursor: onRowClick ? 'pointer' : 'default',
          }}
        >
          {enableStickyLeft ? (
            <>
              {/* Sticky Left Section: Checkbox */}
              {selectable && (
                <CheckboxCell
                  sx={{
                    position: 'sticky',
                    left: 0,
                    zIndex: 10,
                    backgroundColor: bodyBg,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
                    },
                  }}
                >
                  <CustomCheckbox
                    checked={selectedRows.includes(row.id)}
                    onClick={() => toggleRowSelection(row.id)}
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
                    backgroundColor: bodyBg,
                    boxShadow: `1px 0 0 0 ${borderColor}`,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
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
                    backgroundColor: bodyBg,
                    borderLeft: `1px solid ${borderColor}`,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
                    },
                  } : {
                    backgroundColor: bodyBg,
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
                    },
                  }}
                >
                  {actions && actions.length > 0 ? (
                    <ActionsMenu row={row} actions={actions} />
                  ) : renderActions ? (
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
                <CheckboxCell
                  sx={{
                    backgroundColor: bodyBg,
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
                    },
                  }}
                >
                  <CustomCheckbox
                    checked={selectedRows.includes(row.id)}
                    onClick={() => toggleRowSelection(row.id)}
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
                    backgroundColor: bodyBg,
                    borderLeft: `1px solid ${borderColor}`,
                    transition: 'background-color 0.2s ease',
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
                    },
                  } : {
                    backgroundColor: bodyBg,
                    'tr:hover &': {
                      backgroundColor: bodyHoverBg,
                    },
                  }}
                >
                  {actions && actions.length > 0 ? (
                    <ActionsMenu row={row} actions={actions} />
                  ) : renderActions ? (
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
