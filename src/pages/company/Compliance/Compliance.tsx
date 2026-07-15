import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Tabs, Tab } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { PageWrapper } from '../../../components/UI/PageWrapper';
import Table, { Pagination } from '../../../components/UI/Table';
import type { ITableAction } from '../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../components/UI/GlobalModal';
import { certificateService } from '../../../services/api';
import type { ExpiringCertificatesGroup } from '../../../services/api';
import { useCompanyRole } from '../../../contexts/CompanyRoleContext';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../utils/errorHandler';
import {
  createCompanyCertificateColumns,
  mapCompanyCertificateToRow,
  type CompanyCertificateTableRow,
} from './Compliance.columns';
import * as S from './Compliance.styles';

const PAGE_SIZE = 20;

const DAYS_OPTIONS = [
  { value: 7, label: 'Next 7 days' },
  { value: 14, label: 'Next 14 days' },
  { value: 30, label: 'Next 30 days' },
  { value: 60, label: 'Next 60 days' },
  { value: 90, label: 'Next 90 days' },
];

export const Compliance: React.FC = () => {
  const { canManageWorkers } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showError, showSuccess } = useSnackbar();
  const [activeTab, setActiveTab] = useState(0);

  // All Certificates tab (server-paginated)
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState<CompanyCertificateTableRow[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingAll, setLoadingAll] = useState(true);

  const fetchAllCertificates = useCallback(async () => {
    try {
      setLoadingAll(true);
      const { data } = await certificateService.getAllCertificates(page, PAGE_SIZE);
      setRows((data.content || []).map(mapCompanyCertificateToRow));
      setTotalPages(Math.max(1, data.totalPages || 1));
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load certificates'));
    } finally {
      setLoadingAll(false);
    }
  }, [page, showError]);

  useEffect(() => {
    if (activeTab === 0) fetchAllCertificates();
  }, [activeTab, fetchAllCertificates]);

  // Expiring Soon tab
  const [days, setDays] = useState(30);
  const [expiringGroups, setExpiringGroups] = useState<ExpiringCertificatesGroup[]>([]);
  const [loadingExpiring, setLoadingExpiring] = useState(false);

  const fetchExpiring = useCallback(async () => {
    try {
      setLoadingExpiring(true);
      const { data } = await certificateService.getExpiringCertificates(days);
      setExpiringGroups(Array.isArray(data) ? data : []);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load expiring certificates'));
    } finally {
      setLoadingExpiring(false);
    }
  }, [days, showError]);

  useEffect(() => {
    if (activeTab === 1) fetchExpiring();
  }, [activeTab, fetchExpiring]);

  const expiringRows = useMemo(
    (): CompanyCertificateTableRow[] =>
      expiringGroups.flatMap((group) =>
        group.certificates.map((cert) => mapCompanyCertificateToRow({ ...cert, workerName: group.workerName, workerId: group.workerId }))
      ),
    [expiringGroups]
  );

  const handleDelete = useCallback(
    (row: CompanyCertificateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteCompanyCertificate',
        children: (
          <ConfirmationModal
            title="Delete Certificate"
            message={`Delete "${row.name}" for ${row.workerName}?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await certificateService.deleteWorkerCertificate(row.workerId, row.id);
                showSuccess('Certificate deleted');
                resetGlobalModalOuterProps();
                if (activeTab === 0) fetchAllCertificates();
                else fetchExpiring();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete certificate'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [activeTab, setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, fetchAllCertificates, fetchExpiring]
  );

  const actions: ITableAction<CompanyCertificateTableRow>[] = useMemo(
    () => (canManageWorkers ? [{ id: 'delete', label: 'Delete', onClick: handleDelete, color: 'error' as const }] : []),
    [canManageWorkers, handleDelete]
  );

  const columns = useMemo(() => createCompanyCertificateColumns(), []);

  return (
    <PageWrapper
      title="Compliance"
      description="Company-wide certificate tracking and expiry monitoring."
      dropdownOptions={activeTab === 1 ? DAYS_OPTIONS : undefined}
      dropdownValue={activeTab === 1 ? days : undefined}
      dropdownPlaceholder="Next 30 days"
      onDropdownChange={(value) => setDays(Number(value))}
    >
      <S.TabsWrapper>
        <Tabs value={activeTab} onChange={(_, v) => setActiveTab(v)}>
          <Tab icon={<DescriptionOutlinedIcon fontSize="small" />} iconPosition="start" label="All Certificates" />
          <Tab icon={<WarningAmberOutlinedIcon fontSize="small" />} iconPosition="start" label="Expiring Soon" />
        </Tabs>
      </S.TabsWrapper>

      {activeTab === 0 && (
        <>
          <Table<CompanyCertificateTableRow>
            columns={columns}
            data={rows}
            showActions={canManageWorkers}
            actions={actions}
            loading={loadingAll}
            emptyMessage="No certificates found."
          />
          {totalPages > 1 && (
            <S.PaginationWrapper>
              <Pagination currentPage={page + 1} totalPages={totalPages} onPageChange={(p) => setPage(p - 1)} />
            </S.PaginationWrapper>
          )}
        </>
      )}

      {activeTab === 1 && (
        <Table<CompanyCertificateTableRow>
          columns={columns}
          data={expiringRows}
          showActions={canManageWorkers}
          actions={actions}
          loading={loadingExpiring}
          emptyMessage={`No certificates expiring in the next ${days} days.`}
        />
      )}
    </PageWrapper>
  );
};

export default Compliance;
