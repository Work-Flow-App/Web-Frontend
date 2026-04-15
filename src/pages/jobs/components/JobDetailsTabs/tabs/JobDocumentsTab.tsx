import React, { useEffect, useState, useCallback } from 'react';
import { Box, Divider, Tooltip } from '@mui/material';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { JobResponse, StepAttachmentResponse, JobWorkflowStepResponse, InvoiceResponse } from '../../../../../services/api';
import { jobWorkflowService, stepActivityService, estimateService } from '../../../../../services/api';
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
  if (fileType.startsWith('image/')) return <ImageIcon sx={{ color: 'success.main' }} />;
  if (fileType === 'application/pdf') return <PictureAsPdfIcon sx={{ color: 'error.main' }} />;
  if (fileType.includes('word') || fileType.includes('document')) return <DescriptionIcon sx={{ color: 'info.main' }} />;
  return <InsertDriveFileIcon sx={{ color: 'text.secondary' }} />;
};

const fmt = (v?: number) => (v !== undefined ? `£${v.toFixed(2)}` : '—');

export const JobDocumentsTab: React.FC<JobDocumentsTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const [documents, setDocuments] = useState<DocumentWithStep[]>([]);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAllDocuments = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // Fetch workflow attachments and invoices in parallel
      const [workflowResponse, estimateResponse] = await Promise.allSettled([
        jobWorkflowService.getJobWorkflowByJobId(job.id),
        estimateService.getByJobId(job.id),
      ]);

      // --- Workflow attachments ---
      if (workflowResponse.status === 'fulfilled') {
        const workflow = workflowResponse.value.data;
        if (workflow?.steps?.length) {
          const attachmentPromises = workflow.steps.map(async (step: JobWorkflowStepResponse) => {
            if (!step.id) return [];
            try {
              const response = await stepActivityService.getAttachments(step.id);
              return (response.data || []).map((a: StepAttachmentResponse) => ({
                ...a,
                stepName: step.name,
                stepId: step.id,
              }));
            } catch {
              return [];
            }
          });
          const allAttachments = (await Promise.all(attachmentPromises)).flat();
          allAttachments.sort((a, b) => {
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return dateB - dateA;
          });
          setDocuments(allAttachments);
        }
      }

      // --- Invoices ---
      if (estimateResponse.status === 'fulfilled') {
        const estimateId = estimateResponse.value.data?.id;
        if (estimateId) {
          try {
            const invRes = await estimateService.listInvoicesForEstimate(estimateId);
            const data = Array.isArray(invRes.data) ? invRes.data : [];
            setInvoices(data.slice().sort((a, b) => {
              const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
              const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
              return dateB - dateA;
            }));
          } catch {
            // no invoices yet is fine
          }
        }
      }
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  }, [job.id]);

  useEffect(() => {
    fetchAllDocuments();
  }, [fetchAllDocuments]);

  const handleDownload = (document: DocumentWithStep) => {
    if (document.fileUrl) window.open(document.fileUrl, '_blank');
  };

  const handleDelete = async (document: DocumentWithStep) => {
    if (!document.id) return;
    try {
      await stepActivityService.deleteAttachment(document.id);
      showSuccess('Document deleted successfully');
      fetchAllDocuments();
    } catch {
      showError('Failed to delete document');
    }
  };

  if (loading) return <Loader size={40} centered minHeight="200px" />;

  const hasDocuments = documents.length > 0;
  const hasInvoices = invoices.length > 0;

  if (!hasDocuments && !hasInvoices) {
    return (
      <S.DocumentsEmptyState>
        <S.DocumentsEmptyIcon>
          <FolderOpenIcon sx={{ fontSize: 32 }} />
        </S.DocumentsEmptyIcon>
        <S.DocumentsEmptyText>No documents yet</S.DocumentsEmptyText>
        <S.DocumentsEmptySubtext>
          Documents uploaded in workflow steps and generated invoices will appear here
        </S.DocumentsEmptySubtext>
      </S.DocumentsEmptyState>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* ── Invoices ── */}
      {hasInvoices && (
        <Box>
          <S.DetailsSectionTitle sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ReceiptIcon sx={{ fontSize: '1rem' }} />
            Invoices ({invoices.length})
          </S.DetailsSectionTitle>
          <S.DocumentsGrid>
            {invoices.map((inv) => (
              <S.DocumentCard key={inv.id}>
                <S.DocumentCardHeader>
                  <S.DocumentIcon>
                    <ReceiptIcon sx={{ color: 'primary.main' }} />
                  </S.DocumentIcon>
                  <S.DocumentInfo>
                    <S.DocumentName>{inv.invoiceNumber || `Invoice #${inv.id}`}</S.DocumentName>
                    <S.DocumentMeta>
                      {inv.createdAt && new Date(inv.createdAt).toLocaleDateString()}
                    </S.DocumentMeta>
                  </S.DocumentInfo>
                </S.DocumentCardHeader>

                <Box sx={{ px: 0.5, pb: 0.5, display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                  {inv.reference && (
                    <S.DocumentMeta>Ref: {inv.reference}</S.DocumentMeta>
                  )}
                  {inv.dueDate && (
                    <S.DocumentMeta>Due: {new Date(inv.dueDate).toLocaleDateString()}</S.DocumentMeta>
                  )}
                  <S.DocumentMeta sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Total: {fmt(inv.grandTotal)}
                  </S.DocumentMeta>
                </Box>

                <S.DocumentCardActions>
                  <Tooltip title="View PDF">
                    <span>
                      <IconButton
                        size="small"
                        variant="outlined"
                        color="secondary"
                        onClick={() => inv.presignedUrl && window.open(inv.presignedUrl, '_blank', 'noopener,noreferrer')}
                        aria-label="View invoice PDF"
                        disabled={!inv.presignedUrl}
                      >
                        <OpenInNewIcon fontSize="small" />
                      </IconButton>
                    </span>
                  </Tooltip>
                </S.DocumentCardActions>
              </S.DocumentCard>
            ))}
          </S.DocumentsGrid>
        </Box>
      )}

      {/* ── Divider between sections ── */}
      {hasInvoices && hasDocuments && <Divider />}

      {/* ── Workflow attachments ── */}
      {hasDocuments && (
        <Box>
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
        </Box>
      )}
    </Box>
  );
};
