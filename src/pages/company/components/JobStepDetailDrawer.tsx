import React from 'react';
import { Drawer, Box, IconButton, Typography, Divider } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import { useNavigate } from 'react-router-dom';
import type { JobResponse } from '../../../services/api';
import { rem } from '../../../components/UI/Typography/utility';
import { floowColors } from '../../../theme/colors';
import type { StepEventGroup } from './JobEventsSection';

interface JobStepDetailDrawerProps {
  open: boolean;
  onClose: () => void;
  stepGroup: StepEventGroup;
  jobsMap: Map<number, JobResponse>;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  STARTED:     { bg: floowColors.info.light,    text: floowColors.info.dark,    border: floowColors.info.main },
  ONGOING:     { bg: floowColors.info.light,    text: floowColors.info.dark,    border: floowColors.info.main },
  INITIATED:   { bg: floowColors.warning.light, text: floowColors.warning.dark, border: floowColors.warning.main },
  PENDING:     { bg: floowColors.warning.light, text: floowColors.warning.dark, border: floowColors.warning.main },
  NOT_STARTED: { bg: floowColors.grey[100],     text: floowColors.grey[500],    border: floowColors.grey[300] },
  COMPLETED:   { bg: floowColors.success.light, text: floowColors.green.main,   border: floowColors.success.main },
  SKIPPED:     { bg: floowColors.error.bgLight, text: floowColors.error.main,   border: floowColors.error.main },
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
    if (titleField && titleField[1]?.value) return String(titleField[1].value);
  }
  return `Job #${jobId}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
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

  const statusBreakdown = stepGroup.jobWorkflows.reduce<Record<string, number>>((acc, { currentStep }) => {
    const s = currentStep.status ?? 'UNKNOWN';
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const handleGoToJob = (jobId: number) => {
    navigate(`/company/jobs/${jobId}/details`);
    onClose();
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: { xs: '100vw', sm: 680 },
            display: 'flex',
            flexDirection: 'column',
            bgcolor: floowColors.grey[50],
            boxShadow: `-4px 0 24px ${floowColors.shadow.xxl}`,
          },
        },
      }}
    >
      {/* ── Header ─────────────────────────────────────────────────── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: rem(24),
          py: rem(18),
          bgcolor: floowColors.white,
          borderBottom: `1px solid ${floowColors.border.light}`,
          flexShrink: 0,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(12) }}>
          <Box
            sx={{
              width: rem(40),
              height: rem(40),
              borderRadius: rem(10),
              bgcolor: `${stepGroup.color}18`,
              border: `1.5px solid ${stepGroup.color}40`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: stepGroup.color,
            }}
          >
            <WorkOutlineIcon sx={{ fontSize: rem(20) }} />
          </Box>
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: rem(17), color: floowColors.text.heading, lineHeight: 1.2 }}>
              {stepGroup.stepName}
            </Typography>
            <Typography sx={{ fontSize: rem(12), color: floowColors.text.muted, mt: rem(2) }}>
              {stepGroup.count} job{stepGroup.count !== 1 ? 's' : ''} at this step
            </Typography>
          </Box>
        </Box>

        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            bgcolor: floowColors.grey[100],
            '&:hover': { bgcolor: floowColors.grey[200] },
            width: rem(32),
            height: rem(32),
          }}
        >
          <CloseIcon sx={{ fontSize: rem(16) }} />
        </IconButton>
      </Box>

      {/* ── Body ───────────────────────────────────────────────────── */}
      <Box sx={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* Left — Job List */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: rem(16),
            display: 'flex',
            flexDirection: 'column',
            gap: rem(8),
          }}
        >
          {stepGroup.jobWorkflows.length === 0 ? (
            <Box
              sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                color: floowColors.text.muted,
                gap: rem(8),
                py: rem(64),
              }}
            >
              <WorkOutlineIcon sx={{ fontSize: rem(36), opacity: 0.4 }} />
              <Typography sx={{ fontSize: rem(14) }}>No jobs at this step</Typography>
            </Box>
          ) : (
            stepGroup.jobWorkflows.map(({ jobWorkflow, currentStep }, index) => {
              const jobId = jobWorkflow.jobId!;
              const job = jobsMap.get(jobId);
              const statusStyle = STATUS_COLORS[currentStep.status ?? ''] ?? STATUS_COLORS.NOT_STARTED;
              const statusLabel = STATUS_LABELS[currentStep.status ?? ''] ?? currentStep.status ?? '';
              const title = getJobTitle(job, jobId);

              return (
                <Box
                  key={`${jobId}-${index}`}
                  onClick={() => handleGoToJob(jobId)}
                  sx={{
                    bgcolor: floowColors.white,
                    borderRadius: rem(10),
                    border: `1px solid ${floowColors.border.light}`,
                    borderLeft: `3px solid ${statusStyle.border}`,
                    px: rem(16),
                    py: rem(14),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: rem(12),
                    cursor: 'pointer',
                    transition: 'box-shadow 0.15s, border-color 0.15s',
                    '&:hover': {
                      boxShadow: `0 2px 12px ${floowColors.shadow.md}`,
                      borderColor: floowColors.border.medium,
                      borderLeftColor: statusStyle.border,
                    },
                  }}
                >
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    {/* Title row */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(8), mb: rem(6) }}>
                      <Typography
                        sx={{
                          fontWeight: 600,
                          fontSize: rem(14),
                          color: floowColors.text.heading,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {title}
                      </Typography>
                      {/* Step status badge */}
                      <Box
                        sx={{
                          px: rem(8),
                          py: rem(2),
                          borderRadius: rem(20),
                          bgcolor: statusStyle.bg,
                          color: statusStyle.text,
                          fontSize: rem(11),
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          lineHeight: 1.6,
                        }}
                      >
                        {statusLabel}
                      </Box>
                    </Box>

                    {/* Meta row */}
                    <Box sx={{ display: 'flex', gap: rem(12), alignItems: 'center' }}>
                      {job?.status && (
                        <Typography
                          sx={{
                            fontSize: rem(11),
                            color: floowColors.text.muted,
                            bgcolor: floowColors.grey[100],
                            px: rem(6),
                            py: rem(1),
                            borderRadius: rem(4),
                            fontWeight: 500,
                          }}
                        >
                          {job.status.replace(/_/g, ' ')}
                        </Typography>
                      )}
                      {job?.createdAt && (
                        <Typography sx={{ fontSize: rem(11), color: floowColors.text.disabled }}>
                          {formatDate(job.createdAt)}
                        </Typography>
                      )}
                    </Box>
                  </Box>

                  <IconButton
                    size="small"
                    onClick={(e) => { e.stopPropagation(); handleGoToJob(jobId); }}
                    sx={{
                      flexShrink: 0,
                      color: floowColors.text.muted,
                      opacity: 0,
                      '.MuiBox-root:hover &': { opacity: 1 },
                      transition: 'opacity 0.15s',
                      '&:hover': { color: floowColors.blue.main },
                    }}
                  >
                    <OpenInNewIcon sx={{ fontSize: rem(16) }} />
                  </IconButton>
                </Box>
              );
            })
          )}
        </Box>

        {/* Right — Summary Panel */}
        <Box
          sx={{
            width: rem(200),
            flexShrink: 0,
            bgcolor: floowColors.white,
            borderLeft: `1px solid ${floowColors.border.light}`,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {/* Active / Waiting */}
          <Box sx={{ p: rem(20) }}>
            <Typography
              sx={{
                fontSize: rem(11),
                fontWeight: 700,
                color: floowColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: rem(14),
              }}
            >
              Ongoing Total Jobs
            </Typography>

            <Box sx={{ display: 'flex', gap: rem(10), mb: rem(10) }}>
              {/* Active bubble */}
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: rem(52),
                    height: rem(52),
                    borderRadius: '50%',
                    border: `2.5px solid ${floowColors.info.main}`,
                    bgcolor: floowColors.info.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: floowColors.info.dark,
                    fontWeight: 800,
                    fontSize: rem(18),
                    mx: 'auto',
                  }}
                >
                  {activeCount}
                </Box>
                <Typography sx={{ fontSize: rem(10), color: floowColors.text.muted, mt: rem(4), fontWeight: 500 }}>
                  Active
                </Typography>
              </Box>

              {/* Waiting bubble */}
              <Box sx={{ textAlign: 'center' }}>
                <Box
                  sx={{
                    width: rem(52),
                    height: rem(52),
                    borderRadius: '50%',
                    border: `2.5px solid ${floowColors.success.main}`,
                    bgcolor: floowColors.success.light,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: floowColors.green.main,
                    fontWeight: 800,
                    fontSize: rem(18),
                    mx: 'auto',
                  }}
                >
                  {waitingCount}
                </Box>
                <Typography sx={{ fontSize: rem(10), color: floowColors.text.muted, mt: rem(4), fontWeight: 500 }}>
                  Waiting
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: floowColors.border.light }} />

          {/* Step Info */}
          <Box sx={{ p: rem(20) }}>
            <Typography
              sx={{
                fontSize: rem(11),
                fontWeight: 700,
                color: floowColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: rem(12),
              }}
            >
              Step Info
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: rem(8) }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: rem(12), color: floowColors.text.muted }}>Order</Typography>
                <Typography
                  sx={{
                    fontSize: rem(12),
                    fontWeight: 600,
                    color: floowColors.text.primary,
                    bgcolor: floowColors.grey[100],
                    px: rem(8),
                    py: rem(2),
                    borderRadius: rem(4),
                  }}
                >
                  #{stepGroup.orderIndex + 1}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: rem(12), color: floowColors.text.muted }}>Total</Typography>
                <Typography sx={{ fontSize: rem(12), fontWeight: 600, color: floowColors.text.primary }}>
                  {stepGroup.count} job{stepGroup.count !== 1 ? 's' : ''}
                </Typography>
              </Box>
            </Box>
          </Box>

          <Divider sx={{ borderColor: floowColors.border.light }} />

          {/* By Status */}
          <Box sx={{ p: rem(20) }}>
            <Typography
              sx={{
                fontSize: rem(11),
                fontWeight: 700,
                color: floowColors.text.muted,
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                mb: rem(12),
              }}
            >
              By Status
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: rem(8) }}>
              {Object.entries(statusBreakdown).map(([status, count]) => {
                const style = STATUS_COLORS[status] ?? STATUS_COLORS.NOT_STARTED;
                return (
                  <Box
                    key={status}
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      py: rem(4),
                      px: rem(8),
                      borderRadius: rem(6),
                      bgcolor: style.bg,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: rem(6) }}>
                      <Box
                        sx={{
                          width: rem(6),
                          height: rem(6),
                          borderRadius: '50%',
                          bgcolor: style.border,
                          flexShrink: 0,
                        }}
                      />
                      <Typography sx={{ fontSize: rem(12), color: style.text, fontWeight: 500 }}>
                        {STATUS_LABELS[status] ?? status}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: rem(12), fontWeight: 700, color: style.text }}>
                      {count}
                    </Typography>
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
};
