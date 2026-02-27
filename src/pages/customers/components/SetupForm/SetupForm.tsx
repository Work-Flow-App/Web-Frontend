import React, { useCallback, useEffect, useState } from 'react';
import { CustomerFormSchema, type CustomerFormData } from '../../schema/CustomerFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { CustomerFormFields } from '../CustomerFormFields';
import { Loader } from '../../../../components/UI';
import { customerService, type CustomerCreateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useNavigate } from 'react-router-dom';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface SetupFormProps {
  isModal?: boolean;
  customerId?: number;
  onSuccess?: () => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ isModal = false, customerId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [customerData, setCustomerData] = useState<Partial<CustomerFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isModal) {
      updateModalTitle(customerId ? 'Edit Customer' : 'Add New Customer');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: customerId ? 'Update' : 'Add Customer',
      });
    }
  }, [isModal, customerId, updateModalTitle, updateGlobalModalInnerConfig]);

  useEffect(() => {
    const fetchCustomerData = async () => {
      if (customerId) {
        try {
          setIsLoading(true);
          const response = await customerService.getCustomerById(customerId);
          const customer = response.data;

          setCustomerData({
            name: customer.name || '',
            email: customer.email || '',
            telephone: customer.telephone || '',
            mobile: customer.mobile || '',
            street: customer.address?.street || '',
            city: customer.address?.city || '',
            postalCode: customer.address?.postalCode || '',
            country: customer.address?.country || '',
          });
        } catch (error) {
          console.error('Error fetching customer:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load customer data';
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchCustomerData();
  }, [customerId, showError]);

  const handleSubmit = useCallback(
    async (data: CustomerFormData) => {
      try {
        const address = {
          street: data.street,
          city: data.city,
          postalCode: data.postalCode,
          country: data.country,
        };

        if (customerId) {
          const response = await customerService.updateCustomer(customerId, {
            name: data.name,
            email: data.email,
            telephone: data.telephone,
            mobile: data.mobile,
            address,
          });
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Customer updated successfully');
        } else {
          const createPayload: CustomerCreateRequest = {
            name: data.name,
          };
          if (data.email) createPayload.email = data.email;
          if (data.telephone) createPayload.telephone = data.telephone;
          if (data.mobile) createPayload.mobile = data.mobile;
          if (data.street || data.city || data.postalCode || data.country) {
            createPayload.address = address;
          }

          const response = await customerService.createCustomer(createPayload);
          showSuccess(response.data.name ? `${response.data.name} added successfully` : 'Customer added successfully');
        }

        if (onSuccess) {
          onSuccess();
        } else {
          navigate('/customers');
        }
      } catch (error) {
        console.error('Error saving customer:', error);
        const errorMessage = error instanceof Error ? error.message : `Failed to ${customerId ? 'update' : 'add'} customer`;
        showError(errorMessage);
        throw error;
      }
      return { success: true };
    },
    [customerId, showSuccess, showError, onSuccess, navigate]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={CustomerFormSchema}
      onSubmit={handleSubmit}
      defaultValues={customerData}
      isModal={isModal}
    >
      <CustomerFormFields />
    </SetupFormWrapper>
  );
};
