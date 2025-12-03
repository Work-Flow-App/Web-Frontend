import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/UI/GlobalModal';
import { jobTemplateService, jobService } from '../../../../services/api';
import type { JobTemplateResponse, JobResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { columns, type TemplateTableRow } from './DataColumn';
import { TemplateForm } from '../TemplateForm/TemplateForm';
import { TemplateFields } from '../TemplateFields/TemplateFields';

export const TemplatesList: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateTableRow[]>([]);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
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

  // Fetch templates
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobTemplateService.getAllTemplates();
      const templatesData = Array.isArray(response.data) ? response.data : [];

      // Fetch field counts for each template
      const transformedData: TemplateTableRow[] = await Promise.all(
        templatesData.map(async (template: JobTemplateResponse) => {
          let fieldCount = 0;
          try {
            const fieldsResponse = await jobTemplateService.getTemplateFields(template.id || 0);
            const fieldsData = Array.isArray(fieldsResponse.data) ? fieldsResponse.data : [];
            fieldCount = fieldsData.length;
          } catch (error) {
            console.error(`Error fetching fields for template ${template.id}:`, error);
          }

          const jobCount = jobs.filter((job) => job.templateId === template.id).length;

          return {
            id: template.id || 0,
            name: template.name || '',
            description: template.description,
            fieldCount,
            jobCount,
            createdAt: template.createdAt || new Date().toISOString(),
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

  // Load jobs first, then templates
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  useEffect(() => {
    if (jobs.length >= 0) {
      fetchTemplates();
    }
  }, [jobs, fetchTemplates]);

  // Handle add template
  const handleAddTemplate = () => {
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
  };

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
    async (template: TemplateTableRow) => {
      if (template.jobCount > 0) {
        showError(`Cannot delete template "${template.name}" because it has ${template.jobCount} job(s) using it.`);
        return;
      }

      if (!window.confirm(`Are you sure you want to delete template "${template.name}"?`)) {
        return;
      }

      try {
        await jobTemplateService.deleteTemplate(template.id);
        showSuccess(`Template "${template.name}" deleted successfully`);
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
        showError(errorMessage);
      }
    },
    [showSuccess, showError, fetchTemplates]
  );

  // Handle view/manage fields
  const handleViewFields = useCallback(
    (template: TemplateTableRow) => {
      setSelectedTemplateId(template.id);
    },
    []
  );

  // Define table actions
  const tableActions: ITableAction<TemplateTableRow>[] = useMemo(
    () => [
      {
        id: 'viewFields',
        label: 'Manage Fields',
        onClick: handleViewFields,
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
        disabled: (row) => row.jobCount > 0,
      },
    ],
    [handleViewFields, handleEditTemplate, handleDeleteTemplate]
  );

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

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
        columns={columns}
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

      {selectedTemplateId && selectedTemplate && (
        <TemplateFields templateId={selectedTemplateId} templateName={selectedTemplate.name} />
      )}
    </PageWrapper>
  );
};
