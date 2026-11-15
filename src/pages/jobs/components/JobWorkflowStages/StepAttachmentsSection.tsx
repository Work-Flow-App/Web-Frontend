import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import { stepActivityService } from '../../../../services/api';
import type { StepAttachmentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI/Loader/Loader';
import { IconButton } from '../../../../components/UI/Button/IconButton';
import { BeforeAfterPhotos, companyBeforeAfterPhotosApi, splitAttachments } from '../BeforeAfterPhotos';
import {
  AttachmentUploadDialog,
  UploadAttachmentTypeEnum,
  ExpandableDescription,
  EditAttachmentDialog,
  type AttachmentUploadItem,
} from '../../../../components/UI/AttachmentUploadDialog';
import * as SPage from '../../JobDetailsPage.styles';
import * as S from './JobWorkflowStages.styles';

interface StepAttachmentsSectionProps {
  stepId: number;
  stepName?: string;
  /** Change it to reload the before/after photos' saved write-up after the step's comments change. */
  refreshKey?: number;
  onUpdate?: () => void;
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <S.StyledGenericFileIcon />;

  if (fileType.startsWith('image/')) {
    return <S.StyledImageIcon />;
  }
  if (fileType === 'application/pdf') {
    return <S.StyledPdfIcon />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <S.StyledDocIcon />;
  }
  return <S.StyledGenericFileIcon />;
};

export const StepAttachmentsSection: React.FC<StepAttachmentsSectionProps> = ({
  stepId,
  stepName,
  refreshKey,
  onUpdate,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const [attachments, setAttachments] = useState<StepAttachmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<StepAttachmentResponse | null>(null);
  const [savingAttachment, setSavingAttachment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Only the first load shows the loader; reloads keep the section mounted so an unsaved photo write-up survives.
  const fetchAttachments = useCallback(async () => {
    try {
      const response = await stepActivityService.getAttachments(stepId);
      const nextAttachments = response.data || [];
      setAttachments(nextAttachments);
      return nextAttachments;
    } catch (error) {
      console.error('Error fetching attachments:', error);
      setAttachments([]);
      return null;
    } finally {
      setLoading(false);
    }
  }, [stepId]);

  const { before, after, others } = splitAttachments(attachments);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles(files);
    setIsUploadDialogOpen(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleConfirmUpload = async (items: AttachmentUploadItem[]) => {
    try {
      setUploading(true);
      const failedUploads: string[] = [];

      for (const item of items) {
        try {
          await stepActivityService.uploadAttachment(
            stepId,
            item.file,
            item.type,
            item.description || undefined
          );
        } catch (error) {
          console.error(`Error uploading attachment ${item.file.name}:`, error);
          failedUploads.push(item.file.name);
        }
      }

      if (failedUploads.length === 0) {
        if (items.length === 1) {
          showSuccess('Attachment uploaded successfully');
        } else {
          showSuccess('All attachments uploaded successfully');
        }
      } else if (failedUploads.length < items.length) {
        showError(`Failed to upload: ${failedUploads.join(', ')}. Other attachments uploaded successfully.`);
      } else {
        showError('Failed to upload attachments');
      }

      setIsUploadDialogOpen(false);
      setSelectedFiles([]);
      fetchAttachments();
      onUpdate?.();
    } catch (error) {
      console.error('Error during attachments upload:', error);
      showError('Failed to upload attachments');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAttachment = async (attachmentId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await stepActivityService.deleteAttachment(attachmentId);
      showSuccess('Attachment deleted successfully');
      fetchAttachments();
      onUpdate?.();
    } catch (error) {
      console.error('Error deleting attachment:', error);
      showError('Failed to delete attachment');
    }
  };

  const handleSaveAttachmentEdit = async (newDescription: string) => {
    if (!editingAttachment?.id) return;
    try {
      setSavingAttachment(true);
      await stepActivityService.updateAttachment(editingAttachment.id, {
        description: newDescription || undefined,
      });
      showSuccess('Attachment updated successfully');
      setEditingAttachment(null);
      fetchAttachments();
      onUpdate?.();
    } catch (error) {
      console.error('Error updating attachment:', error);
      showError('Failed to update attachment');
    } finally {
      setSavingAttachment(false);
    }
  };

  const handleDownload = (attachment: StepAttachmentResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (attachment.fileUrl) {
      window.open(attachment.fileUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <SPage.EventNoteBox>
        <SPage.EventNoteHeader>
          <SPage.EventNoteTitle>Attachments</SPage.EventNoteTitle>
        </SPage.EventNoteHeader>
        <Loader size={20} centered minHeight="60px" />
      </SPage.EventNoteBox>
    );
  }

  return (
    <SPage.EventNoteBox>
      <SPage.EventNoteHeader>
        <SPage.EventNoteTitle>Attachments</SPage.EventNoteTitle>
        <SPage.EventNoteEditButton onClick={handleUploadClick} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add'}
        </SPage.EventNoteEditButton>
      </SPage.EventNoteHeader>

      <S.HiddenFileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        multiple
      />

      <BeforeAfterPhotos
        stepId={stepId}
        stepName={stepName}
        api={companyBeforeAfterPhotosApi}
        before={before}
        after={after}
        reloadAttachments={fetchAttachments}
        refreshKey={refreshKey}
        onUpdate={onUpdate}
      />

      {others.length === 0 ? (
        <SPage.UploadDropzone onClick={handleUploadClick}>
          <S.StyledAttachFileIcon />
          <SPage.EventNoteContent>Click to upload attachments</SPage.EventNoteContent>
        </SPage.UploadDropzone>
      ) : (
        <SPage.AttachmentList>
          {others.map((attachment) => (
            <SPage.AttachmentItem key={attachment.id}>
              {getFileIcon(attachment.fileType)}
              <SPage.AttachmentFileName>
                <div className="name">
                  {attachment.fileName || 'Unnamed file'}
                </div>
                {attachment.createdAt && (
                  <div className="date">
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </div>
                )}
                <ExpandableDescription description={attachment.description} />
              </SPage.AttachmentFileName>
              <SPage.AttachmentActions>
                <Tooltip title="Edit description">
                  <IconButton
                    size="small"
                    variant="text"
                    color="secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingAttachment(attachment);
                    }}
                    aria-label="Edit description"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    variant="text"
                    color="secondary"
                    onClick={(e) => handleDownload(attachment, e)}
                    aria-label="Download attachment"
                  >
                    <DownloadIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    variant="text"
                    color="error"
                    onClick={(e) => attachment.id && handleDeleteAttachment(attachment.id, e)}
                    aria-label="Delete attachment"
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Tooltip>
              </SPage.AttachmentActions>
            </SPage.AttachmentItem>
          ))}

          <SPage.AddMoreButton onClick={handleUploadClick}>
            <S.StyledAttachFileSmallIcon />
            Add more
          </SPage.AddMoreButton>
        </SPage.AttachmentList>
      )}

      <AttachmentUploadDialog
        open={isUploadDialogOpen}
        files={selectedFiles}
        defaultType={UploadAttachmentTypeEnum.General}
        allowTypeChange={false}
        isUploading={uploading}
        onConfirm={handleConfirmUpload}
        onClose={() => {
          if (!uploading) {
            setIsUploadDialogOpen(false);
            setSelectedFiles([]);
          }
        }}
      />

      <EditAttachmentDialog
        open={Boolean(editingAttachment)}
        fileName={editingAttachment?.fileName || 'Attachment'}
        initialDescription={editingAttachment?.description || ''}
        allowTypeChange={false}
        isSaving={savingAttachment}
        onSave={(newDesc) => handleSaveAttachmentEdit(newDesc)}
        onClose={() => setEditingAttachment(null)}
      />
    </SPage.EventNoteBox>
  );
};

