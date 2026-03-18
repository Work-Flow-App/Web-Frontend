import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useNavigate } from 'react-router-dom';
import {
  jobService,
  jobWorkflowService,
  workflowService,
} from '../../../services/api';
import type {
  JobResponse,
  JobWorkflowResponse,
  JobWorkflowStepResponse,
  WorkflowStepResponse,
} from '../../../services/api';
import { floowColors } from '../../../theme/colors';
import { JobStepDetailDrawer } from './JobStepDetailDrawer';
import * as S from './JobEventsSection.styles';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface StepEventGroup {
  stepName: string;
  orderIndex: number;
  count: number;
  color: string;
  jobWorkflows: Array<{ jobWorkflow: JobWorkflowResponse; currentStep: JobWorkflowStepResponse }>;
}

// ─── Color palette — uses floowColors design system ──────────────────────────

const STEP_COLORS = [
  floowColors.info.main,           // #2196F3 — blue
  floowColors.warning.main,        // #FFA500 — orange
  floowColors.chart.quaternary,    // #ff9800 — amber
  floowColors.success.main,        // #00A63E — green
  floowColors.indigo.main,         // #6366F1 — purple
  floowColors.grey[500],           // #737373 — gray
  floowColors.error.main,          // #FB2C36 — red
  floowColors.chart.primary,       // #3f51b5 — indigo
];

function getStepColor(index: number): string {
  return STEP_COLORS[index % STEP_COLORS.length];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const DONE_STATUSES = new Set(['COMPLETED', 'SKIPPED']);

function getCurrentStep(steps: JobWorkflowStepResponse[]): JobWorkflowStepResponse | null {
  if (!steps?.length) return null;
  const sorted = [...steps].sort((a, b) => (a.orderIndex ?? 0) - (b.orderIndex ?? 0));
  return sorted.find((s) => !DONE_STATUSES.has(s.status ?? '')) ?? null;
}

function getJobLabel(count: number, status: string | undefined): string {
  if (status === 'STARTED' || status === 'ONGOING') return `${count} Job${count !== 1 ? 's' : ''} active`;
  return `${count} Job${count !== 1 ? 's' : ''} waiting`;
}

// ─── Build step groups from workflow templates + active job workflows ─────────

function buildGroups(
  templateSteps: WorkflowStepResponse[],
  jobWorkflows: JobWorkflowResponse[],
): StepEventGroup[] {
  // Map step name → base info from template
  const groupMap = new Map<string, StepEventGroup>();

  templateSteps.forEach((step, index) => {
    const name = step.name ?? `Step ${index + 1}`;
    if (!groupMap.has(name)) {
      groupMap.set(name, {
        stepName: name,
        orderIndex: step.orderIndex ?? index,
        count: 0,
        color: getStepColor(index),
        jobWorkflows: [],
      });
    }
  });

  // Overlay with actual job workflow counts
  jobWorkflows.forEach((jw) => {
    const current = getCurrentStep(jw.steps ?? []);
    if (!current) return;
    const name = current.name ?? 'Unknown';
    if (!groupMap.has(name)) {
      groupMap.set(name, {
        stepName: name,
        orderIndex: current.orderIndex ?? 999,
        count: 0,
        color: getStepColor(groupMap.size),
        jobWorkflows: [],
      });
    }
    const group = groupMap.get(name)!;
    group.count += 1;
    group.jobWorkflows.push({ jobWorkflow: jw, currentStep: current });
  });

  return Array.from(groupMap.values()).sort((a, b) => a.orderIndex - b.orderIndex);
}

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────

const PIPELINE_MAX_VISIBLE = 6;

function PipelineBar({
  groups,
  activeStep,
  onSelectStep,
}: {
  groups: StepEventGroup[];
  activeStep: string | null;
  onSelectStep: (name: string) => void;
}) {
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
}

// ─── Events List ──────────────────────────────────────────────────────────────

function EventsList({
  groups,
  onSelectStep,
}: {
  groups: StepEventGroup[];
  onSelectStep: (name: string) => void;
}) {
  const maxCount = Math.max(...groups.map((g) => g.count), 1);

  if (groups.length === 0) {
    return (
      <S.EventsCard>
        <S.EmptyState>
          <WorkOutlineIcon sx={{ fontSize: 40, opacity: 0.3 }} />
          No active job events
        </S.EmptyState>
      </S.EventsCard>
    );
  }

  return (
    <S.EventsCard>
      <S.EventsCardHeader>
        <S.EventsCardTitle>Job Events</S.EventsCardTitle>
        <S.EventsCardSubtitle>Next event to be completed</S.EventsCardSubtitle>
      </S.EventsCardHeader>

      {groups.map((group) => {
        const fillPct = (group.count / maxCount) * 100;
        const statusOfFirst = group.jobWorkflows[0]?.currentStep.status;
        const label = getJobLabel(group.count, statusOfFirst);

        return (
          <S.EventRow key={group.stepName} onClick={() => onSelectStep(group.stepName)}>
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
}

// ─── Summary Panel (right) ────────────────────────────────────────────────────

function SummaryPanel({ groups }: { groups: StepEventGroup[] }) {
  const totalJobs = groups.reduce((s, g) => s + g.count, 0);
  const activeJobs = groups
    .flatMap((g) => g.jobWorkflows)
    .filter(({ currentStep }) => currentStep.status === 'STARTED' || currentStep.status === 'ONGOING')
    .length;

  const withJobs = groups.filter((g) => g.count > 0);
  const noJobs = groups.filter((g) => g.count === 0);

  return (
    <S.SummaryCard>
      <S.SummaryTitle>Ongoing Total Jobs</S.SummaryTitle>

      <S.SummaryStatRow>
        <div>
          <S.SummaryBubble bubbleColor={floowColors.info.main}>{totalJobs}</S.SummaryBubble>
          <S.SummaryBubbleLabel sx={{ textAlign: 'center', mt: '4px' }}>Total</S.SummaryBubbleLabel>
        </div>
        <div>
          <S.SummaryBubble bubbleColor={floowColors.success.main}>{activeJobs}</S.SummaryBubble>
          <S.SummaryBubbleLabel sx={{ textAlign: 'center', mt: '4px' }}>Active</S.SummaryBubbleLabel>
        </div>
      </S.SummaryStatRow>

      {withJobs.length > 0 && (
        <>
          <S.SummaryDivider />
          <div>
            <S.SummarySectionLabel>With Jobs</S.SummarySectionLabel>
            {withJobs.map((g) => (
              <S.SummaryRow key={g.stepName}>
                <S.SummaryRowName>{g.stepName}</S.SummaryRowName>
                <S.SummaryRowCount countColor={g.color}>{g.count}</S.SummaryRowCount>
              </S.SummaryRow>
            ))}
          </div>
        </>
      )}

      {noJobs.length > 0 && (
        <>
          <S.SummaryDivider />
          <div>
            <S.SummarySectionLabel>Pending Steps</S.SummarySectionLabel>
            {noJobs.map((g) => (
              <S.SummaryRow key={g.stepName}>
                <S.SummaryRowName>{g.stepName}</S.SummaryRowName>
                <S.SummaryRowCount countColor={floowColors.grey[400]}>0</S.SummaryRowCount>
              </S.SummaryRow>
            ))}
          </div>
        </>
      )}
    </S.SummaryCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export const JobEventsSection: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<StepEventGroup[]>([]);
  const [jobsMap, setJobsMap] = useState<Map<number, JobResponse>>(new Map());
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, jobWorkflowsRes, workflowsRes] = await Promise.all([
          jobService.getAllJobs(),
          jobWorkflowService.getAllJobWorkflows(),
          workflowService.getAllWorkflows(),
        ]);

        const jobs: JobResponse[] = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const jobWorkflows: JobWorkflowResponse[] = Array.isArray(jobWorkflowsRes.data) ? jobWorkflowsRes.data : [];
        const workflows = Array.isArray(workflowsRes.data) ? workflowsRes.data : [];

        // Build jobs lookup
        const map = new Map<number, JobResponse>();
        jobs.forEach((j) => { if (j.id != null) map.set(j.id, j); });
        setJobsMap(map);

        // Fetch steps from the first workflow template (to seed the pipeline)
        let templateSteps: WorkflowStepResponse[] = [];
        if (workflows.length > 0) {
          try {
            const stepsRes = await workflowService.getWorkflowSteps(workflows[0].id!);
            templateSteps = Array.isArray(stepsRes.data) ? stepsRes.data : [];
          } catch {
            // ignore
          }
        }

        setGroups(buildGroups(templateSteps, jobWorkflows));
      } catch (err) {
        console.error('Failed to load job events:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelectStep = (stepName: string) => {
    setActiveStep(stepName);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setActiveStep(null);
  };

  const selectedGroup = groups.find((g) => g.stepName === activeStep) ?? null;

  return (
    <S.SectionWrapper>
      {/* Header */}
      <S.SectionHeader>
        <S.SectionTitle>Job Events</S.SectionTitle>
        <S.NewJobButton
          startIcon={<AddIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          onClick={() => navigate('/company/jobs')}
        >
          New Job
        </S.NewJobButton>
      </S.SectionHeader>

      {/* Pipeline bar */}
      {loading ? (
        <S.LoadingBox>
          <CircularProgress size={28} />
        </S.LoadingBox>
      ) : (
        <>
          <PipelineBar groups={groups} activeStep={activeStep} onSelectStep={handleSelectStep} />

          <S.ContentRow>
            <EventsList groups={groups} onSelectStep={handleSelectStep} />
            <SummaryPanel groups={groups} />
          </S.ContentRow>
        </>
      )}

      {selectedGroup && (
        <JobStepDetailDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          stepGroup={selectedGroup}
          jobsMap={jobsMap}
        />
      )}
    </S.SectionWrapper>
  );
};
