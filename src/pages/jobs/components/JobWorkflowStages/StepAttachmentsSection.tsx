import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Tooltip } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { stepActivityService } from '../../../../services/api';
import type { StepAttachmentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Loader } from '../../../../components/UI/Loader/Loader';
import { IconButton } from '../../../../components/UI/Button/IconButton';
import * as SPage from '../../JobDetailsPage.styles';
import * as S from './JobWorkflowStages.styles';

interface StepAttachmentsSectionProps {
  stepId: number;
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

export const StepAttachmentsSection: React.FC<StepAttachmentsSectionProps> = ({ stepId, onUpdate }) => {
  const { showSuccess, showError } = useSnackbar();
  const [attachments, setAttachments] = useState<StepAttachmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchAttachments = useCallback(async () => {
    try {
      setLoading(true);
      const response = await stepActivityService.getAttachments(stepId);
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
      await stepActivityService.uploadAttachment(stepId, file);
      showSuccess('Attachment uploaded successfully');
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
      />

      {attachments.length === 0 ? (
        <SPage.UploadDropzone onClick={handleUploadClick}>
          <S.StyledAttachFileIcon />
          <SPage.EventNoteContent>Click to upload attachments</SPage.EventNoteContent>
        </SPage.UploadDropzone>
      ) : (
        <SPage.AttachmentList>
          {attachments.map((attachment) => (
            <SPage.AttachmentItem key={attachment.id}>
              {getFileIcon(attachment.fileType)}
              <SPage.AttachmentFileName>
                <div className="name">{attachment.fileName || 'Unnamed file'}</div>
                {attachment.createdAt && (
                  <div className="date">
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </div>
                )}
              </SPage.AttachmentFileName>
              <SPage.AttachmentActions>
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
    </SPage.EventNoteBox>
  );
};

