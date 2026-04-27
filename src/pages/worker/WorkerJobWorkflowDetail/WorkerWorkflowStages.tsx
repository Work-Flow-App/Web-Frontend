import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgress, Box, Chip, Collapse } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/UI/Button';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowResponse, JobWorkflowStepResponse } from '../../../services/api';
import { JobWorkflowStepResponseStatusEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerWorkflowStagesProps {
  jobWorkflow: JobWorkflowResponse;
  onStepUpdate?: () => void;
}

const getStatusInfo = (status?: string) => {
  switch (status) {
    case JobWorkflowStepResponseStatusEnum.Completed:
      return {
        label: 'COMPLETED',
        isCompleted: true,
        isInProgress: false,
        isDelayed: false,
        chipBg: '#E8F5E9',
        chipColor: '#2E7D32',
      };
    case JobWorkflowStepResponseStatusEnum.Started:
      return {
        label: 'STARTED',
        isCompleted: false,
        isInProgress: true,
        isDelayed: false,
        chipBg: '#E3F2FD',
        chipColor: '#1565C0',
      };
    case JobWorkflowStepResponseStatusEnum.Ongoing:
      return {
        label: 'ONGOING',
        isCompleted: false,
        isInProgress: true,
        isDelayed: false,
        chipBg: '#E3F2FD',
        chipColor: '#1565C0',
      };
    case JobWorkflowStepResponseStatusEnum.Pending:
      return {
        label: 'PENDING',
        isCompleted: false,
        isInProgress: false,
        isDelayed: false,
        chipBg: '#FFF8E1',
        chipColor: '#F9A825',
      };
    case JobWorkflowStepResponseStatusEnum.Skipped:
      return {
        label: 'SKIPPED',
        isCompleted: false,
        isInProgress: false,
        isDelayed: true,
        chipBg: '#FFEBEE',
        chipColor: '#C62828',
      };
    case JobWorkflowStepResponseStatusEnum.Initiated:
      return {
        label: 'INITIATED',
        isCompleted: false,
        isInProgress: false,
        isDelayed: false,
        chipBg: '#F3E5F5',
        chipColor: '#7B1FA2',
      };
    case JobWorkflowStepResponseStatusEnum.NotStarted:
    default:
      return {
        label: 'NOT_STARTED',
        isCompleted: false,
        isInProgress: false,
        isDelayed: false,
        chipBg: '#F5F5F5',
        chipColor: '#616161',
      };
  }
};

export const WorkerWorkflowStages: React.FC<WorkerWorkflowStagesProps> = ({ jobWorkflow, onStepUpdate }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null);
  const [updatingStep, setUpdatingStep] = useState<number | null>(null);

  const sortedSteps: JobWorkflowStepResponse[] = jobWorkflow.steps
    ? [...jobWorkflow.steps].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : [];

  useEffect(() => {
    const activeStep = sortedSteps.find(
      (step) =>
        step.status !== JobWorkflowStepResponseStatusEnum.Completed &&
        step.status !== JobWorkflowStepResponseStatusEnum.Skipped,
    );
    if (activeStep?.id && expandedStepId === null) {
      setExpandedStepId(activeStep.id);
    }
  }, [sortedSteps, expandedStepId]);

  const toggleStep = (stepId: number) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const handleStartStep = useCallback(
    async (step: JobWorkflowStepResponse) => {
      if (!step.id) return;
      try {
        setUpdatingStep(step.id);
        await workerJobWorkflowService.startStep(step.id);
        showSuccess('Step started');
        onStepUpdate?.();
      } catch (error) {
        console.error('Error starting step:', error);
        showError('Failed to start step');
      } finally {
        setUpdatingStep(null);
      }
    },
    [showSuccess, showError, onStepUpdate],
  );

  const handleMarkOngoing = useCallback(
    async (step: JobWorkflowStepResponse) => {
      if (!step.id) return;
      try {
        setUpdatingStep(step.id);
        await workerJobWorkflowService.markStepOngoing(step.id);
        showSuccess('Step marked ongoing');
        onStepUpdate?.();
      } catch (error) {
        console.error('Error marking step ongoing:', error);
        showError('Failed to update step');
      } finally {
        setUpdatingStep(null);
      }
    },
    [showSuccess, showError, onStepUpdate],
  );

  const handleCompleteStep = useCallback(
    async (step: JobWorkflowStepResponse) => {
      if (!step.id) return;
      try {
        setUpdatingStep(step.id);
        if (step.status === JobWorkflowStepResponseStatusEnum.Ongoing) {
          await workerJobWorkflowService.completeOngoingStep(step.id);
        } else {
          await workerJobWorkflowService.completeStep(step.id);
        }
        showSuccess('Step completed');
        onStepUpdate?.();
      } catch (error) {
        console.error('Error completing step:', error);
        showError('Failed to complete step');
      } finally {
        setUpdatingStep(null);
      }
    },
    [showSuccess, showError, onStepUpdate],
  );

  const handleOpenStep = (step: JobWorkflowStepResponse) => {
    if (step.id) {
      navigate(`/worker/steps/${step.id}`);
    }
  };

  if (!jobWorkflow || sortedSteps.length === 0) {
    return (
      <S.WorkflowSidebar>
        <S.WorkflowSidebarHeader>
          <S.WorkflowSidebarTitle>Workflow</S.WorkflowSidebarTitle>
        </S.WorkflowSidebarHeader>
        <Box px={2} py={3}>
          <S.PlaceholderText>No steps in this workflow</S.PlaceholderText>
        </Box>
      </S.WorkflowSidebar>
    );
  }

  return (
    <S.WorkflowSidebar>
      <S.WorkflowSidebarHeader>
        <S.WorkflowSidebarTitle>Workflow #{jobWorkflow.id}</S.WorkflowSidebarTitle>
      </S.WorkflowSidebarHeader>

      <Box sx={{ px: 2, py: 1, overflowY: 'auto', flex: 1 }}>
        {sortedSteps.map((step, index) => {
          const statusInfo = getStatusInfo(step.status);
          const isLast = index === sortedSteps.length - 1;
          const isExpanded = step.id === expandedStepId;
          const isUpdating = updatingStep === step.id;

          return (
            <Box
              key={step.id || index}
              sx={{
                display: 'flex',
                position: 'relative',
              }}
            >
              {!isLast && (
                <Box
                  sx={{
                    position: 'absolute',
                    left: 13,
                    top: 28,
                    bottom: 0,
                    width: 2,
                    backgroundColor: statusInfo.isCompleted ? '#4CAF50' : '#E0E0E0',
                  }}
                />
              )}

              <Box
                onClick={() => step.id && toggleStep(step.id)}
                sx={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: statusInfo.isCompleted
                    ? '#4CAF50'
                    : statusInfo.isInProgress
                      ? '#4CAF50'
                      : statusInfo.isDelayed
                        ? '#F44336'
                        : '#E0E0E0',
                  color: statusInfo.isCompleted || statusInfo.isInProgress || statusInfo.isDelayed ? 'white' : '#666',
                  fontSize: 12,
                  fontWeight: 600,
                  flexShrink: 0,
                  cursor: 'pointer',
                  position: 'relative',
                  zIndex: 1,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                {statusInfo.isCompleted ? (
                  <CheckIcon sx={{ fontSize: 16 }} />
                ) : statusInfo.isInProgress ? (
                  <PlayArrowIcon sx={{ fontSize: 16 }} />
                ) : statusInfo.isDelayed ? (
                  <CloseIcon sx={{ fontSize: 16 }} />
                ) : (
                  index + 1
                )}
              </Box>

              <Box sx={{ ml: 1.5, flex: 1, pb: 2, minWidth: 0 }}>
                <S.StepTitleContainer>
                  <S.StepTitleText onClick={() => step.id && toggleStep(step.id)}>
                    {index + 1}. {step.name || `Step ${index + 1}`}
                  </S.StepTitleText>
                </S.StepTitleContainer>

                <Box sx={{ fontSize: 12, color: '#888', mb: 1 }}>
                  {step.description || 'No description'}
                </Box>

                <Box
                  onClick={() => step.id && toggleStep(step.id)}
                  sx={{
                    display: 'flex',
                    gap: 0.5,
                    flexWrap: 'wrap',
                    cursor: 'pointer',
                  }}
                >
                  <Chip
                    label={statusInfo.label}
                    size="small"
                    sx={{
                      height: 24,
                      fontSize: 11,
                      fontWeight: 600,
                      backgroundColor: statusInfo.chipBg,
                      color: statusInfo.chipColor,
                      borderRadius: '4px',
                    }}
                  />
                </Box>

                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    <S.StepDetailRow>
                      <span className="label">Started</span>
                      <span className="value">
                        {step.startedAt ? new Date(step.startedAt).toLocaleString() : '-'}
                      </span>
                    </S.StepDetailRow>
                    <S.StepDetailRow>
                      <span className="label">Completed</span>
                      <span className="value">
                        {step.completedAt ? new Date(step.completedAt).toLocaleString() : '-'}
                      </span>
                    </S.StepDetailRow>

                    <S.StepActions>
                      {step.status === JobWorkflowStepResponseStatusEnum.NotStarted && (
                        <Button
                          size="small"
                          onClick={() => handleStartStep(step)}
                          disabled={isUpdating}
                        >
                          Start
                        </Button>
                      )}
                      {step.status === JobWorkflowStepResponseStatusEnum.Initiated && (
                        <Button
                          size="small"
                          onClick={() => handleMarkOngoing(step)}
                          disabled={isUpdating}
                        >
                          Mark Ongoing
                        </Button>
                      )}
                      {(step.status === JobWorkflowStepResponseStatusEnum.Started ||
                        step.status === JobWorkflowStepResponseStatusEnum.Ongoing) && (
                        <Button
                          size="small"
                          onClick={() => handleCompleteStep(step)}
                          disabled={isUpdating}
                        >
                          Complete
                        </Button>
                      )}
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() => handleOpenStep(step)}
                      >
                        Open
                      </Button>
                    </S.StepActions>
                  </Box>
                </Collapse>
              </Box>
            </Box>
          );
        })}
      </Box>
    </S.WorkflowSidebar>
  );
};

export const WorkerWorkflowStagesLoader: React.FC = () => (
  <S.WorkflowSidebar>
    <S.WorkflowSidebarHeader>
      <S.WorkflowSidebarTitle>Workflow</S.WorkflowSidebarTitle>
    </S.WorkflowSidebarHeader>
    <Box display="flex" justifyContent="center" alignItems="center" py={4}>
      <CircularProgress size={32} />
    </Box>
  </S.WorkflowSidebar>
);
