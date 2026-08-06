import { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { formService } from '../../../../services/api';
import type { FormSubmissionResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { CreateSubmissionModal } from '../CreateSubmissionModal';
import { formSubmissionColumns, mapSubmissionToRow, type FormSubmissionTableRow } from './DataColumn';

export interface FormSubmissionsListHandle {
  openCreate: () => void;
}

/** Ref-exposed so FormsPage can drive "Create Submission" from the shared PageWrapper header action. */
export const FormSubmissionsList = forwardRef<FormSubmissionsListHandle>((_props, ref) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [submissions, setSubmissions] = useState<FormSubmissionResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubmissions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formService.getAllSubmissions();
      setSubmissions(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load form submissions'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const rows = useMemo(() => submissions.map(mapSubmissionToRow), [submissions]);

  const handleCreate = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'createFormSubmission',
      children: (
        <CreateSubmissionModal
          onSuccess={(submission) => {
            resetGlobalModalOuterProps();
            navigate(`/company/forms/submissions/${submission.id}`);
          }}
        />
      ),
    });
  }, [navigate, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  useImperativeHandle(ref, () => ({ openCreate: handleCreate }), [handleCreate]);

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
                fetchSubmissions();
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
    [showSuccess, showError, fetchSubmissions, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const actions: ITableAction<FormSubmissionTableRow>[] = useMemo(
    () => [
      { id: 'open', label: 'Open', onClick: handleRowClick },
      { id: 'pdf', label: 'Download PDF', onClick: handleDownloadPdf },
      { id: 'delete', label: 'Delete', onClick: handleDelete, color: 'error' as const },
    ],
    [handleRowClick, handleDownloadPdf, handleDelete]
  );

  return (
    <Table<FormSubmissionTableRow>
      columns={formSubmissionColumns}
      data={rows}
      showActions
      actions={actions}
      onRowClick={handleRowClick}
      loading={loading}
      emptyMessage="No form submissions yet. Create one from a template to get started."
      rowsPerPage={10}
      showPagination
    />
  );
});

FormSubmissionsList.displayName = 'FormSubmissionsList';

export default FormSubmissionsList;
