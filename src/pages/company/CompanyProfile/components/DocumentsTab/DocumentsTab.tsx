import React, { useCallback, useMemo } from 'react';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import Table from '../../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../../components/UI/Table/ITable';
import { Button } from '../../../../../components/UI/Button';
import {
  useGlobalModalOuterContext,
  ModalSizes,
  ConfirmationModal,
} from '../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../services/api';
import type { CompanyDocumentResponse } from '../../../../../services/api';
import { useFetch } from '../../../../../hooks/useFetch';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useCompanyRole } from '../../../../../contexts/CompanyRoleContext';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { DocumentForm } from './DocumentForm';
import { createDocumentColumns, type DocumentTableRow } from './DocumentsTab.columns';
import { TabHeader, TabHeaderText, TabTitle, TabDescription } from './DocumentsTab.styles';

export const DocumentsTab: React.FC = () => {
  const { showSuccess, showError } = useSnackbar();
  const { canEdit, canDelete } = useCompanyRole();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const fetchDocuments = useCallback(() => companyService.getDocuments(), []);
  const { data, loading, refetch } = useFetch<CompanyDocumentResponse[]>(fetchDocuments, [], {
    onError: (err) => showError(extractErrorMessage(err, 'Failed to load documents.')),
  });

  const rows: DocumentTableRow[] = useMemo(
    () => (data || []).map((doc) => ({ ...doc, id: doc.id ?? 0 })),
    [data]
  );

  const openDocumentForm = useCallback(
    (document?: DocumentTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'companyDocumentForm',
        children: (
          <DocumentForm
            document={document}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              refetch();
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, refetch]
  );

  const handleDelete = useCallback(
    (row: DocumentTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteCompanyDocument',
        children: (
          <ConfirmationModal
            title="Delete Document"
            message={`Delete "${row.title}"?`}
            description="This action cannot be undone."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await companyService.deleteDocument(row.id);
                showSuccess('Document deleted.');
                resetGlobalModalOuterProps();
                refetch();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete document.'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [setGlobalModalOuterProps, resetGlobalModalOuterProps, showSuccess, showError, refetch]
  );

  const actions: ITableAction<DocumentTableRow>[] = useMemo(() => {
    const list: ITableAction<DocumentTableRow>[] = [
      {
        id: 'download',
        label: 'Download',
        icon: <DownloadOutlinedIcon fontSize="small" />,
        show: (row) => Boolean(row.fileUrl),
        onClick: (row) => row.fileUrl && window.open(row.fileUrl, '_blank', 'noopener,noreferrer'),
      },
    ];
    if (canEdit) {
      list.push({ id: 'edit', label: 'Edit', onClick: (row) => openDocumentForm(row) });
    }
    if (canDelete) {
      list.push({ id: 'delete', label: 'Delete', color: 'error', onClick: handleDelete });
    }
    return list;
  }, [canEdit, canDelete, openDocumentForm, handleDelete]);

  const columns = useMemo(() => createDocumentColumns(), []);

  return (
    <>
      <TabHeader>
        <TabHeaderText>
          <TabTitle>Company Documents</TabTitle>
          <TabDescription>Certificates, licenses, insurance and other company documents.</TabDescription>
        </TabHeaderText>
        {canEdit && (
          <Button variant="contained" color="primary" size="medium" onClick={() => openDocumentForm()}>
            Upload Document
          </Button>
        )}
      </TabHeader>

      <Table<DocumentTableRow>
        columns={columns}
        data={rows}
        loading={loading}
        showActions={actions.length > 0}
        actions={actions}
        emptyMessage="No documents uploaded yet."
        rowsPerPage={10}
        showPagination
        enableStickyLeft
      />
    </>
  );
};
