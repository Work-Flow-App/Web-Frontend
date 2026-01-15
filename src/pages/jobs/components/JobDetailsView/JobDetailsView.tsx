import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { PageWrapper } from '../../../../components/UI/PageWrapper';
import { jobService, jobTemplateService, companyClientService, workerService, assetService } from '../../../../services/api';
import type {
  JobResponse,
  JobTemplateResponse,
  ClientResponse,
  WorkerResponse,
  JobTemplateFieldResponse,
  AssetResponse,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import * as S from '../../JobDetailsPage.styles';
import { JobBreadcrumb } from '../JobBreadcrumb/JobBreadcrumb';
import { JobOverviewCard } from '../JobOverviewCard/JobOverviewCard';
import { JobWorkflowStages } from '../JobWorkflowStages/JobWorkflowStages';
import { JobDetailsTabs } from '../JobDetailsTabs/JobDetailsTabs';

export const JobDetailsView: React.FC = () => {
  const { jobId } = useParams<{ jobId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [job, setJob] = useState<JobResponse | null>(null);
  const [template, setTemplate] = useState<JobTemplateResponse | null>(null);
  const [templateFields, setTemplateFields] = useState<JobTemplateFieldResponse[]>([]);
  const [client, setClient] = useState<ClientResponse | null>(null);
  const [worker, setWorker] = useState<WorkerResponse | null>(null);
  const [assets, setAssets] = useState<AssetResponse[]>([]);
  const [loading, setLoading] = useState(true);

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

      if (jobData.assignedWorkerId) {
        promises.push(workerService.getWorkerById(jobData.assignedWorkerId).then((res) => setWorker(res.data)));
      }

      // Fetch asset details if job has assets
      if (jobData.assetIds && jobData.assetIds.length > 0) {
        promises.push(
          Promise.all(jobData.assetIds.map((assetId) => assetService.getAssetById(assetId)))
            .then((assetResponses) => {
              const assetsData = assetResponses.map((res) => res.data);
              setAssets(assetsData);
            })
            .catch((error) => {
              console.error('Error fetching assets:', error);
              setAssets([]);
            })
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

  const handleJobsClick = () => {
    navigate('/company/jobs');
  };

  if (loading) {
    return (
      <PageWrapper title={<JobBreadcrumb jobId={jobId || ''} onJobsClick={handleJobsClick} />} description="">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageWrapper>
    );
  }

  if (!job) {
    return (
      <PageWrapper title={<JobBreadcrumb jobId={jobId || ''} onJobsClick={handleJobsClick} />} description="">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <S.InfoValue>Job not found</S.InfoValue>
        </Box>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper title={<JobBreadcrumb jobId={jobId || ''} onJobsClick={handleJobsClick} />} description="">
      <S.ContentContainer>
        <S.DetailsGrid>
          <JobOverviewCard job={job} client={client} worker={worker} template={template} />
          <JobWorkflowStages job={job} />
          <JobDetailsTabs
            job={job}
            client={client}
            worker={worker}
            template={template}
            templateFields={templateFields}
            assets={assets}
          />
        </S.DetailsGrid>
      </S.ContentContainer>
    </PageWrapper>
  );
};
