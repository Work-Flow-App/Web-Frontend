import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Chip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import { Button } from '../../../components/UI/Button';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowStepResponse, WorkerAssignedStepResponse } from '../../../services/api';
import { JobWorkflowStepResponseStatusEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import * as S from '../../jobs/JobDetailsPage.styles';
import { WorkerStepComments } from './WorkerStepComments';
import { WorkerStepAttachments } from './WorkerStepAttachments';
import { WorkerStepWorkLogs } from './WorkerStepWorkLogs';
import { WorkerStepDiscussion } from './WorkerStepDiscussion';

const getStatusInfo = (status?: string) => {
  switch (status) {
    case JobWorkflowStepResponseStatusEnum.Completed:
      return { label: 'COMPLETED', bg: '#E8F5E9', color: '#2E7D32' };
    case JobWorkflowStepResponseStatusEnum.Started:
      return { label: 'STARTED', bg: '#E3F2FD', color: '#1565C0' };
    case JobWorkflowStepResponseStatusEnum.Ongoing:
      return { label: 'ONGOING', bg: '#E3F2FD', color: '#1565C0' };
    case JobWorkflowStepResponseStatusEnum.Pending:
      return { label: 'PENDING', bg: '#FFF8E1', color: '#F9A825' };
    case JobWorkflowStepResponseStatusEnum.Skipped:
      return { label: 'SKIPPED', bg: '#FFEBEE', color: '#C62828' };
    case JobWorkflowStepResponseStatusEnum.Initiated:
      return { label: 'INITIATED', bg: '#F3E5F5', color: '#7B1FA2' };
    case JobWorkflowStepResponseStatusEnum.NotStarted:
    default:
      return { label: 'NOT_STARTED', bg: '#F5F5F5', color: '#616161' };
  }
};

export const WorkerStepDetail: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const [step, setStep] = useState<JobWorkflowStepResponse | null>(null);
  const [context, setContext] = useState<WorkerAssignedStepResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchStep = useCallback(async () => {
    if (!stepId) return;
    try {
      setLoading(true);
      const numericId = Number(stepId);
      const [stepRes, assignedRes] = await Promise.all([
        workerJobWorkflowService.getStep(numericId),
        workerJobWorkflowService.getMyAssignedSteps(),
      ]);
      setStep(stepRes.data);
      const match = (assignedRes.data || []).find((s) => s.step?.id === numericId) || null;
      setContext(match);
    } catch (error) {
      console.error('Error fetching step:', error);
      showError('Failed to load step');
    } finally {
      setLoading(false);
    }
  }, [stepId, showError]);

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
    fetchStep();
  }, [fetchStep]);

  const handleBackClick = () => {
    navigate('/worker/steps');
  };

  const handleStartStep = async () => {
    if (!step?.id) return;
    try {
      setUpdating(true);
      await workerJobWorkflowService.startStep(step.id);
      showSuccess('Step started');
      fetchStep();
    } catch (error) {
      console.error('Error starting step:', error);
      showError('Failed to start step');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkOngoing = async () => {
    if (!step?.id) return;
    try {
      setUpdating(true);
      await workerJobWorkflowService.markStepOngoing(step.id);
      showSuccess('Step marked ongoing');
      fetchStep();
    } catch (error) {
      console.error('Error marking step ongoing:', error);
      showError('Failed to update step');
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteStep = async () => {
    if (!step?.id) return;
    try {
      setUpdating(true);
      if (step.status === JobWorkflowStepResponseStatusEnum.Ongoing) {
        await workerJobWorkflowService.completeOngoingStep(step.id);
      } else {
        await workerJobWorkflowService.completeStep(step.id);
      }
      showSuccess('Step completed');
      fetchStep();
    } catch (error) {
      console.error('Error completing step:', error);
      showError('Failed to complete step');
    } finally {
      setUpdating(false);
    }
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

  if (!step) {
    return (
      <PageWrapper title="" description="">
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <S.InfoValue>Step not found</S.InfoValue>
        </Box>
      </PageWrapper>
    );
  }

  const statusInfo = getStatusInfo(step.status);
  const numericStepId = Number(stepId);

  return (
    <PageWrapper title="" description="">
      <S.ContentContainer>
        <S.JobHeader>
          <S.JobHeaderLeft>
            <S.BackButton onClick={handleBackClick}>
              <ArrowBackIcon />
            </S.BackButton>
            <S.JobHeaderInfo>
              <S.JobHeaderTitle>{step.name || `Step #${step.id}`}</S.JobHeaderTitle>
              <S.JobHeaderMeta>
                Step #{step.id}
                {context?.jobRef ? ` · Job #${context.jobRef}` : context?.jobId ? ` · Job #${context.jobId}` : ''}
                {context?.customer?.name ? ` · ${context.customer.name}` : ''}
                {step.startedAt ? ` · Started ${new Date(step.startedAt).toLocaleDateString()}` : ''}
              </S.JobHeaderMeta>
            </S.JobHeaderInfo>
          </S.JobHeaderLeft>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Chip
              label={statusInfo.label}
              size="small"
              sx={{
                height: 26,
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: statusInfo.bg,
                color: statusInfo.color,
              }}
            />
            {step.status === JobWorkflowStepResponseStatusEnum.NotStarted && (
              <Button size="small" onClick={handleStartStep} disabled={updating}>
                Start
              </Button>
            )}
            {step.status === JobWorkflowStepResponseStatusEnum.Initiated && (
              <Button size="small" onClick={handleMarkOngoing} disabled={updating}>
                Mark Ongoing
              </Button>
            )}
            {(step.status === JobWorkflowStepResponseStatusEnum.Started ||
              step.status === JobWorkflowStepResponseStatusEnum.Ongoing) && (
              <Button size="small" onClick={handleCompleteStep} disabled={updating}>
                Complete
              </Button>
            )}
          </Box>
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
          <S.TabButton active={activeTab === 'discussion'} onClick={() => setActiveTab('discussion')}>
            Discussion
          </S.TabButton>
          <S.TabButton active={activeTab === 'comments'} onClick={() => setActiveTab('comments')}>
            Comments
          </S.TabButton>
          <S.TabButton active={activeTab === 'attachments'} onClick={() => setActiveTab('attachments')}>
            Attachments
          </S.TabButton>
          <S.TabButton active={activeTab === 'work-logs'} onClick={() => setActiveTab('work-logs')}>
            Work Logs
          </S.TabButton>
        </S.TabsContainer>

        <S.JobDetailsLayout fullWidth>
          <S.MainContentPanel>
            {activeTab === 'overview' && (
              <S.DetailsSection>
                <S.SectionTitle>Step Details</S.SectionTitle>
                <S.InfoRow>
                  <S.InfoLabel>Name</S.InfoLabel>
                  <S.InfoValue>{step.name || '-'}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>Description</S.InfoLabel>
                  <S.InfoValue>{step.description || 'No description'}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>Status</S.InfoLabel>
                  <S.InfoValue>{step.status || '-'}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>Order</S.InfoLabel>
                  <S.InfoValue>{step.orderIndex ?? '-'}</S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>Started At</S.InfoLabel>
                  <S.InfoValue>
                    {step.startedAt ? new Date(step.startedAt).toLocaleString() : '-'}
                  </S.InfoValue>
                </S.InfoRow>
                <S.InfoRow>
                  <S.InfoLabel>Completed At</S.InfoLabel>
                  <S.InfoValue>
                    {step.completedAt ? new Date(step.completedAt).toLocaleString() : '-'}
                  </S.InfoValue>
                </S.InfoRow>
              </S.DetailsSection>
            )}

            {activeTab === 'service-location' && (
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
            )}

            {activeTab === 'assets' && (
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
                  <S.PlaceholderText>No assets assigned to this step.</S.PlaceholderText>
                )}
              </S.DetailsSection>
            )}

            {activeTab === 'discussion' && (
              <S.DetailsSection>
                <WorkerStepDiscussion stepId={numericStepId} />
              </S.DetailsSection>
            )}

            {activeTab === 'comments' && (
              <S.DetailsSection>
                <WorkerStepComments stepId={numericStepId} onUpdate={fetchStep} />
              </S.DetailsSection>
            )}

            {activeTab === 'attachments' && (
              <S.DetailsSection>
                <WorkerStepAttachments stepId={numericStepId} onUpdate={fetchStep} />
              </S.DetailsSection>
            )}

            {activeTab === 'work-logs' && (
              <S.DetailsSection>
                <WorkerStepWorkLogs stepId={numericStepId} />
              </S.DetailsSection>
            )}
          </S.MainContentPanel>
        </S.JobDetailsLayout>
      </S.ContentContainer>
    </PageWrapper>
  );
};
