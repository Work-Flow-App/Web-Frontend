import { useState, useEffect, useCallback, useMemo, useImperativeHandle, forwardRef } from 'react';
import Table from '../../../../components/UI/Table/Table';
import type { ITableAction } from '../../../../components/UI/Table/ITable';
import { useGlobalModalOuterContext, ModalSizes } from '../../../../components/UI/GlobalModal';
import { jobTemplateService } from '../../../../services/api';
import type { JobTemplateFieldResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { fieldColumns, type FieldTableRow } from './FieldsDataColumn';
import { FieldForm } from '../FieldForm/FieldForm';

interface TemplateFieldsProps {
  templateId: number;
  onFieldsChange?: () => void;
}

export interface TemplateFieldsRef {
  handleAddField: () => void;
}

export const TemplateFields = forwardRef<TemplateFieldsRef, TemplateFieldsProps>(
  ({ templateId, onFieldsChange }, ref) => {
  const [fields, setFields] = useState<FieldTableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  // Fetch fields for the template
  const fetchFields = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobTemplateService.getTemplateFields(templateId);
      const fieldsData = Array.isArray(response.data) ? response.data : [];

      // Transform to table format
      const transformedData: FieldTableRow[] = fieldsData.map((field: JobTemplateFieldResponse) => ({
        id: field.id || 0,
        templateId: field.templateId,
        name: field.name || '',
        label: field.label || '',
        jobFieldType: field.jobFieldType || 'TEXT',
        required: field.required || false,
        options: field.options,
        orderIndex: field.orderIndex,
      }));

      setFields(transformedData);
    } catch (error) {
      console.error('Error fetching fields:', error);
      showError('Failed to load fields');
    } finally {
      setLoading(false);
    }
  }, [templateId, showError]);

  // Load fields on mount
  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  // Handle add field
  const handleAddField = useCallback(() => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.MEDIUM,
      fieldName: 'addField',
      children: (
        <FieldForm
          isModal={true}
          templateId={templateId}
          onSuccess={() => {
            resetGlobalModalOuterProps();
            fetchFields();
            onFieldsChange?.(); // Notify parent to refresh columns
          }}
        />
      ),
    });
  }, [templateId, setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchFields, onFieldsChange]);

  // Expose handleAddField via ref
  useImperativeHandle(ref, () => ({
    handleAddField,
  }), [handleAddField]);

  // Handle edit field
  const handleEditField = useCallback(
    (field: FieldTableRow) => {
      setGlobalModalOuterProps({
        isOpen: true,
        size: ModalSizes.MEDIUM,
        fieldName: 'editField',
        children: (
          <FieldForm
            isModal={true}
            templateId={templateId}
            fieldId={field.id}
            onSuccess={() => {
              resetGlobalModalOuterProps();
              fetchFields();
              onFieldsChange?.(); // Notify parent to refresh columns
            }}
          />
        ),
      });
    },
    [templateId, setGlobalModalOuterProps, resetGlobalModalOuterProps, fetchFields, onFieldsChange]
  );

  // Handle delete field
  const handleDeleteField = useCallback(
    async (field: FieldTableRow) => {
      if (!window.confirm(`Are you sure you want to delete field "${field.label}"?`)) {
        return;
      }

      try {
        await jobTemplateService.deleteField(field.id);
        showSuccess(`Field "${field.label}" deleted successfully`);
        fetchFields();
        onFieldsChange?.(); // Notify parent to refresh columns
      } catch (error) {
        console.error('Error deleting field:', error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete field';
        showError(errorMessage);
      }
    },
    [showSuccess, showError, fetchFields, onFieldsChange]
  );

  // Define table actions
  const tableActions: ITableAction<FieldTableRow>[] = useMemo(
    () => [
      {
        id: 'edit',
        label: 'Edit',
        onClick: handleEditField,
      },
      {
        id: 'delete',
        label: 'Delete',
        onClick: handleDeleteField,
        color: 'error' as const,
      },
    ],
    [handleEditField, handleDeleteField]
  );

  return (
    <Table<FieldTableRow>
      columns={fieldColumns}
      data={fields}
      showActions
      actions={tableActions}
      loading={loading}
      emptyMessage="No fields found. Add your first field to get started."
      rowsPerPage={10}
      showPagination={true}
    />
  );
});

TemplateFields.displayName = 'TemplateFields';
