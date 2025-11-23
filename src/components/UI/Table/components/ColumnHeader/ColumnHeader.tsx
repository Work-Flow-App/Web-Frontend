import React from 'react';
import type { IColumnHeader } from './IColumnHeader';
import { useDataRow, useDataColumn } from '../../context';
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
  className,
}) => {
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

  return (
    <>
      {/* Column Headers Row */}
      <ColumnHeaderRow className={className}>
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
                {column.sortable && (
                  <SortIcon
                    direction={
                      sortConfig?.columnId === column.id ? sortConfig.direction || undefined : undefined
                    }
                  />
                )}
              </HeaderContent>
            </StyledHeaderCell>
          </HeaderCellWrapper>
        ))}

        {showActions && <ActionsCell>Actions</ActionsCell>}
      </ColumnHeaderRow>

      {/* Column Search Row */}
      {showColumnSearch && (
        <ColumnSearchRow>
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

          {showActions && <ActionsCell />}
        </ColumnSearchRow>
      )}
    </>
  );
};

export default ColumnHeader;
