import React, { useCallback, useEffect, useState } from 'react';
import { WorkflowFormSchema, type WorkflowFormData } from '../../schema/WorkflowFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { Loader } from '../../../../components/UI';
import { workflowService } from '../../../../services/api';
import type { WorkflowCreateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { Box } from '@mui/material';
import { Input } from '../../../../components/UI/Forms/Input';
import { TextArea } from '../../../../components/UI/Forms/TextArea';

export interface WorkflowFormProps {
  isModal?: boolean;
  workflowId?: number;
  onSuccess?: () => void;
}

export const WorkflowForm: React.FC<WorkflowFormProps> = ({ isModal = false, workflowId, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();

  const [workflowData, setWorkflowData] = useState<Partial<WorkflowFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const isEditMode = !!workflowId;

  // Set modal title and button text based on mode
  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEditMode ? 'Edit Workflow' : 'Create New Workflow');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEditMode ? 'Update Workflow' : 'Create Workflow',
      });
    }
  }, [isModal, isEditMode, updateModalTitle, updateGlobalModalInnerConfig]);

  // Fetch workflow data when editing
  useEffect(() => {
    const fetchWorkflowData = async () => {
      if (workflowId) {
        try {
          setIsLoading(true);
          const response = await workflowService.getWorkflowById(workflowId);
          const workflow = response.data;

          const formData: Partial<WorkflowFormData> = {
            name: workflow.name || '',
            description: workflow.description || '',
          };

          setWorkflowData(formData);
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
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Input
          name="name"
          label="Workflow Name"
          placeholder="Enter workflow name"
          required
        />
        <TextArea
          name="description"
          label="Description"
          placeholder="Enter workflow description (optional)"
          rows={4}
        />
        {!isEditMode && (
          <Box sx={{ mt: 1, color: 'text.secondary', fontSize: '0.875rem' }}>
            Note: After creating the workflow, you'll be able to add steps using the drag-and-drop builder.
          </Box>
        )}
      </Box>
    </SetupFormWrapper>
  );
};
