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
  Autocomplete,
  Tooltip,
} from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import TimerIcon from '@mui/icons-material/Timer';
import type { JobResponse, WorkerResponse, WorkflowResponse } from '../../../../services/api';
import { jobWorkflowService, workerService, workflowService } from '../../../../services/api';
import type { JobWorkflowResponse, JobWorkflowStepResponse } from '../../../../services/api';
import { JobWorkflowStepResponseStatusEnum, JobWorkflowStepResponseSlaStatusEnum } from '../../../../../workflow-api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { StepCommentsSection } from './StepCommentsSection';
import { StepAttachmentsSection } from './StepAttachmentsSection';
import * as S from '../../JobDetailsPage.styles';

// Live countdown timer for SLA deadline
const SlaTimer: React.FC<{ step: JobWorkflowStepResponse }> = ({ step }) => {
  const [display, setDisplay] = useState('');

  useEffect(() => {
    if (!step.startedAt || !step.maximumDurationMinutes) return;

    const tick = () => {
      const start = new Date(step.startedAt!);
      const deadline = new Date(start.getTime() + step.maximumDurationMinutes! * 60_000);
      const ms = deadline.getTime() - Date.now();

      if (ms <= 0) {
        setDisplay('Breached');
        return;
      }

      const d = Math.floor(ms / 86_400_000);
      const h = Math.floor((ms % 86_400_000) / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1_000);
      setDisplay(`${d}d ${h}h ${m}m ${s}s`);
    };

    tick();
    const id = setInterval(tick, 1_000);
    return () => clearInterval(id);
  }, [step.startedAt, step.maximumDurationMinutes]);

  if (
    !step.startedAt ||
    !step.maximumDurationMinutes ||
    step.slaStatus === JobWorkflowStepResponseSlaStatusEnum.NotApplicable ||
    step.status === JobWorkflowStepResponseStatusEnum.Completed ||
    step.status === JobWorkflowStepResponseStatusEnum.Skipped
  ) {
    return null;
  }

  const sla = step.slaStatus;
  const isBreached = sla === JobWorkflowStepResponseSlaStatusEnum.Breached || display === 'Breached';
  const slaVariant = isBreached
    ? 'breached'
    : sla === JobWorkflowStepResponseSlaStatusEnum.AttentionNeeded
      ? 'attention'
      : 'on_track';

  const label = isBreached && display === 'Breached' ? 'SLA BREACHED' : (display || '...');

  return (
    <Tooltip title="Time remaining until SLA breach" placement="top">
      <S.SlaTimerChip
        icon={<TimerIcon />}
        label={label}
        size="small"
        slaVariant={slaVariant}
      />
    </Tooltip>
  );
};

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

const formatStepDate = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  const strTime = `${hours.toString().padStart(2, '0')}:${minutes}${ampm}`;
  return `${day}/${month}/${year} (${strTime})`;
};

const formatDuration = (minutes?: number) => {
  if (minutes == null) return '';
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  
  const parts = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  
  return parts.length > 0 ? parts.join(' ') : '0 hours';
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

  const handleAssignedChange = async (step: JobWorkflowStepResponse, workerIds: number[]) => {
    if (!step.id || !jobWorkflow?.id) return;

    try {
      setUpdatingStep(step.id);
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, {
        assignedWorkerIds: workerIds,
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
      showSuccess('Workfloow name updated successfully');
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
          <S.WorkflowSidebarTitle>Workfloow Name</S.WorkflowSidebarTitle>
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
          <S.WorkflowSidebarTitle>Workfloow Name</S.WorkflowSidebarTitle>
          <IconButton size="small">
            <EditIcon fontSize="small" />
          </IconButton>
        </S.WorkflowSidebarHeader>
        <Box px={2} py={3}>
          <S.PlaceholderText>No workfloow assigned to this job</S.PlaceholderText>
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
              {workflow?.name || 'Workfloow Name'}
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
            <IconButton size="small" onClick={handleCancelWorkflowNameEdit} aria-label="Cancel workflow name edit">
              <CloseIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" onClick={handleSaveWorkflowName} disabled={savingWorkflowName} aria-label="Save workflow name">
              <SaveIcon fontSize="small" />
            </IconButton>
          </Box>
        ) : (
          <IconButton size="small" onClick={handleEditWorkflowName} aria-label="Edit workflow name">
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
          const assignedWorkerIdsList = Array.from(step.assignedWorkerIds || []);
          const assignedWorker = assignedWorkerIdsList.length > 0
            ? workers.get(assignedWorkerIdsList[0]) ?? null
            : null;
          const selectedWorkers = assignedWorkerIdsList
            .map((id) => allWorkers.find((w) => w.id === id) ?? workers.get(id))
            .filter((w): w is WorkerResponse => !!w);

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
                      <IconButton size="small" onClick={(e) => handleCancelStepNameEdit(e)} aria-label="Cancel step name edit">
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={(e) => handleSaveStepName(step, e)}
                        disabled={updatingStep === step.id}
                        aria-label="Save step name"
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
                  <SlaTimer step={step} />
                </Box>

                {/* Expanded Details */}
                <Collapse in={isExpanded}>
                  <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
                    {/* Duration section */}
                    {step.expectedDurationMinutes != null && (
                      <S.StepDetailRow>
                        <span className="label">Expected Duration Time</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>
                          {formatDuration(step.expectedDurationMinutes)}
                        </span>
                      </S.StepDetailRow>
                    )}
                    {step.maximumDurationMinutes != null && (
                      <S.StepDetailRow>
                        <span className="label">Maximum Duration Time</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>
                          {formatDuration(step.maximumDurationMinutes)}
                        </span>
                      </S.StepDetailRow>
                    )}

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

                    {/* Dates section */}
                    {step.startedAt && (
                      <S.StepDetailRow>
                        <span className="label">Started At</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>
                          {formatStepDate(step.startedAt)}
                        </span>
                      </S.StepDetailRow>
                    )}
                    {step.completedAt && (
                      <S.StepDetailRow>
                        <span className="label">Completed At</span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: '#333' }}>
                          {formatStepDate(step.completedAt)}
                        </span>
                      </S.StepDetailRow>
                    )}

                    {/* Assigned Dropdown */}
                    <S.AssignedRow>
                      <span className="label">Assigned</span>
                      <S.AssignedAutocompleteWrapper>
                        <Autocomplete
                          multiple
                          fullWidth
                          options={allWorkers}
                          value={selectedWorkers}
                          getOptionLabel={(option) => option.name || ''}
                          isOptionEqualToValue={(option, value) => option.id === value.id}
                          onChange={(_, newValue) =>
                            handleAssignedChange(step, newValue.map((w) => w.id!))
                          }
                          disabled={updatingStep === step.id}
                          disablePortal
                          disableCloseOnSelect
                          size="small"
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={selectedWorkers.length === 0 ? 'Unassigned' : ''}
                              size="small"
                            />
                          )}
                          renderOption={(props, option, { selected }) => {
                            const { key, ...rest } = props as React.HTMLAttributes<HTMLLIElement> & { key: React.Key };
                            return (
                              <S.WorkerMenuItem key={key} {...rest} selected={selected}>
                                {option.name}
                              </S.WorkerMenuItem>
                            );
                          }}
                          renderTags={(value, getTagProps) =>
                            value.map((option, index) => {
                              const tagProps = getTagProps({ index });
                              return (
                                <S.AssignedWorkerChip
                                  {...tagProps}
                                  key={tagProps.key}
                                  label={option.name}
                                  size="small"
                                />
                              );
                            })
                          }
                        />
                      </S.AssignedAutocompleteWrapper>
                    </S.AssignedRow>

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
