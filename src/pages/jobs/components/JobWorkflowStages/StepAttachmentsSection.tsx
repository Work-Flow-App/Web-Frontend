import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Box, CircularProgress, IconButton, Tooltip } from '@mui/material';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { stepActivityService } from '../../../../services/api';
import type { StepAttachmentResponse } from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import * as S from '../../JobDetailsPage.styles';

interface StepAttachmentsSectionProps {
  stepId: number;
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <InsertDriveFileIcon sx={{ fontSize: 16 }} />;

  if (fileType.startsWith('image/')) {
    return <ImageIcon sx={{ fontSize: 16, color: '#4CAF50' }} />;
  }
  if (fileType === 'application/pdf') {
    return <PictureAsPdfIcon sx={{ fontSize: 16, color: '#F44336' }} />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <DescriptionIcon sx={{ fontSize: 16, color: '#2196F3' }} />;
  }
  return <InsertDriveFileIcon sx={{ fontSize: 16, color: '#757575' }} />;
};

const formatFileSize = (bytes?: number) => {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export const StepAttachmentsSection: React.FC<StepAttachmentsSectionProps> = ({ stepId }) => {
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
    } catch (error) {
      console.error('Error uploading attachment:', error);
      showError('Failed to upload attachment');
    } finally {
      setUploading(false);
      // Reset input
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
      <S.EventNoteBox>
        <S.EventNoteHeader>
          <S.EventNoteTitle>Attachments</S.EventNoteTitle>
        </S.EventNoteHeader>
        <Box display="flex" justifyContent="center" py={2}>
          <CircularProgress size={20} />
        </Box>
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
        <Box
          onClick={handleUploadClick}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 2,
            cursor: 'pointer',
            border: '1px dashed #ccc',
            borderRadius: 1,
            '&:hover': {
              borderColor: 'primary.main',
              backgroundColor: 'rgba(0, 0, 0, 0.02)',
            },
          }}
        >
          <AttachFileIcon sx={{ fontSize: 24, color: 'text.secondary', mb: 0.5 }} />
          <S.EventNoteContent>Click to upload attachments</S.EventNoteContent>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {attachments.map((attachment) => (
            <Box
              key={attachment.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                p: 1,
                backgroundColor: 'white',
                borderRadius: 0.5,
                border: '1px solid #eee',
                '&:hover': {
                  backgroundColor: '#f5f5f5',
                },
              }}
            >
              {getFileIcon(attachment.fileType)}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Box
                  sx={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: 'text.primary',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {attachment.fileName || 'Unnamed file'}
                </Box>
                {attachment.createdAt && (
                  <Box sx={{ fontSize: 10, color: 'text.secondary' }}>
                    {new Date(attachment.createdAt).toLocaleDateString()}
                  </Box>
                )}
              </Box>
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                <Tooltip title="Download">
                  <IconButton
                    size="small"
                    onClick={(e) => handleDownload(attachment, e)}
                    sx={{ p: 0.5 }}
                  >
                    <DownloadIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    size="small"
                    onClick={(e) => attachment.id && handleDeleteAttachment(attachment.id, e)}
                    sx={{ p: 0.5, color: '#F44336' }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          ))}

          {/* Add more button */}
          <Box
            onClick={handleUploadClick}
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              py: 1,
              cursor: 'pointer',
              border: '1px dashed #ccc',
              borderRadius: 0.5,
              fontSize: 12,
              color: 'text.secondary',
              '&:hover': {
                borderColor: 'primary.main',
                color: 'primary.main',
              },
            }}
          >
            <AttachFileIcon sx={{ fontSize: 14 }} />
            Add more
          </Box>
        </Box>
      )}
    </S.EventNoteBox>
  );
};
