import React, { useEffect, useState, useCallback } from 'react';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import ReceiptIcon from '@mui/icons-material/Receipt';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import type { JobResponse, StepAttachmentResponse, JobWorkflowStepResponse, InvoiceResponse } from '../../../../../services/api';
import { jobWorkflowService, stepActivityService, estimateService } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import * as S from '../../../JobDetailsPage.styles';

type ActiveTab = 'all' | 'invoices' | 'attachments';

interface JobDocumentsTabProps {
  job: JobResponse;
}

interface DocumentWithStep extends StepAttachmentResponse {
  stepName?: string;
  stepId?: number;
}

const getFileIcon = (fileType?: string) => {
  if (!fileType) return <S.DocFileIcon />;
  if (fileType.startsWith('image/')) return <S.DocImageIcon />;
  if (fileType === 'application/pdf') return <S.DocPdfIcon />;
  if (fileType.includes('word') || fileType.includes('document')) return <S.DocDescIcon />;
  return <S.DocFileIcon />;
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export const JobDocumentsTab: React.FC<JobDocumentsTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const [documents, setDocuments] = useState<DocumentWithStep[]>([]);
  const [invoices, setInvoices] = useState<InvoiceResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');

  const fetchAllDocuments = useCallback(async () => {
    if (!job.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);

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

  const handleDownloadAttachment = (document: DocumentWithStep) => {
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

  const totalCount = invoices.length + documents.length;
  const showInvoices = activeTab === 'all' || activeTab === 'invoices';
  const showAttachments = activeTab === 'all' || activeTab === 'attachments';

  return (
    <S.DocumentsTabContainer>
      {/* ── Header ── */}
      <S.DocPageTitle>Documents</S.DocPageTitle>
      <S.DocPageSubtitle>All invoices and attachments for this job</S.DocPageSubtitle>

      {/* ── Tabs ── */}
      <S.DocTabsRow>
        <S.DocTabButton active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
          All <S.DocTabCount active={activeTab === 'all'}>{totalCount}</S.DocTabCount>
        </S.DocTabButton>
        <S.DocTabButton active={activeTab === 'invoices'} onClick={() => setActiveTab('invoices')}>
          Invoices <S.DocTabCount active={activeTab === 'invoices'}>{invoices.length}</S.DocTabCount>
        </S.DocTabButton>
        <S.DocTabButton active={activeTab === 'attachments'} onClick={() => setActiveTab('attachments')}>
          Attachments <S.DocTabCount active={activeTab === 'attachments'}>{documents.length}</S.DocTabCount>
        </S.DocTabButton>
      </S.DocTabsRow>

      {/* ── Invoices Section ── */}
      {showInvoices && (
        <S.InvoicesSection allTab={activeTab === 'all'}>
          <S.DocSectionLabel>INVOICES · {invoices.length}</S.DocSectionLabel>

          <S.DocumentsGrid>
            {invoices.length === 0 && (
              <S.DocumentsEmptyState>
                <S.DocumentsEmptyIcon>
                  <ReceiptIcon />
                </S.DocumentsEmptyIcon>
                <S.DocumentsEmptyText>No Invoice available</S.DocumentsEmptyText>
              </S.DocumentsEmptyState>
            )}

            {invoices.map((inv) => (
              <S.DocumentCard key={inv.id}>
                <S.DocumentCardHeader>
                  <S.DocumentIcon isInvoice>
                    <ReceiptIcon />
                  </S.DocumentIcon>
                  <S.DocumentInfo>
                    <S.DocumentName>{inv.invoiceNumber || `Invoice #${inv.id}`}</S.DocumentName>
                    <S.DocumentMeta>{formatDate(inv.createdAt)}</S.DocumentMeta>
                  </S.DocumentInfo>
                </S.DocumentCardHeader>

                <S.DocInvoiceAmount>
                  £{inv.grandTotal != null ? Number(inv.grandTotal).toFixed(2) : '0.00'}
                </S.DocInvoiceAmount>

                <S.DocumentCardActions>
                  <S.DocCardActionButton
                    onClick={() => inv.presignedUrl && window.open(inv.presignedUrl, '_blank', 'noopener,noreferrer')}
                    disabled={!inv.presignedUrl}
                  >
                    <OpenInNewIcon />
                    Open
                  </S.DocCardActionButton>
                  <S.DocCardActionButton
                    onClick={() => inv.presignedUrl && window.open(inv.presignedUrl, '_blank')}
                    disabled={!inv.presignedUrl}
                  >
                    <DownloadIcon />
                    Download
                  </S.DocCardActionButton>
                </S.DocumentCardActions>
              </S.DocumentCard>
            ))}
          </S.DocumentsGrid>
        </S.InvoicesSection>
      )}

      {/* ── Attachments Section ── */}
      {showAttachments && (
        <S.AttachmentsSection>
          <S.DocSectionLabel>ATTACHMENTS · {documents.length}</S.DocSectionLabel>

          <S.DocumentsGrid>
            {documents.length === 0 && (
              <S.DocumentsEmptyState>
                <S.DocumentsEmptyIcon>
                  <FolderOpenIcon />
                </S.DocumentsEmptyIcon>
                <S.DocumentsEmptyText>No Attachments available</S.DocumentsEmptyText>
              </S.DocumentsEmptyState>
            )}

            {documents.map((document) => (
              <S.DocumentCard key={document.id}>
                <S.DocumentCardHeader>
                  <S.DocumentIcon>{getFileIcon(document.fileType)}</S.DocumentIcon>
                  <S.DocumentInfo>
                    <S.DocumentName>{document.fileName || 'Unnamed file'}</S.DocumentName>
                    <S.DocumentMeta>{formatDate(document.createdAt)}</S.DocumentMeta>
                  </S.DocumentInfo>
                </S.DocumentCardHeader>

                {document.stepName && (
                  <S.DocumentStepBadge>Step: {document.stepName}</S.DocumentStepBadge>
                )}

                <S.DocumentCardActions>
                  <S.DocCardActionButton onClick={() => handleDownloadAttachment(document)}>
                    <DownloadIcon />
                    Download
                  </S.DocCardActionButton>
                  <S.DocCardActionButton
                    danger
                    onClick={() => handleDelete(document)}
                  >
                    <DeleteIcon />
                    Delete
                  </S.DocCardActionButton>
                </S.DocumentCardActions>
              </S.DocumentCard>
            ))}
          </S.DocumentsGrid>
        </S.AttachmentsSection>
      )}
    </S.DocumentsTabContainer>
  );
};
