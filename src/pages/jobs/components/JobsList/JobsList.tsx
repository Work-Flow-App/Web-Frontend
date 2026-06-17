import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
// import { Box } from '@mui/material';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { StandaloneDropdown } from '../../../../components/UI/Forms/Dropdown';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { KeyboardArrowDown, KeyboardArrowUp, Clear } from '@mui/icons-material';
import { ListItemText, Collapse, List } from '@mui/material';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { jobService, jobTemplateService, assetService } from '../../../../services/api';
// import { JobGetAllStatusEnum } from '../../../../workflow-api';
import { FilterContainer, CustomFilterButton, FilterPopover, FilterList, CategoryListItem, SubListItem, FilterIconWrapper, ClearIconButton, ArrowIconWrapper, FilterButtonText } from './JobsList.styles';
import type { JobResponse, JobTemplateResponse, JobTemplateFieldResponse, AssetResponse, PagedModelAssetResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { generateJobColumns, type JobTableRow } from './DataColumn';
import { AddJobWizard } from '../AddJobWizard';
import { useFetch } from '../../../../hooks';

export const JobsList: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [hasShownNoTemplateModal, setHasShownNoTemplateModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [tableFilter, setTableFilter] = useState<{ type: string, value: string } | null>(null);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  const { data: templatesData, loading: loadingTemplates } = useFetch<JobTemplateResponse[]>(
    () => jobTemplateService.getAllTemplates(),
    [],
    { onError: () => showError('Failed to load templates') }
  );
  const templates = useMemo(() => templatesData ?? [], [templatesData]);

  const { data: assetsPage } = useFetch<PagedModelAssetResponse>(
    () => assetService.getAllAssets(0, 1000),
    [],
    { onError: (error) => console.error('Error fetching assets:', error) }
  );
  const assets = useMemo<AssetResponse[]>(() => assetsPage?.content ?? [], [assetsPage]);

  const { data: templateFieldsData } = useFetch<JobTemplateFieldResponse[]>(
    () => jobTemplateService.getTemplateFields(selectedTemplateId!),
    [selectedTemplateId],
    {
      skip: !selectedTemplateId,
      onError: (error) => showError(extractErrorMessage(error, 'Failed to load template fields')),
    }
  );
  const templateFields = useMemo(() => templateFieldsData ?? [], [templateFieldsData]);

  const { data: rawJobs, loading, refetch: fetchJobs } = useFetch<JobResponse[]>(
    () => {
      if (showArchived) return jobService.getArchivedJobs();
      if (selectedTemplateId) return jobService.getJobsByTemplate(selectedTemplateId);
      return jobService.getAllJobs();
    },
    [selectedTemplateId, showArchived],
    {
      skip: loadingTemplates,
      onError: (error) => showError(extractErrorMessage(error, 'Failed to load jobs')),
    }
  );

  const uniqueWorkflows = useMemo(() => Array.from(new Set((rawJobs || []).map(j => j.workflowName).filter(Boolean))), [rawJobs]);
  const uniqueCustomers = useMemo(() => Array.from(new Set((rawJobs || []).map(j => j.customerName).filter(Boolean))), [rawJobs]);
  const uniqueClients = useMemo(() => Array.from(new Set((rawJobs || []).map(j => j.clientName).filter(Boolean))), [rawJobs]);
  const uniqueStatuses = useMemo(() => Array.from(new Set((rawJobs || []).map(j => j.status).filter(Boolean))), [rawJobs]);

  const filterCategories = useMemo(() => [
    { id: 'Workflow', label: 'Workflow', options: uniqueWorkflows },
    { id: 'Customer', label: 'Customer', options: uniqueCustomers },
    { id: 'Client', label: 'Client', options: uniqueClients },
    { id: 'Status', label: 'Status', options: uniqueStatuses },
  ], [uniqueWorkflows, uniqueCustomers, uniqueClients, uniqueStatuses]);

  const jobs = useMemo<JobTableRow[]>(() => {
    let filteredRawJobs = rawJobs ?? [];

    if (tableFilter) {
      filteredRawJobs = filteredRawJobs.filter(job => {
        if (tableFilter.type === 'Workflow') return job.workflowName === tableFilter.value;
        if (tableFilter.type === 'Customer') return job.customerName === tableFilter.value;
        if (tableFilter.type === 'Client') return job.clientName === tableFilter.value;
        if (tableFilter.type === 'Status') return job.status === tableFilter.value;
        return true;
      });
    }

    return filteredRawJobs.map((job: JobResponse) => {
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

      const assetNames = job.assetIds && job.assetIds.length > 0
        ? job.assetIds
            .map(assetId => assets.find(a => a.id === assetId)?.name)
            .filter(Boolean)
            .join(', ')
        : undefined;

      return {
        id: job.id || 0,
        jobRef: job.jobRef,
        templateId: job.templateId,
        templateName: job.templateName || '-',
        customerId: job.customerId,
        customerName: job.customerName || '-',
        workflowName: job.workflowName || '-',
        clientName: job.clientName || '-',
        jobValue: job.estimateTotalNet?.toString() || '-',
        postCode: job.address?.postalCode || '-',
        status: job.status || '-',
        createdAt: job.createdAt || new Date().toISOString(),
        fieldValues,
        assetIds: job.assetIds,
        assetNames,
      };
    });
  }, [rawJobs, assets]);

  // Show "No Templates Available" modal once on load if no templates exist
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
  }, [loadingTemplates, templates.length, hasShownNoTemplateModal, setGlobalModalOuterProps, resetGlobalModalOuterProps, navigate]);

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

  const handleRowClick = useCallback(
    (job: JobTableRow) => navigate(`/company/jobs/${job.id}/details`),
    [navigate]
  );

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
                console.error('Error deleting job:', error);
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
            description="Archived jobs are removed from the active list. This action can be reviewed by your administrator."
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
                console.error('Error archiving job:', error);
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

  const templateOptions = useMemo(
    () => templates.map((t) => ({ label: t.name || '', value: t.id?.toString() || '' })),
    [templates]
  );

  const archivedFilterOptions = [
    { label: 'Active Jobs', value: 'active' },
    { label: 'Archived Jobs', value: 'archived' },
  ];

  return (
    <PageWrapper
      title="All Jobs"
      description="Manage jobs, assign workers, and track progress."
      actions={[
        {
          label: 'Create Job',
          onClick: handleAddJob,
          variant: 'contained',
          color: 'primary',
        },
      ]}
      headerExtra={
        <FilterContainer>
          <CustomFilterButton 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            disableRipple
          >
            <FilterButtonText>
              {tableFilter ? `${tableFilter.type}: ${tableFilter.value}` : 'Filter By...'}
            </FilterButtonText>
            <FilterIconWrapper>
              {tableFilter && (
                <ClearIconButton 
                  size="small"
                  onClick={(e) => { 
                    e.stopPropagation(); 
                    setTableFilter(null); 
                  }}
                >
                  <Clear fontSize="inherit" />
                </ClearIconButton>
              )}
              <ArrowIconWrapper>
                <KeyboardArrowDown fontSize="inherit" />
              </ArrowIconWrapper>
            </FilterIconWrapper>
          </CustomFilterButton>

          <FilterPopover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          >
            <FilterList>
              {filterCategories.map(category => (
                <React.Fragment key={category.id}>
                  <CategoryListItem onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}>
                    <ListItemText primary={category.label} />
                    {expandedCategory === category.id ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                  </CategoryListItem>
                  
                  <Collapse in={expandedCategory === category.id} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {category.options.length === 0 ? (
                        <SubListItem disabled>
                          <ListItemText primary="No options available" />
                        </SubListItem>
                      ) : (
                        category.options.map(option => (
                          <SubListItem 
                            key={String(option)} 
                            selected={tableFilter?.type === category.id && tableFilter?.value === option}
                            onClick={() => {
                              setTableFilter({ type: category.id, value: String(option) });
                              setAnchorEl(null);
                            }}
                          >
                            <ListItemText primary={String(option)} />
                          </SubListItem>
                        ))
                      )}
                    </List>
                  </Collapse>
                </React.Fragment>
              ))}
            </FilterList>
          </FilterPopover>

          <StandaloneDropdown
            name="archivedFilter"
            placeHolder="Active Jobs"
            preFetchedOptions={archivedFilterOptions}
            defaultValue={showArchived ? 'archived' : 'active'}
            onChange={(value) => setShowArchived(value === 'archived')}
            hideErrorMessage
            size="medium"
          />
        </FilterContainer>
      }
      dropdownOptions={!showArchived ? templateOptions : []}
      dropdownValue={selectedTemplateId?.toString()}
      dropdownPlaceholder="All Jobs (No Template Filter)"
      onDropdownChange={(value) => setSelectedTemplateId(value ? Number(value) : null)}
    >
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
            : selectedTemplateId
            ? 'No jobs found for this template. Add your first job to get started.'
            : 'No jobs found. Add your first job to get started.'
        }
        rowsPerPage={100}
        showPagination={true}
        enableStickyLeft={true}
      />
    </PageWrapper>
  );
};
