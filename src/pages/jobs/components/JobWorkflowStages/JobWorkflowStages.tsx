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
import { styles } from './JobWorkflowStages.styles';

// ─── SLA Timer ────────────────────────────────────────────────────────────────

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

// ─── Types ────────────────────────────────────────────────────────────────────

interface JobWorkflowStagesProps {
  job: JobResponse;
  onStepUpdate?: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusInfo = (status?: string) => {
  switch (status) {
    case JobWorkflowStepResponseStatusEnum.Completed:
      return { label: 'COMPLETED', isCompleted: true,  isInProgress: false, isDelayed: false, chipBg: '#E8F5E9', chipColor: '#2E7D32' };
    case JobWorkflowStepResponseStatusEnum.Started:
      return { label: 'STARTED',   isCompleted: false, isInProgress: true,  isDelayed: false, chipBg: '#E3F2FD', chipColor: '#1565C0' };
    case JobWorkflowStepResponseStatusEnum.Ongoing:
      return { label: 'ONGOING',   isCompleted: false, isInProgress: true,  isDelayed: false, chipBg: '#E3F2FD', chipColor: '#1565C0' };
    case JobWorkflowStepResponseStatusEnum.Pending:
      return { label: 'PENDING',   isCompleted: false, isInProgress: false, isDelayed: false, chipBg: '#FFF8E1', chipColor: '#F9A825' };
    case JobWorkflowStepResponseStatusEnum.Skipped:
      return { label: 'SKIPPED',   isCompleted: false, isInProgress: false, isDelayed: true,  chipBg: '#FFEBEE', chipColor: '#C62828' };
    case JobWorkflowStepResponseStatusEnum.Initiated:
      return { label: 'INITIATED', isCompleted: false, isInProgress: false, isDelayed: false, chipBg: '#F3E5F5', chipColor: '#7B1FA2' };
    case JobWorkflowStepResponseStatusEnum.NotStarted:
    default:
      return { label: 'NOT_STARTED', isCompleted: false, isInProgress: false, isDelayed: false, chipBg: '#F5F5F5', chipColor: '#616161' };
  }
};

const formatStepDate = (isoString?: string) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  const day     = date.getDate().toString().padStart(2, '0');
  const month   = (date.getMonth() + 1).toString().padStart(2, '0');
  const year    = date.getFullYear();
  let   hours   = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm    = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;
  return `${day}/${month}/${year} (${hours.toString().padStart(2, '0')}:${minutes}${ampm})`;
};

const formatDuration = (minutes?: number) => {
  if (minutes == null) return '';
  const days  = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const parts: string[] = [];
  if (days  > 0) parts.push(`${days} day${days   > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(' ') : '0 hours';
};

// ─── Component ────────────────────────────────────────────────────────────────

export const JobWorkflowStages: React.FC<JobWorkflowStagesProps> = ({ job, onStepUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [jobWorkflow, setJobWorkflow]               = useState<JobWorkflowResponse | null>(null);
  const [workflow, setWorkflow]                     = useState<WorkflowResponse | null>(null);
  const [loading, setLoading]                       = useState(true);
  const [expandedStepId, setExpandedStepId]         = useState<number | null>(null);
  const [workers, setWorkers]                       = useState<Map<number, WorkerResponse>>(new Map());
  const [allWorkers, setAllWorkers]                 = useState<WorkerResponse[]>([]);
  const [editingStepId, setEditingStepId]           = useState<number | null>(null);
  const [editingNotes, setEditingNotes]             = useState<string>('');
  const [savingNotes, setSavingNotes]               = useState(false);
  const [updatingStep, setUpdatingStep]             = useState<number | null>(null);
  const [editingWorkflowName, setEditingWorkflowName] = useState(false);
  const [workflowNameValue, setWorkflowNameValue]   = useState('');
  const [savingWorkflowName, setSavingWorkflowName] = useState(false);
  const [editingStepNameId, setEditingStepNameId]   = useState<number | null>(null);
  const [stepNameValue, setStepNameValue]           = useState('');
  const [editingDurationStepId, setEditingDurationStepId] = useState<number | null>(null);
  const [editingDurationType, setEditingDurationType]     = useState<'expected' | 'maximum' | null>(null);
  const [editDays, setEditDays]   = useState<number | string>('');
  const [editHours, setEditHours] = useState<number | string>('');

  // ─── Data fetching ──────────────────────────────────────────────────────────

  const fetchJobWorkflow = useCallback(async () => {
    if (!job.id) { setLoading(false); return; }

    try {
      setLoading(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      setJobWorkflow(response.data);

      if (job.workflowId) {
        const workflowResponse = await workflowService.getWorkflowById(job.workflowId);
        setWorkflow(workflowResponse.data);
        setWorkflowNameValue(workflowResponse.data.name || '');
      }

      const workerIds = new Set<number>();
      response.data.steps?.forEach((step) => {
        step.assignedWorkerIds?.forEach((id) => workerIds.add(id));
      });

      if (workerIds.size > 0) {
        const workerPromises = Array.from(workerIds).map((id) =>
          workerService.getWorkerById(id).catch(() => null)
        );
        const workerResponses = await Promise.all(workerPromises);
        const workerMap = new Map<number, WorkerResponse>();
        workerResponses.forEach((res) => {
          if (res?.data?.id) workerMap.set(res.data.id, res.data);
        });
        setWorkers(workerMap);
      }

      const allWorkersResponse = await workerService.getAllWorkers();
      setAllWorkers(allWorkersResponse.data || []);

      const activeStep = response.data.steps?.find(
        (step) =>
          step.status !== JobWorkflowStepResponseStatusEnum.Completed &&
          step.status !== JobWorkflowStepResponseStatusEnum.Skipped
      );
      if (activeStep?.id) setExpandedStepId(activeStep.id);
    } catch {
      console.log('No workflow found for job:', job.id);
      setJobWorkflow(null);
    } finally {
      setLoading(false);
    }
  }, [job.id, job.workflowId]);

  useEffect(() => { fetchJobWorkflow(); }, [fetchJobWorkflow]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const toggleStep = (stepId: number) =>
    setExpandedStepId(expandedStepId === stepId ? null : stepId);

  const handleEditNotes = (step: JobWorkflowStepResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.id) { setEditingStepId(step.id); setEditingNotes(step.description || ''); }
  };

  const handleCancelEdit = () => { setEditingStepId(null); setEditingNotes(''); };

  const handleSaveNotes = async (step: JobWorkflowStepResponse) => {
    if (!step.id || !jobWorkflow?.id) return;
    try {
      setSavingNotes(true);
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, { description: editingNotes });
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
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, { status: newStatus as any });
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
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, { assignedWorkerIds: workerIds });
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

  const handleEditWorkflowName = () => setEditingWorkflowName(true);

  const handleCancelWorkflowNameEdit = () => {
    setEditingWorkflowName(false);
    setWorkflowNameValue(workflow?.name || '');
  };

  const handleSaveWorkflowName = async () => {
    if (!job.workflowId || !workflowNameValue.trim()) return;
    try {
      setSavingWorkflowName(true);
      await workflowService.updateWorkflow(job.workflowId, { name: workflowNameValue.trim() });
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

  const handleEditStepName = (step: JobWorkflowStepResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.id) { setEditingStepNameId(step.id); setStepNameValue(step.name || ''); }
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
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, { name: stepNameValue.trim() });
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

  const handleEditDuration = (step: JobWorkflowStepResponse, type: 'expected' | 'maximum', e: React.MouseEvent) => {
    e.stopPropagation();
    if (step.id) {
      setEditingDurationStepId(step.id);
      setEditingDurationType(type);
      const minutes = type === 'expected' ? step.expectedDurationMinutes : step.maximumDurationMinutes;
      const m = minutes || 0;
      setEditDays(Math.floor(m / (24 * 60)));
      setEditHours(Math.floor((m % (24 * 60)) / 60));
    }
  };

  const handleCancelEditDuration = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingDurationStepId(null);
    setEditingDurationType(null);
  };

  const handleSaveDuration = async (
    step: JobWorkflowStepResponse,
    type: 'expected' | 'maximum',
    e: React.MouseEvent | React.KeyboardEvent,
  ) => {
    e.stopPropagation();
    if (!step.id || !jobWorkflow?.id) return;
    const totalMinutes = (Number(editDays) || 0) * 24 * 60 + (Number(editHours) || 0) * 60;
    try {
      setUpdatingStep(step.id);
      const payload = type === 'expected'
        ? { expectedDurationMinutes: totalMinutes }
        : { maximumDurationMinutes: totalMinutes };
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, payload);
      showSuccess(`${type === 'expected' ? 'Expected' : 'Maximum'} duration updated`);
      setEditingDurationStepId(null);
      setEditingDurationType(null);
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (error) {
      console.error('Error updating duration:', error);
      showError('Failed to update duration');
    } finally {
      setUpdatingStep(null);
    }
  };

  // ─── Derived state ───────────────────────────────────────────────────────────

  const sortedSteps = jobWorkflow?.steps
    ? [...jobWorkflow.steps].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
    : [];

  // ─── Loading state ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <S.WorkflowSidebar>
        <S.WorkflowSidebarHeader>
          <S.WorkflowSidebarTitle>Workflow Name</S.WorkflowSidebarTitle>
        </S.WorkflowSidebarHeader>
        <Box sx={styles.loadingContainer}>
          <CircularProgress size={32} />
        </Box>
      </S.WorkflowSidebar>
    );
  }

  // ─── Empty state ─────────────────────────────────────────────────────────────

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

  // ─── Main render ─────────────────────────────────────────────────────────────

  return (
    <S.WorkflowSidebar>
      {/* ── Header ── */}
      <S.WorkflowSidebarHeader>
        <S.WorkflowSidebarTitle>
          {editingWorkflowName ? (
            <TextField
              size="small"
              value={workflowNameValue}
              onChange={(e) => setWorkflowNameValue(e.target.value)}
              autoFocus
              sx={styles.workflowNameTextField}
            />
          ) : (
            <>
              {workflow?.name || 'Workflow Name'}
              <Box component="span" sx={styles.workflowNameAvatarRow}>
                {Array.from(workers.values())
                  .slice(0, 2)
                  .map((worker) => (
                    <Box key={worker.id} sx={styles.workerAvatar}>
                      {worker.initials || worker.name?.substring(0, 2).toUpperCase()}
                    </Box>
                  ))}
              </Box>
            </>
          )}
        </S.WorkflowSidebarTitle>

        {editingWorkflowName ? (
          <Box sx={styles.workflowNameEditButtons}>
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

      {/* ── Timeline list ── */}
      <Box sx={styles.timelineList}>
        {sortedSteps.map((step, index) => {
          const statusInfo = getStatusInfo(step.status);
          const isLast     = index === sortedSteps.length - 1;
          const isExpanded = step.id === expandedStepId;

          const assignedWorkerIdsList = Array.from(step.assignedWorkerIds || []);
          const assignedWorker        = assignedWorkerIdsList.length > 0
            ? workers.get(assignedWorkerIdsList[0]) ?? null
            : null;
          const selectedWorkers = assignedWorkerIdsList
            .map((id) => allWorkers.find((w) => w.id === id) ?? workers.get(id))
            .filter((w): w is WorkerResponse => !!w);

          // Resolve which node style to use
          const nodeStyle = statusInfo.isCompleted
            ? styles.timelineNodeCompleted
            : statusInfo.isInProgress
              ? styles.timelineNodeInProgress
              : statusInfo.isDelayed
                ? styles.timelineNodeDelayed
                : styles.timelineNodeDefault;

          return (
            <Box key={step.id || index} sx={styles.stepRow}>
              {/* Connector line */}
              {!isLast && (
                <Box sx={statusInfo.isCompleted ? styles.timelineLineCompleted : styles.timelineLinePending} />
              )}

              {/* Node */}
              <Box onClick={() => step.id && toggleStep(step.id)} sx={nodeStyle}>
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
              <Box sx={styles.stepContent}>

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
                        sx={styles.stepNameTextField}
                      />
                      <IconButton size="small" onClick={handleCancelStepNameEdit} aria-label="Cancel step name edit">
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
                <Box sx={styles.stepDescription}>
                  {step.description || 'No description'}
                </Box>

                {/* Chips row */}
                <Box onClick={() => step.id && toggleStep(step.id)} sx={styles.chipsRow}>
                  <Chip
                    label={statusInfo.label}
                    size="small"
                    sx={{
                      ...styles.statusChip,
                      backgroundColor: statusInfo.chipBg,
                      color: statusInfo.chipColor,
                    }}
                  />
                  {assignedWorker && (
                    <Chip label="YOU" size="small" sx={styles.assignedChip} />
                  )}
                  <SlaTimer step={step} />
                </Box>

                {/* Expanded details */}
                <Collapse in={isExpanded}>
                  <Box sx={styles.expandedPanel}>

                    {/* Expected duration */}
                    {step.expectedDurationMinutes != null && (
                      <S.StepDetailRow>
                        <span className="label">Expected Duration Time</span>
                        {editingDurationStepId === step.id && editingDurationType === 'expected' ? (
                          <Box sx={styles.durationEditRow} onClick={(e) => e.stopPropagation()}>
                            <TextField
                              type="number" size="small" value={editDays}
                              onChange={(e) => setEditDays(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveDuration(step, 'expected', e); }}
                              sx={styles.durationTextField}
                            />
                            <span style={styles.durationLabel}>day</span>
                            <TextField
                              type="number" size="small" value={editHours}
                              onChange={(e) => setEditHours(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveDuration(step, 'expected', e); }}
                              sx={styles.durationTextField}
                            />
                            <span style={styles.durationLabel}>hours</span>
                            <IconButton size="small" onClick={handleCancelEditDuration}>
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => handleSaveDuration(step, 'expected', e)} disabled={updatingStep === step.id}>
                              <SaveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={styles.durationValueBox}>
                            <span style={styles.durationValueText}>{formatDuration(step.expectedDurationMinutes)}</span>
                            <IconButton size="small" onClick={(e) => handleEditDuration(step, 'expected', e)} sx={styles.durationEditIconButton}>
                              <EditIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        )}
                      </S.StepDetailRow>
                    )}

                    {/* Maximum duration */}
                    {step.maximumDurationMinutes != null && (
                      <S.StepDetailRow>
                        <span className="label">Maximum Duration Time</span>
                        {editingDurationStepId === step.id && editingDurationType === 'maximum' ? (
                          <Box sx={styles.durationEditRow} onClick={(e) => e.stopPropagation()}>
                            <TextField
                              type="number" size="small" value={editDays}
                              onChange={(e) => setEditDays(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveDuration(step, 'maximum', e); }}
                              sx={styles.durationTextField}
                            />
                            <span style={styles.durationLabel}>day</span>
                            <TextField
                              type="number" size="small" value={editHours}
                              onChange={(e) => setEditHours(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleSaveDuration(step, 'maximum', e); }}
                              sx={styles.durationTextField}
                            />
                            <span style={styles.durationLabel}>hours</span>
                            <IconButton size="small" onClick={handleCancelEditDuration}>
                              <CloseIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <IconButton size="small" onClick={(e) => handleSaveDuration(step, 'maximum', e)} disabled={updatingStep === step.id}>
                              <SaveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        ) : (
                          <Box sx={styles.durationValueBox}>
                            <span style={styles.durationValueText}>{formatDuration(step.maximumDurationMinutes)}</span>
                            <IconButton size="small" onClick={(e) => handleEditDuration(step, 'maximum', e)} sx={styles.durationEditIconButton}>
                              <EditIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        )}
                      </S.StepDetailRow>
                    )}

                    {/* Status dropdown */}
                    <S.StepDetailRow>
                      <span className="label">Status</span>
                      <FormControl size="small" sx={styles.statusSelect}>
                        <Select
                          value={step.status || JobWorkflowStepResponseStatusEnum.NotStarted}
                          onChange={(e: SelectChangeEvent) => handleStatusChange(step, e.target.value)}
                          disabled={updatingStep === step.id}
                          sx={styles.statusSelectInput}
                        >
                          {Object.entries(JobWorkflowStepResponseStatusEnum).map(([key, value]) => {
                            const info = getStatusInfo(value);
                            return (
                              <MenuItem key={key} value={value} sx={{ fontSize: 12 }}>
                                <Chip
                                  label={info.label}
                                  size="small"
                                  sx={{
                                    ...styles.statusMenuItemChip,
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

                    {/* Dates */}
                    {step.startedAt && (
                      <S.StepDetailRow>
                        <span className="label">Started At</span>
                        <span style={styles.dateValueText}>{formatStepDate(step.startedAt)}</span>
                      </S.StepDetailRow>
                    )}
                    {step.completedAt && (
                      <S.StepDetailRow>
                        <span className="label">Completed At</span>
                        <span style={styles.dateValueText}>{formatStepDate(step.completedAt)}</span>
                      </S.StepDetailRow>
                    )}

                    {/* Assigned */}
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

                    {/* Notes */}
                    <S.EventNoteBox>
                      <S.EventNoteHeader>
                        <S.EventNoteTitle>Notes</S.EventNoteTitle>
                        {editingStepId === step.id ? (
                          <Box sx={styles.notesEditButtonRow}>
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
                          sx={styles.notesTextField}
                        />
                      ) : (
                        <S.EventNoteContent>{step.description || 'No notes added yet.'}</S.EventNoteContent>
                      )}
                    </S.EventNoteBox>

                    {/* Attachments */}
                    {step.id && <StepAttachmentsSection stepId={step.id} onUpdate={onStepUpdate} />}

                    {/* Comments */}
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