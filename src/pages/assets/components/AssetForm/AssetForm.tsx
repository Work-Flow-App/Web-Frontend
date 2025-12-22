import React, { useCallback, useEffect, useState } from 'react';
import { AssetFormSchema, type AssetFormData } from '../../schema/AssetFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { AssetFormFields } from '../AssetFormFields';
import { Loader } from '../../../../components/UI';
import { assetService, type AssetCreateRequest, type AssetUpdateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
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
            currentLocation: asset.currentLocation || '',
            latitude: asset.latitude || undefined,
            longitude: asset.longitude || undefined,
          });
        } catch (error) {
          console.error('Error fetching asset:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load asset data';
          showError(errorMessage);
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
        if (isEditMode) {
          // Update existing asset - only updatable fields
          const updatePayload: AssetUpdateRequest = {
            name: data.name,
          };
          if (data.description) updatePayload.description = data.description;
          if (data.serialNumber) updatePayload.serialNumber = data.serialNumber;
          if (data.assetTag) updatePayload.assetTag = data.assetTag;
          if (data.salvageValue !== undefined) updatePayload.salvageValue = data.salvageValue;
          if (data.currentLocation) updatePayload.currentLocation = data.currentLocation;
          if (data.latitude !== undefined) updatePayload.latitude = data.latitude;
          if (data.longitude !== undefined) updatePayload.longitude = data.longitude;

          const response = await assetService.updateAsset(assetId!, updatePayload);
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Asset updated successfully');
        } else {
          // Create new asset - include all fields
          const createPayload: AssetCreateRequest = {
            name: data.name,
            purchasePrice: data.purchasePrice,
            purchaseDate: data.purchaseDate,
          };
          if (data.description) createPayload.description = data.description;
          if (data.serialNumber) createPayload.serialNumber = data.serialNumber;
          if (data.assetTag) createPayload.assetTag = data.assetTag;
          if (data.depreciationRate !== undefined) createPayload.depreciationRate = data.depreciationRate;
          if (data.salvageValue !== undefined) createPayload.salvageValue = data.salvageValue;
          if (data.currentLocation) createPayload.currentLocation = data.currentLocation;
          if (data.latitude !== undefined) createPayload.latitude = data.latitude;
          if (data.longitude !== undefined) createPayload.longitude = data.longitude;

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
        const errorMessage = error instanceof Error ? error.message : `Failed to ${isEditMode ? 'update' : 'add'} asset`;
        showError(errorMessage);
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
      <AssetFormFields isEditMode={isEditMode} />
    </SetupFormWrapper>
  );
};
