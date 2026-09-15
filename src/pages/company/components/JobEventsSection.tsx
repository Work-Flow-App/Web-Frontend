import React, { useEffect, useState, useCallback, useRef } from 'react';
import { CircularProgress, LinearProgress } from '@mui/material';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import CloseIcon from '@mui/icons-material/Close';
import {
  jobService,
  jobWorkflowService,
  workflowService,
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

// ─── Constants ────────────────────────────────────────────────────────────────

const PRIMARY_WORKFLOW_KEY = 'workfloow_primary_workflow_id';

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
  floowColors.info.main, // #2196F3 — blue
  floowColors.warning.main, // #FFA500 — orange
  floowColors.chart.quaternary, // #ff9800 — amber
  floowColors.success.main, // #00A63E — green
  floowColors.indigo.main, // #6366F1 — purple
  floowColors.grey[500], // #737373 — gray
  floowColors.error.main, // #FB2C36 — red
  floowColors.chart.primary, // #3f51b5 — indigo
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

function buildGroups(templateSteps: WorkflowStepResponse[], jobWorkflows: JobWorkflowResponse[]): StepEventGroup[] {
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

function StatBoxesRow({
  jobs,
}: {
  jobs: JobResponse[];
  estimateSentTotal: number;
  awaitingInvoiceTotal: number;
}) {
  const inProgress = jobs.filter((j) => j.status === 'IN_PROGRESS').length;
  const total = jobs.length;
  const progressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  return (
    <S.StatBoxesContainer>
      <S.StatCard>
        <S.StatLabel>Work In Progress (Total Job)</S.StatLabel>
        <S.StatValue>{inProgress}</S.StatValue>
        <LinearProgress
          variant="determinate"
          value={progressPct}
          sx={{
            borderRadius: '4px',
            height: '6px',
            bgcolor: (theme) => theme.palette.grey[100] || '#f3f4f6',
            '& .MuiLinearProgress-bar': { bgcolor: floowColors.info.main, borderRadius: '4px' },
          }}
        />
        <S.StatSubText>{progressPct}% Complete</S.StatSubText>
      </S.StatCard>
    </S.StatBoxesContainer>
  );
}

// ─── Pipeline Bar ─────────────────────────────────────────────────────────────

function PipelineBar({
  groups,
  activeStep,
  onSelectStep,
}: {
  groups: StepEventGroup[];
  activeStep: string | null;
  onSelectStep: (name: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const moreRef = useRef<HTMLDivElement>(null);
  const popupRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800); // Default fallback

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const handleToggle = (event: React.MouseEvent) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: Event) => {
      const target = event.target as Node;
      if (
        popupRef.current &&
        !popupRef.current.contains(target) &&
        moreRef.current &&
        !moreRef.current.contains(target)
      ) {
        handleClose();
      }
    };

    document.addEventListener('click', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('click', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [isOpen]);

  // Dynamically calculate visible count based on containerWidth and estimated item widths:
  let maxVisible = 0;
  let currentWidth = 0;
  const moreButtonWidth = 50; // Width of "···" chip plus arrow
  const horizontalPadding = 32; // Horizontal padding of PipelineBar (16px left + 16px right)
  const availableWidth = containerWidth - horizontalPadding;

  // Let's first check if ALL steps fit:
  let totalEstimatedWidth = 0;
  for (let i = 0; i < groups.length; i++) {
    const textLength = groups[i].stepName.length;
    // Estimated width of the chip: badge (24px) + padding/margins (28px) + gap (6px) + text (char * 7) + arrow (20px)
    // Modified to make the width estimation more precise (releasing unused empty space on the right)
    const chipWidth = 43 + textLength * 6.5 + (i > 0 ? 16 : 0);
    totalEstimatedWidth += chipWidth;
  }

  if (totalEstimatedWidth <= availableWidth) {
    maxVisible = groups.length;
  } else {
    // If they don't all fit, calculate how many can fit next to the "···" button
    for (let i = 0; i < groups.length; i++) {
      const textLength = groups[i].stepName.length;
      const chipWidth = 43 + textLength * 6.5 + (i > 0 ? 16 : 0);
      if (currentWidth + chipWidth + moreButtonWidth <= availableWidth) {
        currentWidth += chipWidth;
        maxVisible++;
      } else {
        break;
      }
    }
    // Always show at least 1 step if any exist
    if (maxVisible === 0 && groups.length > 0) {
      maxVisible = 1;
    }
  }

  const visible = groups.slice(0, maxVisible);
  const hidden = groups.length - maxVisible;

  return (
    <S.PipelineBar ref={containerRef}>
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
        <S.PipelineMoreWrapper ref={moreRef}>
          <S.PipelineArrow>›</S.PipelineArrow>
          <S.PipelineMore onClick={handleToggle}>···</S.PipelineMore>
          {isOpen && (
            <S.DropdownPopup ref={popupRef}>
              <S.DropdownHeader>
                <S.DropdownTitle>More Steps</S.DropdownTitle>
                <S.DropdownCloseButton size="small" onClick={handleClose} aria-label="Close more steps">
                  <CloseIcon sx={{ fontSize: 15 }} />
                </S.DropdownCloseButton>
              </S.DropdownHeader>

              <S.DropdownListWrapper>
                {groups.slice(maxVisible).map((group) => (
                  <S.DropdownMenuItem
                    key={group.stepName}
                    onClick={() => {
                      onSelectStep(group.stepName);
                      handleClose();
                    }}
                  >
                    <S.DropdownPipelineChip
                      chipColor={group.color}
                      isActive={activeStep === group.stepName}
                    >
                      <S.PipelineChipCount>{group.count}</S.PipelineChipCount>
                      <S.PipelineChipName>{group.stepName}</S.PipelineChipName>
                    </S.DropdownPipelineChip>
                  </S.DropdownMenuItem>
                ))}
              </S.DropdownListWrapper>
            </S.DropdownPopup>
          )}
        </S.PipelineMoreWrapper>
      )}
    </S.PipelineBar>
  );
}

// ─── Events List ──────────────────────────────────────────────────────────────

function EventsList({ groups, onSelectStep }: { groups: StepEventGroup[]; onSelectStep: (name: string) => void }) {
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
    .filter(({ currentStep }) => currentStep.status === 'STARTED' || currentStep.status === 'ONGOING').length;

  const withJobs = groups.filter((g) => g.count > 0);
  const noJobs = groups.filter((g) => g.count === 0);

  return (
    <S.SummaryCard>
      <S.SummaryTitle>Workfloow Pipeline</S.SummaryTitle>

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
  const [loading, setLoading] = useState(true);
  const [groups, setGroups] = useState<StepEventGroup[]>([]);
  const [jobsMap, setJobsMap] = useState<Map<number, JobResponse>>(new Map());
  const [customersMap, setCustomersMap] = useState<Map<number, CustomerResponse>>(new Map());
  const [workflows, setWorkflows] = useState<WorkflowResponse[]>([]);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [allJobs, setAllJobs] = useState<JobResponse[]>([]);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [estimateSentTotal, setEstimateSentTotal] = useState(0);
  const [awaitingInvoiceTotal, setAwaitingInvoiceTotal] = useState(0);
  const [isPrimaryMode, setIsPrimaryMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingPrimaryId, setPendingPrimaryId] = useState<number | null>(null);
  const [primaryWorkflowId, setPrimaryWorkflowId] = useState<number | null>(() => {
    const saved = localStorage.getItem(PRIMARY_WORKFLOW_KEY);
    return saved ? Number(saved) : null;
  });

  useEffect(() => {
    const load = async () => {
      try {
        const [jobsRes, workflowsRes, customersRes] = await Promise.all([
          jobService.getAllJobs(),
          workflowService.getAllWorkflows(),
          customerService.getAllCustomers(),
        ]);

        const jobs: JobResponse[] = Array.isArray(jobsRes.data) ? jobsRes.data : [];
        const wfs: WorkflowResponse[] = Array.isArray(workflowsRes.data) ? workflowsRes.data : [];
        const customers: CustomerResponse[] = Array.isArray(customersRes.data) ? customersRes.data : [];

        const map = new Map<number, JobResponse>();
        jobs.forEach((j) => {
          if (j.id != null) map.set(j.id, j);
        });
        setJobsMap(map);

        const cMap = new Map<number, CustomerResponse>();
        customers.forEach((c) => {
          if (c.id != null) cMap.set(c.id, c);
        });
        setCustomersMap(cMap);

        setAllJobs(jobs);
        setWorkflows(wfs);

        // Use saved primary workflow as default, fallback to first workflow
        const savedPrimary = localStorage.getItem(PRIMARY_WORKFLOW_KEY);
        const savedId = savedPrimary ? Number(savedPrimary) : null;
        const validId = savedId && wfs.some((w) => w.id === savedId) ? savedId : (wfs[0]?.id ?? null);

        // If no primary saved yet, auto-save first workflow as primary
        if (!savedPrimary && wfs[0]?.id != null) {
          localStorage.setItem(PRIMARY_WORKFLOW_KEY, String(wfs[0].id));
          setPrimaryWorkflowId(wfs[0].id);
        }

        setSelectedWorkflowId(validId);

        // Fetch estimates for all jobs in parallel
        const estimateResults = await Promise.allSettled(
          jobs.filter((j) => j.id != null).map((j) => estimateService.getByJobId(j.id!))
        );

        let sentTotal = 0;
        const awaitingJobIds = new Set(
          jobs.filter((j) => j.status === 'NEW' || j.status === 'PENDING').map((j) => j.id!)
        );
        const awaitingEstimateIds: number[] = [];

        jobs
          .filter((j) => j.id != null)
          .forEach((j, i) => {
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
            invoices.forEach((inv) => {
              invoiceTotal += inv.grandTotal ?? 0;
            });
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
  const recomputeGroups = useCallback(
    async (workflowId: number | null) => {
      if (workflowId == null) {
        setGroups([]);
        return;
      }

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
      } catch {
        /* ignore */
      }

      setGroups(buildGroups(templateSteps, filteredJobWorkflows));
    },
    [allJobs]
  );

  useEffect(() => {
    if (!loading) recomputeGroups(selectedWorkflowId);
  }, [selectedWorkflowId, loading, recomputeGroups]);

  const handleSelectStep = (stepName: string) => {
    setActiveStep(stepName);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
    setActiveStep(null);
  };

  const handleSetPrimary = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (isPrimaryMode) {
      // Save mode — persist pending selection as primary
      if (pendingPrimaryId != null) {
        localStorage.setItem(PRIMARY_WORKFLOW_KEY, String(pendingPrimaryId));
        setPrimaryWorkflowId(pendingPrimaryId);
      }
      setIsPrimaryMode(false);
      setPendingPrimaryId(null);
      // Keep open after save
    } else {
      // Enter primary-selection mode — highlight the current primary
      setPendingPrimaryId(primaryWorkflowId ?? selectedWorkflowId);
      setIsPrimaryMode(true);
    }
  };

  const selectedGroup = groups.find((g) => g.stepName === activeStep) ?? null;

  return (
    <S.SectionWrapper>
      {/* Header */}
      <S.SectionHeader>
        <S.HeaderRow>
          <S.SectionTitle>Workfloow Event</S.SectionTitle>

          {workflows.length > 0 && (
            <S.WorkflowFormControl size="small">
              <S.WorkflowSelect
                value={selectedWorkflowId ?? ''}
                open={dropdownOpen}
                onOpen={() => setDropdownOpen(true)}
                onClose={(e) => {
                  const target = e?.target as HTMLElement | undefined;
                  const clickedAction = target && (
                    target.closest('[class*="PrimaryMenuAction"]') || 
                    target.closest('[class*="PrimaryMenuDivider"]') ||
                    target.textContent === 'Set a Workfloow as primary' ||
                    target.textContent === 'Save'
                  );
                  if (clickedAction) {
                    return;
                  }

                  if (isPrimaryMode) {
                    const clickedInsideMenu = target && (
                      target.closest('.MuiMenu-paper') || 
                      target.closest('.MuiMenu-list') ||
                      target.closest('li') ||
                      target.closest('ul')
                    );
                    if (clickedInsideMenu) {
                      return;
                    }
                  }
                  setDropdownOpen(false);
                  setIsPrimaryMode(false);
                  setPendingPrimaryId(null);
                }}
                onChange={(e) => {
                  if (isPrimaryMode) return;
                  const newId = Number(e.target.value);
                  if (isNaN(newId) || newId === 0) return;
                  setSelectedWorkflowId(newId);
                  setDropdownOpen(false);
                }}
                displayEmpty
                startAdornment={<S.WorkflowAdornment />}
              >
                {workflows.map((wf) => {
                  const isPrimary = wf.id === primaryWorkflowId;
                  const isHighlighted = isPrimaryMode && wf.id === pendingPrimaryId;
                  return (
                    <S.WorkflowMenuItem
                      key={wf.id}
                      value={wf.id}
                      isHighlighted={isHighlighted}
                      isPrimary={!isPrimaryMode && isPrimary}
                      isPrimaryMode={isPrimaryMode}
                      onMouseDown={(e) => {
                        if (isPrimaryMode) {
                          e.stopPropagation();
                          e.preventDefault();
                        }
                      }}
                      onClick={(e) => {
                        if (isPrimaryMode) {
                          e.stopPropagation();
                          e.preventDefault();
                          if (wf.id != null) {
                            setPendingPrimaryId(wf.id);
                          }
                        }
                      }}
                    >
                      <S.WorkflowMenuItemContent>
                        <S.WorkflowName>{wf.name ?? `Workflow #${wf.id}`}</S.WorkflowName>
                        {!isPrimaryMode && isPrimary && (
                          <S.PrimaryTag>primary</S.PrimaryTag>
                        )}
                      </S.WorkflowMenuItemContent>
                    </S.WorkflowMenuItem>
                  );
                })}

                {/* Divider + Primary action */}
                <S.PrimaryMenuDivider />
                <S.PrimaryMenuAction
                  isSaveMode={isPrimaryMode}
                  value=""
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                  }}
                  onClick={handleSetPrimary}
                >
                  {isPrimaryMode ? 'Save' : 'Set a Workfloow as primary'}
                </S.PrimaryMenuAction>
              </S.WorkflowSelect>
            </S.WorkflowFormControl>
          )}
        </S.HeaderRow>
      </S.SectionHeader>

      {/* Stat boxes */}
      {!loading && (
        <StatBoxesRow
          jobs={allJobs}
          estimateSentTotal={estimateSentTotal}
          awaitingInvoiceTotal={awaitingInvoiceTotal}
        />
      )}

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
