import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  Tooltip,
  IconButton as MuiIconButton,
  CircularProgress,
  Typography,
} from '@mui/material';
import { StandaloneDropdown } from '../../../../components/Forms/Dropdown';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

import { StepCommentCreateRequestTypeEnum } from '../../../../../workflow-api';
import type {
  JobResponse,
  JobWorkflowStepResponse,
  StepTimelineItemResponse,
} from '../../../../services/api';
import {
  jobWorkflowService,
  stepActivityService,
  UploadAttachmentTypeEnum,
} from '../../../../services/api';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { getUserIdFromToken } from '../../../../utils/jwt';
import { Loader } from '../../../../components/Loader/Loader';
import { Button } from '../../../../components/Button';
import {
  useGlobalModalOuterContext,
  ModalSizes,
} from '../../../../components/GlobalModal';

import { FilterByTypeScreen } from './FilterByTypeScreen';
import * as SS from './StepActivityTab.styles';
import {
  POST_TYPES,
  getStepColor,
  getTypeStyle,
  getAvatarColor,
  getInitials,
  getFileIcon,
  extractFileName,
  fmtTime,
  fmtRelative,
  fmtDateGroup,
} from './StepActivityTab.utils';

// ─── Types ────────────────────────────────────────────────────────────────────

interface StepActivityTabProps {
  job: JobResponse;
}

interface CombinedTimelineItem extends StepTimelineItemResponse {
  stepName: string;
  stepId: number;
  stepOrderIndex: number;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const StepActivityTab: React.FC<StepActivityTabProps> = ({ job }) => {
  const { showSuccess, showError } = useSnackbar();
  const { accessToken } = useAuth();
  const { setGlobalModalOuterProps } = useGlobalModalOuterContext();

  const currentUserId = useMemo(
    () => (accessToken ? getUserIdFromToken(accessToken) : null),
    [accessToken]
  );

  const [loadingWorkflow, setLoadingWorkflow] = useState(true);
  const [steps, setSteps] = useState<JobWorkflowStepResponse[]>([]);
  const [allItems, setAllItems] = useState<CombinedTimelineItem[]>([]);
  const [loadingTimelines, setLoadingTimelines] = useState(false);

  // 'all' shows every step's activity combined; a step ID shows only that step
  const [viewFilter, setViewFilter] = useState<'all' | number>('all');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [postToStepId, setPostToStepId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [postType, setPostType] = useState<string>(StepCommentCreateRequestTypeEnum.General);
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ── Data loading ────────────────────────────────────────────────────────────

  const fetchAllTimelines = useCallback(async (stepsArr: JobWorkflowStepResponse[]) => {
    if (!stepsArr.length) return;
    setLoadingTimelines(true);
    try {
      const results = await Promise.all(
        stepsArr.map(s =>
          s.id
            ? stepActivityService
                .getDiscussionTimeline(s.id)
                .then(r => ({ s, items: (r.data || []) as StepTimelineItemResponse[] }))
            : Promise.resolve({ s, items: [] as StepTimelineItemResponse[] })
        )
      );
      const merged: CombinedTimelineItem[] = results
        .flatMap(({ s, items }) =>
          items.map(item => ({
            ...item,
            stepName: s.name || `Step ${s.orderIndex}`,
            stepId: s.id!,
            stepOrderIndex: s.orderIndex || 0,
          }))
        )
        .sort(
          (a, b) =>
            new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime()
        );
      setAllItems(merged);
    } catch {
      setAllItems([]);
    } finally {
      setLoadingTimelines(false);
    }
  }, []);

  const fetchWorkflow = useCallback(async () => {
    if (!job.id) return;
    setLoadingWorkflow(true);
    try {
      const res = await jobWorkflowService.getJobWorkflowByJobId(job.id);
      const sorted = [...(res.data.steps || [])].sort(
        (a, b) => (a.orderIndex || 0) - (b.orderIndex || 0)
      );
      setSteps(sorted);
      if (sorted.length && sorted[0].id) setPostToStepId(sorted[0].id);
      fetchAllTimelines(sorted);
    } catch {
      setSteps([]);
    } finally {
      setLoadingWorkflow(false);
    }
  }, [job.id, fetchAllTimelines]);

  useEffect(() => { fetchWorkflow(); }, [fetchWorkflow]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [allItems]);

  // ── Derived state ───────────────────────────────────────────────────────────

  const visibleItems = useMemo(() => {
    let items = allItems;
    if (viewFilter !== 'all') items = items.filter(i => i.stepId === viewFilter);
    if (activeFilters.length)
      items = items.filter(i =>
        activeFilters.includes((i.discussionType as string) || 'GENERAL')
      );
    return items;
  }, [allItems, viewFilter, activeFilters]);

  const activeStepIdx = viewFilter !== 'all' ? steps.findIndex(s => s.id === viewFilter) : -1;
  const activeStepObj = activeStepIdx >= 0 ? steps[activeStepIdx] : null;

  const participants = useMemo(() => {
    const set = new Set(visibleItems.map(i => i.actorUsername).filter(Boolean));
    return [...set];
  }, [visibleItems]);

  const lastReply = visibleItems.at(-1)?.createdAt;

  const countByStep = useMemo(() => {
    const map: Record<number, number> = {};
    allItems.forEach(i => { map[i.stepId] = (map[i.stepId] || 0) + 1; });
    return map;
  }, [allItems]);

  const stepOptions = useMemo(
    () => steps.map((s, i) => ({ value: s.id!, label: `${i + 1}. ${s.name || `Step ${i + 1}`}` })),
    [steps]
  );

  const typeOptions = useMemo(
    () => POST_TYPES.map(pt => ({ value: pt.value, label: pt.label })),
    []
  );

  // ── Actions ─────────────────────────────────────────────────────────────────

  const handleSend = async () => {
    if (!postToStepId || !message.trim()) return;
    setSending(true);
    try {
      await stepActivityService.addComment(postToStepId, {
        content: message.trim(),
        type: postType as StepCommentCreateRequestTypeEnum,
      });
      setMessage('');
      showSuccess('Message sent');
      fetchAllTimelines(steps);
    } catch {
      showError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !postToStepId) return;
    setUploading(true);
    try {
      await stepActivityService.uploadAttachment(
        postToStepId, file, postType as UploadAttachmentTypeEnum
      );
      showSuccess('Attachment uploaded');
      fetchAllTimelines(steps);
    } catch {
      showError('Failed to upload attachment');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleOpenFilter = () => {
    setGlobalModalOuterProps({
      isOpen: true,
      fieldName: 'stepActivityFilter',
      size: ModalSizes.SMALL,
      children: (
        <FilterByTypeScreen
          activeFilters={activeFilters}
          onApply={filters => setActiveFilters(filters)}
          onClearAll={() => setActiveFilters([])}
        />
      ),
    });
  };

  // ── Feed renderer ───────────────────────────────────────────────────────────

  const renderFeed = () => {
    if (loadingTimelines) {
      return (
        <SS.EmptyFeedBox>
          <CircularProgress size={32} />
        </SS.EmptyFeedBox>
      );
    }

    if (!visibleItems.length) {
      return (
        <SS.EmptyFeedBox>
          <ChatBubbleOutlineIcon sx={{ fontSize: 48, color: 'grey.200' }} />
          <Typography fontSize={14} color="text.secondary">
            No activity yet. Start the discussion!
          </Typography>
        </SS.EmptyFeedBox>
      );
    }

    const nodes: React.ReactNode[] = [];
    let lastGroup = '';

    visibleItems.forEach((item, idx) => {
      const grp = fmtDateGroup(item.createdAt);
      if (grp !== lastGroup) {
        lastGroup = grp;
        nodes.push(
          <SS.DateGroupDivider key={`d-${idx}`}>
            <SS.DateGroupLine />
            <SS.DateGroupText>{grp}</SS.DateGroupText>
            <SS.DateGroupLine />
          </SS.DateGroupDivider>
        );
      }

      const isMine = !!(currentUserId && item.actorId === currentUserId);
      const isAttachment = item.itemType === 'ATTACHMENT';
      const fileName = extractFileName(item.fileUrl);
      const ts = getTypeStyle(item.discussionType as string);

      nodes.push(
        <SS.MessageRow key={`${item.stepId}-${item.id}-${idx}`} isMine={isMine}>
          <SS.MessageAvatarCircle avatarColor={getAvatarColor(item.actorUsername)}>
            {getInitials(item.actorUsername)}
          </SS.MessageAvatarCircle>

          <SS.MessageContentBox isMine={isMine}>
            <SS.MessageMetaRow isMine={isMine}>
              <SS.MessageSenderName>{item.actorUsername || 'Unknown'}</SS.MessageSenderName>
              <SS.MessageTimeText>{fmtTime(item.createdAt)}</SS.MessageTimeText>
              {viewFilter === 'all' && (
                <SS.MessageStepBadge>
                  {item.stepOrderIndex}. {item.stepName}
                </SS.MessageStepBadge>
              )}
              <SS.MessageTypeBadge typeBg={ts.bg} typeText={ts.text}>
                {item.discussionType || 'GENERAL'}
              </SS.MessageTypeBadge>
            </SS.MessageMetaRow>

            <SS.MessageBubble isMine={isMine}>
              {isAttachment ? (
                <SS.AttachmentRow>
                  {getFileIcon(fileName)}
                  <SS.AttachmentFileName isMine={isMine}>{fileName}</SS.AttachmentFileName>
                  {item.fileUrl && (
                    <Tooltip title="Download">
                      <MuiIconButton
                        size="small"
                        onClick={() => window.open(item.fileUrl, '_blank')}
                        sx={{ color: isMine ? 'rgba(255,255,255,0.8)' : 'text.secondary' }}
                      >
                        <DownloadIcon fontSize="small" />
                      </MuiIconButton>
                    </Tooltip>
                  )}
                </SS.AttachmentRow>
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: item.content || item.description || '—',
                  }}
                />
              )}
            </SS.MessageBubble>
          </SS.MessageContentBox>
        </SS.MessageRow>
      );
    });

    return nodes;
  };

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (loadingWorkflow) return <Loader centered minHeight="300px" />;

  if (!steps.length) {
    return (
      <SS.EmptyFeedBox sx={{ minHeight: 300 }}>
        <Typography color="text.secondary" fontSize={14}>
          No workflow steps found for this job.
        </Typography>
      </SS.EmptyFeedBox>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      <SS.StepActivityLayout>
        {/* ── Left: Steps panel ──────────────────────────────────────── */}
        <SS.StepsSidebar>
          <SS.StepsSidebarHeader>
            <SS.StepsSidebarTitle>Steps</SS.StepsSidebarTitle>
            <SS.StepsCountBadge>{steps.length}</SS.StepsCountBadge>
          </SS.StepsSidebarHeader>

          <SS.StepsScrollArea>
            {/* All Steps row */}
            <SS.StepRowItem isActive={viewFilter === 'all'} onClick={() => setViewFilter('all')}>
              <SS.StepCircleIcon
                circleColor={viewFilter === 'all' ? undefined : undefined}
              >
                <ChatBubbleOutlineIcon sx={{ fontSize: 14 }} />
              </SS.StepCircleIcon>
              <SS.StepTextGroup>
                <SS.StepNameText isActive={viewFilter === 'all'}>All Steps</SS.StepNameText>
                <SS.StepStatusText>{allItems.length} messages</SS.StepStatusText>
              </SS.StepTextGroup>
            </SS.StepRowItem>

            {/* Individual step rows */}
            {steps.map((step, idx) => {
              const isActive = viewFilter === step.id;
              const cnt = countByStep[step.id!] || 0;
              const status = (step as Record<string, unknown>).status as string | undefined;
              return (
                <SS.StepRowItem
                  key={step.id}
                  isActive={isActive}
                  onClick={() => step.id && setViewFilter(step.id)}
                >
                  <SS.StepCircleIcon circleColor={getStepColor(idx)}>
                    {idx + 1}
                  </SS.StepCircleIcon>
                  <SS.StepTextGroup>
                    <SS.StepNameText isActive={isActive}>
                      {step.name || `Step ${idx + 1}`}
                    </SS.StepNameText>
                    {status && <SS.StepStatusText>{status}</SS.StepStatusText>}
                  </SS.StepTextGroup>
                  {cnt > 0 && (
                    <SS.StepItemCountBadge isActive={isActive}>{cnt}</SS.StepItemCountBadge>
                  )}
                </SS.StepRowItem>
              );
            })}
          </SS.StepsScrollArea>
        </SS.StepsSidebar>

        {/* ── Right: Chat panel ──────────────────────────────────────── */}
        <SS.ChatPanel>
          {/* Header */}
          <SS.ChatPanelHeader>
            <SS.ChatPanelHeaderLeft>
              <SS.ChatHeaderCircle
                circleColor={activeStepIdx >= 0 ? getStepColor(activeStepIdx) : undefined}
              >
                {activeStepIdx >= 0 ? (
                  activeStepIdx + 1
                ) : (
                  <ChatBubbleOutlineIcon sx={{ fontSize: 15 }} />
                )}
              </SS.ChatHeaderCircle>
              <div>
                <SS.ChatPanelTitle>
                  {viewFilter === 'all'
                    ? 'All Step Activities'
                    : `${activeStepObj?.name ?? 'Step'} · discussion`}
                </SS.ChatPanelTitle>
                {(participants.length > 0 || lastReply) && (
                  <SS.ChatPanelMeta>
                    {participants.length > 0 &&
                      `${participants.length} participant${participants.length !== 1 ? 's' : ''}`}
                    {participants.length > 0 && lastReply && ' · '}
                    {lastReply && `last reply ${fmtRelative(lastReply)}`}
                  </SS.ChatPanelMeta>
                )}
              </div>
            </SS.ChatPanelHeaderLeft>

            <SS.ChatPanelHeaderRight>
              <Button
                variant="outlined"
                size="small"
                startIcon={<FilterListIcon />}
                onClick={handleOpenFilter}
              >
                Filter{activeFilters.length > 0 && ` (${activeFilters.length})`}
              </Button>
            </SS.ChatPanelHeaderRight>
          </SS.ChatPanelHeader>

          {/* Messages */}
          <SS.MessagesArea>
            {renderFeed()}
            <div ref={messagesEndRef} />
          </SS.MessagesArea>

          {/* Input area */}
          <SS.InputAreaWrapper>
            <SS.InputToolbar>
              <SS.ToolbarActionButton
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading || !postToStepId}
              >
                {uploading ? (
                  <CircularProgress size={14} />
                ) : (
                  <AttachFileIcon sx={{ fontSize: 16 }} />
                )}
                Attach
              </SS.ToolbarActionButton>

              <SS.ToolbarSelectGroup>
                <StandaloneDropdown
                  name="postToStep"
                  label="Post to Step"
                  preFetchedOptions={stepOptions}
                  defaultValue={stepOptions[0] as unknown as string}
                  onChange={v => setPostToStepId(v as number)}
                  disableClearable
                  size="medium"
                />
                <StandaloneDropdown
                  name="postType"
                  label="Type"
                  preFetchedOptions={typeOptions}
                  defaultValue={typeOptions[0] as unknown as string}
                  onChange={v => setPostType(v as string)}
                  disableClearable
                  size="medium"
                />
              </SS.ToolbarSelectGroup>
            </SS.InputToolbar>

            <SS.InputRow>
              <SS.MessageTextField
                size="small"
                placeholder="Reply to the team..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                multiline
                maxRows={4}
                fullWidth
              />
              <Button
                size="medium"
                onClick={handleSend}
                disabled={!message.trim() || sending || !postToStepId}
                endIcon={<SendIcon />}
                sx={{ flexShrink: 0, borderRadius: '10px', height: 40, px: 2.5 }}
              >
                {sending ? 'Sending…' : 'Send'}
              </Button>
            </SS.InputRow>
          </SS.InputAreaWrapper>
        </SS.ChatPanel>
      </SS.StepActivityLayout>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
    </>
  );
};
