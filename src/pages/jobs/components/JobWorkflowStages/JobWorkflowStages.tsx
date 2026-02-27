import React, { useEffect, useState, useCallback } from 'react';
import {
  CircularProgress,
  Box,
  IconButton,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Chip,
  Collapse,
} from '@mui/material';
import type { SelectChangeEvent } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import type { JobResponse, WorkerResponse, WorkflowResponse } from '../../../../services/api';
import { jobWorkflowService, workerService, workflowService } from '../../../../services/api';
import type { JobWorkflowResponse, JobWorkflowStepResponse } from '../../../../services/api';
import { JobWorkflowStepResponseStatusEnum } from '../../../../../workflow-api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { StepCommentsSection } from './StepCommentsSection';
import { StepAttachmentsSection } from './StepAttachmentsSection';
import * as S from '../../JobDetailsPage.styles';

interface JobWorkflowStagesProps {
  job: JobResponse;
  onStepUpdate?: () => void;
}

// Get status display info based on API status enum
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

export const JobWorkflowStages: React.FC<JobWorkflowStagesProps> = ({ job, onStepUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [jobWorkflow, setJobWorkflow] = useState<JobWorkflowResponse | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null);
  const [workers, setWorkers] = useState<Map<number, WorkerResponse>>(new Map());
  const [allWorkers, setAllWorkers] = useState<WorkerResponse[]>([]);
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStep, setUpdatingStep] = useState<number | null>(null);
  const [editingWorkflowName, setEditingWorkflowName] = useState(false);
  const [workflowNameValue, setWorkflowNameValue] = useState('');
  const [savingWorkflowName, setSavingWorkflowName] = useState(false);
  const [editingStepNameId, setEditingStepNameId] = useState<number | null>(null);
  const [stepNameValue, setStepNameValue] = useState('');

  const fetchJobWorkflow = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      setJobWorkflow(response.data);

      // Fetch workflow details to get the name
      if (job.workflowId) {
        const workflowResponse = await workflowService.getWorkflowById(job.workflowId);
        setWorkflow(workflowResponse.data);
        setWorkflowNameValue(workflowResponse.data.name || '');
      }

      // Fetch workers for assigned worker IDs
      const workerIds = new Set<number>();
      response.data.steps?.forEach((step) => {
        step.assignedWorkerIds?.forEach((id) => workerIds.add(id));
      });

      if (workerIds.size > 0) {
        const workerPromises = Array.from(workerIds).map((id) => workerService.getWorkerById(id).catch(() => null));
        const workerResponses = await Promise.all(workerPromises);
        const workerMap = new Map<number, WorkerResponse>();
        workerResponses.forEach((res) => {
          if (res?.data?.id) {
            workerMap.set(res.data.id, res.data);
          }
        });
        setWorkers(workerMap);
      }

      // Fetch all workers for dropdown
      const allWorkersResponse = await workerService.getAllWorkers();
      setAllWorkers(allWorkersResponse.data || []);

      // Auto-expand the first non-completed step
      const activeStep = response.data.steps?.find(
        (step) =>
          step.status !== JobWorkflowStepResponseStatusEnum.Completed &&
          step.status !== JobWorkflowStepResponseStatusEnum.Skipped
      );
      if (activeStep?.id) {
        setExpandedStepId(activeStep.id);
      }
    } catch {
      console.log('No workflow found for job:', job.id);
      setJobWorkflow(null);
    } finally {
      setLoading(false);
    }
  }, [job.id, job.workflowId]);

  useEffect(() => {
    fetchJobWorkflow();
  }, [fetchJobWorkflow]);

  const toggleStep = (stepId: number) => {
    setExpandedStepId(expandedStepId === stepId ? null : stepId);
  };

  const handleEditNotes = (step: JobWorkflowStepResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.id) {
      setEditingStepId(step.id);
      setEditingNotes(step.description || '');
    }
  };

  const handleCancelEdit = () => {
    setEditingStepId(null);
    setEditingNotes('');
  };

  const handleSaveNotes = async (step: JobWorkflowStepResponse) => {
    if (!step.id || !jobWorkflow?.id) return;

    try {
      setSavingNotes(true);
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, {
        description: editingNotes,
      });
      showSuccess('Notes updated successfully');
      setEditingStepId(null);
      setEditingNotes('');
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (error) {
      console.error('Error updating notes:', error);
      showError('Failed to update notes');
    } finally {
      setSavingNotes(false);
    }
  };

  const handleStatusChange = async (step: JobWorkflowStepResponse, newStatus: string) => {
    if (!step.id || !jobWorkflow?.id) return;

    try {
      setUpdatingStep(step.id);
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, {
        status: newStatus as any,
      });
      showSuccess('Status updated successfully');
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (error) {
      console.error('Error updating status:', error);
      showError('Failed to update status');
    } finally {
      setUpdatingStep(null);
    }
  };

  const handleAssignedChange = async (step: JobWorkflowStepResponse, workerId: number | '') => {
    if (!step.id || !jobWorkflow?.id) return;

    try {
      setUpdatingStep(step.id);
      // Convert to array for API - Set doesn't serialize properly to JSON
      const workerIdsArray = workerId ? [workerId] : [];
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, {
        assignedWorkerIds: workerIdsArray as any,
      });
      showSuccess('Assignment updated successfully');
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (error) {
      console.error('Error updating assignment:', error);
      showError('Failed to update assignment');
    } finally {
      setUpdatingStep(null);
    }
  };

  const handleEditWorkflowName = () => {
    setEditingWorkflowName(true);
  };

  const handleEditStepName = (step: JobWorkflowStepResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.id) {
      setEditingStepNameId(step.id);
      setStepNameValue(step.name || '');
    }
  };

  const handleCancelStepNameEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingStepNameId(null);
    setStepNameValue('');
  };

  const handleSaveStepName = async (step: JobWorkflowStepResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!step.id || !jobWorkflow?.id || !stepNameValue.trim()) return;

    try {
      setUpdatingStep(step.id);
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, {
        name: stepNameValue.trim(),
      });
      showSuccess('Step name updated successfully');
      setEditingStepNameId(null);
      setStepNameValue('');
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (error) {
      console.error('Error updating step name:', error);
      showError('Failed to update step name');
    } finally {
      setUpdatingStep(null);
    }
  };

  const handleCancelWorkflowNameEdit = () => {
    setEditingWorkflowName(false);
    setWorkflowNameValue(workflow?.name || '');
  };

  const handleSaveWorkflowName = async () => {
    if (!job.workflowId || !workflowNameValue.trim()) return;

    try {
      setSavingWorkflowName(true);
      await workflowService.updateWorkflow(job.workflowId, {
        name: workflowNameValue.trim(),
      });
      showSuccess('Workflow name updated successfully');
      setEditingWorkflowName(false);
      fetchJobWorkflow();
    } catch (error) {
      console.error('Error updating workflow name:', error);
      showError('Failed to update workflow name');
    } finally {
      setSavingWorkflowName(false);
    }
  };

  // Sort steps by orderIndex from API
  const sortedSteps = jobWorkflow?.steps
    ? [...jobWorkflow.steps].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : [];

  if (loading) {
    return (
      <S.WorkflowSidebar>
        <S.WorkflowSidebarHeader>
          <S.WorkflowSidebarTitle>Workflow Name</S.WorkflowSidebarTitle>
        </S.WorkflowSidebarHeader>
        <Box display="flex" justifyContent="center" alignItems="center" py={4}>
          <CircularProgress size={32} />
        </Box>
      </S.WorkflowSidebar>
    );
  }

  if (!jobWorkflow || sortedSteps.length === 0) {
    return (
      <S.WorkflowSidebar>
        <S.WorkflowSidebarHeader>
          <S.WorkflowSidebarTitle>Workflow Name</S.WorkflowSidebarTitle>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </S.WorkflowSidebarHeader>
        <Box px={2} py={3}>
          <S.PlaceholderText>No workflow assigned to this job</S.PlaceholderText>
        </Box>
      </S.WorkflowSidebar>
    );
  }

  return (
    <S.WorkflowSidebar>
      <S.WorkflowSidebarHeader>
        <S.WorkflowSidebarTitle>
          {editingWorkflowName ? (
            <TextField
              size="small"
              value={workflowNameValue}
              onChange={(e) => setWorkflowNameValue(e.target.value)}
              autoFocus
              sx={{
                '& .MuiOutlinedInput-root': {
                  fontSize: 14,
                  fontWeight: 600,
                },
                '& .MuiOutlinedInput-input': {
                  py: 0.5,
                  px: 1,
                },
              }}
            />
          ) : (
            <>
              {workflow?.name || 'Workflow Name'}
              <Box
                component="span"
                sx={{
                  display: 'inline-flex',
                  gap: 0.5,
                  ml: 1,
                }}
              >
                {Array.from(workers.values())
                  .slice(0, 2)
                  .map((worker) => (
                    <Box
                      key={worker.id}
                      sx={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        backgroundColor: 'primary.main',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 10,
                        fontWeight: 600,
                      }}
                    >
                      {worker.initials || worker.name?.substring(0, 2).toUpperCase()}
                    </Box>
                  ))}
              </Box>
            </>
          )}
        </S.WorkflowSidebarTitle>
        {editingWorkflowName ? (
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton size="small" onClick={handleCancelWorkflowNameEdit}>
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleSaveWorkflowName} disabled={savingWorkflowName}>
              <SaveIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <IconButton size="small" onClick={handleEditWorkflowName}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </S.WorkflowSidebarHeader>

      {/* Timeline List */}
      <Box sx={{ px: 2, py: 1, overflowY: 'auto', flex: 1 }}>
        {sortedSteps.map((step, index) => {
          const statusInfo = getStatusInfo(step.status);
          const isLast = index === sortedSteps.length - 1;
          const isExpanded = step.id === expandedStepId;
          const assignedWorker = step.assignedWorkerIds
            ? Array.from(step.assignedWorkerIds)
                .map((id) => workers.get(id))
                .filter(Boolean)[0]
            : null;
          const assignedWorkerId = step.assignedWorkerIds ? Array.from(step.assignedWorkerIds)[0] : '';

          return (
            <Box
              key={step.id || index}
              sx={{
                display: 'flex',
                position: 'relative',
              }}
            >
              {/* Timeline line - continuous through the entire step */}
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

              {/* Timeline node */}
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

              {/* Step content */}
              <Box sx={{ ml: 1.5, flex: 1, pb: 2, minWidth: 0 }}>
                {/* Step title */}
                <S.StepTitleContainer>
                  {editingStepNameId === step.id ? (
                    <S.StepTitleEditContainer>
                      <S.StepTitleIndex>{index + 1}.</S.StepTitleIndex>
                      <TextField
                        size="small"
                        value={stepNameValue}
                        onChange={(e) => setStepNameValue(e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        autoFocus
                        sx={{
                          flex: 1,
                          '& .MuiOutlinedInput-root': {
                            fontSize: 14,
                            fontWeight: 600,
                          },
                          '& .MuiOutlinedInput-input': {
                            py: 0.25,
                            px: 0.5,
                          },
                        }}
                      />
                      <IconButton size="small" onClick={(e) => handleCancelStepNameEdit(e)}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleSaveStepName(step, e)}
                        disabled={updatingStep === step.id}
                      >
                        <SaveIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </S.StepTitleEditContainer>
                  ) : (
                    <>
                      <S.StepTitleText onClick={(e) => handleEditStepName(step, e)}>
                        {index + 1}. {step.name || `Step ${index + 1}`}
                      </S.StepTitleText>
                      <S.StepTitleEditButton onClick={(e) => handleEditStepName(step, e)}>
                        <EditIcon sx={{ fontSize: 14 }} />
                      </S.StepTitleEditButton>
                    </>
                  )}
                </S.StepTitleContainer>

                {/* Step description */}
                <Box
                  sx={{
                    fontSize: 12,
                    color: '#888',
                    mb: 1,
                  }}
                >
                  {step.description || 'No description'}
                </Box>

                {/* Status and assignment chips - clickable to expand */}
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
                  {assignedWorker && (
                    <Chip
                      label="YOU"
                      size="small"
                      sx={{
                        height: 24,
                        fontSize: 11,
                        fontWeight: 600,
                        backgroundColor: '#F5F5F5',
                        color: '#616161',
                        borderRadius: '4px',
                      }}
                    />
                  )}
                </Box>

                {/* Expanded Details */}
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    {/* Status Dropdown */}
                    <S.StepDetailRow>
                      <span className="label">Status</span>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={step.status || JobWorkflowStepResponseStatusEnum.NotStarted}
                          onChange={(e: SelectChangeEvent) => handleStatusChange(step, e.target.value)}
                          disabled={updatingStep === step.id}
                          sx={{
                            fontSize: 12,
                            '& .MuiSelect-select': {
                              py: 0.5,
                            },
                          }}
                        >
                          {Object.entries(JobWorkflowStepResponseStatusEnum).map(([key, value]) => {
                            const info = getStatusInfo(value);
                            return (
                              <MenuItem key={key} value={value} sx={{ fontSize: 12 }}>
                                <Chip
                                  label={info.label}
                                  size="small"
                                  sx={{
                                    height: 20,
                                    fontSize: 10,
                                    fontWeight: 600,
                                    backgroundColor: info.chipBg,
                                    color: info.chipColor,
                                  }}
                                />
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </S.StepDetailRow>

                    {/* Assigned Dropdown */}
                    <S.StepDetailRow>
                      <span className="label">Assigned</span>
                      <FormControl size="small" sx={{ minWidth: 140 }}>
                        <Select
                          value={assignedWorkerId || ''}
                          onChange={(e: SelectChangeEvent<number | ''>) =>
                            handleAssignedChange(step, e.target.value as number | '')
                          }
                          disabled={updatingStep === step.id}
                          displayEmpty
                          sx={{
                            fontSize: 12,
                            '& .MuiSelect-select': {
                              py: 0.5,
                            },
                          }}
                        >
                          <MenuItem value="" sx={{ fontSize: 12 }}>
                            Unassigned
                          </MenuItem>
                          {allWorkers.map((worker) => (
                            <MenuItem key={worker.id} value={worker.id} sx={{ fontSize: 12 }}>
                              {worker.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </S.StepDetailRow>

                    {/* Event Notes section */}
                    <S.EventNoteBox>
                      <S.EventNoteHeader>
                        <S.EventNoteTitle>Notes</S.EventNoteTitle>
                        {editingStepId === step.id ? (
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <S.EventNoteEditButton onClick={() => handleCancelEdit()} style={{ color: '#666' }}>
                              Cancel
                            </S.EventNoteEditButton>
                            <S.EventNoteEditButton onClick={() => handleSaveNotes(step)} disabled={savingNotes}>
                              {savingNotes ? 'Saving...' : 'Save'}
                            </S.EventNoteEditButton>
                          </Box>
                        ) : (
                          <S.EventNoteEditButton onClick={(e) => handleEditNotes(step, e)}>Edit</S.EventNoteEditButton>
                        )}
                      </S.EventNoteHeader>
                      {editingStepId === step.id ? (
                        <TextField
                          multiline
                          rows={3}
                          fullWidth
                          size="small"
                          value={editingNotes}
                          onChange={(e) => setEditingNotes(e.target.value)}
                          placeholder="Enter notes..."
                          onClick={(e) => e.stopPropagation()}
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              fontSize: 12,
                            },
                          }}
                        />
                      ) : (
                        <S.EventNoteContent>{step.description || 'No notes added yet.'}</S.EventNoteContent>
                      )}
                    </S.EventNoteBox>

                    {/* Attachments section */}
                    {step.id && <StepAttachmentsSection stepId={step.id} onUpdate={onStepUpdate} />}

                    {/* Comments section */}
                    {step.id && <StepCommentsSection stepId={step.id} onUpdate={onStepUpdate} />}
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
