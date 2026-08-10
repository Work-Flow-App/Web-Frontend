import { useState, useEffect, useCallback, useMemo, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { formService } from '../../../../services/api';
import type { FormTemplateRequest } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { FormTemplateMetaForm } from '../FormTemplateMetaForm';
import { VersionHistoryModal } from '../VersionHistoryModal';
import { formTemplateColumns, mapTemplateToRow, type FormTemplateTableRow } from './DataColumn';

export interface FormTemplatesListHandle {
  openCreate: () => void;
}

/** Ref-exposed so FormsPage can drive "Create Template" from the shared PageWrapper header action. */
export const FormTemplatesList = forwardRef<FormTemplatesListHandle>((_props, ref) => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const [templates, setTemplates] = useState<FormTemplateRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = useCallback(async () => {
    try {
      setLoading(true);
      const response = await formService.getAllTemplates();
      setTemplates(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load form templates'));
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  // Archived rows are superseded versions (editing a template archives the old one and creates
  // a new version) - the main list only shows the current version of each template.
  const rows = useMemo(() => templates.filter((t) => !t.archived).map(mapTemplateToRow), [templates]);

  const handleCreate = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'createFormTemplate',
      children: (
        <FormTemplateMetaForm
          isModal
          deferCreate
          onSuccess={(draft) => {
            resetGlobalModalOuterProps();
            // Nothing is persisted yet - the builder page creates the template once fields are
            // added, so the first version already has real fields instead of an empty one that
            // immediately gets archived and replaced.
            navigate('/company/forms/templates/new/builder', {
              state: { name: draft.name, description: draft.description },
            });
          }}
        />
      ),
    });
  }, [navigate, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  useImperativeHandle(ref, () => ({ openCreate: handleCreate }), [handleCreate]);

  const handleRename = useCallback(
    (row: FormTemplateTableRow) => {
      const template = templates.find((t) => t.id === row.id);
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'renameFormTemplate',
        children: (
          <FormTemplateMetaForm
            isModal
            template={template}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchTemplates();
            }}
          />
        ),
      });
    },
    [templates, setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchTemplates]
  );

  const handleDelete = useCallback(
    (row: FormTemplateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'deleteFormTemplate',
        children: (
          <ConfirmationModal
            title="Delete Template"
            message={`Are you sure you want to delete "${row.name}"?`}
            description="This action cannot be undone. Existing submissions created from this template are not affected."
            variant="danger"
            confirmButtonText="Delete"
            cancelButtonText="Cancel"
            onConfirm={async () => {
              try {
                await formService.deleteTemplate(row.id);
                showSuccess(`Template "${row.name}" deleted successfully`);
                resetGlobalModalOuterProps();
                fetchTemplates();
              } catch (error) {
                showError(extractErrorMessage(error, 'Failed to delete template'));
                resetGlobalModalOuterProps();
              }
            }}
            onCancel={() => resetGlobalModalOuterProps()}
          />
        ),
      });
    },
    [showSuccess, showError, fetchTemplates, setGlobalModalOuterProps, resetGlobalModalOuterProps]
  );

  const handleRowClick = useCallback(
    (row: FormTemplateTableRow) => navigate(`/company/forms/templates/${row.id}/builder`),
    [navigate]
  );

  const handleViewHistory = useCallback(
    (row: FormTemplateTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.SMALL,
        fieldName: 'formTemplateVersionHistory',
        children: <VersionHistoryModal templateId={row.id} templateName={row.name} allTemplates={templates} />,
      });
    },
    [templates, setGlobalModalOuterProps]
  );

  const actions: ITableAction<FormTemplateTableRow>[] = useMemo(
    () => [
      { id: 'edit', label: 'Edit Fields', onClick: handleRowClick },
      { id: 'rename', label: 'Rename', onClick: handleRename },
      { id: 'history', label: 'Version History', onClick: handleViewHistory },
      { id: 'delete', label: 'Delete', onClick: handleDelete, color: 'error' as const },
    ],
    [handleRowClick, handleRename, handleViewHistory, handleDelete]
  );

  return (
    <Table<FormTemplateTableRow>
      columns={formTemplateColumns}
      data={rows}
      selectable
      enableStickyLeft
      showActions
      actions={actions}
      onRowClick={handleRowClick}
      loading={loading}
      emptyMessage="No form templates yet. Create your first template to get started."
      rowsPerPage={10}
      showPagination
      showTopPagination={false}
    />
  );
});

FormTemplatesList.displayName = 'FormTemplatesList';

export default FormTemplatesList;
