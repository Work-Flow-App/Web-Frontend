import React from 'react';
import { Drawer, Box, IconButton, Typography, Divider, Chip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import type { JobResponse } from '../../../services/api';
import { rem } from '../../../components/UI/Typography/utility';
import type { StepEventGroup } from './JobEventsSection';

interface JobStepDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  stepGroup: StepEventGroup;
  jobsMap: Map<number, JobResponse>;
}

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  STARTED:     { bg: '#EBF5FF', text: '#2563EB' },
  ONGOING:     { bg: '#EBF5FF', text: '#2563EB' },
  INITIATED:   { bg: '#FFF7ED', text: '#D97706' },
  PENDING:     { bg: '#FFF7ED', text: '#D97706' },
  NOT_STARTED: { bg: '#F5F5F5', text: '#6B7280' },
  COMPLETED:   { bg: '#F0FDF4', text: '#16A34A' },
  SKIPPED:     { bg: '#FEF2F2', text: '#DC2626' },
};

const STATUS_LABELS: Record<string, string> = {
  STARTED:     'In Progress',
  ONGOING:     'Ongoing',
  INITIATED:   'Ready',
  PENDING:     'Pending',
  NOT_STARTED: 'Waiting',
  COMPLETED:   'Done',
  SKIPPED:     'Skipped',
};

function getJobTitle(job: JobResponse | undefined, jobId: number): string {
  if (!job) return `Job #${jobId}`;
  if (job.fieldValues) {
    const titleField = Object.entries(job.fieldValues).find(
      ([key]) => key.toLowerCase().includes('title') || key.toLowerCase().includes('name')
    );
    if (titleField && titleField[1]?.value) {
      return String(titleField[1].value);
    }
  }
  return `Job #${jobId}`;
}

export const JobStepDetailDrawer: React.FC<JobStepDetailDrawerProps> = ({
  open,
  onClose,
  stepGroup,
  jobsMap,
}) => {
  const navigate = useNavigate();

  const activeCount = stepGroup.jobWorkflows.filter(
    ({ currentStep }) => currentStep.status === 'STARTED' || currentStep.status === 'ONGOING'
  ).length;
  const waitingCount = stepGroup.count - activeCount;

  const handleGoToJob = (jobId: number) => {
    navigate(`/company/jobs/${jobId}/details`);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100vw', sm: 600 },
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: rem(24),
          py: rem(16),
          borderBottom: '1px solid',
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: rem(18) }}>
            {stepGroup.stepName}
          </Typography>
          <Typography sx={{ fontSize: rem(13), color: 'text.secondary', mt: rem(2) }}>
            {stepGroup.count} job{stepGroup.count !== 1 ? 's' : ''} at this step
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Two-column content area */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left — Job Details List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            borderRight: '1px solid',
            borderColor: 'divider',
          }}
        >
          {stepGroup.jobWorkflows.length === 0 ? (
            <Box sx={{ p: rem(32), textAlign: 'center', color: 'text.secondary', fontSize: rem(14) }}>
              No jobs at this step
            </Box>
          ) : (
            stepGroup.jobWorkflows.map(({ jobWorkflow, currentStep }, index) => {
              const jobId = jobWorkflow.jobId!;
              const job = jobsMap.get(jobId);
              const statusStyle = STATUS_COLORS[currentStep.status ?? ''] ?? STATUS_COLORS.NOT_STARTED;
              const statusLabel = STATUS_LABELS[currentStep.status ?? ''] ?? currentStep.status ?? '';
              const title = getJobTitle(job, jobId);

              return (
                <Box key={`${jobId}-${index}`}>
                  <Box
                    sx={{
                      px: rem(20),
                      py: rem(14),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: rem(12),
                      cursor: 'pointer',
                      '&:hover': { bgcolor: 'action.hover' },
                    }}
                    onClick={() => handleGoToJob(jobId)}
                  >
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: rem(14),
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {title}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: rem(8), mt: rem(4), flexWrap: 'wrap', alignItems: 'center' }}>
                        <Chip
                          label={statusLabel}
                          size="small"
                          sx={{
                            backgroundColor: statusStyle.bg,
                            color: statusStyle.text,
                            fontWeight: 600,
                            fontSize: rem(11),
                            height: rem(20),
                          }}
                        />
                        {job?.status && (
                          <Typography sx={{ fontSize: rem(12), color: 'text.secondary' }}>
                            {job.status.replace('_', ' ')}
                          </Typography>
                        )}
                        {job?.createdAt && (
                          <Typography sx={{ fontSize: rem(11), color: 'text.disabled' }}>
                            Created {new Date(job.createdAt).toLocaleDateString()}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    <IconButton
                      size="small"
                      onClick={(e) => { e.stopPropagation(); handleGoToJob(jobId); }}
                      sx={{ flexShrink: 0, color: 'text.secondary' }}
                    >
                      <OpenInNewIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Divider />
                </Box>
              );
            })
          )}
        </Box>

        {/* Right — Ongoing Summary Card */}
        <Box
          sx={{
            width: rem(180),
            flexShrink: 0,
            p: rem(16),
            display: 'flex',
            flexDirection: 'column',
            gap: rem(16),
            overflowY: 'auto',
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: rem(13) }}>
            Ongoing Total Jobs
          </Typography>

          {/* A / O bubbles */}
          <Box sx={{ display: 'flex', gap: rem(10) }}>
            <Box
              sx={{
                width: rem(48),
                height: rem(48),
                borderRadius: '50%',
                border: '2px solid #4A90D9',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#4A90D9',
                fontWeight: 700,
                fontSize: rem(16),
              }}
              title="Active"
            >
              {activeCount}
            </Box>
            <Box
              sx={{
                width: rem(48),
                height: rem(48),
                borderRadius: '50%',
                border: '2px solid #2BAE66',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                color: '#2BAE66',
                fontWeight: 700,
                fontSize: rem(16),
              }}
              title="Waiting"
            >
              {waitingCount}
            </Box>
          </Box>

          <Typography sx={{ fontSize: rem(11), color: 'text.disabled' }}>
            Active / Waiting
          </Typography>

          <Divider />

          {/* Step info */}
          <Box>
            <Typography sx={{ fontSize: rem(11), fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', mb: rem(8) }}>
              Step Info
            </Typography>
            <Typography sx={{ fontSize: rem(12), color: 'text.secondary', mb: rem(4) }}>
              Order: #{stepGroup.orderIndex + 1}
            </Typography>
            <Typography sx={{ fontSize: rem(12), color: 'text.secondary' }}>
              Total: {stepGroup.count} job{stepGroup.count !== 1 ? 's' : ''}
            </Typography>
          </Box>

          <Divider />

          {/* Status breakdown */}
          <Box>
            <Typography sx={{ fontSize: rem(11), fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase', mb: rem(8) }}>
              By Status
            </Typography>
            {Object.entries(
              stepGroup.jobWorkflows.reduce<Record<string, number>>((acc, { currentStep }) => {
                const s = currentStep.status ?? 'UNKNOWN';
                acc[s] = (acc[s] ?? 0) + 1;
                return acc;
              }, {})
            ).map(([status, count]) => (
              <Box key={status} sx={{ display: 'flex', justifyContent: 'space-between', mb: rem(4) }}>
                <Typography sx={{ fontSize: rem(12), color: 'text.secondary' }}>
                  {STATUS_LABELS[status] ?? status}
                </Typography>
                <Typography sx={{ fontSize: rem(12), fontWeight: 600, color: STATUS_COLORS[status]?.text ?? 'text.primary' }}>
                  {count}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
