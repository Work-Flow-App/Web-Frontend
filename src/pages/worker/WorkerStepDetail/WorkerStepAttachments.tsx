import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useFileViewer } from '../../../components/UI/FileViewer';
import { FilePreview } from '../../../components/UI/FilePreview';
import { extractErrorMessage } from '../../../utils/errorHandler';
import { Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import { workerJobWorkflowService } from '../../../services/api';
import type { StepAttachmentResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { IconButton } from '../../../components/UI/Button/IconButton';
import { BeforeAfterPhotos, splitAttachments, workerBeforeAfterPhotosApi } from '../../jobs/components/BeforeAfterPhotos';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerStepAttachmentsProps {
  stepId: number;
  stepName?: string;
  onUpdate?: () => void;
}

export const WorkerStepAttachments: React.FC<WorkerStepAttachmentsProps> = ({ stepId, stepName, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [attachments, setAttachments] = useState<StepAttachmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
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
  const { openFile, viewer } = useFileViewer(others);

  useEffect(() => {
    fetchAttachments();
  }, [fetchAttachments]);

  const handleUploadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      await workerJobWorkflowService.uploadAttachment(stepId, file);
      showSuccess('Attachment uploaded');
      fetchAttachments();
      onUpdate?.();
    } catch (error) {
      console.error('Error uploading attachment:', error);
      showError(extractErrorMessage(error, 'Failed to upload attachment'));
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
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

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
        onClick={(e) => e.stopPropagation()}
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
          <S.AttachmentTileGrid>
          {others.map((attachment, attachmentIndex) => (
            <S.AttachmentTile key={attachment.id}>
              <FilePreview
                fileUrl={attachment.fileUrl}
                thumbnailUrl={attachment.thumbnailUrl}
                fileName={attachment.fileName}
                fileType={attachment.fileType}
                aspectRatio="4 / 3"
                onOpen={() => openFile(attachmentIndex)}
              />
              <S.AttachmentTileFooter>
              <S.AttachmentFileName>
                <div className="name" title={attachment.fileName}>{attachment.fileName || 'Unnamed file'}</div>
                {attachment.createdAt && (
                  <div className="date">{new Date(attachment.createdAt).toLocaleDateString()}</div>
                )}
              </S.AttachmentFileName>
              <S.AttachmentTileActions>
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
              </S.AttachmentTileActions>
              </S.AttachmentTileFooter>
            </S.AttachmentTile>
          ))}
          </S.AttachmentTileGrid>

          <S.AddMoreButton onClick={handleUploadClick}>
            <AttachFileIcon sx={{ fontSize: 14 }} />
            Add more
          </S.AddMoreButton>
        </S.AttachmentList>
      )}
      {viewer}
    </S.EventNoteBox>
  );
};
