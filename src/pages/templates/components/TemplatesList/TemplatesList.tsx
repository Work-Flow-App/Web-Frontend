import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/UI/GlobalModal';
import { jobTemplateService, jobService } from '../../../../services/api';
import type { JobTemplateResponse, JobResponse, JobTemplateFieldResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { generateTemplateColumns, type TemplateTableRow } from './DataColumn';
import { TemplateForm } from '../TemplateForm/TemplateForm';
import { TemplateFields } from '../TemplateFields/TemplateFields';

export const TemplatesList: React.FC = () => {
  const [templates, setTemplates] = useState<TemplateTableRow[]>([]);
  const [jobs, setJobs] = useState<JobResponse[]>([]);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
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

  // Fetch all unique fields across all templates
  const fetchAllTemplateFields = useCallback(async () => {
    try {
      const response = await jobTemplateService.getAllTemplates();
      const templatesData = Array.isArray(response.data) ? response.data : [];

      // Collect all unique fields from all templates
      const allFieldsMap = new Map<string, JobTemplateFieldResponse>();

      await Promise.all(
        templatesData.map(async (template: JobTemplateResponse) => {
          try {
            const fieldsResponse = await jobTemplateService.getTemplateFields(template.id || 0);
            const fieldsData = Array.isArray(fieldsResponse.data) ? fieldsResponse.data : [];

            // Add unique fields to map
            fieldsData.forEach((field) => {
              if (field.name && !allFieldsMap.has(field.name)) {
                allFieldsMap.set(field.name, field);
              }
            });
          } catch (error) {
            console.error(`Error fetching fields for template ${template.id}:`, error);
          }
        })
      );

      // Convert map to array and sort by orderIndex
      const uniqueFields = Array.from(allFieldsMap.values()).sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );

      setTemplateFields(uniqueFields);
    } catch (error) {
      console.error('Error fetching template fields:', error);
    }
  }, []);

  // Fetch templates with their field values
  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobTemplateService.getAllTemplates();
      const templatesData = Array.isArray(response.data) ? response.data : [];

      // Fetch fields for each template and build field values
      const transformedData: TemplateTableRow[] = await Promise.all(
        templatesData.map(async (template: JobTemplateResponse) => {
          const fieldValues: { [key: string]: string } = {};

          try {
            const fieldsResponse = await jobTemplateService.getTemplateFields(template.id || 0);
            const fieldsData = Array.isArray(fieldsResponse.data) ? fieldsResponse.data : [];

            // Populate field values (currently empty, can be populated from template data if available)
            fieldsData.forEach((field) => {
              if (field.name) {
                fieldValues[field.name] = ''; // Empty for now - can be populated with actual values
              }
            });
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
            fieldValues,
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
      fetchAllTemplateFields();
      fetchTemplates();
    }
  }, [jobs, fetchAllTemplateFields, fetchTemplates]);

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
            fetchAllTemplateFields();
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
              fetchAllTemplateFields();
              fetchTemplates();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchAllTemplateFields, fetchTemplates]
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
        fetchAllTemplateFields();
        fetchTemplates();
      } catch (error) {
        console.error('Error deleting template:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete template';
        showError(errorMessage);
      }
    },
    [showSuccess, showError, fetchAllTemplateFields, fetchTemplates]
  );

  // Handle manage fields
  const handleManageFields = useCallback(
    (template: TemplateTableRow) => {
      setSelectedTemplateId(template.id);
    },
    []
  );

  // Define table actions
  const tableActions: ITableAction<TemplateTableRow>[] = useMemo(
    () => [
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
        disabled: (row) => row.jobCount > 0,
      },
    ],
    [handleManageFields, handleEditTemplate, handleDeleteTemplate]
  );

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  // Memoize columns to ensure they update when templateFields changes
  const tableColumns = useMemo(() => {
    return generateTemplateColumns(templateFields);
  }, [templateFields]);

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

      {selectedTemplateId && selectedTemplate && (
        <TemplateFields
          templateId={selectedTemplateId}
          templateName={selectedTemplate.name}
          onFieldsChange={() => {
            fetchAllTemplateFields();
            fetchTemplates();
          }}
        />
      )}
    </PageWrapper>
  );
};
