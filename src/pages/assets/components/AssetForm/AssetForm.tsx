import React, { useCallback, useEffect, useState } from 'react';
import { AssetFormSchema, type AssetFormData } from '../../schema/AssetFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { AssetFormFields } from '../AssetFormFields';
import { Loader } from '../../../../components/UI';
import { assetService, type AssetCreateRequest, type AssetUpdateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useNavigate } from 'react-router-dom';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface AssetFormProps {
  isModal?: boolean;
  assetId?: number;
  onSuccess?: () => void;
}

export const AssetForm: React.FC<AssetFormProps> = ({ isModal = false, assetId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const navigate = useNavigate();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const [assetData, setAssetData] = useState<Partial<AssetFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!assetId;

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Edit Asset' : 'Add New Asset');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Update Asset' : 'Add Asset',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch asset data when editing
  useEffect(() => {
    const fetchAssetData = async () => {
      if (assetId) {
        try {
          setIsLoading(true);
          const response = await assetService.getAssetById(assetId);
          const asset = response.data;

          // Map asset data to form data structure
          setAssetData({
            name: asset.name || '',
            description: asset.description || '',
            serialNumber: asset.serialNumber || '',
            assetTag: asset.assetTag || '',
            purchasePrice: asset.purchasePrice || 0,
            purchaseDate: asset.purchaseDate || '',
            depreciationRate: asset.depreciationRate || 0,
            salvageValue: asset.salvageValue || 0,
            warehouseAddressStreet: [
              asset.warehouseAddress?.street,
              asset.warehouseAddress?.city,
              asset.warehouseAddress?.state,
              asset.warehouseAddress?.postalCode,
              asset.warehouseAddress?.country,
            ]
              .filter(Boolean)
              .join(', '),
            warehouseAddressCity: '',
            warehouseAddressState: '',
            warehouseAddressPostalCode: '',
            warehouseAddressCountry: '',
            warehouseAddressLatitude: asset.warehouseAddress?.latitude ?? null,
            warehouseAddressLongitude: asset.warehouseAddress?.longitude ?? null,
          });
        } catch (error) {
          console.error('Error fetching asset:', error);
          showError(extractErrorMessage(error, 'Failed to load asset data'));
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchAssetData();
  }, [assetId, showError]);

  const handleSubmit = useCallback(
    async (data: AssetFormData) => {
      try {
        const warehouseAddress = {
          ...(data.warehouseAddressStreet && { street: data.warehouseAddressStreet }),
          ...(data.warehouseAddressCity && { city: data.warehouseAddressCity }),
          ...(data.warehouseAddressState && { state: data.warehouseAddressState }),
          ...(data.warehouseAddressPostalCode && { postalCode: data.warehouseAddressPostalCode }),
          ...(data.warehouseAddressCountry && { country: data.warehouseAddressCountry }),
          ...(data.warehouseAddressLatitude != null && { latitude: data.warehouseAddressLatitude }),
          ...(data.warehouseAddressLongitude != null && { longitude: data.warehouseAddressLongitude }),
        };
        const hasWarehouseAddress = Object.keys(warehouseAddress).length > 0;

        if (isEditMode) {
          // Update existing asset - only updatable fields
          const updatePayload: AssetUpdateRequest = {
            name: data.name,
          };
          if (data.description) updatePayload.description = data.description;
          if (data.serialNumber) updatePayload.serialNumber = data.serialNumber;
          if (data.assetTag) updatePayload.assetTag = data.assetTag;
          if (data.purchasePrice !== undefined) updatePayload.purchasePrice = data.purchasePrice;
          if (data.purchaseDate) updatePayload.purchaseDate = data.purchaseDate;
          if (data.depreciationRate !== undefined) updatePayload.depreciationRate = data.depreciationRate;
          if (data.salvageValue !== undefined) updatePayload.salvageValue = data.salvageValue;
          if (hasWarehouseAddress) updatePayload.warehouseAddress = warehouseAddress;

          const response = await assetService.updateAsset(assetId!, updatePayload);
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Asset updated successfully');
        } else {
          // Create new asset - include all fields
          const createPayload: AssetCreateRequest = {
            name: data.name,
            purchasePrice: data.purchasePrice,
            purchaseDate: data.purchaseDate,
            depreciationRate: data.depreciationRate ?? 0,
          };
          if (data.description) createPayload.description = data.description;
          if (data.serialNumber) createPayload.serialNumber = data.serialNumber;
          if (data.assetTag) createPayload.assetTag = data.assetTag;
          if (data.salvageValue !== undefined) createPayload.salvageValue = data.salvageValue;
          if (hasWarehouseAddress) createPayload.warehouseAddress = warehouseAddress;

          const response = await assetService.createAsset(createPayload);
          showSuccess(response.data.name ? `${response.data.name} added successfully` : 'Asset added successfully');
        }

        // Call onSuccess callback if provided (for modal usage)
        if (onSuccess) {
          onSuccess();
        } else {
          // Navigate back to list view (for standalone usage)
          navigate('/company/assets');
        }
      } catch (error) {
        console.error('Error saving asset:', error);
        showError(extractErrorMessage(error, `Failed to ${isEditMode ? 'update' : 'add'} asset`));
        throw error;
      }
      return { success: true };
    },
    [assetId, isEditMode, showSuccess, showError, onSuccess, navigate]
  );

  // Show loading state while fetching asset data
  if (assetId && isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={AssetFormSchema}
      defaultValues={assetData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <AssetFormFields />
    </SetupFormWrapper>
  );
};
