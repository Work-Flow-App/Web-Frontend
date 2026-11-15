import React, { useState, useEffect, useMemo } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CircularProgress from '@mui/material/CircularProgress';

import {
  UploadAttachmentTypeEnum,
  ATTACHMENT_TYPE_CONFIG,
} from './AttachmentUploadDialog';
import { Button } from '../Button';
import { IconButton } from '../Button/IconButton';
import * as S from './AttachmentUploadDialog.styles';

export interface EditAttachmentDialogProps {
  open: boolean;
  fileName: string;
  initialDescription?: string;
  initialType?: UploadAttachmentTypeEnum;
  allowTypeChange?: boolean;
  isSaving?: boolean;
  onSave: (description: string, type: UploadAttachmentTypeEnum) => Promise<void> | void;
  onClose: () => void;
}

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toUpperCase() || 'FILE' : 'FILE';
};

export const EditAttachmentDialog: React.FC<EditAttachmentDialogProps> = ({
  open,
  fileName,
  initialDescription = '',
  initialType = UploadAttachmentTypeEnum.General,
  allowTypeChange = false,
  isSaving = false,
  onSave,
  onClose,
}) => {
  const [description, setDescription] = useState(initialDescription);
  const [type, setType] = useState<UploadAttachmentTypeEnum>(initialType);

  useEffect(() => {
    if (open) {
      setDescription(initialDescription || '');
      setType(initialType || UploadAttachmentTypeEnum.General);
    }
  }, [open, initialDescription, initialType]);

  const typeOptions = useMemo(() => {
    return Object.entries(ATTACHMENT_TYPE_CONFIG).map(([key, config]) => ({
      value: key as UploadAttachmentTypeEnum,
      label: config.label,
      dotColor: config.dotColor,
    }));
  }, []);

  const currentConfig =
    ATTACHMENT_TYPE_CONFIG[type] ||
    ATTACHMENT_TYPE_CONFIG[UploadAttachmentTypeEnum.General];

  const ext = getFileExtension(fileName);
  const isPdf = ext === 'PDF';
  const isDoc = ['DOC', 'DOCX'].includes(ext);

  const handleSave = async () => {
    await onSave(description.trim(), type);
  };

  return (
    <S.StyledDialog open={open} onClose={isSaving ? undefined : onClose}>
      <S.DialogHeader>
        <S.HeaderTitleText>Edit Attachment</S.HeaderTitleText>
        <IconButton
          size="small"
          variant="text"
          color="secondary"
          disabled={isSaving}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </S.DialogHeader>

      <S.DialogBody>
        <S.EditDialogContentBox>
          <S.EditDialogFileRow>
            <S.EditDialogFileLeft>
              <S.ThumbnailWrapper>
                <S.DocumentBadge
                  badgeColor={isPdf ? '#E53935' : isDoc ? '#1E88E5' : undefined}
                >
                  {isPdf ? (
                    <PictureAsPdfIcon fontSize="small" />
                  ) : isDoc ? (
                    <DescriptionIcon fontSize="small" />
                  ) : (
                    <InsertDriveFileIcon fontSize="small" />
                  )}
                  <S.DocumentExtText>{ext}</S.DocumentExtText>
                </S.DocumentBadge>
              </S.ThumbnailWrapper>
              <S.EditDialogFileName title={fileName}>
                {fileName}
              </S.EditDialogFileName>
            </S.EditDialogFileLeft>

            {allowTypeChange ? (
              <S.StyledTypeSelect
                size="small"
                value={type}
                onChange={(e) =>
                  setType(e.target.value as UploadAttachmentTypeEnum)
                }
                disabled={isSaving}
                renderValue={() => (
                  <>
                    <S.TypeDot dotColor={currentConfig.dotColor} />
                    {currentConfig.label}
                  </>
                )}
              >
                {typeOptions.map((opt) => (
                  <S.TypeMenuItem key={opt.value} value={opt.value}>
                    <S.TypeDot dotColor={opt.dotColor} />
                    {opt.label}
                  </S.TypeMenuItem>
                ))}
              </S.StyledTypeSelect>
            ) : (
              <S.ReadOnlyTypeBadge>
                <S.TypeDot dotColor={currentConfig.dotColor} />
                {currentConfig.label}
              </S.ReadOnlyTypeBadge>
            )}
          </S.EditDialogFileRow>

          <S.DescriptionInput
            size="small"
            multiline
            minRows={2}
            maxRows={5}
            label="Description"
            placeholder="Add a description (optional)..."
            value={description}
            disabled={isSaving}
            onChange={(e) => setDescription(e.target.value)}
          />
        </S.EditDialogContentBox>
      </S.DialogBody>

      <S.DialogFooter>
        <Button
          variant="outlined"
          color="secondary"
          size="medium"
          disabled={isSaving}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          disabled={isSaving}
          onClick={handleSave}
          startIcon={
            isSaving ? <CircularProgress size={16} color="inherit" /> : undefined
          }
        >
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </S.DialogFooter>
    </S.StyledDialog>
  );
};
