import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { SetupForm } from '../SetupForm';
import { customerService, type CustomerResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { columns, type CustomerTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  const fetchCustomers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await customerService.getAllCustomers();
      const customersData = Array.isArray(response.data) ? response.data : [];

      const transformedData: CustomerTableRow[] = customersData.map((customer: CustomerResponse) => {
        const addr = customer.address;
        const addressParts = [addr?.street, addr?.city, addr?.postalCode, addr?.country].filter(Boolean);
        return {
          id: customer.id || 0,
          name: customer.name || '',
          email: customer.email || '',
          telephone: customer.telephone || '',
          mobile: customer.mobile || '',
          address: addressParts.join(', '),
          addedOn: customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : '',
        };
      });

      setCustomers(transformedData);
    } catch (error) {
      console.error('Error fetching customers:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load customers';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const handleAddCustomer = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addCustomer',
      children: (
        <SetupForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchCustomers();
          }}
        />
      ),
    });
  };

  const handleEditCustomer = useCallback(
    (customer: CustomerTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editCustomer',
        children: (
          <SetupForm
            isModal={true}
            customerId={customer.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchCustomers();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchCustomers]
  );

  const handleDeleteCustomer = useCallback(
    (customer: CustomerTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteCustomer',
        children: (
          <ConfirmationModal
            title="Delete Customer"
            message={`Are you sure you want to delete ${customer.name}?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await customerService.deleteCustomer(customer.id);
                showSuccess(`${customer.name} deleted successfully`);
                resetGlobalModalOuterProps();
                fetchCustomers();
              } catch (error) {
                console.error('Error deleting customer:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete customer';
                showError(errorMessage);
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => {
              resetGlobalModalOuterProps();
            }}
          />
        ),
      });
    },
    [showSuccess, showError, fetchCustomers, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const tableActions: ITableAction<CustomerTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditCustomer,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteCustomer,
        color: 'error' as const,
      },
    ],
    [handleEditCustomer, handleDeleteCustomer]
  );

  return (
    <PageWrapper
      title="All Customers"
      description="Manage customer details and information in one place."
      actions={[
        {
          label: 'Add Customer',
          onClick: handleAddCustomer,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search customers"
    >
      <Table<CustomerTableRow>
        columns={columns}
        data={customers}
        selectable
        showActions
        actions={tableActions}
        loading={loading}
        emptyMessage="No customers found. Add your first customer to get started."
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
