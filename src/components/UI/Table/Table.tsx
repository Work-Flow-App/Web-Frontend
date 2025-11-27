import React from 'react';
import type { ITable, ITableRow } from './ITable';
import { DataTableContextProvider } from './context';
import { TitleHeader } from './components/TitleHeader';
import { ColumnHeader } from './components/ColumnHeader';
import { DataTableBody } from './components/DataTableBody';
import { Footer } from './components/Footer';
import { TableWrapper, StyledTableContainer, StyledTable, StyledTableHead, StyledTableBody } from './Table.styles';

/**
 * Enhanced Table component with context-based architecture
 * Supports column search, sorting, selection, and pagination
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
 *   title="Team Members"
 *   columns={columns}
 *   data={data}
 *   selectable
 *   sortable
 *   showActions
 *   showColumnSearch
 * />
 * ```
 */

export interface IEnhancedTable<T = ITableRow> extends Omit<ITable<T>, 'sortConfig' | 'onSortChange'> {
  /** Table title */
  title?: string;
  /** Enable column-level search */
  showColumnSearch?: boolean;
  /** Custom actions in title header */
  titleActions?: React.ReactNode;
  /** Enable pagination */
  showPagination?: boolean;
  /** Rows per page */
  rowsPerPage?: number;
  /** Maximum page buttons */
  maxPageButtons?: number;
  /** Show previous/next buttons */
  showPrevNext?: boolean;
  /** Show first/last buttons */
  showFirstLast?: boolean;
  /** Enable sticky left columns (for checkboxes/IDs) */
  enableStickyLeft?: boolean;
  /** Enable sticky right columns (for actions) */
  enableStickyRight?: boolean;
}

const TableInner = <T extends ITableRow = ITableRow>({
  title,
  showColumnSearch = false,
  titleActions,
  selectable = false,
  showActions = false,
  renderActions,
  onActionClick,
  loading = false,
  emptyMessage = 'No data available',
  showPagination = true,
  maxPageButtons = 5,
  showPrevNext = true,
  showFirstLast = false,
  enableStickyLeft = false,
  enableStickyRight = false,
  width = '100%',
  className,
}: Omit<IEnhancedTable<T>, 'columns' | 'data'>) => {
  return (
    <TableWrapper width={width} className={className}>
      {/* Title Header */}
      <TitleHeader
        title={title}
        actions={titleActions}
      />

      <StyledTableContainer>
        <StyledTable>
          {/* Column Headers */}
          <StyledTableHead>
            <ColumnHeader
              selectable={selectable}
              showColumnSearch={showColumnSearch}
              showActions={showActions}
              enableStickyLeft={enableStickyLeft}
              enableStickyRight={enableStickyRight}
            />
          </StyledTableHead>

          {/* Data Rows */}
          <StyledTableBody>
            <DataTableBody
              selectable={selectable}
              showActions={showActions}
              renderActions={renderActions}
              onActionClick={onActionClick}
              loading={loading}
              emptyMessage={emptyMessage}
              enableStickyLeft={enableStickyLeft}
              enableStickyRight={enableStickyRight}
            />
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>

      {/* Footer with Pagination */}
      <Footer
        showPagination={showPagination}
        maxPageButtons={maxPageButtons}
        showPrevNext={showPrevNext}
        showFirstLast={showFirstLast}
      />
    </TableWrapper>
  );
};

/**
 * Main Table component wrapper with context provider
 */
const Table = <T extends ITableRow = ITableRow>({
  columns,
  data,
  rowsPerPage = 10,
  ...props
}: IEnhancedTable<T>) => {
  return (
    <DataTableContextProvider<T>
      initialData={data}
      initialColumns={columns}
      initialRowsPerPage={rowsPerPage}
    >
      <TableInner<T> {...props} />
    </DataTableContextProvider>
  );
};

export default Table;
