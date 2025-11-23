import React from 'react';
import type { IColumnHeader } from './IColumnHeader';
import { useDataRow, useDataColumn } from '../../context';
import { useTheme } from '@mui/material/styles';
import {
  StyledHeaderCell,
  HeaderContent,
  CheckboxCell,
  ActionsCell,
  CustomCheckbox,
} from '../../Table.styles';
import {
  ColumnHeaderRow,
  ColumnSearchRow,
  HeaderCellWrapper,
  ColumnSearchInput,
  SearchCellWrapper,
} from './ColumnHeader.styles';
import { SortIcon } from '../../icons';

/**
 * ColumnHeader component for table column headers and column search
 *
 * @component
 * @example
 * ```tsx
 * <ColumnHeader
 *   selectable
 *   showColumnSearch
 *   showActions
 * />
 * ```
 */
const ColumnHeader: React.FC<IColumnHeader> = ({
  selectable = false,
  showColumnSearch = false,
  showActions = false,
  enableStickyLeft = false,
  enableStickyRight = false,
  className,
}) => {
  const theme = useTheme();
  const { isAllSelected, isIndeterminate, toggleAllRows, sortConfig, setSortConfig } = useDataRow();
  const { columns, columnSearchQueries, setColumnSearchQuery } = useDataColumn();

  const handleSort = (columnId: string) => {
    const column = columns.find((col) => col.id === columnId);
    if (!column?.sortable) return;

    if (!sortConfig || sortConfig.columnId !== columnId) {
      setSortConfig({ columnId, direction: 'asc' });
    } else if (sortConfig.direction === 'asc') {
      setSortConfig({ columnId, direction: 'desc' });
    } else {
      setSortConfig(null);
    }
  };

  const handleColumnSearchChange = (columnId: string, value: string) => {
    setColumnSearchQuery(columnId, value);
  };

  // Split columns for sticky left: first column goes to sticky left, rest to center
  const firstColumn = columns.length > 0 ? columns[0] : null;
  const remainingColumns = columns.length > 1 ? columns.slice(1) : [];

  return (
    <>
      {/* Column Headers Row */}
      <ColumnHeaderRow className={className}>
        {enableStickyLeft ? (
          <>
            {/* Sticky Left Section: Checkbox */}
            {selectable && (
              <CheckboxCell style={{
                position: 'sticky',
                left: 0,
                zIndex: 5,
                background: theme.palette.colors.grey_50,
              }}>
                <CustomCheckbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onClick={toggleAllRows}
                />
              </CheckboxCell>
            )}

            {/* Sticky Left Section: First Column */}
            {firstColumn && (
              <StyledHeaderCell
                width={firstColumn.width}
                align={firstColumn.align}
                sortable={firstColumn.sortable}
                onClick={() => firstColumn.sortable && handleSort(firstColumn.id)}
                sx={{
                  position: 'sticky',
                  left: selectable ? '48px' : 0,
                  zIndex: 5,
                  background: theme.palette.colors.grey_50,
                  boxShadow: `1px 0 0 0 ${theme.palette.colors.grey_100}`,
                  '&:hover': {
                    background: theme.palette.colors.grey_50,
                  }
                }}
              >
                <HeaderContent>
                  {firstColumn.label}
                  {firstColumn.sortable && <SortIcon />}
                </HeaderContent>
              </StyledHeaderCell>
            )}

            {/* Center Section: Remaining Columns */}
            {remainingColumns.map((column) => (
              <HeaderCellWrapper key={column.id} width={column.width}>
                <StyledHeaderCell
                  width={column.width}
                  align={column.align}
                  sortable={column.sortable}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <HeaderContent>
                    {column.label}
                    {column.sortable && <SortIcon />}
                  </HeaderContent>
                </StyledHeaderCell>
              </HeaderCellWrapper>
            ))}

            {/* Sticky Right Section: Actions */}
            {showActions && (
              <ActionsCell
                sx={enableStickyRight ? {
                  position: 'sticky',
                  right: 0,
                  zIndex: 3,
                  background: theme.palette.colors.grey_50,
                  borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
                } : undefined}
              >
                Actions
              </ActionsCell>
            )}
          </>
        ) : (
          <>
            {selectable && (
              <CheckboxCell>
                <CustomCheckbox
                  checked={isAllSelected}
                  indeterminate={isIndeterminate}
                  onClick={toggleAllRows}
                />
              </CheckboxCell>
            )}

            {columns.map((column) => (
              <HeaderCellWrapper key={column.id} width={column.width}>
                <StyledHeaderCell
                  width={column.width}
                  align={column.align}
                  sortable={column.sortable}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <HeaderContent>
                    {column.label}
                    {column.sortable && <SortIcon />}
                  </HeaderContent>
                </StyledHeaderCell>
              </HeaderCellWrapper>
            ))}

            {showActions && (
              <ActionsCell
                sx={enableStickyRight ? {
                  position: 'sticky',
                  right: 0,
                  zIndex: 3,
                  background: theme.palette.colors.grey_50,
                  borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
                } : undefined}
              >
                Actions
              </ActionsCell>
            )}
          </>
        )}
      </ColumnHeaderRow>

      {/* Column Search Row */}
      {showColumnSearch && (
        <ColumnSearchRow>
          {enableStickyLeft ? (
            <>
              {/* Sticky Left Section: Checkbox */}
              {selectable && (
                <CheckboxCell style={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 3,
                  background: theme.palette.colors.grey_50,
                }} />
              )}

              {/* Sticky Left Section: First Column Search */}
              {firstColumn && (
                <SearchCellWrapper
                  width={firstColumn.width}
                  style={{
                    position: 'sticky',
                    left: selectable ? '48px' : 0,
                    zIndex: 3,
                    background: theme.palette.colors.white,
                    boxShadow: `1px 0 0 0 ${theme.palette.colors.grey_100}`,
                  }}
                >
                  <ColumnSearchInput
                    size="small"
                    placeholder={`Search ${firstColumn.label.toLowerCase()}...`}
                    value={columnSearchQueries[firstColumn.id] || ''}
                    onChange={(e) => handleColumnSearchChange(firstColumn.id, e.target.value)}
                    variant="outlined"
                  />
                </SearchCellWrapper>
              )}

              {/* Center Section: Remaining Column Searches */}
              {remainingColumns.map((column) => (
                <SearchCellWrapper key={`search-${column.id}`} width={column.width}>
                  <ColumnSearchInput
                    size="small"
                    placeholder={`Search ${column.label.toLowerCase()}...`}
                    value={columnSearchQueries[column.id] || ''}
                    onChange={(e) => handleColumnSearchChange(column.id, e.target.value)}
                    variant="outlined"
                  />
                </SearchCellWrapper>
              ))}

              {/* Sticky Right Section: Actions Search Cell */}
              {showActions && (
                <ActionsCell
                  sx={enableStickyRight ? {
                    position: 'sticky',
                    right: 0,
                    zIndex: 3,
                    background: theme.palette.colors.white,
                    borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
                  } : undefined}
                />
              )}
            </>
          ) : (
            <>
              {selectable && <CheckboxCell />}

              {columns.map((column) => (
                <SearchCellWrapper key={`search-${column.id}`} width={column.width}>
                  <ColumnSearchInput
                    size="small"
                    placeholder={`Search ${column.label.toLowerCase()}...`}
                    value={columnSearchQueries[column.id] || ''}
                    onChange={(e) => handleColumnSearchChange(column.id, e.target.value)}
                    variant="outlined"
                  />
                </SearchCellWrapper>
              ))}

              {showActions && (
                <ActionsCell
                  sx={enableStickyRight ? {
                    position: 'sticky',
                    right: 0,
                    zIndex: 3,
                    background: theme.palette.colors.white,
                    borderLeft: `1px solid ${theme.palette.colors.grey_100}`,
                  } : undefined}
                />
              )}
            </>
          )}
        </ColumnSearchRow>
      )}
    </>
  );
};

export default ColumnHeader;
