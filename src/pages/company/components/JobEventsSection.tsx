import React, { useEffect, useMemo, useState, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { rem } from '../../../components/UI/Typography/utility';
import { queries } from '../../../services/queries';
import type { WorkflowResponse } from '../../../services/api';
import { toStepEventGroups, type StepEventGroup } from '../dashboardMappers';
import { useDashboardPreferences } from '../dashboardQueries';
import { floowColors } from '../../../theme/colors';
import { JobStepDetailDrawer } from './JobStepDetailDrawer';
import * as S from './JobEventsSection.styles';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getJobLabel(count: number, status: string | undefined): string {
  if (status === 'STARTED' || status === 'ONGOING') return `${count} Job${count !== 1 ? 's' : ''} active`;
  return `${count} Job${count !== 1 ? 's' : ''} waiting`;
}

function StatBoxesRow({ inProgress, total }: { inProgress: number; total: number }) {
  const progressPct = total > 0 ? Math.round((inProgress / total) * 100) : 0;

  return (
    <S.StatBoxesContainer>
      <S.StatCard>
        <S.StatLabel>Work In Progress (Total Job)</S.StatLabel>
        <S.StatValue>{inProgress}</S.StatValue>
        <S.StatProgressBar
          variant="determinate"
          value={progressPct}
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
                  <S.DropdownCloseIcon />
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
          <S.EmptyStateIcon />
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
        const statusOfFirst = group.jobs[0]?.currentStepStatus;
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
              <S.EventArrowIcon />
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
    .flatMap((g) => g.jobs)
    .filter((job) => job.currentStepStatus === 'STARTED' || job.currentStepStatus === 'ONGOING').length;

  const withJobs = groups.filter((g) => g.count > 0);
  const noJobs = groups.filter((g) => g.count === 0);

  return (
    <S.SummaryCard>
      <S.SummaryTitle>Workfloow Pipeline</S.SummaryTitle>

      <S.SummaryStatRow>
        <S.SummaryBubbleItem>
          <S.SummaryBubble bubbleColor={floowColors.info.main}>{totalJobs}</S.SummaryBubble>
          <S.SummaryBubbleLabel>Total</S.SummaryBubbleLabel>
        </S.SummaryBubbleItem>
        <S.SummaryBubbleItem>
          <S.SummaryBubble bubbleColor={floowColors.success.main}>{activeJobs}</S.SummaryBubble>
          <S.SummaryBubbleLabel>Active</S.SummaryBubbleLabel>
        </S.SummaryBubbleItem>
      </S.SummaryStatRow>

      {withJobs.length > 0 && (
        <>
          <S.SummaryDivider />
          <S.SummarySection>
            <S.SummarySectionLabel>With Jobs</S.SummarySectionLabel>
            {withJobs.map((g) => (
              <S.SummaryRow key={g.stepName}>
                <S.SummaryRowName>{g.stepName}</S.SummaryRowName>
                <S.SummaryRowCount countColor={g.color}>{g.count}</S.SummaryRowCount>
              </S.SummaryRow>
            ))}
          </S.SummarySection>
        </>
      )}

      {noJobs.length > 0 && (
        <>
          <S.SummaryDivider />
          <S.SummarySection>
            <S.SummarySectionLabel>Empty Steps</S.SummarySectionLabel>
            {noJobs.map((g) => (
              <S.SummaryRow key={g.stepName}>
                <S.SummaryRowName>{g.stepName}</S.SummaryRowName>
                <S.SummaryRowCount countColor={floowColors.grey[400]}>0</S.SummaryRowCount>
              </S.SummaryRow>
            ))}
          </S.SummarySection>
        </>
      )}
    </S.SummaryCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const NO_WORKFLOWS: WorkflowResponse[] = [];
const NO_GROUPS: StepEventGroup[] = [];

export const JobEventsSection: React.FC = () => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<number | null>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isPrimaryMode, setIsPrimaryMode] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [pendingPrimaryId, setPendingPrimaryId] = useState<number | null>(null);

  const { primaryWorkflowId: savedPrimaryWorkflowId, update: updatePreferences } = useDashboardPreferences();
  const jobStatsQuery = useQuery(queries.jobStats());
  const workflowsQuery = useQuery(queries.workflows());
  const workflows = workflowsQuery.data ?? NO_WORKFLOWS;

  // The first workflow is primary until the user picks one, or if theirs has since been deleted
  const primaryWorkflowId = workflows.some((w) => w.id === savedPrimaryWorkflowId)
    ? savedPrimaryWorkflowId
    : (workflows[0]?.id ?? null);
  const activeWorkflowId = selectedWorkflowId ?? primaryWorkflowId;

  // Cached per workflow so switching back is instant
  const eventsQuery = useQuery({
    ...queries.workflowEvents(activeWorkflowId!),
    enabled: activeWorkflowId != null,
    placeholderData: keepPreviousData,
  });
  const events = eventsQuery.data;
  const groups = useMemo(() => (events ? toStepEventGroups(events) : NO_GROUPS), [events]);
  const loading = workflowsQuery.isLoading || eventsQuery.isLoading;

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
        updatePreferences({ primaryWorkflowId: pendingPrimaryId });
      }
      setIsPrimaryMode(false);
      setPendingPrimaryId(null);
      // Keep open after save
    } else {
      // Enter primary-selection mode — highlight the current primary
      setPendingPrimaryId(primaryWorkflowId);
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
                value={activeWorkflowId ?? ''}
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
      {!jobStatsQuery.isLoading && (
        <StatBoxesRow inProgress={jobStatsQuery.data?.inProgress ?? 0} total={jobStatsQuery.data?.total ?? 0} />
      )}

      {/* Pipeline bar */}
      {loading ? (
        <S.LoadingBox>
          <CircularProgress size={rem(28)} />
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
        />
      )}
    </S.SectionWrapper>
  );
};
