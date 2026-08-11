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
  showViewButton?: boolean;
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
  showViewButton = true,
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
    // Check for Line Item
    const productCodeCol = columns.find((col) => col.id === 'productCode' || col.label === 'Product Code');
    if (productCodeCol) {
      const code = row[productCodeCol.accessor || 'productCode'] || row.productCode || '';
      return `Product Code:${code}`;
    }

    // Check for Asset
    const assetIdCol = columns.find((col) => col.label === 'Asset ID');
    if (assetIdCol) {
      const ref = row[assetIdCol.accessor || 'assetRef'] ?? row.assetRef ?? row.id;
      return `Asset ID:${ref}`;
    }

    // Check for Workflow
    const workflowIdCol = columns.find((col) => col.id === 'id' && col.label === 'ID');
    if (workflowIdCol && ('workflowRef' in row || 'stepCount' in row)) {
      const ref = row.workflowRef ?? row.id;
      return `ID:${ref}`;
    }

    // Check for Job No
    const jobNoCol = columns.find(
      (col) =>
        col.id === 'jobRef' ||
        col.label.toLowerCase().includes('job no')
    );
    if (jobNoCol) {
      const ref = row[jobNoCol.accessor || 'jobRef'] ?? row.jobRef ?? row.id;
      return `Job No. ${ref}`;
    }

    // Check for Member (All Workers)
    const memberCol = columns.find((col) => col.label === 'Member');
    if (memberCol) {
      return String(row[memberCol.accessor || 'name'] || row.name || '');
    }

    // Check for Template Name
    const templateCol = columns.find((col) => col.label === 'Template Name');
    if (templateCol) {
      return String(row[templateCol.accessor || 'name'] || row.name || '');
    }

    // Check for Client
    const clientCol = columns.find((col) => col.label === 'Client');
    if (clientCol) {
      return String(row[clientCol.accessor || 'name'] || row.name || '');
    }

    // Check for Customer
    const customerCol = columns.find((col) => col.label === 'Customer');
    if (customerCol) {
      return String(row[customerCol.accessor || 'name'] || row.name || '');
    }

    // Fallbacks
    const titleCol = columns.find(
      (col) =>
        col.id === 'id' ||
        col.id === 'jobRef' ||
        col.label.toLowerCase().includes('ref')
    );

    if (titleCol) {
      const rawVal = titleCol.accessor ? row[titleCol.accessor] : '';
      if (rawVal) {
        return String(rawVal);
      }
      const val = titleCol.render ? titleCol.render(row) : '';
      const stringVal = typeof val === 'object' ? '' : String(val ?? '');
      return stringVal;
    }

    const nameCol = columns.find(
      (col) =>
        col.id === 'name' ||
        col.label.toLowerCase().includes('name') ||
        col.label.toLowerCase().includes('title')
    );

    if (nameCol) {
      const rawVal = nameCol.accessor ? row[nameCol.accessor] : '';
      if (rawVal) {
        return String(rawVal);
      }
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
    const isStatusCol = col.id === 'status' || col.label.toLowerCase() === 'status';
    if (isStatusCol) return false;

    // Check and exclude columns that are used in the top card title
    const labelLower = col.label.toLowerCase();
    
    // Exclude for Jobs
    const isJobTitleCol = col.id === 'jobRef' || labelLower.includes('job no');
    if (isJobTitleCol) {
      const jobNoCol = columns.find((c) => c.id === 'jobRef' || c.label.toLowerCase().includes('job no'));
      if (jobNoCol) return false;
    }

    // Exclude for Line Item (Product Code)
    if (col.id === 'productCode' || col.label === 'Product Code') {
      return false;
    }

    // Exclude for Asset ID
    if (col.label === 'Asset ID') {
      return false;
    }

    // Exclude for Workflow ID
    if (col.id === 'id' && col.label === 'ID') {
      return false;
    }

    // Exclude for Member (All Workers page)
    if (col.label === 'Member') {
      return false;
    }

    // Exclude for Template Name
    if (col.label === 'Template Name') {
      return false;
    }

    // Exclude for Client
    if (col.label === 'Client') {
      return false;
    }

    // Exclude for Customer
    if (col.label === 'Customer') {
      return false;
    }

    // Exclude postcode if rendered inline on Job Value
    if (col.id === 'postCode' || labelLower === 'post code') {
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
        {showViewButton && <ViewButton onClick={handleViewClick}>View</ViewButton>}
      </CardFooter>
    </CardContainer>
  );
};

export default MobileResponsive;
