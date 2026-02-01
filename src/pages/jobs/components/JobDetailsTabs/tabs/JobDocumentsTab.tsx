import React, { useEffect, useState, useCallback } from 'react';
import { Tooltip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import type { JobResponse, StepAttachmentResponse, JobWorkflowStepResponse } from '../../../../../services/api';
import { jobWorkflowService, stepActivityService } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { IconButton } from '../../../../../components/UI/Button/IconButton';
import * as S from '../../../JobDetailsPage.styles';

interface JobDocumentsTabProps {
  job: JobResponse;
}

interface DocumentWithStep extends StepAttachmentResponse {
  stepName?: string;
  stepId?: number;
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <InsertDriveFileIcon />;

  if (fileType.startsWith('image/')) {
    return <ImageIcon sx={{ color: 'success.main' }} />;
  }
  if (fileType === 'application/pdf') {
    return <PictureAsPdfIcon sx={{ color: 'error.main' }} />;
  }
  if (fileType.includes('word') || fileType.includes('document')) {
    return <DescriptionIcon sx={{ color: 'info.main' }} />;
  }
  return <InsertDriveFileIcon sx={{ color: 'text.secondary' }} />;
};

export const JobDocumentsTab: React.FC<JobDocumentsTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const [documents, setDocuments] = useState<DocumentWithStep[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDocuments = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Get the job workflow
      const workflowResponse = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const workflow = workflowResponse.data;

      if (!workflow?.steps || workflow.steps.length === 0) {
        setDocuments([]);
        setLoading(false);
        return;
      }

      // Fetch attachments for all steps in parallel
      const attachmentPromises = workflow.steps.map(async (step: JobWorkflowStepResponse) => {
        if (!step.id) return [];

        try {
          const response = await stepActivityService.getAttachments(step.id);
          const attachments = response.data || [];

          // Add step info to each attachment
          return attachments.map((attachment: StepAttachmentResponse) => ({
            ...attachment,
            stepName: step.name,
            stepId: step.id,
          }));
        } catch {
          return [];
        }
      });

      const allAttachments = await Promise.all(attachmentPromises);
      const flatDocuments = allAttachments.flat();

      // Sort by creation date (newest first)
      flatDocuments.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
      });

      setDocuments(flatDocuments);
    } catch (error) {
      console.error('Error fetching documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  }, [job.id]);

  useEffect(() => {
    fetchAllDocuments();
  }, [fetchAllDocuments]);

  const handleDownload = (document: DocumentWithStep) => {
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleDelete = async (document: DocumentWithStep) => {
    if (!document.id) return;

    try {
      await stepActivityService.deleteAttachment(document.id);
      showSuccess('Document deleted successfully');
      fetchAllDocuments();
    } catch (error) {
      console.error('Error deleting document:', error);
      showError('Failed to delete document');
    }
  };

  if (loading) {
    return <Loader size={40} centered minHeight="200px" />;
  }

  if (documents.length === 0) {
    return (
      <S.DocumentsEmptyState>
        <S.DocumentsEmptyIcon>
          <FolderOpenIcon sx={{ fontSize: 32 }} />
        </S.DocumentsEmptyIcon>
        <S.DocumentsEmptyText>No documents yet</S.DocumentsEmptyText>
        <S.DocumentsEmptySubtext>
          Documents uploaded in workflow steps will appear here
        </S.DocumentsEmptySubtext>
      </S.DocumentsEmptyState>
    );
  }

  return (
    <>
      <S.DetailsSectionTitle>Documents ({documents.length})</S.DetailsSectionTitle>
      <S.DocumentsGrid>
        {documents.map((document) => (
          <S.DocumentCard key={document.id}>
            <S.DocumentCardHeader>
              <S.DocumentIcon>{getFileIcon(document.fileType)}</S.DocumentIcon>
              <S.DocumentInfo>
                <S.DocumentName>{document.fileName || 'Unnamed file'}</S.DocumentName>
                <S.DocumentMeta>
                  {document.createdAt && new Date(document.createdAt).toLocaleDateString()}
                </S.DocumentMeta>
              </S.DocumentInfo>
            </S.DocumentCardHeader>

            {document.stepName && (
              <S.DocumentStepBadge>Step: {document.stepName}</S.DocumentStepBadge>
            )}

            <S.DocumentCardActions>
              <Tooltip title="Download">
                <IconButton
                  size="small"
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDownload(document)}
                  aria-label="Download document"
                >
                  <DownloadIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete">
                <IconButton
                  size="small"
                  variant="outlined"
                  color="danger"
                  onClick={() => handleDelete(document)}
                  aria-label="Delete document"
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </S.DocumentCardActions>
          </S.DocumentCard>
        ))}
      </S.DocumentsGrid>
    </>
  );
};
