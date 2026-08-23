import React, { useState, useMemo } from 'react';
import type { ITable, ITableRow } from './ITable';
import { DataTableContextProvider, useDataRow, useDataColumn, usePagination } from './context';
import { TitleHeader } from './components/TitleHeader';
import { ColumnHeader } from './components/ColumnHeader';
import { DataTableBody } from './components/DataTableBody';
import { Footer } from './components/Footer';
import { MobileResponsive } from './components/MobileResponsive';
import { Loader } from '../Loader';
import { TableWrapper, StyledTableContainer, StyledTable, StyledTableHead, StyledTableBody, HeaderActionsContainer, IndependentActionsContainer, MobileResponsiveCardsContainer, ToggleViewWrapper, ToggleSwitchTrack, ToggleSwitchThumb, ToggleSwitchText } from './Table.styles';

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
  /** Enable top pagination */
  showTopPagination?: boolean;
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
  showTopPagination = false,
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
  highlightedRowId,
  view = true,
}: Omit<IEnhancedTable<T>, 'columns' | 'data'> & {
  allColumnLabels?: string[];
  onVisibleColumnsChange?: (visible: string[]) => void;
}) => {
  const [currentView, setCurrentView] = useState<'card' | 'table'>('card');
  const hasTitleHeader = Boolean(title || titleActions);

  const { filteredRows } = useDataRow();
  const { columns } = useDataColumn();
  const { currentPage, rowsPerPage } = usePagination();

  const paginatedRows = useMemo(() => {
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return filteredRows.slice(startIndex, endIndex);
  }, [filteredRows, currentPage, rowsPerPage]);

  const headerActions = hasTitleHeader ? (
    <HeaderActionsContainer>
      {titleActions}
    </HeaderActionsContainer>
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

      <ToggleViewWrapper>
        <ToggleSwitchTrack onClick={() => setCurrentView((v) => (v === 'card' ? 'table' : 'card'))}>
          <ToggleSwitchText $active={currentView === 'table'}>
            {currentView === 'card' ? 'Table' : 'Card'}
          </ToggleSwitchText>
          <ToggleSwitchThumb $active={currentView === 'table'} />
        </ToggleSwitchTrack>
      </ToggleViewWrapper>


      {/* Top Pagination */}
      {showTopPagination && (
        <Footer
          showPagination={showPagination}
          maxPageButtons={maxPageButtons}
          showPrevNext={showPrevNext}
          showFirstLast={showFirstLast}
        />
      )}

      <StyledTableContainer className={`table-main-container ${currentView === 'table' ? 'mobile-show-table' : ''}`}>
        <StyledTable>
          {/* Column Headers */}
          <StyledTableHead>
            <ColumnHeader
              selectable={selectable}
              showColumnSearch={showColumnSearch}
              showActions={showActions}
              enableStickyLeft={enableStickyLeft}
              enableStickyRight={enableStickyRight}
              customiseColumns={customiseColumns}
              allColumnLabels={allColumnLabels}
              onVisibleColumnsChange={onVisibleColumnsChange}
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
              highlightedRowId={highlightedRowId}
            />
          </StyledTableBody>
        </StyledTable>
      </StyledTableContainer>

      <MobileResponsiveCardsContainer className={currentView === 'card' ? 'mobile-show-card' : ''}>
        {loading && paginatedRows.length === 0 ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
            <Loader size={40} centered={false} />
          </div>
        ) : paginatedRows.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>
            {emptyMessage}
          </div>
        ) : (
          paginatedRows.map((row) => (
            <MobileResponsive
              key={row.id}
              row={row}
              columns={columns}
              selectable={selectable}
              showActions={showActions}
              actions={actions}
              renderActions={renderActions}
              onActionClick={onActionClick}
              onRowClick={onRowClick}
              highlightedRowId={highlightedRowId}
              showViewButton={view}
            />
          ))
        )}
      </MobileResponsiveCardsContainer>

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
  onSelectionChange,
  selectedRows,
  view = true,
  ...props
}: IEnhancedTable<T> & { view?: boolean }) => {
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
      onSelectionChange={onSelectionChange}
      selectedRows={selectedRows}
    >
      <TableInner<T> 
        customiseColumns={customiseColumns}
        allColumnLabels={allColumnLabels}
        onVisibleColumnsChange={setVisibleColumnLabels}
        view={view}
        {...props} 
      />
    </DataTableContextProvider>
  );
};

export default Table;
