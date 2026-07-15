import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table, { Pagination } from '../../../components/UI/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import { leaveService, LEAVE_STATUS_OPTIONS, LeaveStatus } from '../../../services/api';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { RejectLeaveModal } from './RejectLeaveModal';
import { LeaveCalendar } from './LeaveCalendar';
import { createLeaveRequestColumns, mapLeaveRequestToRow, type LeaveRequestTableRow } from './LeaveRequests.columns';
import * as S from './LeaveRequests.styles';

const PAGE_SIZE = 20;

const STATUS_FILTER_OPTIONS = [{ value: 'ALL', label: 'All Statuses' }, ...LEAVE_STATUS_OPTIONS];

export const LeaveRequests: React.FC = () => {
  const { canManageWorkers } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);

  const [status, setStatus] = useState<string>('ALL');
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<LeaveRequestTableRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await leaveService.getCompanyLeaveRequests({
        status: status === 'ALL' ? undefined : (status as (typeof LeaveStatus)[keyof typeof LeaveStatus]),
        page,
        size: PAGE_SIZE,
      });
      setRows((data.content || []).map(mapLeaveRequestToRow));
      setTotalPages(Math.max(1, data.totalPages || 1));
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load leave requests'));
    } finally {
      setLoading(false);
    }
  }, [status, page, showError]);

  useEffect(() => {
    if (activeTab === 0) fetchRequests();
  }, [activeTab, fetchRequests]);

  useEffect(() => {
    setPage(0);
  }, [status]);

  const handleApprove = useCallback(
    (row: LeaveRequestTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'approveLeave',
        children: (
          <ConfirmationModal
            title="Approve Leave Request"
            message={`Approve ${row.workerName}'s ${row.type.toLowerCase()} leave for ${row.startDate} - ${row.endDate}?`}
            variant="default"
            confirmButtonText="Approve"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await leaveService.approveLeaveRequest(row.id);
                showSuccess('Leave request approved');
                resetGlobalModalOuterProps();
                fetchRequests();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to approve leave request'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, fetchRequests]
  );

  const handleReject = useCallback(
    (row: LeaveRequestTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'rejectLeave',
        children: (
          <RejectLeaveModal
            workerName={row.workerName}
            onConfirm={async (decisionNote) => {
              try {
                await leaveService.rejectLeaveRequest(row.id, decisionNote);
                showSuccess('Leave request rejected');
                resetGlobalModalOuterProps();
                fetchRequests();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to reject leave request'));
              }
            }}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, fetchRequests]
  );

  const actions: ITableAction<LeaveRequestTableRow>[] = useMemo(
    () =>
      canManageWorkers
        ? [
            { id: 'approve', label: 'Approve', onClick: handleApprove, show: (row) => row.status === LeaveStatus.Pending },
            {
              id: 'reject',
              label: 'Reject',
              onClick: handleReject,
              color: 'error' as const,
              show: (row) => row.status === LeaveStatus.Pending,
            },
          ]
        : [],
    [canManageWorkers, handleApprove, handleReject]
  );

  const columns = useMemo(() => createLeaveRequestColumns(), []);

  return (
    <PageWrapper
      title="Leave Requests"
      description="Review, approve, and track worker leave requests."
      dropdownOptions={activeTab === 0 ? STATUS_FILTER_OPTIONS : undefined}
      dropdownValue={activeTab === 0 ? status : undefined}
      dropdownPlaceholder="All Statuses"
      onDropdownChange={(value) => setStatus(String(value))}
    >
      <S.TabsWrapper>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<ListAltOutlinedIcon fontSize="small" />} iconPosition="start" label="Requests" />
          <Tab icon={<CalendarMonthOutlinedIcon fontSize="small" />} iconPosition="start" label="Calendar" />
        </Tabs>
      </S.TabsWrapper>

      {activeTab === 0 && (
        <>
          <Table<LeaveRequestTableRow>
            columns={columns}
            data={rows}
            showActions={canManageWorkers}
            actions={actions}
            loading={loading}
            emptyMessage="No leave requests found."
          />
          {totalPages > 1 && (
            <S.PaginationWrapper>
              <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
            </S.PaginationWrapper>
          )}
        </>
      )}

      {activeTab === 1 && <LeaveCalendar />}
    </PageWrapper>
  );
};

export default LeaveRequests;
