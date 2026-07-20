import React, { useRef } from 'react';
import { Button } from '../../../../../components/UI/Button';
import {
  useGlobalModalOuterContext,
  ModalSizes,
  ConfirmationModal,
} from '../../../../../components/UI/GlobalModal';
import { companyService } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useFormSubmit } from '../../../../../hooks/useFormSubmit';
import { extractErrorMessage } from '../../../../../utils/errorHandler';
import { ValidationRules } from '../../../../../utils/validation';
import {
  LogoRow,
  LogoPreview,
  LogoImage,
  LogoInitials,
  LogoActions,
  LogoButtonRow,
  LogoHint,
} from './LogoUpload.styles';

const MAX_LOGO_SIZE_MB = 5;
const ALLOWED_LOGO_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

interface LogoUploadProps {
  logoUrl?: string;
  companyName?: string;
  editable: boolean;
  onLogoChange: () => void;
}

const getInitials = (name?: string): string => {
  if (!name) return 'CO';
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'CO';
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
};

export const LogoUpload: React.FC<LogoUploadProps> = ({ logoUrl, companyName, editable, onLogoChange }) => {
  const { showSuccess, showError } = useSnackbar();
  const { saving, withSaving } = useFormSubmit();
  const { setGlobalModalOuterProps, resetGlobalModalOuterProps } = useGlobalModalOuterContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;

    const typeError = ValidationRules.fileType(ALLOWED_LOGO_TYPES)(file);
    if (typeError) {
      showError(typeError);
      return;
    }
    const sizeError = ValidationRules.fileSize(MAX_LOGO_SIZE_MB)(file);
    if (sizeError) {
      showError(sizeError);
      return;
    }

    await withSaving(async () => {
      try {
        await companyService.uploadLogo(file);
        onLogoChange();
        showSuccess('Logo updated successfully.');
      } catch (error) {
        showError(extractErrorMessage(error, 'Failed to upload logo.'));
      }
    });
  };

  const handleRemove = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      size: ModalSizes.SMALL,
      fieldName: 'removeCompanyLogo',
      children: (
        <ConfirmationModal
          title="Remove Logo"
          message="Remove the company logo?"
          description="You can upload a new logo at any time."
          variant="danger"
          confirmButtonText="Remove"
          cancelButtonText="Cancel"
          onConfirm={async () => {
            try {
              await companyService.deleteLogo();
              onLogoChange();
              showSuccess('Logo removed.');
            } catch (error) {
              showError(extractErrorMessage(error, 'Failed to remove logo.'));
            } finally {
              resetGlobalModalOuterProps();
            }
          }}
          onCancel={() => resetGlobalModalOuterProps()}
        />
      ),
    });
  };

  return (
    <LogoRow>
      <LogoPreview>
        {logoUrl ? (
          <LogoImage src={logoUrl} alt={`${companyName || 'Company'} logo`} />
        ) : (
          <LogoInitials>{getInitials(companyName)}</LogoInitials>
        )}
      </LogoPreview>

      {editable && (
        <LogoActions>
          <LogoButtonRow>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <Button variant="outlined" color="secondary" size="small" onClick={handleUploadClick} disabled={saving}>
              {saving ? 'Uploading...' : logoUrl ? 'Change Logo' : 'Upload Logo'}
            </Button>
            {logoUrl && (
              <Button variant="text" color="error" size="small" onClick={handleRemove} disabled={saving}>
                Remove
              </Button>
            )}
          </LogoButtonRow>
          <LogoHint>PNG or JPG, up to {MAX_LOGO_SIZE_MB}MB.</LogoHint>
        </LogoActions>
      )}
    </LogoRow>
  );
};
