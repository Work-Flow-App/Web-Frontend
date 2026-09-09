import React, { useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import type { JobResponse } from '../../../../../services/api';
import { jobService, formService } from '../../../../../services/api';
import { useFetch } from '../../../../../hooks';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../../components/UI/GlobalModal';
import { Button } from '../../../../../components/UI/Button';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import Table from '../../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../../components/UI/Table/ITable';
import { CreateSubmissionModal } from '../../../../forms/components/CreateSubmissionModal';
import { formSubmissionColumns, mapSubmissionToRow, type FormSubmissionTableRow } from '../../../../forms/components/FormSubmissionsList/DataColumn';
import * as S from '../../../JobDetailsPage.styles';

interface JobFormsTabProps {
  job: JobResponse;
}

export const JobFormsTab: React.FC<JobFormsTabProps> = ({ job }) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const onError = useCallback(
    (error: unknown) => showError(extractErrorMessage(error, 'Failed to load forms for this job')),
    [showError]
  );

  const {
    data: submissions,
    loading,
    refetch,
  } = useFetch(() => jobService.getJobForms(job.id!), [job.id], { onError, skip: !job.id });

  const rows = useMemo(() => (submissions ?? []).map(mapSubmissionToRow), [submissions]);

  const handleCreate = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'createFormSubmission',
      children: (
        <CreateSubmissionModal
          jobId={job.id}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            showSuccess('Form submission created');
            refetch();
          }}
        />
      ),
    });
  }, [job.id, setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, refetch]);

  const handleRowClick = useCallback(
    (row: FormSubmissionTableRow) => navigate(`/company/forms/submissions/${row.id}`),
    [navigate]
  );

  const handleDownloadPdf = useCallback(
    async (row: FormSubmissionTableRow) => {
      try {
        await formService.downloadPdf(row.id, `${row.title}.pdf`);
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to download PDF'));
      }
    },
    [showError]
  );

  const handleDelete = useCallback(
    (row: FormSubmissionTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteFormSubmission',
        children: (
          <ConfirmationModal
            title="Delete Submission"
            message={`Are you sure you want to delete "${row.title}"?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await formService.deleteSubmission(row.id);
                showSuccess('Submission deleted');
                resetGlobalModalOuterProps();
                refetch();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete submission'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, refetch, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const actions: ITableAction<FormSubmissionTableRow>[] = useMemo(
    () => [
      { id: 'open', label: 'Open', onClick: handleRowClick },
      { id: 'pdf', label: 'Download PDF', onClick: handleDownloadPdf },
      { id: 'delete', label: 'Delete', onClick: handleDelete, color: 'error' as const },
    ],
    [handleRowClick, handleDownloadPdf, handleDelete]
  );

  if (loading) return <Loader size={40} centered minHeight="200px" />;

  return (
    <div>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <S.DetailsSectionTitle>Forms</S.DetailsSectionTitle>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} onClick={handleCreate} size="small">
          Create Submission
        </Button>
      </Box>

      <Table<FormSubmissionTableRow>
        columns={formSubmissionColumns}
        data={rows}
        enableStickyLeft
        showActions
        actions={actions}
        onRowClick={handleRowClick}
        emptyMessage="No forms linked to this job yet. Create one to get started."
        rowsPerPage={10}
        showPagination
        showTopPagination={false}
      />
    </div>
  );
};

export default JobFormsTab;
