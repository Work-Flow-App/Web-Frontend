import React, { useCallback, useEffect, useState } from 'react';
import { AssetGroupFormSchema, type AssetGroupFormData } from '../../schema/AssetGroupFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { AssetGroupFormFields } from '../AssetGroupFormFields';
import { assetGroupService, type AssetGroupResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface SetupFormProps {
  isModal?: boolean;
  /** Existing group being edited - the list endpoint already has everything we need, so no re-fetch by id. */
  assetGroup?: AssetGroupResponse;
  onSuccess?: () => void;
}

export const SetupForm: React.FC<SetupFormProps> = ({ isModal = false, assetGroup, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();
  const isEditMode = !!assetGroup;
  const [groupData, setGroupData] = useState<Partial<AssetGroupFormData> | undefined>(undefined);

  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Edit Asset Group' : 'Add New Asset Group');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Update Group' : 'Add Group',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  useEffect(() => {
    if (assetGroup) {
      setGroupData({
        name: assetGroup.name || '',
        description: assetGroup.description || '',
      });
    }
  }, [assetGroup]);

  const handleSubmit = useCallback(
    async (data: AssetGroupFormData) => {
      try {
        if (isEditMode && assetGroup?.id) {
          const response = await assetGroupService.updateAssetGroup(assetGroup.id, {
            name: data.name,
            description: data.description || undefined,
          });
          showSuccess(response.data.name ? `${response.data.name} updated successfully` : 'Asset group updated successfully');
        } else {
          const response = await assetGroupService.createAssetGroup({
            name: data.name,
            description: data.description || undefined,
          });
          showSuccess(response.data.name ? `${response.data.name} added successfully` : 'Asset group added successfully');
        }

        onSuccess?.();
      } catch (error) {
        console.error('Error saving asset group:', error);
        showError(extractErrorMessage(error, `Failed to ${isEditMode ? 'update' : 'add'} asset group`));
        throw error;
      }
      return { success: true };
    },
    [isEditMode, assetGroup, showSuccess, showError, onSuccess]
  );

  return (
    <SetupFormWrapper schema={AssetGroupFormSchema} defaultValues={groupData} onSubmit={handleSubmit} isModal={isModal}>
      <AssetGroupFormFields />
    </SetupFormWrapper>
  );
};
