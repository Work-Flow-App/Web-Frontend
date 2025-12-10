import React, { useCallback, useEffect, useState } from 'react';
import { ClientFormSchema, type ClientFormData } from '../../schema/ClientFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { ClientFormFields } from '../ClientFormFields';
import { Loader } from '../../../../components/UI';
import { companyClientService, type ClientCreateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface SetupFormProps {
  isModal?: boolean;
  clientId?: number;
  onSuccess?: () => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ isModal = false, clientId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [clientData, setClientData] = useState<Partial<ClientFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(clientId ? 'Edit Client' : 'Add New Client');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: clientId ? 'Update' : 'Add Client',
      });
    }
  }, [isModal, clientId, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch client data when editing
  useEffect(() => {
    const fetchClientData = async () => {
      if (clientId) {
        try {
          setIsLoading(true);
          const response = await companyClientService.getClientById(clientId);
          const client = response.data;

          // Map client data to form data structure
          setClientData({
            name: client.name || '',
            email: client.email || '',
            telephone: client.telephone || '',
            mobile: client.mobile || '',
            address: client.address || '',
          });
        } catch (error) {
          console.error('Error fetching client:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load client data';
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchClientData();
  }, [clientId, showError]);

  const handleSubmit = useCallback(
    async (data: ClientFormData) => {
      try {
        if (clientId) {
          // Update existing client
          const response = await companyClientService.updateClient(clientId, {
            name: data.name,
            email: data.email,
            telephone: data.telephone,
            mobile: data.mobile,
            address: data.address,
          });
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Client updated successfully');
        } else {
          // Create new client
          const createPayload: ClientCreateRequest = {
            name: data.name,
          };
          if (data.email) createPayload.email = data.email;
          if (data.telephone) createPayload.telephone = data.telephone;
          if (data.mobile) createPayload.mobile = data.mobile;
          if (data.address) createPayload.address = data.address;

          const response = await companyClientService.createClient(createPayload);
          showSuccess(response.data.name ? `${response.data.name} added successfully` : 'Client added successfully');
        }

        // Call onSuccess callback if provided (for modal usage)
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate back to list view (for standalone usage)
          navigate('/clients');
        }
      } catch (error) {
        console.error('Error saving client:', error);
        const errorMessage = error instanceof Error ? error.message : `Failed to ${clientId ? 'update' : 'add'} client`;
        showError(errorMessage);
        throw error;
      }
      return { success: true };
    },
    [clientId, showSuccess, showError, onSuccess, navigate]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={ClientFormSchema}
      onSubmit={handleSubmit}
      defaultValues={clientData}
      isModal={isModal}
    >
      <ClientFormFields />
    </SetupFormWrapper>
  );
};
