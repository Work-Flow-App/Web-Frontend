import React, { useEffect, useState, useCallback } from 'react';
import { CircularProgress, Select, MenuItem, FormControl, Box, LinearProgress, Typography } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import AddIcon from '@mui/icons-material/Add';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/UI/Button';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import { AddJobWizard } from '../../jobs/components/AddJobWizard';
import {
  jobService,
  jobWorkflowService,
  workflowService,
  jobTemplateService,
  customerService,
  estimateService,
} from '../../../services/api';
import type {
  JobResponse,
  JobWorkflowResponse,
  JobWorkflowStepResponse,
  WorkflowStepResponse,
  WorkflowResponse,
  CustomerResponse,
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

// ─── Stat Boxes ───────────────────────────────────────────────────────────────

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

function formatAmount(value: number): string {
  return value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function StatBoxesRow({
  jobs,
  estimateSentTotal,
  awaitingInvoiceTotal,
}: {
  jobs: JobResponse[];
  estimateSentTotal: number;
  awaitingInvoiceTotal: number;
}) {
  const inProgress = jobs.filter((j) => j.status === 'IN_PROGRESS').length;
  const total = jobs.length;
  const progressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;
  const awaitingCount = jobs.filter((j) => j.status === 'NEW' || j.status === 'PENDING').length;

  return (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
      {/* Box 1 — Estimate Sent */}
      <Box sx={statCardSx}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: floowColors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Estimate Sent
        </Typography>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: floowColors.text.heading, lineHeight: 1.1 }}>
          £{formatAmount(estimateSentTotal)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingUpIcon sx={{ fontSize: '14px', color: floowColors.success.main }} />
          <Typography sx={{ fontSize: '12px', fontWeight: 600, color: floowColors.success.main }}>
            up-trend
          </Typography>
        </Box>
      </Box>

      {/* Box 2 — Work In Progress */}
      <Box sx={statCardSx}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: floowColors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Work In Progress (Total Job)
        </Typography>
        <Typography sx={{ fontSize: '34px', fontWeight: 800, color: floowColors.text.heading, lineHeight: 1.1 }}>
          {inProgress}
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

      {/* Box 3 — Estimates Awaiting Approval */}
      <Box sx={statCardSx}>
        <Typography sx={{ fontSize: '11px', fontWeight: 700, color: floowColors.text.muted, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
          Estimates Awaiting Approval
        </Typography>
        <Typography sx={{ fontSize: '28px', fontWeight: 800, color: floowColors.text.heading, lineHeight: 1.1 }}>
          £{formatAmount(awaitingInvoiceTotal)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {awaitingCount > 0 ? (
            <>
              <ErrorOutlineIcon sx={{ fontSize: '14px', color: floowColors.error.main }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: floowColors.error.main }}>
                awaiting approval
              </Typography>
            </>
          ) : (
            <>
              <PendingActionsIcon sx={{ fontSize: '14px', color: floowColors.success.main }} />
              <Typography sx={{ fontSize: '12px', fontWeight: 600, color: floowColors.success.main }}>
                all approved
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
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
      <S.SummaryTitle>Workflow Pipeline</S.SummaryTitle>

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
            <S.SummarySectionLabel>Empty Steps</S.SummarySectionLabel>
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
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<StepEventGroup[]>([]);
  const [jobsMap, setJobsMap] = useState<Map<number, JobResponse>>(new Map());
  const [customersMap, setCustomersMap] = useState<Map<number, CustomerResponse>>(new Map());
  const [templates, setTemplates] = useState<{ id?: number }[]>([]);
  const [workflows, setWorkflows] = useState<WorkflowResponse[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [allJobs, setAllJobs] = useState<JobResponse[]>([]);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [estimateSentTotal, setEstimateSentTotal] = useState(0);
  const [awaitingInvoiceTotal, setAwaitingInvoiceTotal] = useState(0);

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, workflowsRes, templatesRes, customersRes] = await Promise.all([
          jobService.getAllJobs(),
          workflowService.getAllWorkflows(),
          jobTemplateService.getAllTemplates(),
          customerService.getAllCustomers(),
        ]);
        setTemplates(Array.isArray(templatesRes.data) ? templatesRes.data : []);

        const jobs: JobResponse[] = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const wfs: WorkflowResponse[] = Array.isArray(workflowsRes.data) ? workflowsRes.data : [];
        const customers: CustomerResponse[] = Array.isArray(customersRes.data) ? customersRes.data : [];

        const map = new Map<number, JobResponse>();
        jobs.forEach((j) => { if (j.id != null) map.set(j.id, j); });
        setJobsMap(map);

        const cMap = new Map<number, CustomerResponse>();
        customers.forEach((c) => { if (c.id != null) cMap.set(c.id, c); });
        setCustomersMap(cMap);

        setAllJobs(jobs);
        setWorkflows(wfs);

        const defaultId = wfs[0]?.id ?? null;
        setSelectedWorkflowId(defaultId);

        // Fetch estimates for all jobs in parallel
        const estimateResults = await Promise.allSettled(
          jobs.filter((j) => j.id != null).map((j) => estimateService.getByJobId(j.id!))
        );

        let sentTotal = 0;
        const awaitingJobIds = new Set(
          jobs.filter((j) => j.status === 'NEW' || j.status === 'PENDING').map((j) => j.id!)
        );
        const awaitingEstimateIds: number[] = [];

        jobs.filter((j) => j.id != null).forEach((j, i) => {
          const result = estimateResults[i];
          if (result.status === 'fulfilled') {
            const estimate = result.value.data;
            sentTotal += estimate.grandTotal ?? 0;
            if (awaitingJobIds.has(j.id!) && estimate.id != null) {
              awaitingEstimateIds.push(estimate.id);
            }
          }
        });
        setEstimateSentTotal(sentTotal);

        // Fetch invoices for awaiting-approval estimates and sum their totals
        const invoiceResults = await Promise.allSettled(
          awaitingEstimateIds.map((eid) => estimateService.listInvoicesForEstimate(eid))
        );
        let invoiceTotal = 0;
        invoiceResults.forEach((result) => {
          if (result.status === 'fulfilled') {
            const invoices = Array.isArray(result.value.data) ? result.value.data : [];
            invoices.forEach((inv) => { invoiceTotal += inv.grandTotal ?? 0; });
          }
        });
        setAwaitingInvoiceTotal(invoiceTotal);
      } catch (err) {
        console.error('Failed to load job events:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  // Recompute groups whenever selected workflow changes
  const recomputeGroups = useCallback(async (workflowId: number | null) => {
    if (workflowId == null) { setGroups([]); return; }

    // Jobs that belong to this workflow
    const filteredJobs = allJobs.filter((j) => j.workflowId === workflowId && j.id != null);

    // Fetch JobWorkflow per-job — the bulk /job-workflows endpoint sometimes
    // returns stale or incomplete data; per-job fetch matches the Job Details page.
    const jwResults = await Promise.allSettled(
      filteredJobs.map((j) => jobWorkflowService.getJobWorkflowByJobId(j.id!))
    );
    const filteredJobWorkflows: JobWorkflowResponse[] = [];
    jwResults.forEach((r) => {
      if (r.status === 'fulfilled' && r.value?.data) {
        filteredJobWorkflows.push(r.value.data);
      }
    });

    // Template steps for this workflow
    let templateSteps: WorkflowStepResponse[] = [];
    try {
      const stepsRes = await workflowService.getWorkflowSteps(workflowId);
      templateSteps = Array.isArray(stepsRes.data) ? stepsRes.data : [];
    } catch { /* ignore */ }

    setGroups(buildGroups(templateSteps, filteredJobWorkflows));
  }, [allJobs]);

  useEffect(() => {
    if (!loading) recomputeGroups(selectedWorkflowId);
  }, [selectedWorkflowId, loading, recomputeGroups]);

  const handleAddJob = () => {
    if (templates.length === 0) {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'noTemplateWarning',
        children: (
          <ConfirmationModal
            title="No Templates Available"
            message="You need to create a job template before creating a job."
            description="Job templates define the structure and fields for your jobs. Would you like to create a template now?"
            variant="default"
            confirmButtonText="Create Template"
            cancelButtonText="Cancel"
            onConfirm={() => {
              resetGlobalModalOuterProps();
              navigate('/company/jobs/templates?openAddModal=true');
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
      return;
    }
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.LARGE,
      fieldName: 'addJob',
      children: (
        <AddJobWizard
          onSuccess={() => {
            resetGlobalModalOuterProps();
          }}
        />
      ),
    });
  };

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
        {/* Left: title + workflow dropdown side by side */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <S.SectionTitle>Workflow Event</S.SectionTitle>

          {workflows.length > 0 && (
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={selectedWorkflowId ?? ''}
                onChange={(e) => setSelectedWorkflowId(Number(e.target.value))}
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
                  '& .MuiOutlinedInput-notchedOutline': { borderColor: floowColors.border.medium },
                  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: floowColors.blue.main },
                }}
              >
                {workflows.map((wf) => (
                  <MenuItem key={wf.id} value={wf.id} sx={{ fontSize: 13 }}>
                    {wf.name ?? `Workflow #${wf.id}`}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
        </Box>

        {/* Right: New Job button */}
        <Button
          startIcon={<AddIcon />}
          endIcon={<KeyboardArrowDownIcon />}
          onClick={handleAddJob}
        >
          New Job
        </Button>
      </S.SectionHeader>

      {/* Stat boxes */}
      {!loading && <StatBoxesRow jobs={allJobs} estimateSentTotal={estimateSentTotal} awaitingInvoiceTotal={awaitingInvoiceTotal} />}

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
          customersMap={customersMap}
        />
      )}
    </S.SectionWrapper>
  );
};
