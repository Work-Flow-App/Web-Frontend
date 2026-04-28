import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Collapse } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import NearMeOutlinedIcon from '@mui/icons-material/NearMeOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import { Button } from '../../../components/UI/Button';
import { workerJobWorkflowService } from '../../../services/api';
import type { JobWorkflowStepResponse, WorkerAssignedStepResponse } from '../../../services/api';
import { JobWorkflowStepResponseStatusEnum } from '../../../../workflow-api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import * as M from '../styles/WorkerMobile.styles';
import { WorkerStepComments } from './WorkerStepComments';
import { WorkerStepAttachments } from './WorkerStepAttachments';
import { WorkerStepWorkLogs } from './WorkerStepWorkLogs';
import { WorkerStepDiscussion } from './WorkerStepDiscussion';

type SectionKey = 'task' | 'location' | 'customer' | 'assets';
type ActivityTab = 'discussion' | 'comments' | 'attachments';

const SECTION_THEMES: Record<
  SectionKey,
  { accent: string; iconBg: string; iconFg: string }
> = {
  task: {
    accent: '#3B82F6',
    iconBg: 'rgba(59, 130, 246, 0.12)',
    iconFg: '#1D4ED8',
  },
  location: {
    accent: '#EF4444',
    iconBg: 'rgba(239, 68, 68, 0.12)',
    iconFg: '#B91C1C',
  },
  customer: {
    accent: '#06B6D4',
    iconBg: 'rgba(6, 182, 212, 0.12)',
    iconFg: '#0E7490',
  },
  assets: {
    accent: '#F59E0B',
    iconBg: 'rgba(245, 158, 11, 0.14)',
    iconFg: '#B45309',
  },
};

const formatAddress = (addr?: WorkerAssignedStepResponse['jobAddress']): string => {
  if (!addr) return '';
  return [addr.street, addr.city, addr.state, addr.postalCode, addr.country]
    .filter(Boolean)
    .join(', ');
};

const buildMapsUrl = (addr?: WorkerAssignedStepResponse['jobAddress']): string | null => {
  if (!addr) return null;
  if (addr.latitude != null && addr.longitude != null) {
    return `https://www.google.com/maps/dir/?api=1&destination=${addr.latitude},${addr.longitude}`;
  }
  const formatted = formatAddress(addr);
  return formatted
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(formatted)}`
    : null;
};

const buildPlusCode = (addr?: WorkerAssignedStepResponse['jobAddress']): string | null => {
  if (!addr) return null;
  if (addr.latitude != null && addr.longitude != null) {
    return `${addr.latitude.toFixed(4)}, ${addr.longitude.toFixed(4)}`;
  }
  return null;
};

const formatStatusLabel = (status?: string): string => {
  if (!status) return 'Not Started';
  return status
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

interface AccordionSectionProps {
  sectionKey: SectionKey;
  title: string;
  icon: React.ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const AccordionSection: React.FC<AccordionSectionProps> = ({
  sectionKey,
  title,
  icon,
  expanded,
  onToggle,
  children,
}) => {
  const theme = SECTION_THEMES[sectionKey];
  return (
    <M.AccordionCard accentColor={theme.accent}>
      <M.AccordionHeader onClick={onToggle} aria-expanded={expanded}>
        <M.AccordionIcon bg={theme.iconBg} fg={theme.iconFg}>
          {icon}
        </M.AccordionIcon>
        <M.AccordionTitle>{title}</M.AccordionTitle>
        <M.AccordionChevron
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <KeyboardArrowDownIcon />
        </M.AccordionChevron>
      </M.AccordionHeader>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <M.AccordionBody>{children}</M.AccordionBody>
      </Collapse>
    </M.AccordionCard>
  );
};

export const WorkerStepDetail: React.FC = () => {
  const { stepId } = useParams<{ stepId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();

  const [step, setStep] = useState<JobWorkflowStepResponse | null>(null);
  const [context, setContext] = useState<WorkerAssignedStepResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    task: true,
    location: false,
    customer: false,
    assets: false,
  });
  const [activityTab, setActivityTab] = useState<ActivityTab | null>(null);
  const [showWorkLogs, setShowWorkLogs] = useState(false);

  const fetchStep = useCallback(async () => {
    if (!stepId) return;
    try {
      setLoading(true);
      const numericId = Number(stepId);
      const [stepRes, assignedRes] = await Promise.all([
        workerJobWorkflowService.getStep(numericId),
        workerJobWorkflowService.getMyAssignedSteps(),
      ]);
      setStep(stepRes.data);
      const match = (assignedRes.data || []).find((s) => s.step?.id === numericId) || null;
      setContext(match);
    } catch (error) {
      console.error('Error fetching step:', error);
      showError('Failed to load step');
    } finally {
      setLoading(false);
    }
  }, [stepId, showError]);

  useEffect(() => {
    fetchStep();
  }, [fetchStep]);

  const toggle = (key: SectionKey) =>
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleBackClick = () => navigate('/worker/steps');

  const handleStartStep = async () => {
    if (!step?.id) return;
    try {
      setUpdating(true);
      await workerJobWorkflowService.startStep(step.id);
      showSuccess('Step started');
      fetchStep();
    } catch (error) {
      console.error('Error starting step:', error);
      showError('Failed to start step');
    } finally {
      setUpdating(false);
    }
  };

  const handleMarkOngoing = async () => {
    if (!step?.id) return;
    try {
      setUpdating(true);
      await workerJobWorkflowService.markStepOngoing(step.id);
      showSuccess('Step marked ongoing');
      fetchStep();
    } catch (error) {
      console.error('Error marking step ongoing:', error);
      showError('Failed to update step');
    } finally {
      setUpdating(false);
    }
  };

  const handleCompleteStep = async () => {
    if (!step?.id) return;
    try {
      setUpdating(true);
      if (step.status === JobWorkflowStepResponseStatusEnum.Ongoing) {
        await workerJobWorkflowService.completeOngoingStep(step.id);
      } else {
        await workerJobWorkflowService.completeStep(step.id);
      }
      showSuccess('Step completed');
      fetchStep();
    } catch (error) {
      console.error('Error completing step:', error);
      showError('Failed to complete step');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <M.WorkerShell>
        <M.LoadingBox>
          <CircularProgress size={28} />
        </M.LoadingBox>
      </M.WorkerShell>
    );
  }

  if (!step) {
    return (
      <M.WorkerShell>
        <M.WorkerHeader>
          <M.BackIconButton onClick={handleBackClick} aria-label="Back">
            <ArrowBackIcon />
          </M.BackIconButton>
          <h1>Step</h1>
        </M.WorkerHeader>
        <M.EmptyState>Step not found</M.EmptyState>
      </M.WorkerShell>
    );
  }

  const numericStepId = Number(stepId);
  const statusTheme = M.resolveStatusTheme(step.status);
  const mapsUrl = buildMapsUrl(context?.jobAddress);
  const plusCode = buildPlusCode(context?.jobAddress);

  return (
    <M.WorkerShell>
      <M.WorkerHeader>
        <M.BackIconButton onClick={handleBackClick} aria-label="Back">
          <ArrowBackIcon />
        </M.BackIconButton>
        <h1>Step: {step.name || `#${step.id}`}</h1>
      </M.WorkerHeader>

      <M.StepBadgesRow>
        <M.RefBadge>
          Job #{context?.jobRef ?? context?.jobId ?? step.id} · Step #{step.orderIndex ?? 1}
        </M.RefBadge>
        <M.StatusPill bg={statusTheme.pillBg} fg={statusTheme.pillFg}>
          {formatStatusLabel(step.status)}
        </M.StatusPill>
      </M.StepBadgesRow>

      <M.PageTitle>{step.name || `Step #${step.id}`}</M.PageTitle>

      {(step.status === JobWorkflowStepResponseStatusEnum.NotStarted ||
        step.status === JobWorkflowStepResponseStatusEnum.Initiated ||
        step.status === JobWorkflowStepResponseStatusEnum.Started ||
        step.status === JobWorkflowStepResponseStatusEnum.Ongoing) && (
        <M.StepActionsBar>
          {step.status === JobWorkflowStepResponseStatusEnum.NotStarted && (
            <Button onClick={handleStartStep} disabled={updating}>
              Start Step
            </Button>
          )}
          {step.status === JobWorkflowStepResponseStatusEnum.Initiated && (
            <Button onClick={handleMarkOngoing} disabled={updating}>
              Mark Ongoing
            </Button>
          )}
          {(step.status === JobWorkflowStepResponseStatusEnum.Started ||
            step.status === JobWorkflowStepResponseStatusEnum.Ongoing) && (
            <Button onClick={handleCompleteStep} disabled={updating}>
              Complete Step
            </Button>
          )}
        </M.StepActionsBar>
      )}

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <AccordionSection
          sectionKey="task"
          title="Task Details"
          icon={<DescriptionOutlinedIcon />}
          expanded={openSections.task}
          onToggle={() => toggle('task')}
        >
          <M.AccordionBodyRow>
            <span className="label">Description</span>
            <span className="value">{step.description || 'No description provided.'}</span>
          </M.AccordionBodyRow>
          <M.AccordionBodyRow>
            <span className="label">Started At</span>
            <span className="value">
              {step.startedAt ? new Date(step.startedAt).toLocaleString() : '-'}
            </span>
          </M.AccordionBodyRow>
          <M.AccordionBodyRow>
            <span className="label">Completed At</span>
            <span className="value">
              {step.completedAt ? new Date(step.completedAt).toLocaleString() : '-'}
            </span>
          </M.AccordionBodyRow>
        </AccordionSection>

        <AccordionSection
          sectionKey="location"
          title="Service Location"
          icon={<LocationOnOutlinedIcon />}
          expanded={openSections.location}
          onToggle={() => toggle('location')}
        >
          {plusCode && (
            <M.AccordionBodyRow>
              <span className="label">Coordinates</span>
              <span className="value" style={{ fontWeight: 700 }}>{plusCode}</span>
            </M.AccordionBodyRow>
          )}
          <M.AccordionBodyRow>
            <span className="label">Address</span>
            <span className="value">
              {formatAddress(context?.jobAddress) || 'No address provided'}
            </span>
          </M.AccordionBodyRow>
          {context?.jobAddress?.additionalInfo && (
            <M.AccordionBodyRow>
              <span className="label">Additional Info</span>
              <span className="value">{context.jobAddress.additionalInfo}</span>
            </M.AccordionBodyRow>
          )}
          {mapsUrl && (
            <M.PrimaryActionButton
              onClick={() => window.open(mapsUrl, '_blank', 'noopener,noreferrer')}
            >
              <NearMeOutlinedIcon />
              Get Directions
            </M.PrimaryActionButton>
          )}
        </AccordionSection>

        <AccordionSection
          sectionKey="customer"
          title="Customer Details"
          icon={<PersonOutlineIcon />}
          expanded={openSections.customer}
          onToggle={() => toggle('customer')}
        >
          {context?.customer ? (
            <>
              <M.AccordionBodyRow>
                <span className="label">Name</span>
                <span className="value">{context.customer.name || '-'}</span>
              </M.AccordionBodyRow>
              {context.customer.email && (
                <M.AccordionBodyRow>
                  <span className="label">Email</span>
                  <span className="value">
                    <a
                      href={`mailto:${context.customer.email}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {context.customer.email}
                    </a>
                  </span>
                </M.AccordionBodyRow>
              )}
              {context.customer.telephone && (
                <M.AccordionBodyRow>
                  <span className="label">Phone</span>
                  <span className="value">
                    <a
                      href={`tel:${context.customer.telephone}`}
                      style={{ color: '#1976d2', textDecoration: 'none' }}
                    >
                      {context.customer.telephone}
                    </a>
                  </span>
                </M.AccordionBodyRow>
              )}
            </>
          ) : (
            <M.AccordionBodyRow>
              <span className="value">No customer information available.</span>
            </M.AccordionBodyRow>
          )}
        </AccordionSection>

        <AccordionSection
          sectionKey="assets"
          title="Assigned Assets"
          icon={<Inventory2OutlinedIcon />}
          expanded={openSections.assets}
          onToggle={() => toggle('assets')}
        >
          {context?.assignedAssets && context.assignedAssets.length > 0 ? (
            context.assignedAssets.map((asset) => (
              <M.AccordionBodyRow key={asset.assignmentId}>
                <span className="label">{asset.assetName || `Asset #${asset.assetId}`}</span>
                <span className="value">
                  {[asset.assetTag, asset.serialNumber, asset.notes].filter(Boolean).join(' · ') || '-'}
                </span>
              </M.AccordionBodyRow>
            ))
          ) : (
            <M.AccordionBodyRow>
              <span className="value">No assets assigned to this step.</span>
            </M.AccordionBodyRow>
          )}
        </AccordionSection>
      </Box>

      <M.FloatingActionButton onClick={() => setShowWorkLogs((prev) => !prev)}>
        <AccessTimeIcon />
        Work Logs
      </M.FloatingActionButton>

      <Collapse in={showWorkLogs} timeout="auto" unmountOnExit>
        <Box
          sx={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '14px',
          }}
        >
          <WorkerStepWorkLogs stepId={numericStepId} />
        </Box>
      </Collapse>

      <M.ActivityCard
        onClick={() => setActivityTab((prev) => (prev ? null : 'discussion'))}
        role="button"
      >
        <ChatBubbleOutlineIcon />
        <span>Activity, Comments &amp; Attachments</span>
      </M.ActivityCard>

      <Collapse in={activityTab !== null} timeout="auto" unmountOnExit>
        <Box
          sx={{
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <M.ActivityTabsBar>
            <M.FilterTab
              active={activityTab === 'discussion'}
              onClick={() => setActivityTab('discussion')}
            >
              Discussion
            </M.FilterTab>
            <M.FilterTab
              active={activityTab === 'comments'}
              onClick={() => setActivityTab('comments')}
            >
              Comments
            </M.FilterTab>
            <M.FilterTab
              active={activityTab === 'attachments'}
              onClick={() => setActivityTab('attachments')}
            >
              Attachments
            </M.FilterTab>
          </M.ActivityTabsBar>

          {activityTab === 'discussion' && <WorkerStepDiscussion stepId={numericStepId} />}
          {activityTab === 'comments' && (
            <WorkerStepComments stepId={numericStepId} onUpdate={fetchStep} />
          )}
          {activityTab === 'attachments' && (
            <WorkerStepAttachments stepId={numericStepId} onUpdate={fetchStep} />
          )}
        </Box>
      </Collapse>
    </M.WorkerShell>
  );
};

export default WorkerStepDetail;
