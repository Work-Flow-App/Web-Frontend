import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { CreateLineItemModal } from '../CreateLineItemModal';
import { lineItemService } from '../../../../services/api';
import type { LineItemResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useCurrency } from '../../../../contexts/CurrencyContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { getColumns, type LineItemTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const [lineItems, setLineItems] = useState<LineItemTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const { formatCurrency } = useCurrency();
  const columns = useMemo(() => getColumns(formatCurrency), [formatCurrency]);

  const fetchLineItems = useCallback(async () => {
    try {
      setLoading(true);
      const response = await lineItemService.getAll();
      const data = Array.isArray(response.data) ? response.data : [];

      const rows: LineItemTableRow[] = data.map((item: LineItemResponse) => ({
        id: item.id || 0,
        productCode: item.productCode || '',
        productDescription: item.productDescription || '',
        additionalDetails: item.additionalDetails || '',
        coreOrSub: item.coreOrSub || '',
        unitPrice: item.unitPrice || 0,
        quantity: item.quantity || 0,
        vatRate: item.vatRate || 0,
        netAmount: item.netAmount || 0,
        vatAmount: item.vatAmount || 0,
        totalAmount: item.totalAmount || 0,
        createdAt: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '',
      }));

      setLineItems(rows);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load line items'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchLineItems();
  }, [fetchLineItems]);

  const handleCreateLineItem = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'createLineItem',
      children: (
        <CreateLineItemModal
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchLineItems();
          }}
        />
      ),
    });
  }, [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchLineItems]);

  const handleEditLineItem = useCallback(
    (lineItem: LineItemTableRow) => {
      const lineItemData: LineItemResponse = {
        id: lineItem.id,
        productCode: lineItem.productCode,
        productDescription: lineItem.productDescription,
        additionalDetails: lineItem.additionalDetails,
        coreOrSub: lineItem.coreOrSub as LineItemResponse['coreOrSub'],
        unitPrice: lineItem.unitPrice,
        quantity: lineItem.quantity,
        vatRate: lineItem.vatRate,
      };

      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editLineItem',
        children: (
          <CreateLineItemModal
            lineItem={lineItemData}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchLineItems();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchLineItems]
  );

  const handleDeleteLineItem = useCallback(
    (lineItem: LineItemTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteLineItem',
        children: (
          <ConfirmationModal
            title="Delete Line Item"
            message={`Are you sure you want to delete "${lineItem.productDescription}"?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await lineItemService.delete(lineItem.id);
                showSuccess('Line item deleted successfully');
                resetGlobalModalOuterProps();
                fetchLineItems();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete line item'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, fetchLineItems, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const tableActions: ITableAction<LineItemTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditLineItem,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteLineItem,
        color: 'error' as const,
      },
    ],
    [handleEditLineItem, handleDeleteLineItem]
  );

  return (
    <PageWrapper
      title="Line Items"
      description="Manage all reusable line items for estimates and invoices."
      actions={[
        {
          label: 'Create Line Item',
          onClick: handleCreateLineItem,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search line items"
    >
      <Table<LineItemTableRow>
        columns={columns}
        data={lineItems}
        selectable
        showActions
        actions={tableActions}
        loading={loading}
        emptyMessage="No line items found. Create your first line item to get started."
        rowsPerPage={10}
        showPagination={true}
      />
    </PageWrapper>
  );
};
