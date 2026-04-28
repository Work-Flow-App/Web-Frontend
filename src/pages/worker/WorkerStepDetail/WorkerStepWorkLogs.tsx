import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import type { StepVisitLogResponse } from '../../../services/api';
import { workerJobWorkflowService } from '../../../services/api';
import { useGlobalModalOuterContext, ModalSizes } from '../../../components/UI/GlobalModal';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { Button } from '../../../components/UI/Button';
import { AddWorkLogModal } from './AddWorkLogModal';
import * as M from '../styles/WorkerMobile.styles';

interface WorkerStepWorkLogsProps {
  stepId: number;
}

const formatMinutes = (minutes?: number): string => {
  if (!minutes) return '0h 0m';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const formatTime = (timeString?: string): string => {
  if (!timeString) return '-';
  if (timeString.includes('T')) {
    return new Date(timeString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  }
  return timeString.substring(0, 5);
};

export const WorkerStepWorkLogs: React.FC<WorkerStepWorkLogsProps> = ({ stepId }) => {
  const { showSuccess } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [visitLogs, setVisitLogs] = useState<StepVisitLogResponse[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVisitLogs = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getStepVisits(stepId);
      setVisitLogs(response.data.visitLogs || []);
      setTotalMinutes(response.data.totalWorkedMinutes || 0);
    } catch {
      setVisitLogs([]);
      setTotalMinutes(0);
    } finally {
      setLoading(false);
    }
  }, [stepId]);

  useEffect(() => {
    fetchVisitLogs();
  }, [fetchVisitLogs]);

  const summary = useMemo(() => {
    const totalEntries = visitLogs.length;
    const totalHours = totalMinutes / 60;
    const avgMinutes = totalEntries > 0 ? Math.round(totalMinutes / totalEntries) : 0;
    return { totalEntries, totalHours, avgMinutes };
  }, [visitLogs, totalMinutes]);

  const openAddModal = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addWorkLog',
      children: (
        <AddWorkLogModal
          stepId={stepId}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            showSuccess('Work log added');
            fetchVisitLogs();
          }}
        />
      ),
    });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <M.WorkLogsSummaryGrid>
        <M.WorkLogsSummaryTile>
          <span className="label">Total Time</span>
          <span className="value">{formatMinutes(totalMinutes)}</span>
        </M.WorkLogsSummaryTile>
        <M.WorkLogsSummaryTile>
          <span className="label">Total Hours</span>
          <span className="value">{summary.totalHours.toFixed(1)}</span>
        </M.WorkLogsSummaryTile>
        <M.WorkLogsSummaryTile>
          <span className="label">Entries</span>
          <span className="value">{summary.totalEntries}</span>
        </M.WorkLogsSummaryTile>
        <M.WorkLogsSummaryTile>
          <span className="label">Avg per Entry</span>
          <span className="value">{formatMinutes(summary.avgMinutes)}</span>
        </M.WorkLogsSummaryTile>
      </M.WorkLogsSummaryGrid>

      <M.WorkLogsHeader>
        <h3>Work Logs ({visitLogs.length})</h3>
        <Button onClick={openAddModal} size="small" startIcon={<AddIcon fontSize="small" />}>
          Add Work Log
        </Button>
      </M.WorkLogsHeader>

      {loading ? (
        <Loader centered minHeight="160px" />
      ) : visitLogs.length === 0 ? (
        <M.EmptyState>
          <AccessTimeIcon />
          <span>No work logs recorded yet</span>
        </M.EmptyState>
      ) : (
        <M.WorkLogList>
          {visitLogs.map((log) => (
            <M.WorkLogItem key={log.id}>
              <M.WorkLogTopRow>
                <M.WorkLogTimeRow>
                  <EventOutlinedIcon />
                  <span className="date">{formatDate(log.visitDate)}</span>
                </M.WorkLogTimeRow>
                <span className="duration">{formatMinutes(log.workedMinutes)}</span>
              </M.WorkLogTopRow>

              <Box sx={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <M.WorkLogTimeRow>
                  <LoginOutlinedIcon />
                  <span>In: {formatTime(log.timeIn)}</span>
                </M.WorkLogTimeRow>
                <M.WorkLogTimeRow>
                  <LogoutOutlinedIcon />
                  <span>Out: {formatTime(log.timeOut)}</span>
                </M.WorkLogTimeRow>
              </Box>

              {log.description && (
                <M.WorkLogDescription>{log.description}</M.WorkLogDescription>
              )}

              {log.createdAt && (
                <M.WorkLogMeta>Logged on {formatDate(log.createdAt)}</M.WorkLogMeta>
              )}
            </M.WorkLogItem>
          ))}
        </M.WorkLogList>
      )}
    </Box>
  );
};
