import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { jobTemplateService, jobService } from '../../../../services/api';
import type { JobTemplateResponse, JobResponse, JobTemplateFieldResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { generateTemplateColumns, type TemplateTableRow } from './DataColumn';
import { TemplateForm } from '../TemplateForm/TemplateForm';

export const TemplatesList: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateTableRow[]>([]);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps} = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch jobs for counting
  const fetchJobs = useCallback(async () => {
    try {
      const response = await jobService.getAllJobs();
      const jobsData = Array.isArray(response.data) ? response.data : [];
      setJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  }, []);

  // Fetch templates with their fields
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobTemplateService.getAllTemplates();
      const templatesData = Array.isArray(response.data) ? response.data : [];

      // Fetch fields for each template
      const transformedData: TemplateTableRow[] = await Promise.all(
        templatesData.map(async (template: JobTemplateResponse) => {
          let fields: JobTemplateFieldResponse[] = [];

          try {
            const fieldsResponse = await jobTemplateService.getTemplateFields(template.id || 0);
            fields = Array.isArray(fieldsResponse.data) ? fieldsResponse.data : [];
          } catch (error) {
            console.error(`Error fetching fields for template ${template.id}:`, error);
          }

          const jobCount = jobs.filter((job) => job.templateId === template.id).length;

          return {
            id: template.id || 0,
            name: template.name || '',
            description: template.description,
            jobCount,
            createdAt: template.createdAt || new Date().toISOString(),
            fields,
            isDefault: template.default || false,
          };
        })
      );

      setTemplates(transformedData);
    } catch (error) {
      console.error('Error fetching templates:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load templates';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [jobs, showError]);

  // Load data on mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (jobs.length >= 0) {
      fetchTemplates();
    }
  }, [jobs, fetchTemplates]);

  // Handle add template
  const handleAddTemplate = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addTemplate',
      children: (
        <TemplateForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchTemplates();
          }}
        />
      ),
    });
  }, [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchTemplates]);

  // Check if we should auto-open the add template modal
  useEffect(() => {
    const shouldOpenModal = searchParams.get('openAddModal') === 'true';
    if (shouldOpenModal && !loading) {
      // Remove the parameter from URL
      searchParams.delete('openAddModal');
      setSearchParams(searchParams, { replace: true });

      // Open the add template modal
      handleAddTemplate();
    }
  }, [searchParams, setSearchParams, loading, handleAddTemplate]);

  // Handle edit template
  const handleEditTemplate = useCallback(
    (template: TemplateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editTemplate',
        children: (
          <TemplateForm
            isModal={true}
            templateId={template.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchTemplates();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchTemplates]
  );

  // Handle delete template
  const handleDeleteTemplate = useCallback(
    (template: TemplateTableRow) => {
      if (template.jobCount > 0) {
        showError(`Cannot delete template "${template.name}" because it has ${template.jobCount} job(s) using it.`);
        return;
      }

      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteTemplate',
        children: (
          <ConfirmationModal
            title="Delete Template"
            message={`Are you sure you want to delete template "${template.name}"?`}
            description="This action cannot be undone. All fields associated with this template will also be deleted."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await jobTemplateService.deleteTemplate(template.id);
                showSuccess(`Template "${template.name}" deleted successfully`);
                resetGlobalModalOuterProps();
                fetchTemplates();
              } catch (error) {
                console.error('Error deleting template:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
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
    [showSuccess, showError, fetchTemplates, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Handle manage fields
  const handleManageFields = useCallback(
    (template: TemplateTableRow) => {
      navigate(`/company/jobs/templates/${template.id}/fields`);
    },
    [navigate]
  );

  // Handle set as default
  const handleSetAsDefault = useCallback(
    (template: TemplateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'setDefaultTemplate',
        children: (
          <ConfirmationModal
            title="Set Default Template"
            message={`Set "${template.name}" as the default template?`}
            description="This will replace the current default template for your company."
            variant="default"
            confirmButtonText="Set as Default"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await jobTemplateService.updateTemplate(template.id, {
                  name: template.name,
                  description: template.description,
                  isDefault: true,
                });
                showSuccess(`"${template.name}" is now the default template`);
                resetGlobalModalOuterProps();
                fetchTemplates();
              } catch (error) {
                console.error('Error setting default template:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to set default template';
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
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchTemplates, showSuccess, showError]
  );

  // Define table actions
  const tableActions: ITableAction<TemplateTableRow>[] = useMemo(
    () => [
      {
        id: 'setDefault',
        label: 'Set as Default',
        onClick: handleSetAsDefault,
        color: 'primary' as const,
        show: (row) => !row.isDefault,
      },
      {
        id: 'manageFields',
        label: 'Manage Fields',
        onClick: handleManageFields,
        color: 'primary' as const,
      },
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditTemplate,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteTemplate,
        color: 'error' as const,
        disabled: (row) => row.jobCount > 0 || !!row.isDefault,
      },
    ],
    [handleManageFields, handleEditTemplate, handleDeleteTemplate, handleSetAsDefault]
  );

  // Handle template name click
  const handleTemplateNameClick = useCallback(
    (templateId: number) => {
      navigate(`/company/jobs/templates/${templateId}/fields`);
    },
    [navigate]
  );

  // Memoize columns to ensure they update when templateFields changes
  const tableColumns = useMemo(() => {
    return generateTemplateColumns(handleTemplateNameClick);
  }, [handleTemplateNameClick]);

  return (
    <PageWrapper
      title="Job Templates"
      description="Create and manage job templates with custom fields."
      actions={[
        {
          label: 'Add Template',
          onClick: handleAddTemplate,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      showSearch
      searchPlaceholder="Search templates"
    >
      <Table<TemplateTableRow>
        columns={tableColumns}
        data={templates}
        selectable
        showActions
        actions={tableActions}
        loading={loading}
        emptyMessage="No templates found. Add your first template to get started."
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
