import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { workflowService } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { workflowColumns } from './DataColumn';
import type { WorkflowTableRow } from '../../../../types/workflow';
import { WorkflowForm } from '../WorkflowForm/WorkflowForm';

export const WorkflowsList: React.FC = () => {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState<WorkflowTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch workflows
  const fetchWorkflows = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workflowService.getAllWorkflows();
      const workflowsData = Array.isArray(response.data) ? response.data : [];

      // Transform API response to table format and fetch steps count for each workflow
      const transformedData: WorkflowTableRow[] = await Promise.all(
        workflowsData.map(async (workflow) => {
          let stepCount = 0;
          try {
            const stepsResponse = await workflowService.getWorkflowSteps(workflow.id || 0);
            stepCount = Array.isArray(stepsResponse.data) ? stepsResponse.data.length : 0;
          } catch {
            // If fetching steps fails, keep stepCount as 0
          }
          return {
            id: workflow.id || 0,
            workflowRef: workflow.workflowRef,
            name: workflow.name || '',
            description: workflow.description,
            companyId: workflow.companyId,
            stepCount,
          };
        })
      );

      setWorkflows(transformedData);
    } catch (error) {
      console.error('Error fetching workflows:', error);
      showError(extractErrorMessage(error, 'Failed to load workflows'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  // Load workflows on mount
  useEffect(() => {
    fetchWorkflows();
  }, [fetchWorkflows]);

  // Handle add workflow
  const handleAddWorkflow = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addWorkflow',
      children: (
        <WorkflowForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchWorkflows();
          }}
        />
      ),
    });
  };

  // Handle row click - navigate to workflow builder
  const handleRowClick = useCallback(
    (workflow: WorkflowTableRow) => {
      navigate(`/company/workflows/${workflow.id}/builder`);
    },
    [navigate]
  );

  // Handle edit workflow
  const handleEditWorkflow = useCallback(
    (workflow: WorkflowTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editWorkflow',
        children: (
          <WorkflowForm
            isModal={true}
            workflowId={workflow.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchWorkflows();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchWorkflows]
  );

  // Handle archive workflow
  const handleArchiveWorkflow = useCallback(
    (workflow: WorkflowTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'archiveWorkflow',
        children: (
          <ConfirmationModal
            title="Archive Workflow"
            message={`Are you sure you want to archive "${workflow.name}"?`}
            description="Archived workflows are removed from the active list and cannot be assigned to new jobs."
            variant="default"
            confirmButtonText="Archive"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await workflowService.archiveWorkflow(workflow.id);
                showSuccess(`Workflow "${workflow.name}" archived successfully`);
                resetGlobalModalOuterProps();
                fetchWorkflows();
              } catch (error) {
                console.error('Error archiving workflow:', error);
                showError(extractErrorMessage(error, 'Failed to archive workflow'));
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
    [showSuccess, showError, fetchWorkflows, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Handle delete workflow
  const handleDeleteWorkflow = useCallback(
    (workflow: WorkflowTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteWorkflow',
        children: (
          <ConfirmationModal
            title="Delete Workfloow"
            message={`Are you sure you want to delete "${workflow.name}"?`}
            description="This action cannot be undone. All workflow data and steps will be permanently deleted."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await workflowService.deleteWorkflow(workflow.id);
                showSuccess(`Workfloow "${workflow.name}" deleted successfully`);
                resetGlobalModalOuterProps();
                fetchWorkflows();
              } catch (error) {
                console.error('Error deleting workflow:', error);
                const status = (error as { response?: { status?: number } }).response?.status;
                if (status === 409) {
                  showError(
                    'This workflow is used by active jobs. Archive or reassign those jobs before deleting the workflow.'
                  );
                } else {
                  showError(extractErrorMessage(error, 'Failed to delete workflow'));
                }
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
    [showSuccess, showError, fetchWorkflows, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Define table actions
  const tableActions: ITableAction<WorkflowTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditWorkflow,
      },
      {
        id: 'archive',
        label: 'Archive',
        onClick: handleArchiveWorkflow,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteWorkflow,
        color: 'error' as const,
      },
    ],
    [handleEditWorkflow, handleArchiveWorkflow, handleDeleteWorkflow]
  );

  return (
    <PageWrapper
      title="Workfloow Templates"
      description="Create and manage reusable workfloow templates for your jobs."
      actions={[
        {
          label: 'Create Workfloow',
          onClick: handleAddWorkflow,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search workfloows"
    >
      <Table<WorkflowTableRow>
        columns={workflowColumns}
        data={workflows}
        selectable
        showActions
        actions={tableActions}
        onRowClick={handleRowClick}
        loading={loading}
        emptyMessage="No workfloows found. Create your first workfloow template to get started."
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
