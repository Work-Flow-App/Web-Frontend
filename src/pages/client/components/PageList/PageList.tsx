import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { SetupForm } from '../SetupForm';
import { companyClientService, type ClientResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { columns, type ClientTableRow } from './DataColumn';

export const PageList: React.FC = () => {
  const [clients, setClients] = useState<ClientTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch clients from API
  const fetchClients = useCallback(async () => {
    try {
      setLoading(true);

      // Use companyClientService to fetch clients
      const response = await companyClientService.getAllClients();

      // Get the clients array from response
      const clientsData = Array.isArray(response.data) ? response.data : [];

      // Transform API response to table format
      const transformedData: ClientTableRow[] = clientsData.map((client: ClientResponse) => ({
        id: client.id || 0,
        name: client.name || '',
        email: client.email || '',
        telephone: client.telephone || '',
        mobile: client.mobile || '',
        address: client.address || '',
        addedOn: client.createdAt ? new Date(client.createdAt).toLocaleDateString() : '',
      }));

      setClients(transformedData);
    } catch (error) {
      console.error('Error fetching clients:', error);

      const errorMessage = error instanceof Error ? error.message : 'Failed to load clients';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load clients on mount
  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  // Handle add client
  const handleAddClient = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addClient',
      children: (
        <SetupForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchClients();
          }}
        />
      ),
    });
  };

  // Handle edit client
  const handleEditClient = useCallback(
    (client: ClientTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editClient',
        children: (
          <SetupForm
            isModal={true}
            clientId={client.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchClients();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchClients]
  );

  // Handle delete client
  const handleDeleteClient = useCallback(
    (client: ClientTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteClient',
        children: (
          <ConfirmationModal
            title="Delete Client"
            message={`Are you sure you want to delete ${client.name}?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await companyClientService.deleteClient(client.id);
                showSuccess(`${client.name} deleted successfully`);
                resetGlobalModalOuterProps();
                fetchClients();
              } catch (error) {
                console.error('Error deleting client:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete client';
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
    [showSuccess, showError, fetchClients, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Define table actions
  const tableActions: ITableAction<ClientTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditClient,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteClient,
        color: 'error' as const,
      },
    ],
    [handleEditClient, handleDeleteClient]
  );

  return (
    <PageWrapper
      title="All Clients"
      description="Manage client details and information in one place."
      actions={[
        {
          label: 'Add Client',
          onClick: handleAddClient,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search clients"
    >
      <Table<ClientTableRow>
        columns={columns}
        data={clients}
        selectable
        showActions
        actions={tableActions}
        loading={loading}
        emptyMessage="No clients found. Add your first client to get started."
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
