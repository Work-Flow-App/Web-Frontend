import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { Collapse } from '@mui/material';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Input, TextArea } from '../../../../components/UI/Forms';
import { FormField } from '../../../../components/UI/FormComponents';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { floowColors } from '../../../../theme/colors';
import { FieldRowsSection, emptyFieldRow, buildFieldPayload, type FieldRowData } from '../FieldRowsEditor';
import { formService } from '../../../../services/api';
import type { FormTemplateRequest } from '../../../../services/api';
import * as S from './CreateFormTemplateForm.styles';

export interface CreateFormTemplateFormProps {
  isModal?: boolean;
  onSuccess?: () => void;
}

interface CreateFormTemplateData {
  name: string;
  description?: string;
  fields: FieldRowData[];
}

/**
 * Creating a form template used to be two separate modals: name/description here, then a
 * redirect to the builder page just to add fields one at a time (each staged locally until a
 * second, separate "Create Template" click at the top of that page). This collapses both into
 * one modal and one submit — the same single-call batched create the builder page already used
 * once you got there, just reached without the extra hop.
 *
 * The Fields section stays hidden until you finish typing a name and move on (blur) — not on
 * every keystroke, so the layout doesn't jump around while you're still typing the name itself.
 */
export const CreateFormTemplateForm: React.FC<CreateFormTemplateFormProps> = ({ isModal = true, onSuccess }) => {
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnConfirm, setSkipResetModal } =
    useGlobalModalInnerContext();
  const [fieldsUnlocked, setFieldsUnlocked] = useState(false);

  const methods = useForm<CreateFormTemplateData>({
    defaultValues: { name: '', description: '', fields: [emptyFieldRow()] },
    mode: 'onChange',
  });
  const { handleSubmit, setError, getValues } = methods;

  const handleNameBlur = () => {
    if (getValues('name')?.trim()) setFieldsUnlocked(true);
  };

  const onConfirmRef = useRef<() => void>(() => {});

  useEffect(() => {
    onConfirmRef.current = () => {
      handleSubmit(async (data) => {
        const name = data.name?.trim();
        if (!name) {
          setError('name', { message: 'Template name is required' });
          return;
        }

        const fieldPayload = buildFieldPayload(data.fields, setError);
        if (fieldPayload === null) return;

        updateGlobalModalInnerConfig({ isConfirmDisabled: true });
        try {
          const payload: FormTemplateRequest = { name, description: data.description, fields: fieldPayload };
          await formService.createTemplate(payload);
          showSuccess(
            fieldPayload.length > 0
              ? `Template created with ${fieldPayload.length} field${fieldPayload.length > 1 ? 's' : ''}`
              : 'Template created successfully'
          );
          onSuccess?.();
        } catch (error) {
          showError(extractErrorMessage(error, 'Failed to create template'));
        } finally {
          updateGlobalModalInnerConfig({ isConfirmDisabled: false });
        }
      })();
    };
  }, [handleSubmit, setError, showSuccess, showError, onSuccess, updateGlobalModalInnerConfig]);

  useEffect(() => {
    if (isModal) {
      updateModalTitle('Create Form Template');
      updateGlobalModalInnerConfig({ confirmModalButtonText: 'Create Template' });
      setSkipResetModal?.(true);
      updateOnConfirm(() => onConfirmRef.current());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FormProvider {...methods}>
      <S.FormBody>
        <S.SectionCard>
          <S.SectionHeader>
            <S.SectionIconBadge tint={floowColors.blue.main}>
              <DescriptionOutlinedIcon />
            </S.SectionIconBadge>
            <S.SectionHeaderText>
              <S.SectionTitle>Template Details</S.SectionTitle>
              <S.SectionSubtitle>Give this template a name so you can find it later</S.SectionSubtitle>
            </S.SectionHeaderText>
          </S.SectionHeader>

          <FormField label="Template Name" required>
            <Input name="name" placeholder="Enter form template name" onBlur={handleNameBlur} hideErrorMessage={false} />
          </FormField>

          <FormField label="Description">
            <TextArea name="description" placeholder="Enter description (optional)" hideErrorMessage={false} rows={3} />
          </FormField>
        </S.SectionCard>

        <Collapse in={fieldsUnlocked} unmountOnExit>
          <FieldRowsSection />
        </Collapse>

        {!fieldsUnlocked && (
          <S.HintBox>
            <InfoOutlinedIcon />
            Enter a template name above, then click elsewhere to start adding fields
          </S.HintBox>
        )}
      </S.FormBody>
    </FormProvider>
  );
};
