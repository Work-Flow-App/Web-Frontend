import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FilePreview } from '../../../../components/UI/FilePreview';
import { extractErrorMessage } from '../../../../utils/errorHandler';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { stepActivityService } from '../../../../services/api';
import type { StepAttachmentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI/Loader/Loader';
import { IconButton } from '../../../../components/UI/Button/IconButton';
import { BeforeAfterPhotos, companyBeforeAfterPhotosApi, splitAttachments } from '../BeforeAfterPhotos';
import * as SPage from '../../JobDetailsPage.styles';
import * as S from './JobWorkflowStages.styles';

interface StepAttachmentsSectionProps {
  stepId: number;
  stepName?: string;
  /** Change it to reload the before/after photos' saved write-up after the step's comments change. */
  refreshKey?: number;
  onUpdate?: () => void;
}

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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      setUploading(true);
      const failedUploads: string[] = [];

      for (const file of files) {
        try {
          await stepActivityService.uploadAttachment(stepId, file);
        } catch (error) {
          console.error(`Error uploading attachment ${file.name}:`, error);
          failedUploads.push(`${file.name} (${extractErrorMessage(error, 'upload failed')})`);
        }
      }

      if (failedUploads.length === 0) {
        if (files.length === 1) {
          showSuccess('Attachment uploaded successfully');
        } else {
          showSuccess('All attachments uploaded successfully');
        }
      } else if (failedUploads.length < files.length) {
        showError(`Failed to upload ${failedUploads.join(', ')}. Other attachments uploaded successfully.`);
      } else {
        showError(`Failed to upload ${failedUploads.join(', ')}`);
      }

      fetchAttachments();
      onUpdate?.();
    } catch (error) {
      console.error('Error during attachments upload:', error);
      showError('Failed to upload attachments');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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
          <SPage.AttachmentTileGrid>
          {others.map((attachment) => (
            <SPage.AttachmentTile key={attachment.id}>
              <FilePreview
                fileUrl={attachment.fileUrl}
                thumbnailUrl={attachment.thumbnailUrl}
                fileName={attachment.fileName}
                fileType={attachment.fileType}
                aspectRatio="4 / 3"
              />
              <SPage.AttachmentTileFooter>
              <SPage.AttachmentFileName>
                <div className="name" title={attachment.fileName}>{attachment.fileName || 'Unnamed file'}</div>
                {attachment.createdAt && (
                  <div className="date">
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </div>
                )}
              </SPage.AttachmentFileName>
              <SPage.AttachmentTileActions>
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
              </SPage.AttachmentTileActions>
              </SPage.AttachmentTileFooter>
            </SPage.AttachmentTile>
          ))}
          </SPage.AttachmentTileGrid>

          <SPage.AddMoreButton onClick={handleUploadClick}>
            <S.StyledAttachFileSmallIcon />
            Add more
          </SPage.AddMoreButton>
        </SPage.AttachmentList>
      )}
    </SPage.EventNoteBox>
  );
};
