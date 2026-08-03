import React from 'react';
import type { ITableAction, ITableRow, ITableColumn } from '../../ITable';
import { useDataRow } from '../../context';
import { CustomCheckbox, ActionButton } from '../../Table.styles';
import { MoreOptionsIcon } from '../../icons';
import { ActionsMenu } from '../ActionsMenu';
import {
  CardContainer,
  CardHeader,
  HeaderLeft,
  HeaderRight,
  ActionsWrapper,
  CardTitle,
  FieldsContainer,
  FieldRow,
  FieldLabel,
  FieldValueContainer,
  FieldValue,
  FieldRightValue,
  CardFooter,
  UserSelector,
  SelectorAvatar,
  SelectorName,
  ViewButton,
} from './MobileResponsive.styles';

interface IMobileResponsiveProps<T = ITableRow> {
  row: T;
  columns: ITableColumn<T>[];
  selectable?: boolean;
  showActions?: boolean;
  actions?: ITableAction<T>[];
  renderActions?: (row: T) => React.ReactNode;
  onActionClick?: (row: T, event: React.MouseEvent) => void;
  onRowClick?: (row: T) => void;
  highlightedRowId?: string | number;
}

const MobileResponsive = <T extends ITableRow = ITableRow>({
  row,
  columns,
  selectable = false,
  showActions = false,
  actions,
  renderActions,
  onActionClick,
  onRowClick,
  highlightedRowId,
}: IMobileResponsiveProps<T>) => {
  const { selectedRows, toggleRowSelection } = useDataRow();

  const handleCardClick = (event: React.MouseEvent) => {
    // Prevent triggering card click on interactive elements
    const target = event.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input[type="checkbox"]') ||
      target.closest('a') ||
      target.closest('[role="button"]') ||
      target.closest('.user-selector-dropdown')
    ) {
      return;
    }

    if (onRowClick) {
      onRowClick(row);
    } else if (selectable) {
      toggleRowSelection(row.id);
    }
  };

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onRowClick) {
      onRowClick(row);
    }
  };

  const handleActionClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onActionClick) {
      onActionClick(row, event);
    }
  };

  // 1. Dynamic Title/ID resolution
  const getCardTitle = () => {
    const titleCol = columns.find(
      (col) =>
        col.id === 'id' ||
        col.id === 'jobRef' ||
        col.label.toLowerCase().includes('job no') ||
        col.label.toLowerCase().includes('ref')
    );

    if (titleCol) {
      const val = titleCol.render
        ? titleCol.render(row)
        : titleCol.accessor
          ? row[titleCol.accessor]
          : '';
      const stringVal = String(val ?? '');
      
      // Format nice Label if not present
      if (
        titleCol.label.toLowerCase().includes('job no') &&
        !stringVal.toLowerCase().includes('job no')
      ) {
        return `Job No. ${stringVal}`;
      }
      return stringVal;
    }

    const nameCol = columns.find(
      (col) =>
        col.id === 'name' ||
        col.label.toLowerCase().includes('name') ||
        col.label.toLowerCase().includes('title')
    );

    if (nameCol) {
      return nameCol.render
        ? String(nameCol.render(row))
        : String(row[nameCol.accessor || ''] ?? '');
    }

    return `No. ${row.id}`;
  };

  // 2. Dynamic Status Resolution
  const getStatusNode = () => {
    const statusCol = columns.find(
      (col) => col.id === 'status' || col.label.toLowerCase() === 'status'
    );
    if (statusCol) {
      return statusCol.render
        ? statusCol.render(row)
        : statusCol.accessor
          ? String(row[statusCol.accessor] ?? '')
          : null;
    }
    return null;
  };

  // 3. Resolve Display Fields (exclude title and status columns)
  const fieldsToRender = columns.filter((col) => {
    const isTitleCol =
      col.id === 'id' ||
      col.id === 'jobRef' ||
      col.label.toLowerCase().includes('job no') ||
      col.label.toLowerCase().includes('ref');
    const isStatusCol = col.id === 'status' || col.label.toLowerCase() === 'status';

    if (isTitleCol || isStatusCol) return false;

    // Exclude postcode if rendered inline on Job Value
    if (col.id === 'postCode' || col.label.toLowerCase() === 'post code') {
      const colVal = col.render
        ? col.render(row)
        : col.accessor
          ? row[col.accessor]
          : '';
      const rawPostCode = row.postCode || '';
      if (typeof colVal === 'string' && colVal === rawPostCode) {
        return false;
      }
    }

    return true;
  });

  // 4. Resolve Footer contact name & initials
  const getContactInfo = () => {
    const contactName =
      row.customerName ||
      row.workerName ||
      row.clientName ||
      row.name ||
      row.email ||
      'Unassigned';

    // Generate Initials
    const initials = contactName
      .split(' ')
      .map((n: string) => n[0])
      .join('')
      .slice(0, 2);

    return { name: contactName, initials };
  };

  const contact = getContactInfo();
  const titleText = getCardTitle();
  const statusNode = getStatusNode();

  return (
    <CardContainer onClick={handleCardClick} className={row.id === highlightedRowId ? 'highlighted-row' : ''}>
      {/* Card Header: Title/ID & Status */}
      <CardHeader>
        <HeaderLeft>
          {selectable && (
            <CustomCheckbox
              checked={selectedRows.includes(row.id)}
              onClick={(e) => {
                e.stopPropagation();
                toggleRowSelection(row.id);
              }}
            />
          )}
          <CardTitle>{titleText}</CardTitle>
        </HeaderLeft>
        {statusNode && <HeaderRight>{statusNode}</HeaderRight>}
      </CardHeader>

      {/* Card Fields Content */}
      <FieldsContainer>
        {fieldsToRender.map((col, index) => {
          const value = col.render
            ? col.render(row)
            : col.accessor
              ? row[col.accessor]
              : '';
          const isJobValue = col.id === 'jobValue' || col.label.toLowerCase() === 'job value';
          const showPostCodeInline = isJobValue && row.postCode && row.postCode !== '-';

          return (
            <FieldRow key={col.id}>
              <FieldLabel>{col.label}</FieldLabel>
              <FieldValueContainer>
                <FieldValue>{value}</FieldValue>
                {showPostCodeInline && (
                  <FieldRightValue>{row.postCode}</FieldRightValue>
                )}
                {index === 0 && showActions && (
                  <ActionsWrapper>
                    {actions && actions.length > 0 ? (
                      <ActionsMenu row={row} actions={actions} />
                    ) : renderActions ? (
                      renderActions(row)
                    ) : (
                      <ActionButton onClick={handleActionClick}>
                        <MoreOptionsIcon />
                      </ActionButton>
                    )}
                  </ActionsWrapper>
                )}
              </FieldValueContainer>
            </FieldRow>
          );
        })}
      </FieldsContainer>

      {/* Card Footer: User selector dropdown UI & View button */}
      <CardFooter>
        <UserSelector className="user-selector-dropdown">
          <SelectorAvatar>{contact.initials}</SelectorAvatar>
          <SelectorName>{contact.name}</SelectorName>
        </UserSelector>
        <ViewButton onClick={handleViewClick}>View</ViewButton>
      </CardFooter>
    </CardContainer>
  );
};

export default MobileResponsive;
