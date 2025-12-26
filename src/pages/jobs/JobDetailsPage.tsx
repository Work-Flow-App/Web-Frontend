import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Chip } from '@mui/material';
import { PageWrapper } from '../../components/UI/PageWrapper';
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

  return (
    <PageWrapper
      title={`Job #${job.id} Details`}
      description="View all information about this job"
      actions={[
        {
          label: 'Back to Jobs',
          onClick: () => navigate('/company/jobs'),
          variant: 'outlined',
        },
      ]}
    >
      <S.ContentContainer>
        <S.DetailsGrid>
          {/* Job Information Section */}
          <S.DetailsSection>
            <S.SectionTitle variant="subtitle2">Job Information</S.SectionTitle>

            <S.InfoRow>
              <S.InfoLabel>Job ID</S.InfoLabel>
              <S.InfoValue>#{job.id}</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>Status</S.InfoLabel>
              <Box>
                <Chip
                  label={job.status || 'N/A'}
                  color={getStatusColor(job.status)}
                  size="small"
                />
              </Box>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>Template</S.InfoLabel>
              <S.InfoValue>{template?.name || '-'}</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>Created At</S.InfoLabel>
              <S.InfoValue>{formatDate(job.createdAt)}</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>Updated At</S.InfoLabel>
              <S.InfoValue>{formatDate(job.updatedAt)}</S.InfoValue>
            </S.InfoRow>

            <S.InfoRow>
              <S.InfoLabel>Archived</S.InfoLabel>
              <S.InfoValue>{job.archived ? 'Yes' : 'No'}</S.InfoValue>
            </S.InfoRow>
          </S.DetailsSection>

          {/* Client Information Section */}
          {client && (
            <S.DetailsSection>
              <S.SectionTitle variant="subtitle2">Client Information</S.SectionTitle>

              <S.InfoRow>
                <S.InfoLabel>Client Name</S.InfoLabel>
                <S.InfoValue>{client.name || '-'}</S.InfoValue>
              </S.InfoRow>

              {client.email && (
                <S.InfoRow>
                  <S.InfoLabel>Email</S.InfoLabel>
                  <S.InfoValue>{client.email}</S.InfoValue>
                </S.InfoRow>
              )}

              {client.telephone && (
                <S.InfoRow>
                  <S.InfoLabel>Telephone</S.InfoLabel>
                  <S.InfoValue>{client.telephone}</S.InfoValue>
                </S.InfoRow>
              )}

              {client.mobile && (
                <S.InfoRow>
                  <S.InfoLabel>Mobile</S.InfoLabel>
                  <S.InfoValue>{client.mobile}</S.InfoValue>
                </S.InfoRow>
              )}

              {client.address && (
                <S.InfoRow>
                  <S.InfoLabel>Address</S.InfoLabel>
                  <S.InfoValue>{client.address}</S.InfoValue>
                </S.InfoRow>
              )}
            </S.DetailsSection>
          )}

          {/* Worker Information Section */}
          {worker && (
            <S.DetailsSection>
              <S.SectionTitle variant="subtitle2">Assigned Worker</S.SectionTitle>

              <S.InfoRow>
                <S.InfoLabel>Worker Name</S.InfoLabel>
                <S.InfoValue>{worker.name || '-'}</S.InfoValue>
              </S.InfoRow>

              {worker.email && (
                <S.InfoRow>
                  <S.InfoLabel>Email</S.InfoLabel>
                  <S.InfoValue>{worker.email}</S.InfoValue>
                </S.InfoRow>
              )}

              {worker.telephone && (
                <S.InfoRow>
                  <S.InfoLabel>Telephone</S.InfoLabel>
                  <S.InfoValue>{worker.telephone}</S.InfoValue>
                </S.InfoRow>
              )}

              {worker.mobile && (
                <S.InfoRow>
                  <S.InfoLabel>Mobile</S.InfoLabel>
                  <S.InfoValue>{worker.mobile}</S.InfoValue>
                </S.InfoRow>
              )}
            </S.DetailsSection>
          )}

          {/* Template Field Values Section */}
          {job.fieldValues && Object.keys(job.fieldValues).length > 0 && (
            <S.DetailsSection>
              <S.SectionTitle variant="subtitle2">Template Field Values</S.SectionTitle>

              {Object.entries(job.fieldValues).map(([key, fieldValueResponse]) => {
                const value =
                  fieldValueResponse && typeof fieldValueResponse === 'object' && 'value' in fieldValueResponse
                    ? String(fieldValueResponse.value)
                    : String(fieldValueResponse || '-');

                return (
                  <S.InfoRow key={key}>
                    <S.InfoLabel>{key}</S.InfoLabel>
                    <S.InfoValue>{value}</S.InfoValue>
                  </S.InfoRow>
                );
              })}
            </S.DetailsSection>
          )}
        </S.DetailsGrid>
      </S.ContentContainer>
    </PageWrapper>
  );
};
