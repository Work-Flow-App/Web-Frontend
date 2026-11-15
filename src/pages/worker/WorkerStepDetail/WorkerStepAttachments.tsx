import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import EditIcon from '@mui/icons-material/Edit';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { workerJobWorkflowService } from '../../../services/api';
import type { StepAttachmentResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { IconButton } from '../../../components/UI/Button/IconButton';
import { BeforeAfterPhotos, splitAttachments, workerBeforeAfterPhotosApi } from '../../jobs/components/BeforeAfterPhotos';
import {
  AttachmentUploadDialog,
  UploadAttachmentTypeEnum,
  ExpandableDescription,
  EditAttachmentDialog,
  type AttachmentUploadItem,
} from '../../../components/UI/AttachmentUploadDialog';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerStepAttachmentsProps {
  stepId: number;
  stepName?: string;
  onUpdate?: () => void;
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <InsertDriveFileIcon fontSize="small" />;
  if (fileType.startsWith('image/')) {
    return <ImageIcon fontSize="small" sx={{ color: 'success.main' }} />;
  }
  if (fileType === 'application/pdf') {
    return <PictureAsPdfIcon fontSize="small" sx={{ color: 'error.main' }} />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <DescriptionIcon fontSize="small" sx={{ color: 'info.main' }} />;
  }
  return <InsertDriveFileIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
};

export const WorkerStepAttachments: React.FC<WorkerStepAttachmentsProps> = ({ stepId, stepName, onUpdate }) => {
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
      const response = await workerJobWorkflowService.getStepAttachments(stepId);
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
          await workerJobWorkflowService.uploadAttachment(
            stepId,
            item.file,
            item.type as any,
            item.description || undefined
          );
        } catch (error) {
          console.error(`Error uploading attachment ${item.file.name}:`, error);
          failedUploads.push(item.file.name);
        }
      }

      if (failedUploads.length === 0) {
        if (items.length === 1) {
          showSuccess('Attachment uploaded');
        } else {
          showSuccess('All attachments uploaded');
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
      console.error('Error uploading attachment:', error);
      showError('Failed to upload attachment');
    } finally {
      setUploading(false);
    }
  };

  const handleDownload = (attachment: StepAttachmentResponse, e: React.MouseEvent) => {
    e.stopPropagation();
    if (attachment.fileUrl) {
      window.open(attachment.fileUrl, '_blank');
    }
  };

  const handleSaveAttachmentEdit = async (newDescription: string) => {
    if (!editingAttachment?.id) return;
    try {
      setSavingAttachment(true);
      await workerJobWorkflowService.updateAttachment(editingAttachment.id, {
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

  if (loading) {
    return (
      <S.EventNoteBox>
        <S.EventNoteHeader>
          <S.EventNoteTitle>Attachments</S.EventNoteTitle>
        </S.EventNoteHeader>
        <Loader size={20} centered minHeight="60px" />
      </S.EventNoteBox>
    );
  }

  return (
    <S.EventNoteBox>
      <S.EventNoteHeader>
        <S.EventNoteTitle>Attachments</S.EventNoteTitle>
        <S.EventNoteEditButton onClick={handleUploadClick} disabled={uploading}>
          {uploading ? 'Uploading...' : 'Add'}
        </S.EventNoteEditButton>
      </S.EventNoteHeader>

      <S.HiddenFileInput
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
        multiple
      />

      {/* No onUpdate: the page's reload would unmount this tab and lose an unsaved write-up. */}
      <BeforeAfterPhotos
        stepId={stepId}
        stepName={stepName}
        api={workerBeforeAfterPhotosApi}
        before={before}
        after={after}
        reloadAttachments={fetchAttachments}
      />

      {others.length === 0 ? (
        <S.UploadDropzone onClick={handleUploadClick}>
          <AttachFileIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 0.5 }} />
          <S.EventNoteContent>Click to upload attachments</S.EventNoteContent>
        </S.UploadDropzone>
      ) : (
        <S.AttachmentList>
          {others.map((attachment) => (
            <S.AttachmentItem key={attachment.id}>
              {getFileIcon(attachment.fileType)}
              <S.AttachmentFileName>
                <div className="name">
                  {attachment.fileName || 'Unnamed file'}
                </div>
                {attachment.createdAt && (
                  <div className="date">{new Date(attachment.createdAt).toLocaleDateString()}</div>
                )}
                <ExpandableDescription description={attachment.description} />
              </S.AttachmentFileName>
              <S.AttachmentActions>
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
              </S.AttachmentActions>
            </S.AttachmentItem>
          ))}

          <S.AddMoreButton onClick={handleUploadClick}>
            <AttachFileIcon sx={{ fontSize: 14 }} />
            Add more
          </S.AddMoreButton>
        </S.AttachmentList>
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
    </S.EventNoteBox>
  );
};
