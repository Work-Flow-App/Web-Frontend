import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import type { ViewTab } from './JobFilterPanel';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { Search } from '../../../../components/UI/Search';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { isAddressField, parseAddressFieldValue } from '../../../../utils/customAddressField';
import {
  jobService,
  jobTemplateService,
  assetService,
  customerService,
  companyClientService,
  workflowService,
} from '../../../../services/api';
import type {
  JobResponse,
  JobCreateRequest,
  JobTemplateFieldResponse,
  AssetResponse,
  PagedModelAssetResponse,
  CustomerResponse,
  ClientResponse,
  WorkflowResponse,
  JobFilters,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { generateJobColumns, type JobTableRow } from './DataColumn';
import { AddJobWizard } from '../AddJobWizard';
import { useFetch, useCanMutate } from '../../../../hooks';
import { JobFilterPanel } from './JobFilterPanel';
import { FilterChip, ClearAllChip } from './JobsList.styles';
import {
  HeaderControls,
  FilterButtonWrapper,
  FilterCountBadge,
  FilterTuneIcon,
  ChipsRow,
} from './JobFilterPanel.styles';
import { IconButton } from '../../../../components/UI/Button';
import { Badge } from '../../../../components/UI/Badge';
import { JOB_STATUS_OPTIONS } from '../../../../enums';

export const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewTab, setViewTab] = useState<ViewTab>(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'completed' || tabParam === 'archived') {
      return tabParam;
    }
    return 'active';
  });

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam === 'completed' || tabParam === 'archived') {
      setViewTab(tabParam);
      // Clean query parameter
      searchParams.delete('tab');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [hasShownNoTemplateModal, setHasShownNoTemplateModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKey, setSearchKey] = useState(0);
  const [filters, setFilters] = useState<JobFilters>({});
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedJobIds, setSelectedJobIds] = useState<(string | number)[]>([]);
  const [highlightedJobId, setHighlightedJobId] = useState<string | number | undefined>(undefined);

  const location = useLocation();
  const hasAutoOpened = useRef(false);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const { canMutate, reason } = useCanMutate();

  // Read highlightJobId from localStorage
  useEffect(() => {
    const savedId = localStorage.getItem('highlightJobId');
    if (savedId) {
      // Use Number or String depending on format, job IDs are numbers
      setHighlightedJobId(Number(savedId));
      localStorage.removeItem('highlightJobId');
    }
  }, []);

  // Debounce search input → searchQuery (triggers API refetch)
  useEffect(() => {
    const t = setTimeout(() => setSearchQuery(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: templatesData, loading: loadingTemplates } = useFetch(() => jobTemplateService.getAllTemplates(), [], {
    onError: () => showError('Failed to load templates'),
  });
  const templates = useMemo(() => templatesData ?? [], [templatesData]);

  const { data: assetsPage } = useFetch<PagedModelAssetResponse>(() => assetService.getAllAssets(0, 1000), [], {
    onError: (error) => console.error('Error fetching assets:', error),
  });
  const assets = useMemo<AssetResponse[]>(() => assetsPage?.content ?? [], [assetsPage]);

  const { data: customersData } = useFetch<CustomerResponse[]>(() => customerService.getAllCustomers(), [], {
    onError: (error) => console.error('Error fetching customers:', error),
  });
  const customers = useMemo<CustomerResponse[]>(() => customersData ?? [], [customersData]);

  const { data: clientsData } = useFetch<ClientResponse[]>(() => companyClientService.getAllClients(), [], {
    onError: (error) => console.error('Error fetching clients:', error),
  });
  const clients = useMemo<ClientResponse[]>(() => clientsData ?? [], [clientsData]);

  const { data: workflowsData } = useFetch<WorkflowResponse[]>(() => workflowService.getAllWorkflows(), [], {
    onError: (error) => console.error('Error fetching workflows:', error),
  });
  const workflows = useMemo<WorkflowResponse[]>(() => workflowsData ?? [], [workflowsData]);

  // Resolve template ID from active template name filter (drives dynamic columns)
  const filteredTemplateId = useMemo(
    () => (filters.templateName ? (templates.find((t) => t.name === filters.templateName)?.id ?? null) : null),
    [filters.templateName, templates]
  );

  const { data: templateFieldsData } = useFetch<JobTemplateFieldResponse[]>(
    () => jobTemplateService.getTemplateFields(filteredTemplateId!),
    [filteredTemplateId],
    {
      skip: !filteredTemplateId,
      onError: (error) => showError(extractErrorMessage(error, 'Failed to load template fields')),
    }
  );
  const templateFields = useMemo(() => templateFieldsData ?? [], [templateFieldsData]);

  // Stable filter object passed to getAllJobs — only changes when filters or searchQuery change
  const apiFilters = useMemo<JobFilters>(
    () => ({ ...filters, search: searchQuery || undefined }),
    [filters, searchQuery]
  );

  const {
    data: rawJobs,
    loading,
    refetch: fetchJobs,
  } = useFetch<JobResponse[]>(
    () => {
      if (viewTab === 'archived') return jobService.getArchivedJobs();
      if (viewTab === 'completed') return jobService.getAllJobs({ ...apiFilters, status: 'COMPLETED' });
      return jobService.getAllJobs(apiFilters);
    },
    [viewTab, apiFilters],
    {
      skip: loadingTemplates,
      onError: (error) => showError(extractErrorMessage(error, 'Failed to load jobs')),
    }
  );

  const jobs = useMemo<JobTableRow[]>(() => {
    const fieldsById = new Map(templateFields.filter((f) => f.id != null).map((f) => [String(f.id), f]));
    const mapped = (rawJobs ?? []).map((job: JobResponse) => {
      const fieldValues: { [key: string]: unknown } = {};
      if (job.fieldValues) {
        Object.entries(job.fieldValues).forEach(([key, fieldValueResponse]) => {
          // Preserve address fields as structured objects — String()-flattening here is what corrupted DataColumn's display before this fix.
          if (isAddressField(fieldsById.get(key))) {
            const parsed = parseAddressFieldValue(fieldValueResponse);
            if (parsed) fieldValues[key] = parsed;
            return;
          }
          if (fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse) {
            fieldValues[key] = String(fieldValueResponse.value);
          } else if (fieldValueResponse) {
            fieldValues[key] = String(fieldValueResponse);
          }
        });
      }

      const assetNames =
        job.assetIds && job.assetIds.length > 0
          ? job.assetIds
              .map((assetId) => assets.find((a) => a.id === assetId)?.name)
              .filter(Boolean)
              .join(', ')
          : undefined;

      const templateName = job.templateName || templates.find((t) => t.id === job.templateId)?.name || '-';
      const customerName = job.customerName || customers.find((c) => c.id === job.customerId)?.name || '-';
      const clientName = job.clientName || clients.find((c) => c.id === job.clientId)?.name || '-';
      const workflowName = job.workflowName || workflows.find((w) => w.id === job.workflowId)?.name || '-';

      return {
        id: job.id || 0,
        jobRef: job.jobRef,
        templateId: job.templateId,
        templateName,
        customerId: job.customerId,
        customerName,
        workflowName,
        clientName,
        jobValue: job.estimateTotalNet?.toString() || '-',
        postCode: job.address?.postalCode || '-',
        status: job.status || '-',
        createdAt: job.createdAt || new Date().toISOString(),
        fieldValues,
        assetIds: job.assetIds,
        assetNames,
      };
    });
    // In Active tab, filter out completed jobs (they have their own tab)
    if (viewTab === 'active') {
      return mapped.filter((job) => job.status !== 'COMPLETED');
    }
    return mapped;
  }, [rawJobs, assets, templates, customers, clients, workflows, viewTab, templateFields]);

  // No-template modal on first load
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
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    }
  }, [
    loadingTemplates,
    templates.length,
    hasShownNoTemplateModal,
    setGlobalModalOuterProps,
    resetGlobalModalOuterProps,
    navigate,
  ]);

  const handleAddJob = useCallback(() => {
    if (!canMutate) {
      showError(reason ?? 'Your subscription is inactive.');
      return;
    }

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
              navigate('/company/jobs/templates?openAddModal=true');
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
      return;
    }
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'addJob',
      children: (
        <AddJobWizard
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchJobs();
          }}
        />
      ),
    });
  }, [canMutate, reason, templates, navigate, setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchJobs, showError]);

  // Automatically trigger job creation modal if ?openAddModal=true query parameter is present in URL
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (
      queryParams.get('openAddModal') === 'true' &&
      !loadingTemplates &&
      templatesData !== undefined &&
      !hasAutoOpened.current
    ) {
      hasAutoOpened.current = true;
      // Clear the query parameter immediately to avoid duplicate popups on reload
      navigate('/company/jobs', { replace: true });
      handleAddJob();
    }
  }, [location.search, loadingTemplates, templatesData, navigate, handleAddJob]);

  const handleRowClick = useCallback((job: JobTableRow) => navigate(`/company/jobs/${job.id}/details`), [navigate]);

  const handleEditJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.LARGE,
        fieldName: 'editJob',
        children: (
          <AddJobWizard
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

  const handleDeleteJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteJob',
        children: (
          <ConfirmationModal
            title="Delete Job"
            message={`Are you sure you want to delete Job #${job.jobRef ?? job.id}?`}
            description="This action is permanent and cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await jobService.deleteJob(job.id);
                showSuccess(`Job #${job.jobRef ?? job.id} deleted successfully`);
                resetGlobalModalOuterProps();
                fetchJobs();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete job'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, fetchJobs, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const handleArchiveJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'archiveJob',
        children: (
          <ConfirmationModal
            title="Archive Job"
            message={`Are you sure you want to archive Job #${job.id}?`}
            description="Archived jobs are removed from the active list."
            variant="default"
            confirmButtonText="Archive"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await jobService.archiveJob(job.id);
                showSuccess(`Job #${job.id} archived successfully`);
                resetGlobalModalOuterProps();
                fetchJobs();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to archive job'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, fetchJobs, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const handleBulkArchive = useCallback(() => {
    if (selectedJobIds.length === 0) {
      showError('No jobs selected to archive.');
      return;
    }

    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'bulkArchiveJobs',
      children: (
        <ConfirmationModal
          title="Archive All Marked Jobs"
          message={`Are you sure you want to archive ${selectedJobIds.length} job(s)?`}
          description="This will archive the selected jobs and remove them from the active list."
          variant="default"
          confirmButtonText="Archive"
          cancelButtonText="Cancel"
          onConfirm={async () => {
            try {
              await Promise.all(selectedJobIds.map((id) => jobService.archiveJob(Number(id))));
              showSuccess(`Successfully archived ${selectedJobIds.length} job(s)`);
              setSelectedJobIds([]);
              resetGlobalModalOuterProps();
              fetchJobs();
            } catch (error) {
              showError(extractErrorMessage(error, 'Failed to archive jobs'));
              resetGlobalModalOuterProps();
            }
          }}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  }, [selectedJobIds, fetchJobs, showSuccess, showError, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  const handleRestoreJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'restoreJob',
        children: (
          <ConfirmationModal
            title="Restore Job"
            message={`Are you sure you want to restore Job #${job.jobRef ?? job.id}?`}
            description="This will restore the job back to the active list."
            variant="default"
            confirmButtonText="Restore"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await jobService.restoreJob(job.id);
                showSuccess(`Job #${job.jobRef ?? job.id} restored successfully`);
                resetGlobalModalOuterProps();
                fetchJobs();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to restore job'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, fetchJobs, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const handleDuplicateJob = useCallback(
    (job: JobTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'duplicateJob',
        children: (
          <ConfirmationModal
            title="Duplicate Job"
            message={`Are you sure you want to duplicate Job #${job.jobRef ?? job.id}?`}
            description="This will create a new job with the same template, client, customer, workflow, address, custom field values, assets, and assigned workers, but set to the initial status 'NEW'."
            variant="default"
            confirmButtonText="Duplicate"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                const res = await jobService.getJobById(job.id);
                const jobDetails = res.data;

                const mappedFieldValues: { [key: string]: any } = {};
                if (jobDetails.fieldValues) {
                  Object.entries(jobDetails.fieldValues).forEach(([key, fieldValueResponse]) => {
                    if (fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse) {
                      mappedFieldValues[key] = fieldValueResponse.value;
                    } else {
                      mappedFieldValues[key] = fieldValueResponse;
                    }
                  });
                }

                const duplicateRequest: JobCreateRequest = {
                  templateId: jobDetails.templateId!,
                  clientId: jobDetails.clientId,
                  customerId: jobDetails.customerId,
                  workflowId: jobDetails.workflowId,
                  assignedWorkerIds: jobDetails.assignedWorkerIds,
                  status: 'NEW',
                  fieldValues: mappedFieldValues,
                  assetIds: jobDetails.assetIds,
                  address: jobDetails.address ? {
                    street: jobDetails.address.street,
                    city: jobDetails.address.city,
                    state: jobDetails.address.state,
                    postalCode: jobDetails.address.postalCode,
                    country: jobDetails.address.country,
                    additionalInfo: jobDetails.address.additionalInfo,
                    latitude: jobDetails.address.latitude,
                    longitude: jobDetails.address.longitude,
                  } : undefined,
                };

                await jobService.createJob(duplicateRequest);
                showSuccess(`Job #${job.jobRef ?? job.id} duplicated successfully`);
                resetGlobalModalOuterProps();
                fetchJobs();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to duplicate job'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, fetchJobs, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const tableActions: ITableAction<JobTableRow>[] = useMemo(
    () => {
      if (viewTab === 'archived') {
        return [
          { id: 'restore', label: 'Restore', onClick: handleRestoreJob },
          { id: 'delete', label: 'Delete', onClick: handleDeleteJob, color: 'error' as const },
        ];
      }
      return [
        { id: 'edit', label: 'Edit', onClick: handleEditJob },
        { id: 'duplicate', label: 'Duplicate', onClick: handleDuplicateJob },
        { id: 'archive', label: 'Archive', onClick: handleArchiveJob, color: 'error' as const },
      ];
    },
    [handleEditJob, handleDuplicateJob, handleArchiveJob, handleDeleteJob, handleRestoreJob, viewTab]
  );

  const columns = useMemo(() => generateJobColumns(templateFields), [templateFields]);

  // Dropdown options for the filter panel (value = name, since API takes name strings)
  const templateOptions = useMemo(
    () => templates.map((t) => ({ label: t.name || '', value: t.name || '' })),
    [templates]
  );
  const customerOptions = useMemo(
    () => customers.map((c) => ({ label: c.name || '', value: c.name || '' })),
    [customers]
  );
  const clientOptions = useMemo(() => clients.map((c) => ({ label: c.name || '', value: c.name || '' })), [clients]);
  const workflowOptions = useMemo(
    () => workflows.map((w) => ({ label: w.name || '', value: w.name || '' })),
    [workflows]
  );

  // Active filter chips — archived chip shown instead of filter chips when in archived mode
  const activeChips = useMemo(() => {
    const chips: { key: string; label: string; onDelete: () => void }[] = [];

    if (searchQuery) {
      chips.push({
        key: 'search',
        label: `"${searchQuery}"`,
        onDelete: () => {
          setSearchInput('');
          setSearchQuery('');
          setSearchKey((k) => k + 1);
        },
      });
    }

    if (viewTab === 'archived') {
      chips.push({
        key: 'archived',
        label: 'Archived jobs',
        onDelete: () => setViewTab('active'),
      });
      return chips;
    }

    if (viewTab === 'completed') {
      chips.push({
        key: 'completed',
        label: 'Completed jobs',
        onDelete: () => setViewTab('active'),
      });
    }

    if (filters.status) {
      chips.push({
        key: 'status',
        label: `Status: ${JOB_STATUS_OPTIONS.find((o) => o.value === filters.status)?.label ?? filters.status}`,
        onDelete: () =>
          setFilters((prev) => {
            const next = { ...prev };
            delete next.status;
            return next;
          }),
      });
    }
    if (filters.templateName) {
      chips.push({
        key: 'templateName',
        label: `Template: ${filters.templateName}`,
        onDelete: () =>
          setFilters((prev) => {
            const next = { ...prev };
            delete next.templateName;
            return next;
          }),
      });
    }
    if (filters.customerName) {
      chips.push({
        key: 'customerName',
        label: `Customer: ${filters.customerName}`,
        onDelete: () =>
          setFilters((prev) => {
            const next = { ...prev };
            delete next.customerName;
            return next;
          }),
      });
    }
    if (filters.clientName) {
      chips.push({
        key: 'clientName',
        label: `Client: ${filters.clientName}`,
        onDelete: () =>
          setFilters((prev) => {
            const next = { ...prev };
            delete next.clientName;
            return next;
          }),
      });
    }
    if (filters.workflowName) {
      chips.push({
        key: 'workflowName',
        label: `Workflow: ${filters.workflowName}`,
        onDelete: () =>
          setFilters((prev) => {
            const next = { ...prev };
            delete next.workflowName;
            return next;
          }),
      });
    }
    return chips;
  }, [filters, searchQuery, viewTab]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setViewTab('active');
    setSearchInput('');
    setSearchQuery('');
    setSearchKey((k) => k + 1);
  }, []);

  // Badge count: one per active filter dimension + 1 if archived
  const activeBadgeCount = Object.keys(filters).length + (viewTab !== 'active' ? 1 : 0);
  const hasActiveFilters = activeBadgeCount > 0;

  return (
    <PageWrapper
      title="All Jobs"
      description="Manage jobs, assign workers, and track progress."
      actions={[
        ...(selectedJobIds.length > 0
          ? [
              {
                label: 'Archive All Marked Jobs',
                onClick: handleBulkArchive,
                variant: 'outlined' as const,
                color: 'secondary' as const,
                disabled: viewTab === 'archived',
              },
            ]
          : []),
        { label: 'Create Job', onClick: handleAddJob, variant: 'contained', color: 'primary' },
      ]}
      headerExtra={
        <HeaderControls>
          <Search
            key={searchKey}
            placeholder="Search jobs..."
            onChange={setSearchInput}
            onSearch={(v) => {
              setSearchInput(v);
              setSearchQuery(v);
            }}
            size="small"
          />
          <FilterButtonWrapper>
            <IconButton
              variant="outlined"
              color={hasActiveFilters ? 'primary' : 'secondary'}
              size="small"
              onClick={(e) => setFilterAnchorEl(e.currentTarget)}
              aria-label="Open filters"
            >
              <FilterTuneIcon />
            </IconButton>
            {hasActiveFilters && (
              <FilterCountBadge>
                <Badge variant="primary" size="small">
                  {activeBadgeCount}
                </Badge>
              </FilterCountBadge>
            )}
          </FilterButtonWrapper>
        </HeaderControls>
      }
    >
      {activeChips.length > 0 && (
        <ChipsRow>
          {activeChips.map((chip) => (
            <FilterChip key={chip.key} label={chip.label} onDelete={chip.onDelete} size="small" variant="outlined" />
          ))}
          {activeChips.length > 1 && <ClearAllChip label="Clear all" size="small" onClick={clearAllFilters} />}
        </ChipsRow>
      )}

      <Table<JobTableRow>
        columns={columns}
        data={jobs}
        selectable
        selectedRows={selectedJobIds}
        onSelectionChange={setSelectedJobIds}
        highlightedRowId={highlightedJobId}
        showActions
        customiseColumns={true}
        actions={tableActions}
        onRowClick={handleRowClick}
        loading={loading || loadingTemplates}
        emptyMessage={
          viewTab === 'archived'
            ? 'No archived jobs found.'
            : viewTab === 'completed'
              ? 'No completed jobs found.'
              : activeChips.length > 0
                ? 'No jobs match the current filters.'
                : 'No jobs found. Add your first job to get started.'
        }
        rowsPerPage={100}
        showPagination={true}
        showTopPagination={false}
        enableStickyLeft={true}
      />

      <JobFilterPanel
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        viewTab={viewTab}
        onChangeViewTab={setViewTab}
        currentFilters={filters}
        onApply={setFilters}
        templateOptions={templateOptions}
        customerOptions={customerOptions}
        clientOptions={clientOptions}
        workflowOptions={workflowOptions}
      />
    </PageWrapper>
  );
};
