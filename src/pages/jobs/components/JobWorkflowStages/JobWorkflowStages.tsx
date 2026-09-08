import React, { useEffect, useState, useCallback } from 'react';
import {
  CircularProgress,
  IconButton,
  TextField,
  MenuItem,
  Collapse,
  Autocomplete,
  Tooltip,
} from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CloseIcon from '@mui/icons-material/Close';
import TimerIcon from '@mui/icons-material/Timer';

import type { JobResponse, WorkerResponse, WorkflowResponse } from '../../../../services/api';
import { jobWorkflowService, workerService, workflowService } from '../../../../services/api';
import type { JobWorkflowResponse, JobWorkflowStepResponse } from '../../../../services/api';
import { JobWorkflowStepResponseStatusEnum, JobWorkflowStepResponseSlaStatusEnum, type JobWorkflowStepCreateRequest } from '../../../../../workflow-api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { StepCommentsSection } from './StepCommentsSection';
import { StepAttachmentsSection } from './StepAttachmentsSection';
import { AddStepModal } from './AddStepModal';
import * as SPage from '../../JobDetailsPage.styles';
import * as S from './JobWorkflowStages.styles';

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
      <SPage.SlaTimerChip
        icon={<TimerIcon />}
        label={label}
        size="small"
        slaVariant={slaVariant}
      />
    </Tooltip>
  );
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const getStatusInfo = (status?: string) => {
  switch (status) {
    case JobWorkflowStepResponseStatusEnum.Completed:
      return { label: 'COMPLETED', isCompleted: true, isInProgress: false, isDelayed: false, chipBg: '#E8F5E9', chipColor: '#2E7D32', variant: 'completed' as const };
    case JobWorkflowStepResponseStatusEnum.Started:
    case JobWorkflowStepResponseStatusEnum.Ongoing:
      return { label: status === JobWorkflowStepResponseStatusEnum.Started ? 'STARTED' : 'ONGOING', isCompleted: false, isInProgress: true, isDelayed: false, chipBg: '#E3F2FD', chipColor: '#1565C0', variant: 'inProgress' as const };
    case JobWorkflowStepResponseStatusEnum.Pending:
      return { label: 'PENDING', isCompleted: false, isInProgress: false, isDelayed: false, chipBg: '#FFF8E1', chipColor: '#F9A825', variant: 'default' as const };
    case JobWorkflowStepResponseStatusEnum.Skipped:
      return { label: 'SKIPPED', isCompleted: true, isInProgress: false, isDelayed: false, chipBg: '#F3F4F6', chipColor: '#4B5563', variant: 'completed' as const };
    case JobWorkflowStepResponseStatusEnum.Initiated:
      return { label: 'INITIATED', isCompleted: false, isInProgress: false, isDelayed: false, chipBg: '#F3E5F5', chipColor: '#7B1FA2', variant: 'default' as const };
    case JobWorkflowStepResponseStatusEnum.NotStarted:
    default:
      return { label: 'NOT_STARTED', isCompleted: false, isInProgress: false, isDelayed: false, chipBg: '#F5F5F5', chipColor: '#616161', variant: 'default' as const };
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
  hours = hours % 12 || 12;
  return `${day}/${month}/${year} (${hours.toString().padStart(2, '0')}:${minutes}${ampm})`;
};

const formatDuration = (minutes?: number) => {
  if (minutes == null) return '';
  const days = Math.floor(minutes / (24 * 60));
  const hours = Math.floor((minutes % (24 * 60)) / 60);
  const parts: string[] = [];
  if (days > 0) parts.push(`${days} day${days > 1 ? 's' : ''}`);
  if (hours > 0) parts.push(`${hours} hour${hours > 1 ? 's' : ''}`);
  return parts.length > 0 ? parts.join(' ') : '0 hours';
};

// ─── Interfaces ───────────────────────────────────────────────────────────────

interface JobWorkflowStagesProps {
  job: JobResponse;
  onStepUpdate?: () => void;
}

interface SortableStepRowProps {
  step: JobWorkflowStepResponse;
  index: number;
  isLast: boolean;
  isExpanded: boolean;
  isReordering: boolean;
  editingStepNameId: number | null;
  stepNameValue: string;
  updatingStep: number | null;
  editingNotes: string;
  editingStepId: number | null;
  savingNotes: boolean;
  editingDurationStepId: number | null;
  editingDurationType: 'expected' | 'maximum' | null;
  editDays: number | string;
  editHours: number | string;
  workers: Map<number, WorkerResponse>;
  allWorkers: WorkerResponse[];
  onToggleStep: (stepId: number) => void;
  onStartEditStepName: (step: JobWorkflowStepResponse, e: React.MouseEvent) => void;
  onCancelEditStepName: (e: React.MouseEvent) => void;
  onSaveStepName: (step: JobWorkflowStepResponse, e: React.MouseEvent) => void;
  onDeleteStep: (step: JobWorkflowStepResponse, e: React.MouseEvent) => void;
  onStatusChange: (step: JobWorkflowStepResponse, newStatus: string) => void;
  onAssignedChange: (step: JobWorkflowStepResponse, workerIds: number[]) => void;
  onEditNotes: (step: JobWorkflowStepResponse, e: React.MouseEvent) => void;
  onCancelEditNotes: () => void;
  onSaveNotes: (step: JobWorkflowStepResponse) => void;
  onEditDuration: (step: JobWorkflowStepResponse, type: 'expected' | 'maximum', e: React.MouseEvent) => void;
  onCancelEditDuration: (e: React.MouseEvent) => void;
  onSaveDuration: (step: JobWorkflowStepResponse, type: 'expected' | 'maximum', e: React.MouseEvent | React.KeyboardEvent) => void;
  onStepUpdate?: () => void;
  setStepNameValue: (val: string) => void;
  setEditingNotes: (val: string) => void;
  setEditDays: (val: number | string) => void;
  setEditHours: (val: number | string) => void;
}

// ─── Sortable Step Component ──────────────────────────────────────────────────

const SortableStepRow: React.FC<SortableStepRowProps> = ({
  step,
  index,
  isLast,
  isExpanded,
  isReordering,
  editingStepNameId,
  stepNameValue,
  updatingStep,
  editingNotes,
  editingStepId,
  savingNotes,
  editingDurationStepId,
  editingDurationType,
  editDays,
  editHours,
  workers,
  allWorkers,
  onToggleStep,
  onStartEditStepName,
  onCancelEditStepName,
  onSaveStepName,
  onDeleteStep,
  onStatusChange,
  onAssignedChange,
  onEditNotes,
  onCancelEditNotes,
  onSaveNotes,
  onEditDuration,
  onCancelEditDuration,
  onSaveDuration,
  onStepUpdate,
  setStepNameValue,
  setEditingNotes,
  setEditDays,
  setEditHours,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: `step-${step.id}`,
    disabled: !isReordering,
  });

  const dndStyle = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const statusInfo = getStatusInfo(step.status);
  const assignedWorkerIdsList = Array.from(step.assignedWorkerIds || []);
  const assignedWorker = assignedWorkerIdsList.length > 0 ? workers.get(assignedWorkerIdsList[0]) ?? null : null;
  const selectedWorkers = assignedWorkerIdsList
    .map((id) => allWorkers.find((w) => w.id === id) ?? workers.get(id))
    .filter((w): w is WorkerResponse => !!w);

  return (
    <>
      {/* ── Re-Order mode: compact draggable title row only ── */}
      {isReordering ? (
        <S.ReorderDragRow ref={setNodeRef} style={dndStyle} {...attributes} {...listeners}>
          <S.DragIcon />
          <S.ReorderDragIndex>{index + 1}</S.ReorderDragIndex>
          <S.ReorderDragTitle>{step.name || `Step ${index + 1}`}</S.ReorderDragTitle>
        </S.ReorderDragRow>
      ) : (
        /* ── Normal mode: full step row ── */
        <S.StepRowContainer ref={setNodeRef} style={dndStyle}>
          {/* Connector line */}
          {!isLast && (
            statusInfo.isCompleted ? <S.TimelineLineCompleted /> : <S.TimelineLinePending />
          )}

          {/* Node */}
          <S.TimelineNode
            statusVariant={statusInfo.variant}
            onClick={() => step.id && onToggleStep(step.id)}
          >
            {statusInfo.isCompleted ? (
              <S.NodeIconCheck />
            ) : statusInfo.isInProgress ? (
              <S.NodeIconPlay />
            ) : statusInfo.isDelayed ? (
              <S.NodeIconClose />
            ) : (
              index + 1
            )}
          </S.TimelineNode>

          {/* Step Content */}
          <S.StepContentBox>
            {/* Step Title Header */}
            <S.StepTitleHeaderRow>
              {editingStepNameId === step.id ? (
                <S.StepTitleEditWrapper>
                  <S.StepTitleIndexSpan>{index + 1}.</S.StepTitleIndexSpan>
                  <S.StepTitleTextField
                    size="small"
                    value={stepNameValue}
                    onChange={(e) => setStepNameValue(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    autoFocus
                  />
                  <S.ActionIconButton size="small" onClick={onCancelEditStepName} aria-label="Cancel step name edit">
                    <S.SmallIconClose />
                  </S.ActionIconButton>
                  <S.ActionIconButton
                    size="small"
                    onClick={(e) => onSaveStepName(step, e)}
                    disabled={updatingStep === step.id}
                    aria-label="Save step name"
                  >
                    <S.SmallIconSave />
                  </S.ActionIconButton>
                </S.StepTitleEditWrapper>
              ) : (
                <>
                  <SPage.StepTitleText onClick={() => step.id && onToggleStep(step.id)}>
                    {index + 1}. {step.name || `Step ${index + 1}`}
                  </SPage.StepTitleText>

                  {/* Action Buttons */}
                  <S.StepActionButtonsBox>
                    <S.ActionIconButton
                      size="small"
                      onClick={(e) => onStartEditStepName(step, e)}
                      aria-label="Edit step title"
                      title="Edit Step Title"
                    >
                      <S.SmallIconEdit />
                    </S.ActionIconButton>
                    <S.DeleteActionButton
                      size="small"
                      onClick={(e) => onDeleteStep(step, e)}
                      disabled={updatingStep === step.id || step.status === JobWorkflowStepResponseStatusEnum.Skipped}
                      aria-label="Skip step"
                      title="Skip Step"
                    >
                      <S.SmallIconDelete />
                    </S.DeleteActionButton>
                  </S.StepActionButtonsBox>
                </>
              )}
            </S.StepTitleHeaderRow>

            {/* Step description */}
            <S.StepDescriptionText>
              {step.description || 'No description'}
            </S.StepDescriptionText>

            {/* Chips row */}
            <S.ChipsRowBox onClick={() => step.id && onToggleStep(step.id)}>
              <S.StyledStatusChip
                label={statusInfo.label}
                size="small"
                chipbg={statusInfo.chipBg}
                chipcolor={statusInfo.chipColor}
              />
              {assignedWorker && (
                <S.AssignedYouChip label="YOU" size="small" />
              )}
              <SlaTimer step={step} />
            </S.ChipsRowBox>

            {/* Expanded details */}
            <Collapse in={isExpanded}>
              <S.ExpandedPanelBox>
                {/* Expected duration */}
                {step.expectedDurationMinutes != null && (
                  <SPage.StepDetailRow>
                    <span className="label">Expected Duration Time</span>
                    {editingDurationStepId === step.id && editingDurationType === 'expected' ? (
                      <S.DurationEditRowBox onClick={(e) => e.stopPropagation()}>
                        <S.DurationNumberInput
                          type="number" size="small" value={editDays}
                          onChange={(e) => setEditDays(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') onSaveDuration(step, 'expected', e); }}
                        />
                        <S.DurationUnitText>day</S.DurationUnitText>
                        <S.DurationNumberInput
                          type="number" size="small" value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') onSaveDuration(step, 'expected', e); }}
                        />
                        <S.DurationUnitText>hours</S.DurationUnitText>
                        <S.ActionIconButton size="small" onClick={onCancelEditDuration}>
                          <S.SmallIconClose />
                        </S.ActionIconButton>
                        <S.ActionIconButton size="small" onClick={(e) => onSaveDuration(step, 'expected', e)} disabled={updatingStep === step.id}>
                          <S.SmallIconSave />
                        </S.ActionIconButton>
                      </S.DurationEditRowBox>
                    ) : (
                      <S.DurationValueBox>
                        <S.DurationValueText>{formatDuration(step.expectedDurationMinutes)}</S.DurationValueText>
                        <S.ActionIconButton size="small" onClick={(e) => onEditDuration(step, 'expected', e)}>
                          <S.SmallIconEdit />
                        </S.ActionIconButton>
                      </S.DurationValueBox>
                    )}
                  </SPage.StepDetailRow>
                )}

                {/* Maximum duration */}
                {step.maximumDurationMinutes != null && (
                  <SPage.StepDetailRow>
                    <span className="label">Maximum Duration Time</span>
                    {editingDurationStepId === step.id && editingDurationType === 'maximum' ? (
                      <S.DurationEditRowBox onClick={(e) => e.stopPropagation()}>
                        <S.DurationNumberInput
                          type="number" size="small" value={editDays}
                          onChange={(e) => setEditDays(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') onSaveDuration(step, 'maximum', e); }}
                        />
                        <S.DurationUnitText>day</S.DurationUnitText>
                        <S.DurationNumberInput
                          type="number" size="small" value={editHours}
                          onChange={(e) => setEditHours(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') onSaveDuration(step, 'maximum', e); }}
                        />
                        <S.DurationUnitText>hours</S.DurationUnitText>
                        <S.ActionIconButton size="small" onClick={onCancelEditDuration}>
                          <S.SmallIconClose />
                        </S.ActionIconButton>
                        <S.ActionIconButton size="small" onClick={(e) => onSaveDuration(step, 'maximum', e)} disabled={updatingStep === step.id}>
                          <S.SmallIconSave />
                        </S.ActionIconButton>
                      </S.DurationEditRowBox>
                    ) : (
                      <S.DurationValueBox>
                        <S.DurationValueText>{formatDuration(step.maximumDurationMinutes)}</S.DurationValueText>
                        <S.ActionIconButton size="small" onClick={(e) => onEditDuration(step, 'maximum', e)}>
                          <S.SmallIconEdit />
                        </S.ActionIconButton>
                      </S.DurationValueBox>
                    )}
                  </SPage.StepDetailRow>
                )}

                {/* Status dropdown */}
                <SPage.StepDetailRow>
                  <span className="label">Status</span>
                  <S.StatusSelectControl size="small">
                    <S.StatusSelectComponent
                      value={step.status || JobWorkflowStepResponseStatusEnum.NotStarted}
                      onChange={(e: any) => onStatusChange(step, e.target.value as string)}
                      disabled={updatingStep === step.id}
                    >
                      {Object.entries(JobWorkflowStepResponseStatusEnum).map(([key, value]) => {
                        const info = getStatusInfo(value);
                        return (
                          <MenuItem key={key} value={value}>
                            <S.StatusMenuItemChip
                              label={info.label}
                              size="small"
                              chipbg={info.chipBg}
                              chipcolor={info.chipColor}
                            />
                          </MenuItem>
                        );
                      })}
                    </S.StatusSelectComponent>
                  </S.StatusSelectControl>
                </SPage.StepDetailRow>

                {/* Dates */}
                {step.startedAt && (
                  <SPage.StepDetailRow>
                    <span className="label">Started At</span>
                    <S.DateValueText>{formatStepDate(step.startedAt)}</S.DateValueText>
                  </SPage.StepDetailRow>
                )}
                {step.completedAt && (
                  <SPage.StepDetailRow>
                    <span className="label">Completed At</span>
                    <S.DateValueText>{formatStepDate(step.completedAt)}</S.DateValueText>
                  </SPage.StepDetailRow>
                )}

                {/* Assigned */}
                <SPage.AssignedRow>
                  <span className="label">Assigned</span>
                  <SPage.AssignedAutocompleteWrapper>
                    <Autocomplete
                      multiple
                      fullWidth
                      options={allWorkers}
                      value={selectedWorkers}
                      getOptionLabel={(option) => option.name || ''}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={(_, newValue) =>
                        onAssignedChange(step, newValue.map((w) => w.id!))
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
                          <SPage.WorkerMenuItem key={key} {...rest} selected={selected}>
                            {option.name}
                          </SPage.WorkerMenuItem>
                        );
                      }}
                      renderTags={(value, getTagProps) =>
                        value.map((option, tagIndex) => {
                          const tagProps = getTagProps({ index: tagIndex });
                          return (
                            <SPage.AssignedWorkerChip
                              {...tagProps}
                              key={tagProps.key}
                              label={option.name}
                              size="small"
                            />
                          );
                        })
                      }
                    />
                  </SPage.AssignedAutocompleteWrapper>
                </SPage.AssignedRow>

                {/* Notes */}
                <SPage.EventNoteBox>
                  <SPage.EventNoteHeader>
                    <SPage.EventNoteTitle>Notes</SPage.EventNoteTitle>
                    {editingStepId === step.id ? (
                      <S.NotesEditButtonsRow>
                        <SPage.EventNoteEditButton onClick={() => onCancelEditNotes()}>
                          Cancel
                        </SPage.EventNoteEditButton>
                        <SPage.EventNoteEditButton onClick={() => onSaveNotes(step)} disabled={savingNotes}>
                          {savingNotes ? 'Saving...' : 'Save'}
                        </SPage.EventNoteEditButton>
                      </S.NotesEditButtonsRow>
                    ) : (
                      <SPage.EventNoteEditButton onClick={(e) => onEditNotes(step, e)}>Edit</SPage.EventNoteEditButton>
                    )}
                  </SPage.EventNoteHeader>
                  {editingStepId === step.id ? (
                    <S.NotesTextField
                      multiline
                      rows={3}
                      fullWidth
                      size="small"
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                      placeholder="Enter notes..."
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    <SPage.EventNoteContent>{step.description || 'No notes added yet.'}</SPage.EventNoteContent>
                  )}
                </SPage.EventNoteBox>

                {/* Attachments */}
                {step.id && <StepAttachmentsSection stepId={step.id} onUpdate={onStepUpdate} />}

                {/* Comments */}
                {step.id && <StepCommentsSection stepId={step.id} onUpdate={onStepUpdate} />}
              </S.ExpandedPanelBox>
            </Collapse>
          </S.StepContentBox>
        </S.StepRowContainer>
      )}
    </>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const JobWorkflowStages: React.FC<JobWorkflowStagesProps> = ({ job, onStepUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [jobWorkflow, setJobWorkflow] = useState<JobWorkflowResponse | null>(null);
  const [workflow, setWorkflow] = useState<WorkflowResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedStepId, setExpandedStepId] = useState<number | null>(null);
  const [workers, setWorkers] = useState<Map<number, WorkerResponse>>(new Map());
  const [allWorkers, setAllWorkers] = useState<WorkerResponse[]>([]);

  // Re-order mode & local steps state
  const [isReordering, setIsReordering] = useState(false);
  const [localSteps, setLocalSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [savingReorder, setSavingReorder] = useState(false);

  // Add step modal state
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Editing step & workflow states
  const [editingStepId, setEditingStepId] = useState<number | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [updatingStep, setUpdatingStep] = useState<number | null>(null);
  const [editingWorkflowName, setEditingWorkflowName] = useState(false);
  const [workflowNameValue, setWorkflowNameValue] = useState('');
  const [savingWorkflowName, setSavingWorkflowName] = useState(false);
  const [editingStepNameId, setEditingStepNameId] = useState<number | null>(null);
  const [stepNameValue, setStepNameValue] = useState('');
  const [editingDurationStepId, setEditingDurationStepId] = useState<number | null>(null);
  const [editingDurationType, setEditingDurationType] = useState<'expected' | 'maximum' | null>(null);
  const [editDays, setEditDays] = useState<number | string>('');
  const [editHours, setEditHours] = useState<number | string>('');

  // Sensors for Drag and Drop
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

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

      const sorted = response.data.steps
        ? [...response.data.steps].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0))
        : [];
      setLocalSteps(sorted);

      const activeStep = sorted.find(
        (step) =>
          step.status !== JobWorkflowStepResponseStatusEnum.Completed &&
          step.status !== JobWorkflowStepResponseStatusEnum.Skipped
      );
      if (activeStep?.id) setExpandedStepId(activeStep.id);
    } catch {
      console.log('No workflow found for job:', job.id);
      setJobWorkflow(null);
      setLocalSteps([]);
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

  const handleCancelEditNotes = () => { setEditingStepId(null); setEditingNotes(''); };

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
      await jobWorkflowService.updateStep(jobWorkflow.id, step.id, { assignedWorkerIds: workerIds as any });
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

  const handleDeleteStep = (step: JobWorkflowStepResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!step.id || !jobWorkflow?.id) return;
    const stepId = step.id;
    const workflowId = jobWorkflow.id;

    const performSkip = async () => {
      try {
        setUpdatingStep(stepId);
        await jobWorkflowService.updateStep(workflowId, stepId, {
          status: JobWorkflowStepResponseStatusEnum.Skipped as any,
        });
        showSuccess('Step skipped successfully');
        resetGlobalModalOuterProps();
        fetchJobWorkflow();
        onStepUpdate?.();
      } catch (error) {
        console.error('Error skipping step:', error);
        showError(extractErrorMessage(error, 'Failed to skip step'));
      } finally {
        setUpdatingStep(null);
      }
    };

    // Whether this step has related comments/attachments/work logs — and whether that
    // blocks a permanent delete — is decided by the backend automatically; the frontend
    // just triggers the skip and surfaces whatever outcome/message comes back.
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'skipStep',
      children: (
        <ConfirmationModal
          title="Skip Step"
          message="Are you sure you want to skip this step?"
          description="The step will be marked as Skipped and stay visible in the timeline."
          variant="warning"
          confirmButtonText="Skip Step"
          cancelButtonText="Cancel"
          onConfirm={performSkip}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  const handleAddStepSubmit = async (data: JobWorkflowStepCreateRequest) => {
    if (!jobWorkflow?.id) return;
    try {
      await jobWorkflowService.addStep(jobWorkflow.id, data);
      showSuccess('Step added successfully to this job');
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (error) {
      console.error('Error adding step:', error);
      showError('Failed to add step to job');
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

  // ─── Drag & Drop Reorder Handlers (LOCAL state only during drag) ────────────

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = localSteps.findIndex((s) => `step-${s.id}` === active.id);
    const newIndex = localSteps.findIndex((s) => `step-${s.id}` === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Rearrange local state ONLY (no API call during drag)
    const newStepList = arrayMove(localSteps, oldIndex, newIndex);
    setLocalSteps(newStepList);
  };

  // Final batch API call when clicking "Done"
  const handleDoneReordering = async () => {
    if (!jobWorkflow?.id) {
      setIsReordering(false);
      return;
    }

    try {
      setSavingReorder(true);
      const workflowId = jobWorkflow.id;

      // Sequential PATCHes, one at a time — concurrent requests (Promise.all) here
      // intermittently 500 under contention on the backend, more reliably as the
      // number of simultaneous requests grows (confirmed against the live dev API:
      // 0/180 failures sequential vs 2/8 failed batches concurrent on a 9-step
      // workflow). A single write per step is enough — the backend reindexes
      // cleanly without needing an intermediate "parking" value, so there's no
      // temp-offset pass. Steps whose position didn't change are skipped entirely,
      // since a drag typically only shifts the steps between the old and new spot.
      const originalOrderById = new Map((jobWorkflow.steps || []).map((s) => [s.id, s.orderIndex]));
      for (const [idx, step] of localSteps.entries()) {
        if (!step.id) continue;
        const targetIndex = idx + 1;
        if (originalOrderById.get(step.id) === targetIndex) continue;
        await jobWorkflowService.updateStep(workflowId, step.id, { orderIndex: targetIndex });
      }
      showSuccess('Final step re-ordering saved successfully');
      setIsReordering(false);
      fetchJobWorkflow();
      onStepUpdate?.();
    } catch (err) {
      console.error('Error committing reordered steps:', err);
      showError('Failed to save final step order');
      setIsReordering(false);
      fetchJobWorkflow();
    } finally {
      setSavingReorder(false);
    }
  };

  // ─── Loading state ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <SPage.WorkflowSidebar>
        <SPage.WorkflowSidebarHeader>
          <SPage.WorkflowSidebarTitle>Workflow Steps</SPage.WorkflowSidebarTitle>
        </SPage.WorkflowSidebarHeader>
        <S.LoadingContainer>
          <CircularProgress size={32} />
        </S.LoadingContainer>
      </SPage.WorkflowSidebar>
    );
  }

  // ─── Empty state ─────────────────────────────────────────────────────────────

  if (!jobWorkflow || localSteps.length === 0) {
    return (
      <SPage.WorkflowSidebar>
        <SPage.WorkflowSidebarHeader>
          <SPage.WorkflowSidebarTitle>Workflow Steps</SPage.WorkflowSidebarTitle>
        </SPage.WorkflowSidebarHeader>
        <S.EmptyStateContainer>
          <SPage.PlaceholderText>No workflow steps assigned to this job</SPage.PlaceholderText>
          {jobWorkflow?.id && (
            <S.AddStepCardButton onClick={() => setAddModalOpen(true)}>
              <S.SmallIconAdd /> Add New Step
            </S.AddStepCardButton>
          )}
        </S.EmptyStateContainer>

        {jobWorkflow?.id && (
          <AddStepModal
            open={addModalOpen}
            onClose={() => setAddModalOpen(false)}
            onSubmit={handleAddStepSubmit}
            allWorkers={allWorkers}
            nextOrderIndex={1}
          />
        )}
      </SPage.WorkflowSidebar>
    );
  }

  // ─── Main Render ─────────────────────────────────────────────────────────────

  return (
    <SPage.WorkflowSidebar>
      {/* Header */}
      <SPage.WorkflowSidebarHeader>
        <SPage.WorkflowSidebarTitle>
          {editingWorkflowName ? (
            <S.WorkflowNameInput
              size="small"
              value={workflowNameValue}
              onChange={(e) => setWorkflowNameValue(e.target.value)}
              autoFocus
            />
          ) : (
            <>
              <S.WorkflowTitleText title={workflow?.name || 'Workflow Name'}>
                {workflow?.name || 'Workflow Name'}
              </S.WorkflowTitleText>
              <S.WorkerAvatarsRow>
                {Array.from(workers.values())
                  .slice(0, 2)
                  .map((worker) => (
                    <S.WorkerAvatarBox key={worker.id}>
                      {worker.initials || worker.name?.substring(0, 2).toUpperCase()}
                    </S.WorkerAvatarBox>
                  ))}
              </S.WorkerAvatarsRow>
            </>
          )}
        </SPage.WorkflowSidebarTitle>

        <S.HeaderActionsBox>
          {editingWorkflowName ? (
            <S.HeaderButtonsRow>
              <IconButton size="small" onClick={handleCancelWorkflowNameEdit} aria-label="Cancel workflow name edit">
                <CloseIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={handleSaveWorkflowName} disabled={savingWorkflowName} aria-label="Save workflow name">
                <SaveIcon fontSize="small" />
              </IconButton>
            </S.HeaderButtonsRow>
          ) : (
            <>
              <IconButton size="small" onClick={handleEditWorkflowName} aria-label="Edit workflow name">
                <EditIcon fontSize="small" />
              </IconButton>

              {/* White background Re-Order / Done button */}
              <S.ReOrderWhiteButton
                variant="outlined"
                size="small"
                isreordering={isReordering ? 'true' : 'false'}
                disabled={savingReorder}
                onClick={() => {
                  if (isReordering) {
                    handleDoneReordering();
                  } else {
                    setIsReordering(true);
                  }
                }}
              >
                {savingReorder ? 'Saving...' : isReordering ? 'Done' : 'Re-Order'}
              </S.ReOrderWhiteButton>


            </>
          )}
        </S.HeaderActionsBox>
      </SPage.WorkflowSidebarHeader>

      {/* Timeline list with DndContext */}
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={localSteps.map((s) => `step-${s.id}`)} strategy={verticalListSortingStrategy}>
          <S.TimelineListWrapper>
            {localSteps.map((step, index) => {
              const isLast = index === localSteps.length - 1;
              const isExpanded = step.id === expandedStepId;

              return (
                <SortableStepRow
                  key={step.id || index}
                  step={step}
                  index={index}
                  isLast={isLast}
                  isExpanded={isExpanded}
                  isReordering={isReordering}
                  editingStepNameId={editingStepNameId}
                  stepNameValue={stepNameValue}
                  updatingStep={updatingStep}
                  editingNotes={editingNotes}
                  editingStepId={editingStepId}
                  savingNotes={savingNotes}
                  editingDurationStepId={editingDurationStepId}
                  editingDurationType={editingDurationType}
                  editDays={editDays}
                  editHours={editHours}
                  workers={workers}
                  allWorkers={allWorkers}
                  onToggleStep={toggleStep}
                  onStartEditStepName={handleEditStepName}
                  onCancelEditStepName={handleCancelStepNameEdit}
                  onSaveStepName={handleSaveStepName}
                  onDeleteStep={handleDeleteStep}
                  onStatusChange={handleStatusChange}
                  onAssignedChange={handleAssignedChange}
                  onEditNotes={handleEditNotes}
                  onCancelEditNotes={handleCancelEditNotes}
                  onSaveNotes={handleSaveNotes}
                  onEditDuration={handleEditDuration}
                  onCancelEditDuration={handleCancelEditDuration}
                  onSaveDuration={handleSaveDuration}
                  onStepUpdate={onStepUpdate}
                  setStepNameValue={setStepNameValue}
                  setEditingNotes={setEditingNotes}
                  setEditDays={setEditDays}
                  setEditHours={setEditHours}
                />
              );
            })}

            {/* Always available Add Step Card Button at bottom */}
            <S.AddStepCardButton onClick={() => setAddModalOpen(true)}>
              <S.SmallIconAdd /> Add New Step
            </S.AddStepCardButton>
          </S.TimelineListWrapper>
        </SortableContext>
      </DndContext>

      {/* Add step modal */}
      <AddStepModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddStepSubmit}
        allWorkers={allWorkers}
        nextOrderIndex={localSteps.length + 1}
      />
    </SPage.WorkflowSidebar>
  );
};