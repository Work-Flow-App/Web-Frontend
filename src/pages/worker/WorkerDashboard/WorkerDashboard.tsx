import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  Box,
  LinearProgress,
  Typography,
} from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { workerJobWorkflowService } from '../../../services/api';
import type {
  JobWorkflowResponse,
  WorkerAssignedStepResponse,
} from '../../../services/api';
import { JobWorkflowStepResponseStatusEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { floowColors } from '../../../theme/colors';
import * as S from '../../company/components/JobEventsSection.styles';
import { PageContainer } from '../../company/CompanyPage.styles';

const STEP_COLORS = [
  floowColors.info.main,
  floowColors.warning.main,
  floowColors.chart.quaternary,
  floowColors.success.main,
  floowColors.indigo.main,
  floowColors.grey[500],
  floowColors.error.main,
  floowColors.chart.primary,
];

const getStepColor = (index: number): string => STEP_COLORS[index % STEP_COLORS.length];

const DONE_STATUSES = new Set<string>([
  JobWorkflowStepResponseStatusEnum.Completed,
  JobWorkflowStepResponseStatusEnum.Skipped,
]);

const ACTIVE_STATUSES = new Set<string>([
  JobWorkflowStepResponseStatusEnum.Started,
  JobWorkflowStepResponseStatusEnum.Ongoing,
]);

interface StepGroup {
  stepName: string;
  orderIndex: number;
  count: number;
  color: string;
  steps: WorkerAssignedStepResponse[];
}

const buildGroups = (assignedSteps: WorkerAssignedStepResponse[]): StepGroup[] => {
  const groupMap = new Map<string, StepGroup>();

  assignedSteps.forEach((s) => {
    const name = s.step?.name || 'Unnamed Step';
    if (!groupMap.has(name)) {
      groupMap.set(name, {
        stepName: name,
        orderIndex: s.step?.orderIndex ?? 999,
        count: 0,
        color: getStepColor(groupMap.size),
        steps: [],
      });
    }
    const group = groupMap.get(name)!;
    group.count += 1;
    group.steps.push(s);
  });

  return Array.from(groupMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
};

const statCardSx = {
  bgcolor: '#fff',
  borderRadius: '12px',
  border: '1px solid #e5e7eb',
  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  p: '20px 24px',
  display: 'flex',
  flexDirection: 'column',
  gap: '6px',
};

const StatBoxesRow: React.FC<{
  totalSteps: number;
  pendingSteps: number;
  ongoingSteps: number;
  completedSteps: number;
}> = ({ totalSteps, pendingSteps, ongoingSteps, completedSteps }) => {
  const progressPct = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      <Box sx={statCardSx}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: floowColors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Pending Steps
        </Typography>
        <Typography sx={{ fontSize: '34px', fontWeight: 800, color: floowColors.text.heading, lineHeight: 1.1 }}>
          {pendingSteps}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <PendingActionsIcon sx={{ fontSize: '14px', color: floowColors.warning.main }} />
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: floowColors.warning.main }}>
            awaiting action
          </Typography>
        </Box>
      </Box>

      <Box sx={statCardSx}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: floowColors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Ongoing (My Progress)
        </Typography>
        <Typography sx={{ fontSize: '34px', fontWeight: 800, color: floowColors.text.heading, lineHeight: 1.1 }}>
          {ongoingSteps}
        </Typography>
        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{ borderRadius: '2px', height: '4px', bgcolor: floowColors.grey[100], '& .MuiLinearProgress-bar': { bgcolor: floowColors.info.main } }}
        />
        <Typography sx={{ fontSize: '11px', color: floowColors.text.muted }}>
          {progressPct}% Complete
        </Typography>
      </Box>

      <Box sx={statCardSx}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: floowColors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Completed Steps
        </Typography>
        <Typography sx={{ fontSize: '34px', fontWeight: 800, color: floowColors.text.heading, lineHeight: 1.1 }}>
          {completedSteps}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <CheckCircleOutlineIcon sx={{ fontSize: '14px', color: floowColors.success.main }} />
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: floowColors.success.main }}>
            done
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

const PIPELINE_MAX_VISIBLE = 6;

const PipelineBar: React.FC<{
  groups: StepGroup[];
  activeStep: string | null;
  onSelectStep: (name: string) => void;
}> = ({ groups, activeStep, onSelectStep }) => {
  const visible = groups.slice(0, PIPELINE_MAX_VISIBLE);
  const hidden = groups.length - PIPELINE_MAX_VISIBLE;

  return (
    <S.PipelineBar>
      {visible.map((group, index) => (
        <React.Fragment key={group.stepName}>
          {index > 0 && <S.PipelineArrow>›</S.PipelineArrow>}
          <S.PipelineChip
            chipColor={group.color}
            isActive={activeStep === group.stepName}
            onClick={() => onSelectStep(group.stepName)}
          >
            <S.PipelineChipCount>{group.count}</S.PipelineChipCount>
            <S.PipelineChipName>{group.stepName}</S.PipelineChipName>
          </S.PipelineChip>
        </React.Fragment>
      ))}
      {hidden > 0 && (
        <>
          <S.PipelineArrow>›</S.PipelineArrow>
          <S.PipelineMore>···</S.PipelineMore>
        </>
      )}
    </S.PipelineBar>
  );
};

const EventsList: React.FC<{
  groups: StepGroup[];
  onSelectStep: (group: StepGroup) => void;
}> = ({ groups, onSelectStep }) => {
  const maxCount = Math.max(...groups.map((g) => g.count), 1);

  if (groups.length === 0) {
    return (
      <S.EventsCard>
        <S.EmptyState>
          <WorkOutlineIcon sx={{ fontSize: 40, opacity: 0.3 }} />
          No assigned steps yet
        </S.EmptyState>
      </S.EventsCard>
    );
  }

  return (
    <S.EventsCard>
      <S.EventsCardHeader>
        <S.EventsCardTitle>My Step Events</S.EventsCardTitle>
        <S.EventsCardSubtitle>Steps assigned to you, grouped by stage</S.EventsCardSubtitle>
      </S.EventsCardHeader>

      {groups.map((group) => {
        const fillPct = (group.count / maxCount) * 100;
        const ongoingCount = group.steps.filter((s) => ACTIVE_STATUSES.has(s.step?.status ?? '')).length;
        const label = ongoingCount > 0
          ? `${ongoingCount} active · ${group.count} total`
          : `${group.count} pending`;

        return (
          <S.EventRow key={group.stepName} onClick={() => onSelectStep(group)}>
            <S.CountBadge badgeColor={group.color}>{group.count}</S.CountBadge>
            <S.EventInfo>
              <S.EventNameRow>
                <S.EventName>{group.stepName}</S.EventName>
              </S.EventNameRow>
              <S.EventSubText>{label}</S.EventSubText>
              <S.ProgressTrack>
                <S.ProgressFill fillColor={group.color} fillPct={fillPct} />
              </S.ProgressTrack>
            </S.EventInfo>
            <S.EventArrow>
              <ChevronRightIcon sx={{ color: floowColors.grey[300] }} />
            </S.EventArrow>
          </S.EventRow>
        );
      })}
    </S.EventsCard>
  );
};

const SummaryPanel: React.FC<{
  groups: StepGroup[];
  workflows: JobWorkflowResponse[];
}> = ({ groups, workflows }) => {
  const totalSteps = groups.reduce((s, g) => s + g.count, 0);
  const activeSteps = groups
    .flatMap((g) => g.steps)
    .filter((s) => ACTIVE_STATUSES.has(s.step?.status ?? ''))
    .length;

  const withSteps = groups.filter((g) => g.count > 0);

  return (
    <S.SummaryCard>
      <S.SummaryTitle>My Pipeline</S.SummaryTitle>

      <S.SummaryStatRow>
        <div>
          <S.SummaryBubble bubbleColor={floowColors.info.main}>{totalSteps}</S.SummaryBubble>
          <S.SummaryBubbleLabel sx={{ textAlign: 'center', mt: '4px' }}>Total</S.SummaryBubbleLabel>
        </div>
        <div>
          <S.SummaryBubble bubbleColor={floowColors.success.main}>{activeSteps}</S.SummaryBubble>
          <S.SummaryBubbleLabel sx={{ textAlign: 'center', mt: '4px' }}>Active</S.SummaryBubbleLabel>
        </div>
        <div>
          <S.SummaryBubble bubbleColor={floowColors.indigo.main}>{workflows.length}</S.SummaryBubble>
          <S.SummaryBubbleLabel sx={{ textAlign: 'center', mt: '4px' }}>Workflows</S.SummaryBubbleLabel>
        </div>
      </S.SummaryStatRow>

      {withSteps.length > 0 && (
        <>
          <S.SummaryDivider />
          <div>
            <S.SummarySectionLabel>By Stage</S.SummarySectionLabel>
            {withSteps.map((g) => (
              <S.SummaryRow key={g.stepName}>
                <S.SummaryRowName>{g.stepName}</S.SummaryRowName>
                <S.SummaryRowCount countColor={g.color}>{g.count}</S.SummaryRowCount>
              </S.SummaryRow>
            ))}
          </div>
        </>
      )}
    </S.SummaryCard>
  );
};

export const WorkerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { showError } = useSnackbar();
  const [loading, setLoading] = useState(true);
  const [workflows, setWorkflows] = useState<JobWorkflowResponse[]>([]);
  const [allAssignedSteps, setAllAssignedSteps] = useState<WorkerAssignedStepResponse[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | 'ALL'>('ALL');
  const [activeStep, setActiveStep] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [workflowsRes, stepsRes] = await Promise.all([
          workerJobWorkflowService.getMyJobWorkflows(),
          workerJobWorkflowService.getMyAssignedSteps(),
        ]);
        setWorkflows(Array.isArray(workflowsRes.data) ? workflowsRes.data : []);
        setAllAssignedSteps(Array.isArray(stepsRes.data) ? stepsRes.data : []);
      } catch (err) {
        console.error('Failed to load worker dashboard:', err);
        showError('Failed to load dashboard');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [showError]);

  const filteredSteps = selectedWorkflowId === 'ALL'
    ? allAssignedSteps
    : allAssignedSteps.filter((s) => {
        const workflow = workflows.find((w) =>
          w.steps?.some((step) => step.id === s.step?.id),
        );
        return workflow?.id === selectedWorkflowId;
      });

  const groups = buildGroups(filteredSteps);
  const totalSteps = filteredSteps.length;
  const pendingSteps = filteredSteps.filter((s) => !DONE_STATUSES.has(s.step?.status ?? '')).length;
  const ongoingSteps = filteredSteps.filter((s) => ACTIVE_STATUSES.has(s.step?.status ?? '')).length;
  const completedSteps = filteredSteps.filter(
    (s) => s.step?.status === JobWorkflowStepResponseStatusEnum.Completed,
  ).length;

  const handleSelectStep = useCallback((group: StepGroup) => {
    setActiveStep(group.stepName);
    const firstStep = group.steps[0];
    if (firstStep?.step?.id) {
      navigate(`/worker/steps/${firstStep.step.id}`);
    }
  }, [navigate]);

  const handlePipelineSelect = (stepName: string) => {
    const group = groups.find((g) => g.stepName === stepName);
    if (group) handleSelectStep(group);
  };

  return (
    <PageContainer>
      <S.SectionWrapper>
        <S.SectionHeader>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <S.SectionTitle>My Work</S.SectionTitle>

          {workflows.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={selectedWorkflowId}
                onChange={(e) =>
                  setSelectedWorkflowId(e.target.value === 'ALL' ? 'ALL' : Number(e.target.value))
                }
                displayEmpty
                startAdornment={
                  <AccountTreeOutlinedIcon sx={{ fontSize: 16, mr: 0.5, color: floowColors.text.muted }} />
                }
                sx={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: floowColors.text.primary,
                  bgcolor: floowColors.white,
                  borderRadius: '8px',
                }}
              >
                <MenuItem value="ALL" sx={{ fontSize: 13 }}>All My Workflows</MenuItem>
                {workflows.map((wf) => (
                  <MenuItem key={wf.id} value={wf.id} sx={{ fontSize: 13 }}>
                    Workflow #{wf.id}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>
      </S.SectionHeader>

      {!loading && (
        <StatBoxesRow
          totalSteps={totalSteps}
          pendingSteps={pendingSteps}
          ongoingSteps={ongoingSteps}
          completedSteps={completedSteps}
        />
      )}

        {loading ? (
          <S.LoadingBox>
            <CircularProgress size={28} />
          </S.LoadingBox>
        ) : (
          <>
            <PipelineBar groups={groups} activeStep={activeStep} onSelectStep={handlePipelineSelect} />
            <S.ContentRow>
              <EventsList groups={groups} onSelectStep={handleSelectStep} />
              <SummaryPanel groups={groups} workflows={workflows} />
            </S.ContentRow>
          </>
        )}
      </S.SectionWrapper>
    </PageContainer>
  );
};
