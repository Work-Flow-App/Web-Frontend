import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CertificateFormSchema, type CertificateFormData } from '../../schema/CertificateFormSchema';
import { SetupFormWrapper } from '../../../../components/UI/SetupFormWrapper';
import { CertificateFormFields } from '../CertificateFormFields';
import { Button } from '../../../../components/UI/Button';
import {
  certificateService,
  CertificateType,
  type CertificateResponse,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { useGlobalModalInnerContext } from '../../../../components/UI/GlobalModal/context';
import * as S from './CertificateForm.styles';

const MAX_FILE_SIZE_MB = 15;

export interface CertificateFormProps {
  isModal?: boolean;
  /** Present when an admin is uploading on behalf of a worker; absent for worker self-service */
  workerId?: number;
  /** Existing certificate to edit metadata for (edit mode, worker self-service only) */
  certificate?: CertificateResponse;
  onSuccess?: () => void;
}

const extractDropdownValue = (value: CertificateFormData['type']): CertificateType =>
  (typeof value === 'object' ? value.value : value) as CertificateType;

export const CertificateForm: React.FC<CertificateFormProps> = ({
  isModal = false,
  workerId,
  certificate,
  onSuccess,
}) => {
  const isEdit = !!certificate;
  const { showSuccess, showError } = useSnackbar();
  const { updateModalTitle, updateGlobalModalInnerConfig } = useGlobalModalInnerContext();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    if (isModal) {
      updateModalTitle(isEdit ? 'Edit Certificate' : 'Upload Certificate');
      updateGlobalModalInnerConfig({
        confirmModalButtonText: isEdit ? 'Save Changes' : 'Upload',
      });
    }
  }, [isModal, isEdit, updateModalTitle, updateGlobalModalInnerConfig]);

  const handleChooseFile = (e: React.MouseEvent) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected && selected.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setFile(null);
      setFileError(`File size must be less than ${MAX_FILE_SIZE_MB}MB`);
      return;
    }
    setFile(selected);
    setFileError(null);
  };

  const handleSubmit = useCallback(
    async (data: CertificateFormData) => {
      try {
        const type = extractDropdownValue(data.type);

        if (isEdit && certificate) {
          await certificateService.updateMyCertificate(certificate.id, {
            type,
            name: data.name,
            issuingAuthority: data.issuingAuthority || undefined,
            issueDate: data.issueDate || undefined,
            expiryDate: data.expiryDate || undefined,
          });
          showSuccess('Certificate updated successfully');
        } else {
          if (!file) {
            setFileError('A file is required');
            showError('Please choose a file to upload');
            throw new Error('A file is required');
          }
          const payload = {
            file,
            type,
            name: data.name,
            issuingAuthority: data.issuingAuthority || undefined,
            issueDate: data.issueDate || undefined,
            expiryDate: data.expiryDate || undefined,
          };
          if (workerId) {
            await certificateService.uploadWorkerCertificate(workerId, payload);
          } else {
            await certificateService.uploadMyCertificate(payload);
          }
          showSuccess('Certificate uploaded successfully');
        }

        onSuccess?.();
      } catch (error) {
        console.error('Error saving certificate:', error);
        showError(extractErrorMessage(error, `Failed to ${isEdit ? 'update' : 'upload'} certificate`));
        throw error;
      }
      return { success: true };
    },
    [isEdit, certificate, file, workerId, showSuccess, showError, onSuccess]
  );

  return (
    <SetupFormWrapper
      schema={CertificateFormSchema}
      defaultValues={
        certificate
          ? {
              type: certificate.type,
              name: certificate.name,
              issuingAuthority: certificate.issuingAuthority || '',
              issueDate: certificate.issueDate || '',
              expiryDate: certificate.expiryDate || '',
            }
          : undefined
      }
      onSubmit={handleSubmit}
      isModal={isModal}
    >
      {!isEdit && (
        <S.FileFieldWrapper>
          <S.FileButtonRow>
            <Button type="button" variant="outlined" color="secondary" onClick={handleChooseFile}>
              Choose File
            </Button>
            <S.FileName>{file ? file.name : 'No file selected'}</S.FileName>
          </S.FileButtonRow>
          {fileError && <S.FieldErrorText>{fileError}</S.FieldErrorText>}
          <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleFileChange} />
        </S.FileFieldWrapper>
      )}
      <CertificateFormFields />
    </SetupFormWrapper>
  );
};
