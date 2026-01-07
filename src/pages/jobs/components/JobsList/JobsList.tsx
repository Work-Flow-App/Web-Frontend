import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { jobService, jobTemplateService, companyClientService, workerService, assetService } from '../../../../services/api';
import type { JobResponse, JobTemplateResponse, JobTemplateFieldResponse, ClientResponse, WorkerResponse, AssetResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { generateJobColumns, type JobTableRow } from './DataColumn';
import { JobForm } from '../JobForm/JobForm';

export const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState<JobTableRow[]>([]);
  const [templates, setTemplates] = useState<JobTemplateResponse[]>([]);
  const [clients, setClients] = useState<ClientResponse[]>([]);
  const [workers, setWorkers] = useState<WorkerResponse[]>([]);
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingTemplates, setLoadingTemplates] = useState(true);
  const [hasShownNoTemplateModal, setHasShownNoTemplateModal] = useState(false);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch templates, clients, and workers on mount
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

    const fetchClients = async () => {
      try {
        const response = await companyClientService.getAllClients();
        const clientsData = Array.isArray(response.data) ? response.data : [];
        setClients(clientsData);
      } catch (error) {
        console.error('Error fetching clients:', error);
      }
    };

    const fetchWorkers = async () => {
      try {
        const response = await workerService.getAllWorkers();
        const workersData = Array.isArray(response.data) ? response.data : [];
        setWorkers(workersData);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };

    const fetchAssets = async () => {
      try {
        const response = await assetService.getAllAssets(0, 1000);
        const assetsData = response.data.content || [];
        setAssets(assetsData);
      } catch (error) {
        console.error('Error fetching assets:', error);
      }
    };

    fetchTemplates();
    fetchClients();
    fetchWorkers();
    fetchAssets();
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
      // Use template-specific API if a template is selected
      const response = selectedTemplateId
        ? await jobService.getJobsByTemplate(selectedTemplateId)
        : await jobService.getAllJobs();
      const jobsData = Array.isArray(response.data) ? response.data : [];

      // Transform API response to table format
      const transformedData: JobTableRow[] = jobsData.map((job: JobResponse) => {
        const template = templates.find((t) => t.id === job.templateId);
        const client = clients.find((c) => c.id === job.clientId);
        const worker = workers.find((w) => w.id === job.assignedWorkerId);

        // Extract values from FieldValueResponse objects
        const fieldValues: { [key: string]: string } = {};
        if (job.fieldValues) {
          Object.entries(job.fieldValues).forEach(([key, fieldValueResponse]) => {
            if (fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse) {
              fieldValues[key] = String(fieldValueResponse.value);
            } else if (fieldValueResponse) {
              fieldValues[key] = String(fieldValueResponse);
            }
          });
        }

        // Map asset IDs to asset names
        const assetNames = job.assetIds && job.assetIds.length > 0
          ? job.assetIds
              .map(assetId => assets.find(a => a.id === assetId)?.name)
              .filter(Boolean)
              .join(', ')
          : undefined;

        return {
          id: job.id || 0,
          templateId: job.templateId,
          templateName: template?.name || '-',
          clientId: job.clientId,
          clientName: client?.name || '-',
          assignedWorkerId: job.assignedWorkerId,
          workerName: worker?.name || '-',
          status: job.status || '-',
          createdAt: job.createdAt || new Date().toISOString(),
          fieldValues,
          assetIds: job.assetIds,
          assetNames,
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
  }, [selectedTemplateId, templates, clients, workers, assets, showError]);

  // Load jobs when template changes
  useEffect(() => {
    if (!loadingTemplates) {
      fetchJobs();
    }
  }, [selectedTemplateId, loadingTemplates, fetchJobs]);

  // Show "No Templates Available" modal when page loads if no templates exist
  useEffect(() => {
    if (!loadingTemplates && templates.length === 0 && !hasShownNoTemplateModal) {
      setHasShownNoTemplateModal(true);
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'noTemplateWarning',
        children: (
          <ConfirmationModal
            title="No Templates Available"
            message="You need to create a job template before you can manage jobs."
            description="Job templates define the structure and fields for your jobs. Would you like to create a template now?"
            variant="default"
            confirmButtonText="Create Template"
            cancelButtonText="Cancel"
            onConfirm={() => {
              resetGlobalModalOuterProps();
              navigate('/company/jobs/templates?openAddModal=true');
            }}
            onCancel={() => {
              resetGlobalModalOuterProps();
            }}
          />
        ),
      });
    }
  }, [loadingTemplates, templates.length, hasShownNoTemplateModal, setGlobalModalOuterProps, resetGlobalModalOuterProps, navigate]);

  // Handle add job
  const handleAddJob = () => {
    // Check if templates exist
    if (templates.length === 0) {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'noTemplateWarning',
        children: (
          <ConfirmationModal
            title="No Templates Available"
            message="You need to create a job template before creating a job."
            description="Job templates define the structure and fields for your jobs. Would you like to create a template now?"
            variant="default"
            confirmButtonText="Create Template"
            cancelButtonText="Cancel"
            onConfirm={() => {
              resetGlobalModalOuterProps();
              // Navigate to templates page
              navigate('/company/jobs/templates?openAddModal=true');
            }}
            onCancel={() => {
              resetGlobalModalOuterProps();
            }}
          />
        ),
      });
      return;
    }

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

  // Handle row click - navigate to job details
  const handleRowClick = useCallback(
    (job: JobTableRow) => {
      navigate(`/company/jobs/${job.id}/details`);
    },
    [navigate]
  );

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
        onRowClick={handleRowClick}
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
