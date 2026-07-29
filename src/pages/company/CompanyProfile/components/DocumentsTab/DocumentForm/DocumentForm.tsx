import React, { useEffect, useRef, useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import type { FieldError } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Button } from '../../../../../../components/UI/Button';
import { useGlobalModalInnerContext } from '../../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../../services/api';
import type { CompanyDocumentResponse } from '../../../../../../services/api';
import { CompanyUploadDocumentTypeEnum } from '../../../../../../../workflow-api';
import { useSnackbar } from '../../../../../../contexts/SnackbarContext';
import { useFormSubmit } from '../../../../../../hooks/useFormSubmit';
import { useSchema } from '../../../../../../utils/validation';
import { extractErrorMessage } from '../../../../../../utils/errorHandler';
import { SchemaField } from '../../SchemaField';
import { DocumentFormSchema } from './DocumentFormSchema';
import type { DocumentFormValues } from './IDocumentForm';
import { FormContainer, FormWrapper, FileRow, FileName, FileError } from './DocumentForm.styles';

interface DocumentFormProps {
  document?: CompanyDocumentResponse;
  onSuccess: () => void;
  onCancel?: () => void;
}

const DOCUMENT_FIELD_ENTRIES = Object.entries(DocumentFormSchema);

export const DocumentForm: React.FC<DocumentFormProps> = ({ document, onSuccess, onCancel }) => {
  const isEditMode = Boolean(document);
  const { fieldRules, defaultValues } = useSchema(DocumentFormSchema, document);

  const methods = useForm<DocumentFormValues>({
    resolver: yupResolver(fieldRules),
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState('');

  // handleSubmit(onSubmit) is only re-registered with the modal when [saving, isEditMode]
  // change, so onSubmit's closure over selectedFile/fileError would otherwise go stale the
  // moment the user picks a file. Route through a ref that's always current instead.
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

  const handleFileSelect = () => fileInputRef.current?.click();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    if (file) setFileError('');
  };

  const onSubmit = async (data: DocumentFormValues) => {
    if (!isEditMode && !selectedFile) {
      setFileError('Please attach a file.');
      return;
    }

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
            file: selectedFile || undefined,
          });
          showSuccess('Document updated successfully.');
        } else if (selectedFile) {
          await companyService.uploadDocument({
            title: data.title,
            type,
            isPublic: data.isPublic,
            file: selectedFile,
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
          {DOCUMENT_FIELD_ENTRIES.map(([key, field]) => (
            <SchemaField
              key={key}
              name={key}
              field={field}
              error={errors[key as keyof DocumentFormValues] as FieldError | undefined}
              disablePortal
            />
          ))}

          <FileRow>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Button variant="outlined" color="secondary" size="small" onClick={handleFileSelect} type="button">
              {selectedFile ? 'Change File' : document?.fileName ? 'Replace File' : 'Choose File'}
            </Button>
            <FileName>{selectedFile?.name || document?.fileName || 'No file selected'}</FileName>
          </FileRow>
          {fileError && <FileError>{fileError}</FileError>}
        </FormWrapper>
      </FormContainer>
    </FormProvider>
  );
};
