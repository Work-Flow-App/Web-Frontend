import React, { useEffect, useRef } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useGlobalModalInnerContext } from '../../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../../services/api';
import type { CompanyDocumentResponse } from '../../../../../../services/api';
import { CompanyUploadDocumentTypeEnum } from '../../../../../../../workflow-api';
import { useSnackbar } from '../../../../../../contexts/SnackbarContext';
import { useFormSubmit } from '../../../../../../hooks/useFormSubmit';
import { useSchema } from '../../../../../../utils/validation';
import { extractErrorMessage } from '../../../../../../utils/errorHandler';
import { SchemaField } from '../../SchemaField';
import { DocumentFormSchema, DocumentEditFormSchema } from './DocumentFormSchema';
import type { DocumentFormValues } from './IDocumentForm';
import { FormContainer, FormWrapper } from './DocumentForm.styles';

interface DocumentFormProps {
  document?: CompanyDocumentResponse;
  onSuccess: () => void;
  onCancel?: () => void;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({ document, onSuccess, onCancel }) => {
  const isEditMode = Boolean(document);
  const schema = isEditMode ? DocumentEditFormSchema : DocumentFormSchema;
  const { fieldRules, defaultValues } = useSchema(schema, document);

  const methods = useForm<DocumentFormValues>({
    // useSchema's rules are typed for any object; narrow the resolver to this form's values.
    resolver: yupResolver(fieldRules) as unknown as Resolver<DocumentFormValues>,
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { errors },
  } = methods;

  const { showSuccess, showError } = useSnackbar();
  const { saving, withSaving } = useFormSubmit();
  const { updateModalTitle, updateGlobalModalInnerConfig, updateOnClose, updateOnConfirm } =
    useGlobalModalInnerContext();

  // handleSubmit(onSubmit) is only re-registered with the modal when [saving, isEditMode]
  // change, so route through a ref to always call the latest onSubmit.
  const onSubmitRef = useRef<(data: DocumentFormValues) => void>(() => {});

  useEffect(() => {
    updateModalTitle(isEditMode ? 'Edit Document' : 'Upload Document');
    updateGlobalModalInnerConfig({
      confirmModalButtonText: saving ? 'Saving...' : isEditMode ? 'Save Changes' : 'Upload Document',
      cancelButtonText: 'Cancel',
      isConfirmDisabled: saving,
    });
    updateOnClose(() => onCancel?.());
    updateOnConfirm(() => {
      handleSubmit((data) => onSubmitRef.current(data))();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [saving, isEditMode]);

  const onSubmit = async (data: DocumentFormValues) => {
    const type = (
      typeof data.type === 'object' ? (data.type as { value: string })?.value : data.type
    ) as CompanyUploadDocumentTypeEnum;

    await withSaving(async () => {
      try {
        if (isEditMode && document?.id) {
          await companyService.updateDocument(document.id, {
            title: data.title,
            description: data.description || undefined,
            type,
            startDate: data.validityStartDate || undefined,
            endDate: data.validityEndDate || undefined,
            isPublic: data.isPublic,
            file: data.file || undefined,
          });
          showSuccess('Document updated successfully.');
        } else if (data.file) {
          await companyService.uploadDocument({
            title: data.title,
            type,
            isPublic: data.isPublic,
            file: data.file,
            description: data.description || undefined,
            startDate: data.validityStartDate || undefined,
            endDate: data.validityEndDate || undefined,
          });
          showSuccess('Document uploaded successfully.');
        }
        onSuccess();
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to save document.'));
      }
    });
  };

  onSubmitRef.current = onSubmit;

  return (
    <FormProvider {...methods}>
      <FormContainer>
        <FormWrapper>
          {Object.entries(schema).map(([key, field]) => (
            <SchemaField
              key={key}
              name={key}
              field={field}
              error={errors[key as keyof DocumentFormValues] as FieldError | undefined}
              disablePortal
              existingFileName={key === 'file' ? document?.fileName : undefined}
            />
          ))}
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
