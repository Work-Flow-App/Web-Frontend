import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  TextField,
  Tooltip,
  Typography,
  IconButton as MuiIconButton,
  CircularProgress,
  Box,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DownloadIcon from '@mui/icons-material/Download';
import { StepCommentCreateRequestTypeEnum } from '../../../../../../workflow-api';
import type { JobResponse, JobWorkflowStepResponse, StepTimelineItemResponse } from '../../../../../services/api';
import { jobWorkflowService, stepActivityService, UploadAttachment1TypeEnum } from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import * as S from '../../../JobDetailsPage.styles';

interface StepActivityTabProps {
  job: JobResponse;
}

const POST_TYPES = [
  { value: StepCommentCreateRequestTypeEnum.General, label: 'GENERAL' },
  { value: StepCommentCreateRequestTypeEnum.Additional, label: 'ADDITIONAL' },
  { value: StepCommentCreateRequestTypeEnum.Complaint, label: 'COMPLAINT' },
  { value: StepCommentCreateRequestTypeEnum.InternalNote, label: 'INTERNAL NOTE' },
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

export const StepActivityTab: React.FC<StepActivityTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [steps, setSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [selectedStepId, setSelectedStepId] = useState<number | null>(null);
  const [timeline, setTimeline] = useState<StepTimelineItemResponse[]>([]);
  const [loadingTimeline, setLoadingTimeline] = useState(false);
  const [message, setMessage] = useState('');
  const [postType, setPostType] = useState<string>(StepCommentCreateRequestTypeEnum.General);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchWorkflow = useCallback(async () => {
    if (!job.id) return;
    try {
      setLoadingWorkflow(true);
      const response = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const sorted = [...(response.data.steps || [])].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );
      setSteps(sorted);
      if (sorted.length > 0 && sorted[0].id) {
        setSelectedStepId(sorted[0].id);
      }
    } catch {
      setSteps([]);
    } finally {
      setLoadingWorkflow(false);
    }
  }, [job.id]);

  const fetchTimeline = useCallback(async () => {
    if (!selectedStepId) return;
    try {
      setLoadingTimeline(true);
      const response = await stepActivityService.getDiscussionTimeline(selectedStepId);
      setTimeline(response.data || []);
    } catch {
      setTimeline([]);
    } finally {
      setLoadingTimeline(false);
    }
  }, [selectedStepId]);

  useEffect(() => {
    fetchWorkflow();
  }, [fetchWorkflow]);

  useEffect(() => {
    fetchTimeline();
  }, [fetchTimeline]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [timeline]);

  const handleSend = async () => {
    if (!selectedStepId || !message.trim()) return;
    try {
      setSending(true);
      await stepActivityService.addComment(selectedStepId, {
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedStepId) return;
    try {
      setUploading(true);
      await stepActivityService.uploadAttachment(
        selectedStepId,
        file,
        postType as UploadAttachment1TypeEnum
      );
      showSuccess('Attachment uploaded');
      fetchTimeline();
    } catch {
      showError('Failed to upload attachment');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const selectedStep = steps.find((s) => s.id === selectedStepId);

  if (loadingWorkflow) {
    return <Loader centered minHeight="300px" />;
  }

  if (steps.length === 0) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
        <Typography color="text.secondary" fontSize={14}>
          No workflow steps found for this job.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Step selector chips */}
      <S.StepChipsRow>
        {steps.map((step, idx) => (
          <S.StepChip
            key={step.id}
            active={selectedStepId === step.id}
            onClick={() => step.id && setSelectedStepId(step.id)}
          >
            {idx + 1}. {step.name || `Step ${idx + 1}`}
          </S.StepChip>
        ))}
      </S.StepChipsRow>

      {/* Chat container */}
      <S.ActivityChatContainer>
        {/* Step header */}
        <S.ActivityChatHeader>
          <ChatBubbleOutlineIcon fontSize="small" color="primary" />
          <S.ActivityChatHeaderTitle>
            {selectedStep?.name || 'Activity'}
          </S.ActivityChatHeaderTitle>
        </S.ActivityChatHeader>

        {/* Messages feed */}
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
                    {item.actorId ? String(item.actorId).slice(0, 2) : '?'}
                  </S.ActivityAvatar>

                  <S.ActivityMessageContent>
                    <S.ActivityTypeBadge sx={{ backgroundColor: typeStyle.bg, color: typeStyle.color }}>
                      {item.discussionType || 'GENERAL'}
                    </S.ActivityTypeBadge>

                    <S.ActivityBubble>
                      {isAttachment ? (
                        <S.ActivityAttachmentRow>
                          {getFileIcon(fileName)}
                          <S.ActivityAttachmentName>{fileName}</S.ActivityAttachmentName>
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
                        </S.ActivityAttachmentRow>
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

        {/* Input area */}
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

          <FormControl size="small" sx={{ minWidth: 130, flexShrink: 0 }}>
            <InputLabel sx={{ fontSize: 12 }}>Post Type</InputLabel>
            <Select
              value={postType}
              onChange={(e) => setPostType(e.target.value as string)}
              label="Post Type"
              sx={{ fontSize: 12 }}
            >
              {POST_TYPES.map((pt) => (
                <MenuItem key={pt.value} value={pt.value} sx={{ fontSize: 12 }}>
                  {pt.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Tooltip title={uploading ? 'Uploading...' : 'Attach file'}>
            <span>
              <MuiIconButton
                size="small"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !selectedStepId}
                sx={{ color: 'text.secondary' }}
              >
                {uploading ? <CircularProgress size={16} /> : <AttachFileIcon fontSize="small" />}
              </MuiIconButton>
            </span>
          </Tooltip>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />

          <Button
            size="small"
            onClick={handleSend}
            disabled={!message.trim() || sending || !selectedStepId}
            endIcon={<SendIcon fontSize="small" />}
          >
            {sending ? 'Sending...' : 'Send'}
          </Button>
        </S.ActivityInputBar>
      </S.ActivityChatContainer>
    </Box>
  );
};
