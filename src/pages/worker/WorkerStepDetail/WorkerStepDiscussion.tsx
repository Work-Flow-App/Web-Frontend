import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  TextField,
  Tooltip,
  IconButton as MuiIconButton,
  CircularProgress,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { StepCommentCreateRequestTypeEnum } from '../../../../workflow-api';
import type { StepTimelineItemResponse } from '../../../services/api';
import { workerJobWorkflowService, WorkerJobWorkflowUploadAttachmentTypeEnum } from '../../../services/api';
import { useSnackbar } from '../../../contexts/SnackbarContext';
import { Loader } from '../../../components/UI/Loader/Loader';
import { Button } from '../../../components/UI/Button';
import { ImagePreview } from '../../../components/UI/ImagePreview';
import { isImageAttachment } from '../../../utils/attachmentHelpers';
import {
  AttachmentUploadDialog,
  ExpandableDescription,
  EditAttachmentDialog,
  type AttachmentUploadItem,
} from '../../../components/UI/AttachmentUploadDialog';
import * as S from '../../jobs/JobDetailsPage.styles';
import * as WS from './WorkerStepDiscussion.styles';

interface WorkerStepDiscussionProps {
  stepId: number;
}

const POST_TYPES = [
  { value: StepCommentCreateRequestTypeEnum.General, label: 'GENERAL', dotColor: '#1E88E5' },
  { value: StepCommentCreateRequestTypeEnum.Additional, label: 'ADDITIONAL', dotColor: '#8E24AA' },
  { value: StepCommentCreateRequestTypeEnum.Complaint, label: 'COMPLAINT', dotColor: '#FB8C00' },
  { value: StepCommentCreateRequestTypeEnum.InternalNote, label: 'INTERNAL NOTE', dotColor: '#FDD835' },
];

const TYPE_COLORS: Record<string, { bg: string; color: string }> = {
  GENERAL: { bg: '#E3F2FD', color: '#1565C0' },
  ADDITIONAL: { bg: '#E8F5E9', color: '#2E7D32' },
  COMPLAINT: { bg: '#FFEBEE', color: '#C62828' },
  INTERNAL_NOTE: { bg: '#FFF8E1', color: '#F9A825' },
  APPROVAL: { bg: '#E8F5E9', color: '#1B5E20' },
  REJECTION: { bg: '#FCE4EC', color: '#AD1457' },
};

const getTypeStyle = (type?: string) =>
  TYPE_COLORS[type || 'GENERAL'] ?? { bg: '#F5F5F5', color: '#616161' };

const getFileIcon = (fileName: string) => {
  const lower = fileName.toLowerCase();
  if (lower.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) {
    return <ImageIcon fontSize="small" sx={{ color: 'success.main' }} />;
  }
  if (lower.endsWith('.pdf')) {
    return <PictureAsPdfIcon fontSize="small" sx={{ color: 'error.main' }} />;
  }
  return <InsertDriveFileIcon fontSize="small" sx={{ color: 'text.secondary' }} />;
};

const extractFileName = (fileUrl?: string): string => {
  const raw = fileUrl?.split('?')[0].split('/').pop() || 'Attachment';
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
};

const mapPostTypeToAttachmentType = (postType: string): WorkerJobWorkflowUploadAttachmentTypeEnum => {
  switch (postType) {
    case StepCommentCreateRequestTypeEnum.Additional:
      return WorkerJobWorkflowUploadAttachmentTypeEnum.Additional;
    case StepCommentCreateRequestTypeEnum.Complaint:
      return WorkerJobWorkflowUploadAttachmentTypeEnum.Complaint;
    case StepCommentCreateRequestTypeEnum.InternalNote:
      return WorkerJobWorkflowUploadAttachmentTypeEnum.InternalNote;
    default:
      return WorkerJobWorkflowUploadAttachmentTypeEnum.General;
  }
};

export const WorkerStepDiscussion: React.FC<WorkerStepDiscussionProps> = ({ stepId }) => {
  const { showSuccess, showError } = useSnackbar();
  const [timeline, setTimeline] = useState<StepTimelineItemResponse[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(true);
  const [message, setMessage] = useState('');
  const [postType, setPostType] = useState<string>(StepCommentCreateRequestTypeEnum.General);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [editingAttachment, setEditingAttachment] = useState<StepTimelineItemResponse | null>(null);
  const [savingAttachment, setSavingAttachment] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchTimeline = useCallback(async () => {
    try {
      setLoadingTimeline(true);
      const response = await workerJobWorkflowService.getStepDiscussion(stepId);
      setTimeline(response.data || []);
    } catch {
      setTimeline([]);
    } finally {
      setLoadingTimeline(false);
    }
  }, [stepId]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline]);

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      setSending(true);
      await workerJobWorkflowService.addComment(stepId, {
        content: message.trim(),
        type: postType as StepCommentCreateRequestTypeEnum,
      });
      setMessage('');
      showSuccess('Message sent');
      fetchTimeline();
    } catch {
      showError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
        showError(`Failed to upload: ${failedUploads.join(', ')}. Other attachments uploaded.`);
      } else {
        showError('Failed to upload attachments');
      }

      setIsUploadDialogOpen(false);
      setSelectedFiles([]);
      fetchTimeline();
    } catch {
      showError('Failed to upload attachments');
    } finally {
      setUploading(false);
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
      fetchTimeline();
    } catch (error) {
      console.error('Error updating attachment:', error);
      showError('Failed to update attachment');
    } finally {
      setSavingAttachment(false);
    }
  };

  return (
    <WS.DiscussionContainer>
      <S.ActivityChatContainer>
        <S.ActivityChatHeader>
          <ChatBubbleOutlineIcon fontSize="small" color="primary" />
          <S.ActivityChatHeaderTitle>Discussion</S.ActivityChatHeaderTitle>
        </S.ActivityChatHeader>

        <S.ActivityFeed>
          {loadingTimeline ? (
            <Loader centered minHeight="200px" />
          ) : timeline.length === 0 ? (
            <S.ActivityFeedEmpty>
              <ChatBubbleOutlineIcon sx={{ fontSize: 40, color: 'grey.300' }} />
              No activity yet. Start the discussion!
            </S.ActivityFeedEmpty>
          ) : (
            timeline.map((item) => {
              const typeStyle = getTypeStyle(item.discussionType);
              const isAttachment = item.itemType === 'ATTACHMENT';
              const fileName = extractFileName(item.fileUrl);

              return (
                <S.ActivityMessageRow key={item.id}>
                  <S.ActivityAvatar>
                    {item.actorUsername ? item.actorUsername.slice(0, 2).toUpperCase() : '?'}
                  </S.ActivityAvatar>

                  <S.ActivityMessageContent>
                    <S.ActivityTypeBadge sx={{ backgroundColor: typeStyle.bg, color: typeStyle.color }}>
                      {item.discussionType || 'GENERAL'}
                    </S.ActivityTypeBadge>

                    <S.ActivityBubble>
                      {isAttachment ? (
                        <WS.AttachmentDiscussionBox>
                          {item.fileUrl && isImageAttachment(undefined, fileName) && (
                            <ImagePreview src={item.fileUrl} alt={item.description || fileName} />
                          )}
                          <S.ActivityAttachmentRow>
                            {getFileIcon(fileName)}
                            <S.ActivityAttachmentName title={fileName}>{fileName}</S.ActivityAttachmentName>
                            {item.fileUrl && (
                              <Tooltip title="Download">
                                <MuiIconButton
                                  size="small"
                                  onClick={() => window.open(item.fileUrl, '_blank')}
                                >
                                  <DownloadIcon fontSize="small" />
                                </MuiIconButton>
                              </Tooltip>
                            )}
                            <Tooltip title="Edit description">
                              <MuiIconButton
                                size="small"
                                onClick={() => setEditingAttachment(item)}
                              >
                                <WS.EditIconStyled />
                              </MuiIconButton>
                            </Tooltip>
                          </S.ActivityAttachmentRow>
                          <ExpandableDescription description={item.description} />
                        </WS.AttachmentDiscussionBox>
                      ) : (
                        <S.ActivityBubbleHtml
                          dangerouslySetInnerHTML={{ __html: item.content || item.description || '—' }}
                        />
                      )}
                    </S.ActivityBubble>

                    {item.createdAt && (
                      <S.ActivityTimestamp>
                        {new Date(item.createdAt).toLocaleString()}
                      </S.ActivityTimestamp>
                    )}
                  </S.ActivityMessageContent>
                </S.ActivityMessageRow>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </S.ActivityFeed>

        <S.ActivityInputBar>
          <S.ActivityAvatar>ME</S.ActivityAvatar>

          <TextField
            size="small"
            placeholder="Write a message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            multiline
            maxRows={3}
            sx={{
              flex: 1,
              minWidth: 150,
              '& .MuiOutlinedInput-root': { fontSize: 13, borderRadius: 2 },
            }}
          />

          <WS.TypeSelectFormControl size="small">
            <WS.TypeSelectInput
              value={postType}
              onChange={(e) => setPostType(e.target.value as string)}
              renderValue={(val) => {
                const cfg = POST_TYPES.find((p) => p.value === val) || POST_TYPES[0];
                return (
                  <>
                    <WS.TypeDot dotColor={cfg.dotColor} />
                    {cfg.label}
                  </>
                );
              }}
            >
              {POST_TYPES.map((pt) => (
                <WS.TypeMenuItem key={pt.value} value={pt.value}>
                  <WS.TypeDot dotColor={pt.dotColor} />
                  {pt.label}
                </WS.TypeMenuItem>
              ))}
            </WS.TypeSelectInput>
          </WS.TypeSelectFormControl>

          <Tooltip title={uploading ? 'Uploading...' : 'Attach file'}>
            <span>
              <MuiIconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                sx={{ color: 'text.secondary' }}
              >
                {uploading ? <CircularProgress size={16} /> : <AttachFileIcon fontSize="small" />}
              </MuiIconButton>
            </span>
          </Tooltip>
          <WS.HiddenFileInput
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            multiple
          />

          <Button
            size="small"
            onClick={handleSend}
            disabled={!message.trim() || sending}
            endIcon={<SendIcon fontSize="small" />}
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </S.ActivityInputBar>
      </S.ActivityChatContainer>

      <AttachmentUploadDialog
        open={isUploadDialogOpen}
        files={selectedFiles}
        defaultType={mapPostTypeToAttachmentType(postType) as any}
        allowTypeChange={true}
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
        fileName={extractFileName(editingAttachment?.fileUrl)}
        initialDescription={editingAttachment?.description || ''}
        allowTypeChange={false}
        isSaving={savingAttachment}
        onSave={(newDesc) => handleSaveAttachmentEdit(newDesc)}
        onClose={() => setEditingAttachment(null)}
      />
    </WS.DiscussionContainer>
  );
};
