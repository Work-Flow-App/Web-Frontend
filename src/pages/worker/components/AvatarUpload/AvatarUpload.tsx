import React, { useRef, useState } from 'react';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { ValidationRules } from '../../../../utils/validation';
import { getInitials } from '../../../../utils/getInitials';
import { AvatarBox, AvatarImage, AvatarInitials, AvatarEditButton } from './AvatarUpload.styles';

const MAX_PHOTO_SIZE_MB = 5;
const ALLOWED_PHOTO_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

export interface AvatarUploadProps {
  photoUrl?: string;
  name?: string;
  editable: boolean;
  onUpload: (file: File) => Promise<void>;
}

/**
 * Worker photo avatar, modeled on CompanyProfile's LogoUpload. Simpler than LogoUpload:
 * there's no delete-photo endpoint for workers on the backend, so this only supports
 * upload/replace, not remove.
 */
export const AvatarUpload: React.FC<AvatarUploadProps> = ({ photoUrl, name, editable, onUpload }) => {
  const { showError } = useSnackbar();
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditButtonClick = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (!file) return;

    const typeError = ValidationRules.fileType(ALLOWED_PHOTO_TYPES)(file);
    if (typeError) {
      showError(typeError);
      return;
    }
    const sizeError = ValidationRules.fileSize(MAX_PHOTO_SIZE_MB)(file);
    if (sizeError) {
      showError(sizeError);
      return;
    }

    setSaving(true);
    try {
      await onUpload(file);
    } catch (error) {
      showError(extractErrorMessage(error, 'Failed to upload photo.'));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AvatarBox>
      {photoUrl ? (
        <AvatarImage src={photoUrl} alt={`${name || 'Worker'} photo`} />
      ) : (
        <AvatarInitials>{getInitials(name, 'W')}</AvatarInitials>
      )}

      {editable && (
        <>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
          <AvatarEditButton
            type="button"
            title={photoUrl ? 'Change photo' : 'Upload photo'}
            disabled={saving}
            onClick={handleEditButtonClick}
          >
            <EditOutlinedIcon />
          </AvatarEditButton>
        </>
      )}
    </AvatarBox>
  );
};
