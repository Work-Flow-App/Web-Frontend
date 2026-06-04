import React, { useState, useMemo } from 'react';
import type { ITable, ITableRow } from './ITable';
import { DataTableContextProvider } from './context';
import { TitleHeader } from './components/TitleHeader';
import { ColumnHeader } from './components/ColumnHeader';
import { DataTableBody } from './components/DataTableBody';
import { Footer } from './components/Footer';
import { TableWrapper, StyledTableContainer, StyledTable, StyledTableHead, StyledTableBody } from './Table.styles';
import { Box } from '@mui/material';
import CustomiseColumnsButton from './components/CustomiseColumns/CustomiseColumnsButton';

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
  /** Callback when row is clicked */
  onRowClick?: (row: T) => void;
  /** Enable column customization */
  customiseColumns?: boolean;
}

const TableInner = <T extends ITableRow = ITableRow>({
  title,
  showColumnSearch = false,
  titleActions,
  selectable = false,
  showActions = false,
  actions,
  renderActions,
  onActionClick,
  onRowClick,
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
  customiseColumns = false,
  allColumnLabels,
  onVisibleColumnsChange,
}: Omit<IEnhancedTable<T>, 'columns' | 'data'> & {
  allColumnLabels?: string[];
  onVisibleColumnsChange?: (visible: string[]) => void;
}) => {
  const hasTitleHeader = Boolean(title || titleActions);

  const headerActions = hasTitleHeader ? (
    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
      {titleActions}
      {customiseColumns && allColumnLabels && onVisibleColumnsChange && (
        <CustomiseColumnsButton
          columns={allColumnLabels}
          onChange={onVisibleColumnsChange}
        />
      )}
    </Box>
  ) : undefined;

  return (
    <TableWrapper width={width} className={className}>
      {/* Title Header */}
      {hasTitleHeader && (
        <TitleHeader
          title={title}
          actions={headerActions}
        />
      )}

      {/* Render independently if there is no title header */}
      {!hasTitleHeader && customiseColumns && allColumnLabels && onVisibleColumnsChange && (
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', width: '100%', mb: 1.5 }}>
          <CustomiseColumnsButton
            columns={allColumnLabels}
            onChange={onVisibleColumnsChange}
          />
        </Box>
      )}

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
              actions={actions}
              renderActions={renderActions}
              onActionClick={onActionClick}
              onRowClick={onRowClick}
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
  customiseColumns = false,
  ...props
}: IEnhancedTable<T>) => {
  const allColumnLabels = useMemo(() => columns.map((c) => c.label), [columns]);
  const [visibleColumnLabels, setVisibleColumnLabels] = useState<string[]>(allColumnLabels);

  const visibleTableColumns = useMemo(() => {
    if (!customiseColumns) return columns;
    return columns.filter((c) => visibleColumnLabels.includes(c.label));
  }, [columns, customiseColumns, visibleColumnLabels]);

  return (
    <DataTableContextProvider<T>
      initialData={data}
      initialColumns={visibleTableColumns}
      initialRowsPerPage={rowsPerPage}
    >
      <TableInner<T> 
        customiseColumns={customiseColumns}
        allColumnLabels={allColumnLabels}
        onVisibleColumnsChange={setVisibleColumnLabels}
        {...props} 
      />
    </DataTableContextProvider>
  );
};

export default Table;
