import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { IconButton, Typography } from '@mui/material';
import { PageWrapper } from '../../components/UI/PageWrapper';
import { Loader } from '../../components/UI';
import { useSnackbar } from '../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../utils/errorHandler';
import { useFormSubmit } from '../../hooks';
import { useGlobalModalOuterContext, ModalSizes } from '../../components/UI/GlobalModal';
import { formService, FORM_FIELD_TYPE_OPTIONS, FORM_FIELD_ROLE_TARGET_OPTIONS } from '../../services/api';
import type { FormTemplateRequest } from '../../services/api';
import { FieldForm, type BuilderField } from './components/FieldForm';
import * as S from './FormTemplateBuilderPage.styles';

const typeLabel = (value?: string) => FORM_FIELD_TYPE_OPTIONS.find((o) => o.value === value)?.label || value || 'Text';
const roleLabel = (value?: string) => FORM_FIELD_ROLE_TARGET_OPTIONS.find((o) => o.value === value)?.label || value || 'Either';

export const FormTemplateBuilderPage: React.FC = () => {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const { showSuccess, showError } = useSnackbar();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();

  const [template, setTemplate] = useState<FormTemplateRequest | null>(null);
  const [fields, setFields] = useState<BuilderField[]>([]);
  const [loading, setLoading] = useState(true);
  const { saving, withSaving } = useFormSubmit();

  const loadTemplate = useCallback(async () => {
    if (!templateId) return;
    try {
      setLoading(true);
      // No get-by-id endpoint for templates - the list is the source of truth.
      const response = await formService.getAllTemplates();
      const found = (Array.isArray(response.data) ? response.data : []).find((t) => String(t.id) === templateId);
      if (!found) {
        showError('Template not found');
        return;
      }
      setTemplate(found);
      setFields((found.fields || []).map((f, i) => ({ ...f, clientId: f.id ?? Date.now() + i })));
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to load template'));
    } finally {
      setLoading(false);
    }
  }, [templateId, showError]);

  useEffect(() => {
    loadTemplate();
  }, [loadTemplate]);

  const handleCloseModal = () => resetGlobalModalOuterProps();

  const handleSaveField = (field: BuilderField) => {
    const existing = fields.find((f) => f.clientId === field.clientId);
    if (existing) {
      setFields(fields.map((f) => (f.clientId === field.clientId ? field : f)));
      showSuccess('Field updated');
    } else {
      setFields([...fields, field]);
      showSuccess('Field added');
    }
    handleCloseModal();
  };

  const handleAddField = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <FieldForm initialField={null} onSave={handleSaveField} isEditing={false} />,
      fieldName: 'addFormField',
      size: ModalSizes.MEDIUM,
    });
  };

  const handleEditField = (field: BuilderField) => {
    setGlobalModalOuterProps({
      isOpen: true,
      children: <FieldForm initialField={field} onSave={handleSaveField} isEditing />,
      fieldName: 'editFormField',
      size: ModalSizes.MEDIUM,
    });
  };

  const handleDeleteField = (clientId: number) => {
    setFields(fields.filter((f) => f.clientId !== clientId));
    showSuccess('Field removed');
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const next = [...fields];
    [next[index], next[target]] = [next[target], next[index]];
    setFields(next);
  };

  const handleSaveTemplate = async () => {
    if (!template || !templateId) return;
    try {
      await withSaving(async () => {
        const payload: FormTemplateRequest = {
          name: template.name,
          description: template.description,
          version: template.version,
          archived: template.archived,
          fields: fields.map((f, index) => ({
            id: f.id,
            name: f.name,
            label: f.label,
            type: f.type,
            roleTarget: f.roleTarget,
            required: f.required,
            options: f.options,
            orderIndex: index,
          })),
        };
        const response = await formService.updateTemplate(Number(templateId), payload);
        showSuccess('Template saved successfully');
        setTemplate(response.data);
        setFields((response.data.fields || []).map((f, i) => ({ ...f, clientId: f.id ?? Date.now() + i })));
      });
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to save template'));
    }
  };

  if (loading) return <Loader />;
  if (!template) return <Typography>Template not found</Typography>;

  return (
    <PageWrapper
      title={template.name}
      description={template.description || 'Build the fields workers and company staff fill in on this form'}
      actions={[
        {
          label: 'Back to Forms',
          onClick: () => navigate('/company/forms'),
          variant: 'outlined',
          icon: <ArrowBackIcon />,
        },
        {
          label: saving ? 'Saving...' : 'Save Template',
          onClick: handleSaveTemplate,
          variant: 'contained',
          color: 'primary',
          disabled: saving,
        },
      ]}
    >
      <S.FieldsCard>
        <S.FieldsCardHeader>
          <S.FieldsCardTitle>Fields ({fields.length})</S.FieldsCardTitle>
        </S.FieldsCardHeader>

        <S.FieldsList>
          {fields.length === 0 && <S.EmptyFieldsHint>No fields yet - click &quot;Add Field&quot; below to start building this form.</S.EmptyFieldsHint>}

          {fields.map((field, index) => (
            <S.FieldRow key={field.clientId} accentcolor={S.STEP_COLORS[index % S.STEP_COLORS.length]}>
              <S.FieldOrderControls>
                <IconButton size="small" disabled={index === 0} onClick={() => moveField(index, -1)} aria-label="Move field up">
                  <ArrowUpwardIcon fontSize="small" />
                </IconButton>
                <IconButton
                  size="small"
                  disabled={index === fields.length - 1}
                  onClick={() => moveField(index, 1)}
                  aria-label="Move field down"
                >
                  <ArrowDownwardIcon fontSize="small" />
                </IconButton>
              </S.FieldOrderControls>

              <S.FieldBody>
                <S.FieldTitleRow>
                  <S.FieldLabel>{field.label}</S.FieldLabel>
                </S.FieldTitleRow>
                <S.FieldMetaRow>
                  <span>{typeLabel(field.type)}</span>
                  <span>&bull;</span>
                  <span>{roleLabel(field.roleTarget)}</span>
                  {field.required && (
                    <>
                      <span>&bull;</span>
                      <span>Required</span>
                    </>
                  )}
                </S.FieldMetaRow>
              </S.FieldBody>

              <S.FieldActions>
                <IconButton size="small" onClick={() => handleEditField(field)} aria-label="Edit field">
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={() => handleDeleteField(field.clientId)} aria-label="Delete field">
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </S.FieldActions>
            </S.FieldRow>
          ))}

          <S.AddFieldButton type="button" onClick={handleAddField}>
            <AddIcon />
            Add Field
          </S.AddFieldButton>
        </S.FieldsList>
      </S.FieldsCard>
    </PageWrapper>
  );
};

export default FormTemplateBuilderPage;
