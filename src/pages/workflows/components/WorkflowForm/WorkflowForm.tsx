import React, { useCallback, useEffect, useState } from 'react';
import { WorkflowFormSchema, type WorkflowFormData } from '../../schema/WorkflowFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { WorkflowFormFields } from './WorkflowFormFields';
import { Loader } from '../../../../components/UI';
import { workflowService } from '../../../../services/api';
import type { WorkflowCreateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';

export interface WorkflowFormProps {
  isModal?: boolean;
  workflowId?: number;
  onSuccess?: () => void;
}

export const WorkflowForm: React.FC<WorkflowFormProps> = ({ isModal = false, workflowId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();

  const [workflowData, setWorkflowData] = useState<Partial<WorkflowFormData> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!workflowId;

  useEffect(() => {
    if (isModal) {
      const title = isEditMode ? 'Edit Workflow' : 'Create New Workflow';
      const buttonText = isEditMode ? 'Update Workflow' : 'Create Workflow';

      updateModalTitle(title);
      updateGlobalModalInnerConfig({
        confirmModalButtonText: buttonText,
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  useEffect(() => {
    const fetchWorkflowData = async () => {
      if (workflowId) {
        try {
          setIsLoading(true);
          const response = await workflowService.getWorkflowById(workflowId);
          const workflow = response.data;

          setWorkflowData({
            name: workflow.name || '',
            description: workflow.description || '',
          });
        } catch (error) {
          console.error('Error fetching workflow:', error);
          const errorMessage = error instanceof Error ? error.message : 'Failed to load workflow data';
          showError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchWorkflowData();
  }, [workflowId, showError]);

  const handleSubmit = useCallback(
    async (data: WorkflowFormData) => {
      try {
        const payload: WorkflowCreateRequest = {
          name: data.name,
          description: data.description || '',
        };

        if (isEditMode) {
          await workflowService.updateWorkflow(workflowId, payload);
          showSuccess('Workflow updated successfully');
        } else {
          await workflowService.createWorkflow(payload);
          showSuccess('Workflow created successfully');
        }

        if (onSuccess) {
          onSuccess();
        }
      } catch (error) {
        console.error('Error saving workflow:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to save workflow';
        showError(errorMessage);
      }
    },
    [workflowId, isEditMode, showSuccess, showError, onSuccess]
  );

  if (isLoading) {
    return <Loader />;
  }

  return (
    <SetupFormWrapper
      schema={WorkflowFormSchema}
      defaultValues={workflowData}
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      <WorkflowFormFields />
    </SetupFormWrapper>
  );
};
