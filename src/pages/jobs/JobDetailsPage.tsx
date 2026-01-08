import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Chip, IconButton, Avatar } from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  Link as LinkIcon,
  Notifications,
  CheckCircle,
  Delete,
  Assignment,
  Description,
  Edit as EditIcon,
  Update
} from '@mui/icons-material';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { TabMenu } from '../../components/UI/Tab/TabMenu';
import { jobService, jobTemplateService, companyClientService, workerService } from '../../services/api';
import type { JobResponse, JobTemplateResponse, ClientResponse, WorkerResponse } from '../../services/api';
import { useSnackbar } from '../../contexts/SnackbarContext';
import * as S from './JobDetailsPage.styles';

export const JobDetailsPage: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [job, setJob] = useState<JobResponse | null>(null);
  const [template, setTemplate] = useState<JobTemplateResponse | null>(null);
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [worker, setWorker] = useState<WorkerResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('custom-fields');
  const [subTab, setSubTab] = useState('all-customers');

  const fetchJobDetails = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);

      // Fetch main job data
      const jobResponse = await jobService.getJobById(Number(jobId));
      const jobData = jobResponse.data;
      setJob(jobData);

      // Fetch related data in parallel
      const promises = [];

      if (jobData.templateId) {
        promises.push(
          jobTemplateService.getTemplateById(jobData.templateId).then((res) => setTemplate(res.data))
        );
      }

      if (jobData.clientId) {
        promises.push(
          companyClientService.getClientById(jobData.clientId).then((res) => setClient(res.data))
        );
      }

      if (jobData.assignedWorkerId) {
        promises.push(
          workerService.getWorkerById(jobData.assignedWorkerId).then((res) => setWorker(res.data))
        );
      }

      await Promise.all(promises);
    } catch (error) {
      console.error('Error fetching job details:', error);
      showError('Failed to load job details');
    } finally {
      setLoading(false);
    }
  }, [jobId, showError]);

  useEffect(() => {
    fetchJobDetails();
  }, [fetchJobDetails]);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'NEW':
        return 'info';
      case 'PENDING':
        return 'warning';
      case 'IN_PROGRESS':
        return 'primary';
      case 'COMPLETED':
        return 'success';
      case 'CANCELLED':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <PageWrapper title="Job Details" description="Loading job information...">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  if (!job) {
    return (
      <PageWrapper title="Job Details" description="Job not found">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <S.InfoValue>Job not found</S.InfoValue>
        </Box>
      </PageWrapper>
    );
  }

  const tabs = [
    { id: 'custom-fields', label: 'Custom fields', icon: <Assignment /> },
    { id: 'notes', label: 'Notes', icon: <Description /> },
    { id: 'updates', label: 'Updates', icon: <Update /> },
  ];

  const subTabs = [
    { id: 'all-customers', label: 'All Customers' },
    { id: 'all-accounts', label: 'All Accounts' },
    { id: 'angela-accounts', label: "Angela's Accounts" },
    { id: 'yellow-accounts', label: 'Yellow Accounts' },
    { id: 'ariel-accounts', label: "Ariel's Accounts" },
    { id: 'csm-accounts', label: 'CSM Accounts' },
    { id: 'forecast', label: 'Forecast' },
  ];

  return (
    <S.PageContainer>
      {/* Header Section */}
      <S.Header>
        <S.HeaderTop>
          <S.BackButton onClick={() => navigate('/company/jobs')}>
            <ArrowBack fontSize="small" />
            <span>Back</span>
          </S.BackButton>

          <S.HeaderActions>
            <S.ActionButton>
              <LinkIcon fontSize="small" />
            </S.ActionButton>
            <S.ActionButton>
              <Notifications fontSize="small" />
              Snooze
            </S.ActionButton>
            <S.ResolveButton>
              Resolve
            </S.ResolveButton>
            <S.DeleteButton>
              <Delete fontSize="small" />
            </S.DeleteButton>
          </S.HeaderActions>
        </S.HeaderTop>

        <S.HeaderContent>
          <S.JobTitle>{template?.name || `Job #${job.id}`}</S.JobTitle>
          <S.JobDescription>
            {template?.description || 'Typing a new description'}
          </S.JobDescription>
        </S.HeaderContent>

        {/* Metadata Row */}
        <S.MetadataRow>
          <S.MetadataDropdown>
            <S.MetadataLabel>Status</S.MetadataLabel>
            <S.DropdownButton status={job.status}>
              <S.StatusDot status={job.status} />
              {job.status?.replace('_', ' ') || 'N/A'}
              <ExpandMore fontSize="small" />
            </S.DropdownButton>
          </S.MetadataDropdown>

          <S.MetadataDropdown>
            <S.MetadataLabel>Assigned to</S.MetadataLabel>
            <S.DropdownButton>
              {worker?.name || 'Unassigned'}
              <ExpandMore fontSize="small" />
            </S.DropdownButton>
          </S.MetadataDropdown>

          <S.MetadataDropdown>
            <S.MetadataLabel>Priority</S.MetadataLabel>
            <S.DropdownButton>
              <S.PriorityDot priority="low" />
              Low
              <ExpandMore fontSize="small" />
            </S.DropdownButton>
          </S.MetadataDropdown>

          <S.MetadataDropdown>
            <S.MetadataLabel>Followers</S.MetadataLabel>
            <S.FollowersContainer>
              <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>EE</Avatar>
            </S.FollowersContainer>
          </S.MetadataDropdown>
        </S.MetadataRow>

        {/* Company Badge Section */}
        <S.CompanySection>
          <S.CompanyAvatar>A</S.CompanyAvatar>
          <S.CompanyName>{client?.name || 'Acme, Inc.'}</S.CompanyName>
          <S.StatusBadge />
          <S.TagBadge primary>First stage</S.TagBadge>
          <S.TagBadge>Customer</S.TagBadge>
          <S.MoreBadge>+1</S.MoreBadge>
        </S.CompanySection>

        {/* Stages Section */}
        <S.StagesSection>
          <S.StagesLabel>Stages</S.StagesLabel>
          <S.StagesContainer>
            <S.StageItem active={job.status === 'NEW'} color="#C8E6C9">
              <S.StageLabel>Meeting scheduled</S.StageLabel>
            </S.StageItem>
            <S.StageItem active={job.status === 'PENDING'} color="#FFF9C4">
              <S.StageLabel>Proposal Made (Sales)</S.StageLabel>
            </S.StageItem>
            <S.StageItem active={job.status === 'IN_PROGRESS'} color="#FFCCBC">
              <S.StageLabel>Account Closed (Sales)</S.StageLabel>
            </S.StageItem>
            <S.StageItem active={job.status === 'COMPLETED'} color="#E1BEE7">
              <S.StageLabel>Onboarding (CS)</S.StageLabel>
            </S.StageItem>
          </S.StagesContainer>
        </S.StagesSection>

        {/* Tabs */}
        <S.TabsContainer>
          <TabMenu
            tabs={tabs}
            activeTab={activeTab}
            onChange={setActiveTab}
            size="medium"
          />
        </S.TabsContainer>
      </S.Header>

      {/* Content Section */}
      <S.ContentContainer>
        {activeTab === 'custom-fields' && (
          <S.CustomFieldsSection>
            {/* Sub Tabs */}
            <S.SubTabsContainer>
              {subTabs.map((tab) => (
                <S.SubTab
                  key={tab.id}
                  active={subTab === tab.id}
                  onClick={() => setSubTab(tab.id)}
                >
                  {tab.label}
                </S.SubTab>
              ))}
            </S.SubTabsContainer>

            {/* Account Details Section */}
            <S.FieldsSection>
              <S.FieldsSectionTitle>Account details</S.FieldsSectionTitle>
              <S.FieldsGrid>
                {/* Template Field Values */}
                {job.fieldValues && Object.keys(job.fieldValues).length > 0 ? (
                  Object.entries(job.fieldValues).map(([key, fieldValueResponse]) => {
                    const fieldValue =
                      fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse
                        ? fieldValueResponse
                        : null;

                    const label = fieldValue?.label || key;
                    const value = fieldValue?.value !== undefined ? String(fieldValue.value) : '-';

                    return (
                      <S.FieldItem key={key}>
                        <S.FieldLabel>{label}</S.FieldLabel>
                        <S.FieldValue>{value}</S.FieldValue>
                      </S.FieldItem>
                    );
                  })
                ) : (
                  <>
                    <S.FieldItem>
                      <S.FieldLabel>% Allocated 📋</S.FieldLabel>
                      <S.FieldValue>93%</S.FieldValue>
                    </S.FieldItem>
                    <S.FieldItem>
                      <S.FieldLabel>% License Permeation 📋</S.FieldLabel>
                      <S.FieldValue>6%</S.FieldValue>
                    </S.FieldItem>
                    <S.FieldItem>
                      <S.FieldLabel>% of Employees as Users 📋</S.FieldLabel>
                      <S.FieldValue>8.5%</S.FieldValue>
                    </S.FieldItem>
                    <S.FieldItem>
                      <S.FieldLabel>% License Permeation 📋</S.FieldLabel>
                      <S.FieldValue>6%</S.FieldValue>
                    </S.FieldItem>
                    <S.FieldItem>
                      <S.FieldLabel>Account Description 📋</S.FieldLabel>
                      <S.FieldValue>
                        Scale faster when you replace your business bank account and credit card with Brex. No account fees. No paperwork. No personal guarantee.
                      </S.FieldValue>
                    </S.FieldItem>
                  </>
                )}
              </S.FieldsGrid>
            </S.FieldsSection>

            {/* Client Information */}
            {client && (
              <>
                <S.SectionDivider />
                <S.FieldsSection>
                  <S.FieldsSectionTitle>Client Information</S.FieldsSectionTitle>
                  <S.FieldsGrid>
                    <S.FieldItem>
                      <S.FieldLabel>Name</S.FieldLabel>
                      <S.FieldValue>{client.name || '-'}</S.FieldValue>
                    </S.FieldItem>
                    {client.email && (
                      <S.FieldItem>
                        <S.FieldLabel>Email</S.FieldLabel>
                        <S.FieldValue>{client.email}</S.FieldValue>
                      </S.FieldItem>
                    )}
                    {client.telephone && (
                      <S.FieldItem>
                        <S.FieldLabel>Telephone</S.FieldLabel>
                        <S.FieldValue>{client.telephone}</S.FieldValue>
                      </S.FieldItem>
                    )}
                    {client.mobile && (
                      <S.FieldItem>
                        <S.FieldLabel>Mobile</S.FieldLabel>
                        <S.FieldValue>{client.mobile}</S.FieldValue>
                      </S.FieldItem>
                    )}
                    {client.address && (
                      <S.FieldItem>
                        <S.FieldLabel>Address</S.FieldLabel>
                        <S.FieldValue>{client.address}</S.FieldValue>
                      </S.FieldItem>
                    )}
                  </S.FieldsGrid>
                </S.FieldsSection>
              </>
            )}

            {/* Worker Information */}
            {worker && (
              <>
                <S.SectionDivider />
                <S.FieldsSection>
                  <S.FieldsSectionTitle>Assigned Worker</S.FieldsSectionTitle>
                  <S.FieldsGrid>
                    <S.FieldItem>
                      <S.FieldLabel>Name</S.FieldLabel>
                      <S.FieldValue>{worker.name || '-'}</S.FieldValue>
                    </S.FieldItem>
                    {worker.email && (
                      <S.FieldItem>
                        <S.FieldLabel>Email</S.FieldLabel>
                        <S.FieldValue>{worker.email}</S.FieldValue>
                      </S.FieldItem>
                    )}
                    {worker.telephone && (
                      <S.FieldItem>
                        <S.FieldLabel>Telephone</S.FieldLabel>
                        <S.FieldValue>{worker.telephone}</S.FieldValue>
                      </S.FieldItem>
                    )}
                    {worker.mobile && (
                      <S.FieldItem>
                        <S.FieldLabel>Mobile</S.FieldLabel>
                        <S.FieldValue>{worker.mobile}</S.FieldValue>
                      </S.FieldItem>
                    )}
                  </S.FieldsGrid>
                </S.FieldsSection>
              </>
            )}
          </S.CustomFieldsSection>
        )}

        {activeTab === 'notes' && (
          <S.TabContent>
            <S.EmptyState>Notes functionality coming soon</S.EmptyState>
          </S.TabContent>
        )}

        {activeTab === 'updates' && (
          <S.TabContent>
            <S.EmptyState>Updates functionality coming soon</S.EmptyState>
          </S.TabContent>
        )}
      </S.ContentContainer>
    </S.PageContainer>
  );
};
