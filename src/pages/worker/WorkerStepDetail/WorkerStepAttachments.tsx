import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { workerJobWorkflowService } from '../../../services/api';
import type { StepAttachmentResponse } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { IconButton } from '../../../components/UI/Button/IconButton';
import * as S from '../../jobs/JobDetailsPage.styles';

interface WorkerStepAttachmentsProps {
  stepId: number;
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

export const WorkerStepAttachments: React.FC<WorkerStepAttachmentsProps> = ({ stepId, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [attachments, setAttachments] = useState<StepAttachmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAttachments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await workerJobWorkflowService.getStepAttachments(stepId);
      setAttachments(response.data || []);
    } catch (error) {
      console.error('Error fetching attachments:', error);
      setAttachments([]);
    } finally {
      setLoading(false);
    }
  }, [stepId]);

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
      showError('Failed to upload attachment');
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

      {attachments.length === 0 ? (
        <S.UploadDropzone onClick={handleUploadClick}>
          <AttachFileIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 0.5 }} />
          <S.EventNoteContent>Click to upload attachments</S.EventNoteContent>
        </S.UploadDropzone>
      ) : (
        <S.AttachmentList>
          {attachments.map((attachment) => (
            <S.AttachmentItem key={attachment.id}>
              {getFileIcon(attachment.fileType)}
              <S.AttachmentFileName>
                <div className="name">{attachment.fileName || 'Unnamed file'}</div>
                {attachment.createdAt && (
                  <div className="date">{new Date(attachment.createdAt).toLocaleDateString()}</div>
                )}
              </S.AttachmentFileName>
              <S.AttachmentActions>
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
    </S.EventNoteBox>
  );
};
