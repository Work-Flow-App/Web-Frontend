import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { TableRow, Tooltip, IconButton } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import type {
  JobResponse,
  JobWorkflowStepResponse,
  StepVisitLogResponse,
} from '../../../../../services/api';
import { jobWorkflowService, visitLogService } from '../../../../../services/api';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../../components/UI/GlobalModal';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import {
  StyledTableContainer,
  StyledTable,
  StyledTableHead,
  StyledTableBody,
  StyledTableRow,
  StyledHeaderCell,
  StyledTableCell,
  ActionsCell,
} from '../../../../../components/UI/Table/Table.styles';
import { AddWorkLogModal } from './AddWorkLogModal';
import * as S from '../../../JobDetailsPage.styles';

interface JobWorkLogsTabProps {
  job: JobResponse;
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

export const JobWorkLogsTab: React.FC<JobWorkLogsTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [steps, setSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [visitLogs, setVisitLogs] = useState<StepVisitLogResponse[]>([]);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [loadingLogs, setLoadingLogs] = useState(false);

  const fetchWorkflow = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoadingWorkflow(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const sorted = [...(response.data.steps || [])].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );
      setSteps(sorted);
      if (sorted.length > 0 && sorted[0].id) {
        setSelectedStepId(sorted[0].id);
      }
    } catch {
      setSteps([]);
    } finally {
      setLoadingWorkflow(false);
    }
  }, [job.id]);

  const fetchVisitLogs = useCallback(async () => {
    if (!selectedStepId) return;
    try {
      setLoadingLogs(true);
      const response = await visitLogService.getVisitLogs(selectedStepId);
      setVisitLogs(response.data.visitLogs || []);
      setTotalMinutes(response.data.totalWorkedMinutes || 0);
    } catch {
      setVisitLogs([]);
      setTotalMinutes(0);
    } finally {
      setLoadingLogs(false);
    }
  }, [selectedStepId]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  useEffect(() => {
    fetchVisitLogs();
  }, [fetchVisitLogs]);

  const summary = useMemo(() => {
    const totalEntries = visitLogs.length;
    const totalHours = totalMinutes / 60;
    const avgMinutes = totalEntries > 0 ? Math.round(totalMinutes / totalEntries) : 0;
    return { totalEntries, totalHours, avgMinutes };
  }, [visitLogs, totalMinutes]);

  const openModal = (editLog?: StepVisitLogResponse) => {
    if (!selectedStepId) return;

    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addWorkLog',
      children: (
        <AddWorkLogModal
          stepId={selectedStepId}
          editLog={editLog || null}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            showSuccess(editLog ? 'Work log updated' : 'Work log added');
            fetchVisitLogs();
          }}
        />
      ),
    });
  };

  const handleDelete = async (visitLogId: number) => {
    try {
      await visitLogService.deleteVisitLog(visitLogId);
      showSuccess('Work log deleted');
      fetchVisitLogs();
    } catch {
      showError('Failed to delete work log');
    }
  };

  const selectedStep = steps.find((s) => s.id === selectedStepId);

  if (loadingWorkflow) {
    return <Loader centered minHeight="300px" />;
  }

  if (steps.length === 0) {
    return (
      <S.DocumentsEmptyState>
        <S.DocumentsEmptyIcon>
          <AccessTimeIcon sx={{ fontSize: 32 }} />
        </S.DocumentsEmptyIcon>
        <S.DocumentsEmptyText>No workflow steps found</S.DocumentsEmptyText>
        <S.DocumentsEmptySubtext>
          Work logs can be recorded once workflow steps are created for this job
        </S.DocumentsEmptySubtext>
      </S.DocumentsEmptyState>
    );
  }

  return (
    <S.WorkLogsContainer>
      {/* Step selector chips */}
      <S.StepChipsRow>
        {steps.map((step, idx) => (
          <S.StepChip
            key={step.id}
            active={selectedStepId === step.id}
            onClick={() => step.id && setSelectedStepId(step.id)}
          >
            {idx + 1}. {step.name || `Step ${idx + 1}`}
          </S.StepChip>
        ))}
      </S.StepChipsRow>

      {/* Summary stat cards */}
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

      {/* Table header with title and add button */}
      <S.WorkLogsTableHeader>
        <S.DetailsSectionTitle>
          Work Logs — {selectedStep?.name || 'Step'} ({visitLogs.length})
        </S.DetailsSectionTitle>
        <Button onClick={() => openModal()} startIcon={<AddIcon fontSize="small" />}>
          Add Work Log
        </Button>
      </S.WorkLogsTableHeader>

      {/* Table */}
      {loadingLogs ? (
        <Loader centered minHeight="200px" />
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
                <ActionsCell as={StyledHeaderCell} sx={COMPACT_CELL}>Actions</ActionsCell>
              </TableRow>
            </StyledTableHead>

            <StyledTableBody>
              {visitLogs.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center" sx={{ color: 'text.secondary', py: 3 }}>
                    No work logs recorded yet for this step
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                visitLogs.map((log) => (
                  <StyledTableRow key={log.id}>
                    <StyledTableCell sx={COMPACT_CELL}>
                      {formatDate(log.visitDate)}
                    </StyledTableCell>
                    <StyledTableCell sx={COMPACT_CELL}>
                      {formatTime(log.timeIn)}
                    </StyledTableCell>
                    <StyledTableCell sx={COMPACT_CELL}>
                      {formatTime(log.timeOut)}
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ ...COMPACT_CELL, fontWeight: 600 }}>
                      {formatMinutes(log.workedMinutes)}
                    </StyledTableCell>
                    <StyledTableCell sx={COMPACT_CELL}>
                      {log.description || '-'}
                    </StyledTableCell>
                    <StyledTableCell sx={COMPACT_CELL}>
                      <S.DocumentMeta>{formatDate(log.createdAt)}</S.DocumentMeta>
                    </StyledTableCell>
                    <ActionsCell sx={COMPACT_CELL}>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openModal(log)}>
                          <EditIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => log.id && handleDelete(log.id)}>
                          <DeleteIcon sx={{ fontSize: '1rem' }} />
                        </IconButton>
                      </Tooltip>
                    </ActionsCell>
                  </StyledTableRow>
                ))
              )}
            </StyledTableBody>
          </StyledTable>
        </StyledTableContainer>
      )}
    </S.WorkLogsContainer>
  );
};
