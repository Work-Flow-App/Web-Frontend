import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageWrapper } from '../../../components/PageWrapper';
import { Search } from '../../../components/Search';
import Table from '../../../components/Table/Table';
import type { ITableAction } from '../../../components/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/GlobalModal';
import {
  jobService,
  jobTemplateService,
  assetService,
  customerService,
  companyClientService,
  workflowService,
} from '../../../services/api';
import type {
  JobResponse,
  JobTemplateFieldResponse,
  AssetResponse,
  PagedModelAssetResponse,
  CustomerResponse,
  ClientResponse,
  WorkflowResponse,
  JobFilters,
} from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { generateJobColumns, type JobTableRow } from './DataColumn';
import { AddJobWizard } from '../wizard';
import { useFetch } from '../../../hooks';
import { JobFilterPanel } from './JobFilterPanel';
import { FilterChip, ClearAllChip } from './JobsList.styles';
import {
  HeaderControls,
  FilterButtonWrapper,
  FilterCountBadge,
  FilterTuneIcon,
  ChipsRow,
} from './JobFilterPanel.styles';
import { IconButton } from '../../../components/Button';
import { Badge } from '../../../components/Badge';
import { JOB_STATUS_OPTIONS } from '../../../types';

export const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const [showArchived, setShowArchived] = useState(false);
  const [hasShownNoTemplateModal, setHasShownNoTemplateModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchKey, setSearchKey] = useState(0);
  const [filters, setFilters] = useState<JobFilters>({});
  const [filterAnchorEl, setFilterAnchorEl] = useState<HTMLElement | null>(null);

  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

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
    () => (showArchived ? jobService.getArchivedJobs() : jobService.getAllJobs(apiFilters)),
    [showArchived, apiFilters],
    {
      skip: loadingTemplates,
      onError: (error) => showError(extractErrorMessage(error, 'Failed to load jobs')),
    }
  );

  const jobs = useMemo<JobTableRow[]>(() => {
    return (rawJobs ?? []).map((job: JobResponse) => {
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
  }, [rawJobs, assets, templates, customers, clients, workflows]);

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

  const handleAddJob = () => {
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
  };

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

  const tableActions: ITableAction<JobTableRow>[] = useMemo(
    () => [
      { id: 'edit', label: 'Edit', onClick: handleEditJob },
      ...(!showArchived
        ? [{ id: 'archive', label: 'Archive', onClick: handleArchiveJob, color: 'error' as const }]
        : [{ id: 'delete', label: 'Delete', onClick: handleDeleteJob, color: 'error' as const }]),
    ],
    [handleEditJob, handleArchiveJob, handleDeleteJob, showArchived]
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

    if (showArchived) {
      chips.push({
        key: 'archived',
        label: 'Archived jobs',
        onDelete: () => setShowArchived(false),
      });
      return chips;
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
  }, [filters, searchQuery, showArchived]);

  const clearAllFilters = useCallback(() => {
    setFilters({});
    setShowArchived(false);
    setSearchInput('');
    setSearchQuery('');
    setSearchKey((k) => k + 1);
  }, []);

  // Badge count: one per active filter dimension + 1 if archived
  const activeBadgeCount = Object.keys(filters).length + (showArchived ? 1 : 0);
  const hasActiveFilters = activeBadgeCount > 0;

  return (
    <PageWrapper
      title="All Jobs"
      description="Manage jobs, assign workers, and track progress."
      actions={[{ label: 'Create Job', onClick: handleAddJob, variant: 'contained', color: 'primary' }]}
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
        showActions
        customiseColumns={true}
        actions={tableActions}
        onRowClick={handleRowClick}
        loading={loading || loadingTemplates}
        emptyMessage={
          showArchived
            ? 'No archived jobs found.'
            : activeChips.length > 0
              ? 'No jobs match the current filters.'
              : 'No jobs found. Add your first job to get started.'
        }
        rowsPerPage={100}
        showPagination={true}
        enableStickyLeft={true}
      />

      <JobFilterPanel
        anchorEl={filterAnchorEl}
        onClose={() => setFilterAnchorEl(null)}
        showArchived={showArchived}
        onToggleArchived={setShowArchived}
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
