import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TableRow } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import type { StepVisitLogResponse } from '../../../services/api';
import { workerJobWorkflowService } from '../../../services/api';
import { useGlobalModalOuterContext, ModalSizes } from '../../../components/UI/GlobalModal';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { Button } from '../../../components/UI/Button';
import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledHeaderCell,
  StyledTableCell,
} from '../../../components/UI/Table/Table.styles';
import { AddWorkLogModal } from './AddWorkLogModal';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerStepWorkLogsProps {
  stepId: number;
}

const COMPACT_CELL = { py: '5px', px: '10px', fontSize: '0.8125rem' };

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
    <S.WorkLogsContainer>
      <S.WorkLogsSummaryRow>
        <S.WorkLogsSummaryCard>
          <S.DetailLabel>Total Time</S.DetailLabel>
          <S.WorkLogsSummaryValue>{formatMinutes(totalMinutes)}</S.WorkLogsSummaryValue>
        </S.WorkLogsSummaryCard>
        <S.WorkLogsSummaryCard>
          <S.DetailLabel>Total Hours</S.DetailLabel>
          <S.WorkLogsSummaryValue>{summary.totalHours.toFixed(1)}</S.WorkLogsSummaryValue>
        </S.WorkLogsSummaryCard>
        <S.WorkLogsSummaryCard>
          <S.DetailLabel>Entries</S.DetailLabel>
          <S.WorkLogsSummaryValue>{summary.totalEntries}</S.WorkLogsSummaryValue>
        </S.WorkLogsSummaryCard>
        <S.WorkLogsSummaryCard>
          <S.DetailLabel>Avg per Entry</S.DetailLabel>
          <S.WorkLogsSummaryValue>{formatMinutes(summary.avgMinutes)}</S.WorkLogsSummaryValue>
        </S.WorkLogsSummaryCard>
      </S.WorkLogsSummaryRow>

      <S.WorkLogsTableHeader>
        <S.DetailsSectionTitle>
          Work Logs ({visitLogs.length})
        </S.DetailsSectionTitle>
        <Button onClick={openAddModal} startIcon={<AddIcon fontSize="small" />}>
          Add Work Log
        </Button>
      </S.WorkLogsTableHeader>

      {loading ? (
        <Loader centered minHeight="200px" />
      ) : visitLogs.length === 0 ? (
        <S.DocumentsEmptyState>
          <S.DocumentsEmptyIcon>
            <AccessTimeIcon sx={{ fontSize: 32 }} />
          </S.DocumentsEmptyIcon>
          <S.DocumentsEmptyText>No work logs recorded yet</S.DocumentsEmptyText>
          <S.DocumentsEmptySubtext>
            Add a work log to track time spent on this step
          </S.DocumentsEmptySubtext>
        </S.DocumentsEmptyState>
      ) : (
        <StyledTableContainer>
          <StyledTable>
            <StyledTableHead>
              <TableRow>
                <StyledHeaderCell sx={COMPACT_CELL}>Date</StyledHeaderCell>
                <StyledHeaderCell sx={COMPACT_CELL}>Start Time</StyledHeaderCell>
                <StyledHeaderCell sx={COMPACT_CELL}>End Time</StyledHeaderCell>
                <StyledHeaderCell align="right" sx={COMPACT_CELL}>Duration</StyledHeaderCell>
                <StyledHeaderCell sx={COMPACT_CELL}>Description</StyledHeaderCell>
                <StyledHeaderCell sx={COMPACT_CELL}>Created</StyledHeaderCell>
              </TableRow>
            </StyledTableHead>

            <StyledTableBody>
              {visitLogs.map((log) => (
                <StyledTableRow key={log.id}>
                  <StyledTableCell sx={COMPACT_CELL}>{formatDate(log.visitDate)}</StyledTableCell>
                  <StyledTableCell sx={COMPACT_CELL}>{formatTime(log.timeIn)}</StyledTableCell>
                  <StyledTableCell sx={COMPACT_CELL}>{formatTime(log.timeOut)}</StyledTableCell>
                  <StyledTableCell align="right" sx={{ ...COMPACT_CELL, fontWeight: 600 }}>
                    {formatMinutes(log.workedMinutes)}
                  </StyledTableCell>
                  <StyledTableCell sx={COMPACT_CELL}>{log.description || '-'}</StyledTableCell>
                  <StyledTableCell sx={COMPACT_CELL}>
                    <S.DocumentMeta>{formatDate(log.createdAt)}</S.DocumentMeta>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      )}
    </S.WorkLogsContainer>
  );
};
