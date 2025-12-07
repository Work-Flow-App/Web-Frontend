import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { jobService, jobTemplateService } from '../../../../services/api';
import type { JobResponse, JobTemplateResponse, JobTemplateFieldResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { generateJobColumns, type JobTableRow } from './DataColumn';
import { JobForm } from '../JobForm/JobForm';

export const JobsList: React.FC = () => {
  const [jobs, setJobs] = useState<JobTableRow[]>([]);
  const [templates, setTemplates] = useState<JobTemplateResponse[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch templates on mount
  useEffect(() => {
    const fetchTemplates = async () => {
      try {
        setLoadingTemplates(true);
        const response = await jobTemplateService.getAllTemplates();
        const templatesData = Array.isArray(response.data) ? response.data : [];
        setTemplates(templatesData);
      } catch (error) {
        console.error('Error fetching templates:', error);
        showError('Failed to load templates');
      } finally {
        setLoadingTemplates(false);
      }
    };

    fetchTemplates();
  }, [showError]);

  // Fetch template fields when template is selected
  useEffect(() => {
    const fetchTemplateFields = async () => {
      if (!selectedTemplateId) {
        setTemplateFields([]);
        return;
      }

      try {
        const response = await jobTemplateService.getTemplateFields(selectedTemplateId);
        const fieldsData = Array.isArray(response.data) ? response.data : [];
        setTemplateFields(fieldsData);
      } catch (error) {
        console.error('Error fetching template fields:', error);
        showError('Failed to load template fields');
        setTemplateFields([]);
      }
    };

    fetchTemplateFields();
  }, [selectedTemplateId, showError]);

  // Fetch jobs based on selected template
  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobService.getAllJobs();
      const jobsData = Array.isArray(response.data) ? response.data : [];

      // Filter by selected template if any
      const filteredJobs = selectedTemplateId
        ? jobsData.filter((job: JobResponse) => job.templateId === selectedTemplateId)
        : jobsData;

      // Transform API response to table format
      const transformedData: JobTableRow[] = filteredJobs.map((job: JobResponse) => {
        const template = templates.find((t) => t.id === job.templateId);

        return {
          id: job.id || 0,
          templateId: job.templateId,
          templateName: template?.name || '-',
          clientId: job.clientId,
          clientName: '-', // TODO: Fetch client name from client service when available
          assignedWorkerId: job.assignedWorkerId,
          workerName: '-', // TODO: Fetch worker name from worker service when available
          status: job.status || '-',
          createdAt: job.createdAt || new Date().toISOString(),
          fieldValues: job.fieldValues || {},
        };
      });

      setJobs(transformedData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to load jobs';
      showError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [selectedTemplateId, templates, showError]);

  // Load jobs when template changes
  useEffect(() => {
    if (!loadingTemplates) {
      fetchJobs();
    }
  }, [selectedTemplateId, loadingTemplates, fetchJobs]);

  // Handle add job
  const handleAddJob = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addJob',
      children: (
        <JobForm
          isModal={true}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchJobs();
          }}
        />
      ),
    });
  };

  // Handle edit job
  const handleEditJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editJob',
        children: (
          <JobForm
            isModal={true}
            jobId={job.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchJobs();
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchJobs]
  );

  // Handle delete job
  const handleDeleteJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteJob',
        children: (
          <ConfirmationModal
            title="Delete Job"
            message={`Are you sure you want to delete Job #${job.id}?`}
            description="This action cannot be undone. All data associated with this job will be permanently deleted."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await jobService.deleteJob(job.id);
                showSuccess(`Job #${job.id} deleted successfully`);
                resetGlobalModalOuterProps();
                fetchJobs();
              } catch (error) {
                console.error('Error deleting job:', error);
                const errorMessage = error instanceof Error ? error.message : 'Failed to delete job';
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
    [showSuccess, showError, fetchJobs, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  // Define table actions
  const tableActions: ITableAction<JobTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditJob,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteJob,
        color: 'error' as const,
      },
    ],
    [handleEditJob, handleDeleteJob]
  );

  // Generate columns based on selected template fields
  const columns = useMemo(() => {
    return generateJobColumns(templateFields);
  }, [templateFields]);

  // Template dropdown options
  const templateOptions = useMemo(() => {
    return templates.map((template) => ({
      label: template.name || '',
      value: template.id?.toString() || '',
    }));
  }, [templates]);

  return (
    <PageWrapper
      title="All Jobs"
      description="Manage jobs, assign workers, and track progress."
      actions={[
        {
          label: 'Add Job',
          onClick: handleAddJob,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      dropdownOptions={templateOptions}
      dropdownValue={selectedTemplateId?.toString()}
      dropdownPlaceholder="All Jobs (No Template Filter)"
      onDropdownChange={(value) => setSelectedTemplateId(value ? Number(value) : null)}
      showSearch
      searchPlaceholder="Search jobs"
    >
      <Table<JobTableRow>
        columns={columns}
        data={jobs}
        selectable
        showActions
        actions={tableActions}
        loading={loading || loadingTemplates}
        emptyMessage={
          selectedTemplateId
            ? 'No jobs found for this template. Add your first job to get started.'
            : 'No jobs found. Add your first job to get started.'
        }
        rowsPerPage={10}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
