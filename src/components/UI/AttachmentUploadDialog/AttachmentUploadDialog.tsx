import React, { useState, useEffect, useMemo, useCallback } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import CircularProgress from '@mui/material/CircularProgress';

import { Button } from '../Button';
import { IconButton } from '../Button/IconButton';
import * as S from './AttachmentUploadDialog.styles';

export const UploadAttachmentTypeEnum = {
  General: 'GENERAL',
  Additional: 'ADDITIONAL',
  Complaint: 'COMPLAINT',
  InternalNote: 'INTERNAL_NOTE',
  Approval: 'APPROVAL',
  Rejection: 'REJECTION',
} as const;

export type UploadAttachmentTypeEnum =
  (typeof UploadAttachmentTypeEnum)[keyof typeof UploadAttachmentTypeEnum];

export interface AttachmentUploadItem {
  file: File;
  description: string;
  type: UploadAttachmentTypeEnum;
}

export interface AttachmentUploadDialogProps {
  open: boolean;
  files: File[];
  defaultType?: UploadAttachmentTypeEnum;
  allowTypeChange?: boolean;
  isUploading?: boolean;
  onConfirm: (items: AttachmentUploadItem[]) => Promise<void> | void;
  onClose: () => void;
}

export const ATTACHMENT_TYPE_CONFIG: Record<
  UploadAttachmentTypeEnum,
  { label: string; dotColor: string }
> = {
  [UploadAttachmentTypeEnum.General]: {
    label: 'GENERAL',
    dotColor: '#1E88E5',
  },
  [UploadAttachmentTypeEnum.Additional]: {
    label: 'ADDITIONAL',
    dotColor: '#8E24AA',
  },
  [UploadAttachmentTypeEnum.Complaint]: {
    label: 'COMPLAINT',
    dotColor: '#FB8C00',
  },
  [UploadAttachmentTypeEnum.InternalNote]: {
    label: 'INTERNAL NOTE',
    dotColor: '#FDD835',
  },
  [UploadAttachmentTypeEnum.Approval]: {
    label: 'APPROVAL',
    dotColor: '#43A047',
  },
  [UploadAttachmentTypeEnum.Rejection]: {
    label: 'REJECTION',
    dotColor: '#E53935',
  },
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

const getFileExtension = (fileName: string): string => {
  const parts = fileName.split('.');
  return parts.length > 1 ? parts.pop()?.toUpperCase() || 'FILE' : 'FILE';
};

interface FileItemState {
  id: string;
  file: File;
  previewUrl?: string;
  isImage: boolean;
  description: string;
  type: UploadAttachmentTypeEnum;
}

export const AttachmentUploadDialog: React.FC<AttachmentUploadDialogProps> = ({
  open,
  files,
  defaultType = UploadAttachmentTypeEnum.General,
  allowTypeChange = false,
  isUploading = false,
  onConfirm,
  onClose,
}) => {
  const [items, setItems] = useState<FileItemState[]>([]);

  // Synchronize incoming files when dialog opens
  useEffect(() => {
    if (!open) {
      setItems([]);
      return;
    }

    const initialItems: FileItemState[] = files.map((file, idx) => {
      const isImg = file.type.startsWith('image/') || /\.(jpe?g|png|gif|webp|svg)$/i.test(file.name);
      return {
        id: `${file.name}-${file.size}-${idx}-${Date.now()}`,
        file,
        previewUrl: isImg ? URL.createObjectURL(file) : undefined,
        isImage: isImg,
        description: '',
        type: defaultType,
      };
    });

    setItems(initialItems);

    // Revoke object URLs on cleanup
    return () => {
      initialItems.forEach((item) => {
        if (item.previewUrl) {
          URL.revokeObjectURL(item.previewUrl);
        }
      });
    };
  }, [open, files, defaultType]);

  const handleRemoveItem = useCallback((id: string) => {
    setItems((prev) => {
      const target = prev.find((item) => item.id === id);
      if (target?.previewUrl) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  const handleDescriptionChange = useCallback((id: string, text: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, description: text } : item))
    );
  }, []);

  const handleTypeChange = useCallback((id: string, newType: UploadAttachmentTypeEnum) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, type: newType } : item))
    );
  }, []);

  const handleConfirm = useCallback(async () => {
    if (items.length === 0) return;
    const payload: AttachmentUploadItem[] = items.map((item) => ({
      file: item.file,
      description: item.description.trim(),
      type: item.type,
    }));
    await onConfirm(payload);
  }, [items, onConfirm]);

  const typeOptions = useMemo(() => {
    return Object.entries(ATTACHMENT_TYPE_CONFIG).map(([key, config]) => ({
      value: key as UploadAttachmentTypeEnum,
      label: config.label,
      dotColor: config.dotColor,
    }));
  }, []);

  const renderThumbnail = (item: FileItemState) => {
    if (item.isImage && item.previewUrl) {
      return (
        <S.ThumbnailWrapper>
          <S.ThumbnailImage src={item.previewUrl} alt={item.file.name} />
        </S.ThumbnailWrapper>
      );
    }

    const ext = getFileExtension(item.file.name);
    const isPdf = ext === 'PDF' || item.file.type === 'application/pdf';
    const isDoc = ['DOC', 'DOCX'].includes(ext);

    return (
      <S.ThumbnailWrapper>
        <S.DocumentBadge badgeColor={isPdf ? '#E53935' : isDoc ? '#1E88E5' : undefined}>
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
    );
  };

  return (
    <S.StyledDialog open={open} onClose={isUploading ? undefined : onClose}>
      <S.DialogHeader>
        <S.HeaderTitleText>
          Upload Attachments {items.length > 0 ? `(${items.length})` : ''}
        </S.HeaderTitleText>
        <IconButton
          size="small"
          variant="text"
          color="secondary"
          disabled={isUploading}
          onClick={onClose}
          aria-label="Close dialog"
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </S.DialogHeader>

      <S.DialogBody>
        {items.map((item) => {
          const currentConfig = ATTACHMENT_TYPE_CONFIG[item.type] || ATTACHMENT_TYPE_CONFIG[UploadAttachmentTypeEnum.General];

          return (
            <S.FileCard key={item.id}>
              <S.FileTopRow>
                <S.FileDetailsLeft>
                  {renderThumbnail(item)}
                  <S.FileInfo>
                    <S.FileName title={item.file.name}>{item.file.name}</S.FileName>
                    <S.FileMeta>{formatFileSize(item.file.size)}</S.FileMeta>
                  </S.FileInfo>
                </S.FileDetailsLeft>

                <S.FileActionsRight>
                  {allowTypeChange ? (
                    <S.StyledTypeSelect
                      size="small"
                      value={item.type}
                      onChange={(e) => handleTypeChange(item.id, e.target.value as UploadAttachmentTypeEnum)}
                      disabled={isUploading}
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

                  <IconButton
                    size="small"
                    variant="text"
                    color="secondary"
                    disabled={isUploading}
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove file"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </S.FileActionsRight>
              </S.FileTopRow>

              <S.DescriptionInput
                size="small"
                multiline
                minRows={1}
                maxRows={3}
                placeholder="Add a description (optional)..."
                value={item.description}
                disabled={isUploading}
                onChange={(e) => handleDescriptionChange(item.id, e.target.value)}
              />
            </S.FileCard>
          );
        })}
      </S.DialogBody>

      <S.DialogFooter>
        <Button
          variant="outlined"
          color="secondary"
          size="medium"
          disabled={isUploading}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="medium"
          disabled={items.length === 0 || isUploading}
          onClick={handleConfirm}
          startIcon={isUploading ? <CircularProgress size={16} color="inherit" /> : undefined}
        >
          {isUploading ? 'Uploading...' : `Upload (${items.length})`}
        </Button>
      </S.DialogFooter>
    </S.StyledDialog>
  );
};
