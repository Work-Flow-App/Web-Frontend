import React, { useEffect, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Box } from '@mui/material';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { assetService } from '../../../../services/api';
import type { AddressRequest, AddressResponse } from '../../../../services/api';
import { FormField } from '../../../../components/UI/FormComponents';
import LocationMapField from '../../../jobs/components/JobFormFields/LocationMapField';

export interface AssetAddressFormProps {
  assignmentId: number;
  assetName: string;
  currentAddress?: AddressResponse;
  onSuccess?: () => void;
}

/**
 * Worker self-service: update the physical address of an asset assigned to them
 * (e.g. "I moved this generator to a different site"). Modeled on AssignAssetModal -
 * a plain react-hook-form instance driving the GlobalModal's own confirm/cancel footer,
 * rather than the schema-driven SetupFormWrapper.
 */
export const AssetAddressForm: React.FC<AssetAddressFormProps> = ({
  assignmentId,
  assetName,
  currentAddress,
  onSuccess,
}) => {
  const methods = useForm();
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();
  const [submitting, setSubmitting] = useState(false);

  // Prefill once from the assignment's current address
  useEffect(() => {
    if (!currentAddress) return;
    methods.setValue(
      'addressStreet',
      [currentAddress.street, currentAddress.city, currentAddress.state, currentAddress.postalCode, currentAddress.country]
        .filter(Boolean)
        .join(', ')
    );
    methods.setValue('addressCity', currentAddress.city ?? '');
    methods.setValue('addressState', currentAddress.state ?? '');
    methods.setValue('addressPostalCode', currentAddress.postalCode ?? '');
    methods.setValue('addressCountry', currentAddress.country ?? '');
    methods.setValue('addressLatitude', currentAddress.latitude ?? null);
    methods.setValue('addressLongitude', currentAddress.longitude ?? null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateModalTitle(`Update Address - ${assetName}`);
    updateGlobalModalInnerConfig({
      confirmModalButtonText: submitting ? 'Saving...' : 'Save Address',
      isConfirmDisabled: submitting,
    });
    setSkipResetModal?.(true);
  }, [updateModalTitle, updateGlobalModalInnerConfig, setSkipResetModal, assetName, submitting]);

  useEffect(() => {
    updateOnConfirm(async () => {
      const values = methods.getValues();
      const addr: AddressRequest = {
        ...(values.addressStreet && { street: values.addressStreet }),
        ...(values.addressCity && { city: values.addressCity }),
        ...(values.addressState && { state: values.addressState }),
        ...(values.addressPostalCode && { postalCode: values.addressPostalCode }),
        ...(values.addressCountry && { country: values.addressCountry }),
        ...(values.addressLatitude != null && { latitude: values.addressLatitude }),
        ...(values.addressLongitude != null && { longitude: values.addressLongitude }),
      };

      if (Object.keys(addr).length === 0) {
        showError('Please enter an address');
        return;
      }

      try {
        setSubmitting(true);
        await assetService.updateMyAssetAddress(assignmentId, addr);
        showSuccess('Address updated successfully');
        onSuccess?.();
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to update address'));
      } finally {
        setSubmitting(false);
      }
    });
  }, [updateOnConfirm, assignmentId, showSuccess, showError, onSuccess, methods]);

  return (
    <FormProvider {...methods}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormField label="Asset Address">
          <LocationMapField namePrefix="address" />
        </FormField>
      </Box>
    </FormProvider>
  );
};
