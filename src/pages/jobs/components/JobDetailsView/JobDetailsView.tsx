import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EditIcon from '@mui/icons-material/Edit';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { jobService, jobTemplateService, companyClientService } from '../../../../services/api';
import type {
  JobResponse,
  JobTemplateResponse,
  ClientResponse,
  JobTemplateFieldResponse,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import * as S from '../../JobDetailsPage.styles';
import { JobWorkflowStages } from '../JobWorkflowStages/JobWorkflowStages';
import { JobDetailsSection } from '../JobDetailsSection/JobDetailsSection';

export const JobDetailsView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [job, setJob] = useState<JobResponse | null>(null);
  const [template, setTemplate] = useState<JobTemplateResponse | null>(null);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

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
          jobTemplateService.getTemplateWithFields(jobData.templateId).then((res) => {
            setTemplate(res.data.template || null);
            setTemplateFields(res.data.fields || []);
          })
        );
      }

      if (jobData.clientId) {
        promises.push(companyClientService.getClientById(jobData.clientId).then((res) => setClient(res.data)));
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

  const handleBackClick = () => {
    navigate('/company/jobs');
  };

  if (loading) {
    return (
      <PageWrapper title="" description="">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  if (!job) {
    return (
      <PageWrapper title="" description="">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <S.InfoValue>Job not found</S.InfoValue>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title="" description="">
      <S.ContentContainer>
        {/* Header */}
        <S.JobHeader>
          <S.JobHeaderLeft>
            <S.BackButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </S.BackButton>
            <S.JobHeaderInfo>
              <S.JobHeaderTitle>{client?.name || 'No Client'}</S.JobHeaderTitle>
              <S.JobHeaderMeta>
                {job.id}-{template?.name || 'Mayday Resources'}
              </S.JobHeaderMeta>
            </S.JobHeaderInfo>
          </S.JobHeaderLeft>

          <S.JobHeaderRight>
            <S.AssignedToSelector>
              <span className="label">Assigned to</span>
              <KeyboardArrowDownIcon fontSize="small" />
            </S.AssignedToSelector>
            <IconButton size="small">
              <EditIcon />
            </IconButton>
          </S.JobHeaderRight>
        </S.JobHeader>

        {/* Tabs Navigation */}
        <S.TabsContainer>
          <S.TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </S.TabButton>
          <S.TabButton active={activeTab === 'visit-log'} onClick={() => setActiveTab('visit-log')}>
            Visit Log
          </S.TabButton>
          <S.TabButton active={activeTab === 'estimate'} onClick={() => setActiveTab('estimate')}>
            Estimate
          </S.TabButton>
          <S.TabButton active={activeTab === 'financials'} onClick={() => setActiveTab('financials')}>
            Financials
          </S.TabButton>
          <S.TabButton active={activeTab === 'documents'} onClick={() => setActiveTab('documents')}>
            Documents
          </S.TabButton>
          <S.TabButton active={activeTab === 'complaints'} onClick={() => setActiveTab('complaints')}>
            Complaints
          </S.TabButton>
          <S.TabButton active={activeTab === 'history'} onClick={() => setActiveTab('history')}>
            History
          </S.TabButton>
          <S.TabButton active={activeTab === 'form'} onClick={() => setActiveTab('form')}>
            Form
          </S.TabButton>
        </S.TabsContainer>

        {/* Main Content Layout */}
        <S.JobDetailsLayout>
          {/* Left Sidebar - Workflow */}
          <JobWorkflowStages job={job} />

          {/* Right Content - Details */}
          <S.MainContentPanel>
            {/* Job Details Section */}
            <JobDetailsSection
              job={job}
              client={client}
              template={template}
              templateFields={templateFields}
              title="Job Details"
              defaultExpanded={true}
            />

            {/* Policy Details Section - Shows custom fields from template */}
            {templateFields.length > 0 && (
              <JobDetailsSection
                job={job}
                client={client}
                template={template}
                templateFields={templateFields}
                title="Policy Details"
                defaultExpanded={false}
              />
            )}
          </S.MainContentPanel>
        </S.JobDetailsLayout>
      </S.ContentContainer>
    </PageWrapper>
  );
};
