import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Box, IconButton as MuiIconButton, Collapse, Tooltip } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SaveIcon from '@mui/icons-material/Save';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import type { JobResponse, StepTimelineItemResponse } from '../../../../services/api';
import {
  jobWorkflowService,
  stepActivityService,
  UploadAttachment1TypeEnum,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { Button } from '../../../../components/UI/Button';
import { IconButton } from '../../../../components/UI/Button/IconButton';
import { RichTextEditor } from '../../../../components/UI/Forms/RichTextEditor';
import { Loader } from '../../../../components/UI/Loader/Loader';
import * as S from '../../JobDetailsPage.styles';

interface AdditionalInformationSectionProps {
  job: JobResponse;
  defaultExpanded?: boolean;
}

interface PendingFile {
  id: string;
  name: string;
  type: string;
  size: number;
  file: File;
}

interface AdditionalInfoFormValues {
  description: string;
}

const getFileIconFromName = (fileName: string) => {
  const lower = fileName.toLowerCase();
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return <ImageIcon fontSize="small" sx={{ color: 'success.main' }} />;
  }
  if (lower.endsWith('.pdf')) {
    return <PictureAsPdfIcon fontSize="small" sx={{ color: 'error.main' }} />;
  }
  if (lower.match(/\.(doc|docx)$/)) {
    return <DescriptionIcon fontSize="small" sx={{ color: 'info.main' }} />;
  }
  return <InsertDriveFileIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
};

const getFileIconFromType = (fileType: string) => {
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

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const AdditionalInformationSection: React.FC<AdditionalInformationSectionProps> = ({
  job,
  defaultExpanded = false,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [firstStepId, setFirstStepId] = useState<number | null>(null);
  const [existingItems, setExistingItems] = useState<StepTimelineItemResponse[]>([]);
  const [loadingItems, setLoadingItems] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const methods = useForm<AdditionalInfoFormValues>({
    defaultValues: { description: '' },
  });

  const fetchWorkflowAndItems = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoadingItems(true);
      const workflowResponse = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const steps = workflowResponse.data?.steps || [];
      if (steps.length === 0) return;

      const sorted = [...steps].sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      const stepId = sorted[0].id!;
      setFirstStepId(stepId);

      const discussionResponse = await stepActivityService.getDiscussionTimeline(stepId);
      const allItems = discussionResponse.data || [];
      setExistingItems(allItems.filter((item) => item.discussionType === 'ADDITIONAL'));
    } catch (error) {
      console.error('Error fetching additional information:', error);
    } finally {
      setLoadingItems(false);
    }
  }, [job.id]);

  useEffect(() => {
    fetchWorkflowAndItems();
  }, [fetchWorkflowAndItems]);

  const toggleExpanded = () => setIsExpanded((prev) => !prev);

  const addFiles = (files: File[]) => {
    const newFiles: PendingFile[] = files.map((file) => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type,
      size: file.size,
      file,
    }));
    setPendingFiles((prev) => [...prev, ...newFiles]);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) addFiles(Array.from(event.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemovePendingFile = (id: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== id));
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) addFiles(Array.from(event.dataTransfer.files));
  };

  const handleUploadClick = () => fileInputRef.current?.click();

  const handleSave = async (data: AdditionalInfoFormValues) => {
    if (!firstStepId) {
      showError('No workflow step found for this job');
      return;
    }
    if (!data.description.trim() && pendingFiles.length === 0) {
      showError('Please add a description or attachment');
      return;
    }

    try {
      setSaving(true);

      if (data.description.trim()) {
        await stepActivityService.addComment(firstStepId, {
          content: data.description.trim(),
          type: 'ADDITIONAL',
        });
      }

      for (const pending of pendingFiles) {
        await stepActivityService.uploadAttachment(
          firstStepId,
          pending.file,
          UploadAttachment1TypeEnum.Additional
        );
      }

      showSuccess('Additional information saved successfully');
      methods.reset();
      setPendingFiles([]);
      fetchWorkflowAndItems();
    } catch (error) {
      console.error('Error saving additional information:', error);
      showError('Failed to save additional information');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = (item: StepTimelineItemResponse) => {
    if (item.fileUrl) window.open(item.fileUrl, '_blank');
  };

  return (
    <S.CollapsibleSection>
      <S.CollapsibleSectionHeader onClick={toggleExpanded}>
        <S.CollapsibleSectionTitle>Additional Information</S.CollapsibleSectionTitle>
        <S.CollapsibleSectionActions>
          <MuiIconButton
            size="small"
            sx={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <ExpandMoreIcon fontSize="small" />
          </MuiIconButton>
        </S.CollapsibleSectionActions>
      </S.CollapsibleSectionHeader>

      <Collapse in={isExpanded}>
        <S.CollapsibleSectionContent>
          {/* Existing saved ADDITIONAL items */}
          {loadingItems ? (
            <Loader size={20} centered minHeight="60px" />
          ) : existingItems.length > 0 ? (
            <S.EventNoteBox>
              <S.EventNoteHeader>
                <S.EventNoteTitle>Saved Information</S.EventNoteTitle>
              </S.EventNoteHeader>
              {existingItems.map((item) => (
                <S.CommentItemBox key={`${item.itemType}-${item.id}`}>
                  {item.itemType === 'COMMENT' ? (
                    <>
                      <S.EventNoteContent dangerouslySetInnerHTML={{ __html: item.content || '' }} />
                      {item.createdAt && (
                        <S.CommentTimestamp>
                          {new Date(item.createdAt).toLocaleString()}
                        </S.CommentTimestamp>
                      )}
                    </>
                  ) : (
                    <S.CommentContentRow>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getFileIconFromName(item.content || '')}
                        <S.AttachmentFileName>
                          <div className="name">{item.content || 'Unnamed file'}</div>
                          {item.createdAt && (
                            <div className="date">
                              {new Date(item.createdAt).toLocaleDateString()}
                            </div>
                          )}
                        </S.AttachmentFileName>
                      </Box>
                      {item.fileUrl && (
                        <Tooltip title="Download">
                          <IconButton
                            size="small"
                            variant="text"
                            color="secondary"
                            onClick={() => handleDownload(item)}
                            aria-label="Download file"
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </S.CommentContentRow>
                  )}
                </S.CommentItemBox>
              ))}
            </S.EventNoteBox>
          ) : null}

          {/* Add new information form */}
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(handleSave)}>
              <S.AdditionalInfoContainer>
                <RichTextEditor
                  name="description"
                  label="Description"
                  placeholder="Enter additional information or notes about this job..."
                />

                <div>
                  <S.FormLabel>Attachments</S.FormLabel>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    multiple
                    style={{ display: 'none' }}
                  />

                  {pendingFiles.length === 0 ? (
                    <S.UploadArea
                      onClick={handleUploadClick}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      isDragging={isDragging}
                    >
                      <CloudUploadIcon sx={{ fontSize: 32, color: 'grey.400', mb: 1 }} />
                      <S.UploadText>
                        <S.UploadHighlight>Click to upload</S.UploadHighlight> or drag and drop
                      </S.UploadText>
                      <S.UploadSubtext>Any file type supported</S.UploadSubtext>
                    </S.UploadArea>
                  ) : (
                    <>
                      <S.AttachmentList>
                        {pendingFiles.map((pending) => (
                          <S.AttachmentItem key={pending.id}>
                            {getFileIconFromType(pending.type)}
                            <S.AttachmentFileName>
                              <div className="name">{pending.name}</div>
                              <div className="date">{formatFileSize(pending.size)}</div>
                            </S.AttachmentFileName>
                            <S.AttachmentActions>
                              <Tooltip title="Remove">
                                <IconButton
                                  size="small"
                                  variant="text"
                                  color="error"
                                  onClick={() => handleRemovePendingFile(pending.id)}
                                  aria-label="Remove attachment"
                                >
                                  <DeleteIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            </S.AttachmentActions>
                          </S.AttachmentItem>
                        ))}
                      </S.AttachmentList>
                      <S.AddMoreButton onClick={handleUploadClick}>
                        <AttachFileIcon sx={{ fontSize: 14 }} />
                        Add more
                      </S.AddMoreButton>
                    </>
                  )}
                </div>

                <S.ButtonActionsRow>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    type="submit"
                    startIcon={<SaveIcon />}
                    disabled={saving || (!firstStepId && !loadingItems)}
                  >
                    {saving ? 'Saving...' : 'Save'}
                  </Button>
                </S.ButtonActionsRow>
              </S.AdditionalInfoContainer>
            </form>
          </FormProvider>
        </S.CollapsibleSectionContent>
      </Collapse>
    </S.CollapsibleSection>
  );
};
