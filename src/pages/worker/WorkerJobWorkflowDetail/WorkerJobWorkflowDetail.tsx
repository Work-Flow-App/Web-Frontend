import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowResponse, WorkerAssignedStepResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import * as S from '../../jobs/JobDetailsPage.styles';
import { WorkerWorkflowStages } from './WorkerWorkflowStages';

export const WorkerJobWorkflowDetail: React.FC = () => {
  const { jobWorkflowId } = useParams<{ jobWorkflowId: string }>();
  const navigate = useNavigate();
  const { showError } = useSnackbar();

  const [jobWorkflow, setJobWorkflow] = useState<JobWorkflowResponse | null>(null);
  const [context, setContext] = useState<WorkerAssignedStepResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchJobWorkflow = useCallback(async () => {
    if (!jobWorkflowId) return;

    try {
      setLoading(true);
      const [workflowRes, assignedRes] = await Promise.all([
        workerJobWorkflowService.getJobWorkflow(Number(jobWorkflowId)),
        workerJobWorkflowService.getMyAssignedSteps(),
      ]);
      const workflowData = workflowRes.data;
      setJobWorkflow(workflowData);
      const stepIds = new Set((workflowData.steps || []).map((s) => s.id).filter(Boolean));
      const match = (assignedRes.data || []).find((a) => a.step?.id && stepIds.has(a.step.id)) || null;
      setContext(match);
    } catch (error) {
      console.error('Error fetching job workflow:', error);
      showError('Failed to load workflow');
    } finally {
      setLoading(false);
    }
  }, [jobWorkflowId, showError]);

  const formatAddress = (addr?: WorkerAssignedStepResponse['jobAddress']): string => {
    if (!addr) return '';
    return [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
      .filter(Boolean)
      .join(', ');
  };

  const buildMapsUrl = (addr?: WorkerAssignedStepResponse['jobAddress']): string | null => {
    if (!addr) return null;
    if (addr.latitude != null && addr.longitude != null) {
      return `https://www.google.com/maps?q=${addr.latitude},${addr.longitude}`;
    }
    const formatted = formatAddress(addr);
    return formatted ? `https://www.google.com/maps?q=${encodeURIComponent(formatted)}` : null;
  };

  useEffect(() => {
    fetchJobWorkflow();
  }, [fetchJobWorkflow]);

  const handleBackClick = () => {
    navigate('/worker/job-workflows');
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

  if (!jobWorkflow) {
    return (
      <PageWrapper title="" description="">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <S.InfoValue>Workflow not found</S.InfoValue>
        </Box>
      </PageWrapper>
    );
  }

  const totalSteps = jobWorkflow.steps?.length ?? 0;
  const completedSteps = jobWorkflow.steps?.filter(
    (s) => s.status === 'COMPLETED' || s.status === 'SKIPPED',
  ).length ?? 0;

  return (
    <PageWrapper title="" description="">
      <S.ContentContainer>
        <S.JobHeader>
          <S.JobHeaderLeft>
            <S.BackButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </S.BackButton>
            <S.JobHeaderInfo>
              <S.JobHeaderTitle>
                {context?.customer?.name || `Workflow #${jobWorkflow.id}`}
              </S.JobHeaderTitle>
              <S.JobHeaderMeta>
                Job #{context?.jobRef ?? jobWorkflow.jobId} · {jobWorkflow.status || 'NOT_STARTED'} · {completedSteps} of {totalSteps} steps complete
              </S.JobHeaderMeta>
            </S.JobHeaderInfo>
          </S.JobHeaderLeft>
        </S.JobHeader>

        <S.TabsContainer>
          <S.TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </S.TabButton>
          <S.TabButton active={activeTab === 'service-location'} onClick={() => setActiveTab('service-location')}>
            Service Location
          </S.TabButton>
          <S.TabButton active={activeTab === 'assets'} onClick={() => setActiveTab('assets')}>
            Assets
          </S.TabButton>
        </S.TabsContainer>

        <S.JobDetailsLayout fullWidth>
          {activeTab === 'overview' && (
            <WorkerWorkflowStages jobWorkflow={jobWorkflow} onStepUpdate={fetchJobWorkflow} />
          )}

          {activeTab === 'service-location' && (
            <S.MainContentPanel>
              <S.DetailsSection>
                <S.SectionTitle>Service Location</S.SectionTitle>
                {context?.customer && (
                  <>
                    <S.InfoRow>
                      <S.InfoLabel>Customer</S.InfoLabel>
                      <S.InfoValue>{context.customer.name || '-'}</S.InfoValue>
                    </S.InfoRow>
                    {context.customer.email && (
                      <S.InfoRow>
                        <S.InfoLabel>Customer Email</S.InfoLabel>
                        <S.InfoValue>{context.customer.email}</S.InfoValue>
                      </S.InfoRow>
                    )}
                    {context.customer.telephone && (
                      <S.InfoRow>
                        <S.InfoLabel>Customer Phone</S.InfoLabel>
                        <S.InfoValue>{context.customer.telephone}</S.InfoValue>
                      </S.InfoRow>
                    )}
                  </>
                )}
                <S.InfoRow>
                  <S.InfoLabel>Address</S.InfoLabel>
                  <S.InfoValue>{formatAddress(context?.jobAddress) || 'No address provided'}</S.InfoValue>
                </S.InfoRow>
                {context?.jobAddress?.additionalInfo && (
                  <S.InfoRow>
                    <S.InfoLabel>Additional Info</S.InfoLabel>
                    <S.InfoValue>{context.jobAddress.additionalInfo}</S.InfoValue>
                  </S.InfoRow>
                )}
                {buildMapsUrl(context?.jobAddress) && (
                  <S.InfoRow>
                    <S.InfoLabel>Map</S.InfoLabel>
                    <S.InfoValue>
                      <a
                        href={buildMapsUrl(context?.jobAddress) || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Open in Google Maps
                      </a>
                    </S.InfoValue>
                  </S.InfoRow>
                )}
              </S.DetailsSection>
            </S.MainContentPanel>
          )}

          {activeTab === 'assets' && (
            <S.MainContentPanel>
              <S.DetailsSection>
                <S.SectionTitle>Assigned Assets</S.SectionTitle>
                {context?.assignedAssets && context.assignedAssets.length > 0 ? (
                  context.assignedAssets.map((asset) => (
                    <S.InfoRow key={asset.assignmentId}>
                      <S.InfoLabel>{asset.assetName || `Asset #${asset.assetId}`}</S.InfoLabel>
                      <S.InfoValue>
                        {[asset.assetTag, asset.serialNumber, asset.notes].filter(Boolean).join(' · ') || '-'}
                      </S.InfoValue>
                    </S.InfoRow>
                  ))
                ) : (
                  <S.PlaceholderText>No assets assigned to this workflow.</S.PlaceholderText>
                )}
              </S.DetailsSection>
            </S.MainContentPanel>
          )}
        </S.JobDetailsLayout>
      </S.ContentContainer>
    </PageWrapper>
  );
};
