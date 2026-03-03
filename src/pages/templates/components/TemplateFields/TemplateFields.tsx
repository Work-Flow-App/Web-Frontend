import { useState, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import { useGlobalModalOuterContext, ModalSizes, ConfirmationModal } from '../../../../components/UI/GlobalModal';
import { jobTemplateService, JobTemplateFieldCreateRequestJobFieldTypeEnum } from '../../../../services/api';
import type { JobTemplateFieldResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { FIELD_TYPE_OPTIONS } from '../../../../enums';
import type { FieldTableRow } from './FieldsDataColumn';
import { FieldTypeToolbar } from './FieldTypeToolbar';
import { TemplateFieldPanel } from './TemplateFieldPanel';
import { EditableFieldsTable } from './EditableFieldsTable';
import type { FieldFormData } from '../../schema/FieldFormSchema';
import * as S from './TemplateFieldPanel.styles';

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
  const [panelOpen, setPanelOpen] = useState(false);
  const [editFieldId, setEditFieldId] = useState<number | null>(null);
  const [panelLoading, setPanelLoading] = useState(false);
  const [panelDefaultValues, setPanelDefaultValues] = useState<Partial<FieldFormData> | undefined>(undefined);

  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const { showSuccess, showError } = useSnackbar();

  const fetchFields = useCallback(async () => {
    try {
      setLoading(true);
      const response = await jobTemplateService.getTemplateFields(templateId);
      const fieldsData = Array.isArray(response.data) ? response.data : [];

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

  useEffect(() => {
    fetchFields();
  }, [fetchFields]);

  const openAddPanel = useCallback((initialFieldType?: string) => {
    setEditFieldId(null);
    const preSelected = initialFieldType
      ? FIELD_TYPE_OPTIONS.find(ft => ft.value === initialFieldType) ?? null
      : null;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setPanelDefaultValues(preSelected ? { jobFieldType: preSelected as any } : undefined);
    setPanelOpen(true);
  }, []);

  useImperativeHandle(ref, () => ({
    handleAddField: () => openAddPanel(),
  }), [openAddPanel]);

  const openEditPanel = useCallback(async (field: FieldTableRow) => {
    setEditFieldId(field.id);
    setPanelDefaultValues(undefined);
    setPanelLoading(true);
    setPanelOpen(true);

    try {
      const response = await jobTemplateService.getFieldById(field.id);
      const data = response.data;
      const selectedFieldType = FIELD_TYPE_OPTIONS.find(ft => ft.value === data.jobFieldType) ?? null;

      setPanelDefaultValues({
        name: data.name || '',
        label: data.label || '',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        jobFieldType: selectedFieldType as any,
        required: String(data.required) as any,
        options: data.options || '',
        orderIndex: data.orderIndex || 0,
      });
    } catch (error) {
      showError('Failed to load field data');
      setPanelOpen(false);
      setEditFieldId(null);
    } finally {
      setPanelLoading(false);
    }
  }, [showError]);

  const closePanel = useCallback(() => {
    setPanelOpen(false);
    setEditFieldId(null);
    setPanelDefaultValues(undefined);
  }, []);

  const handlePanelSubmit = useCallback(async (data: FieldFormData) => {
    try {
      const required = typeof data.required === 'string'
        ? data.required === 'true'
        : Boolean(data.required);

      const jobFieldType = typeof data.jobFieldType === 'object' && data.jobFieldType !== null
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (data.jobFieldType as any).value
        : data.jobFieldType;

      const fieldPayload = {
        templateId,
        name: data.name,
        label: data.label,
        jobFieldType: jobFieldType as JobTemplateFieldCreateRequestJobFieldTypeEnum,
        required,
        options: data.options,
        orderIndex: Number(data.orderIndex),
      };

      if (editFieldId) {
        await jobTemplateService.updateField(editFieldId, fieldPayload);
        showSuccess('Field updated successfully');
      } else {
        await jobTemplateService.createField(fieldPayload);
        showSuccess('Field created successfully');
      }

      closePanel();
      fetchFields();
      onFieldsChange?.();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save field';
      showError(errorMessage);
    }
  }, [templateId, editFieldId, showSuccess, showError, closePanel, fetchFields, onFieldsChange]);

  const handleDeleteField = useCallback((field: FieldTableRow) => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'deleteField',
      children: (
        <ConfirmationModal
          title="Delete Field"
          message={`Are you sure you want to delete "${field.label}"?`}
          description="This action cannot be undone."
          variant="danger"
          confirmButtonText="Delete"
          cancelButtonText="Cancel"
          onConfirm={async () => {
            try {
              await jobTemplateService.deleteField(field.id);
              showSuccess(`Field "${field.label}" deleted successfully`);
              resetGlobalModalOuterProps();
              fetchFields();
              onFieldsChange?.();
            } catch (error) {
              const errorMessage = error instanceof Error ? error.message : 'Failed to delete field';
              showError(errorMessage);
              resetGlobalModalOuterProps();
            }
          }}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  }, [showSuccess, showError, fetchFields, onFieldsChange, setGlobalModalOuterProps, resetGlobalModalOuterProps]);

  const handleCellSave = useCallback(async (fieldId: number, updates: Partial<FieldTableRow>) => {
    const row = fields.find(f => f.id === fieldId);
    if (!row) return;

    // Optimistically update local state so the UI reflects instantly
    setFields(prev => prev.map(f => f.id === fieldId ? { ...f, ...updates } : f));

    try {
      const jobFieldType = (updates.jobFieldType ?? row.jobFieldType) as JobTemplateFieldCreateRequestJobFieldTypeEnum;
      await jobTemplateService.updateField(fieldId, {
        templateId,
        name: updates.name ?? row.name,
        label: updates.label ?? row.label,
        jobFieldType,
        required: updates.required ?? row.required,
        options: updates.options ?? row.options,
        orderIndex: updates.orderIndex ?? row.orderIndex,
      });
      onFieldsChange?.();
    } catch (error) {
      // Revert on failure
      setFields(prev => prev.map(f => f.id === fieldId ? row : f));
      const errorMessage = error instanceof Error ? error.message : 'Failed to save change';
      showError(errorMessage);
    }
  }, [fields, templateId, showError, onFieldsChange]);

  return (
    <>
      <FieldTypeToolbar onSelectType={openAddPanel} />
      <S.LayoutContainer>
        <EditableFieldsTable
          fields={fields}
          loading={loading}
          onCellSave={handleCellSave}
          onOpenPanel={openEditPanel}
          onDelete={handleDeleteField}
        />
        <TemplateFieldPanel
          open={panelOpen}
          isEdit={!!editFieldId}
          defaultValues={panelDefaultValues}
          isLoading={panelLoading}
          onSubmit={handlePanelSubmit}
          onClose={closePanel}
        />
      </S.LayoutContainer>
    </>
  );
});

TemplateFields.displayName = 'TemplateFields';
