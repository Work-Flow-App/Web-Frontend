import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  Tooltip,
  CircularProgress,
  Typography,
} from '@mui/material';
import { StandaloneDropdown } from '../../../../../components/UI/Forms/Dropdown';
import SendIcon from '@mui/icons-material/Send';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';

import { StepCommentCreateRequestTypeEnum } from '../../../../../../workflow-api';
import type {
  JobResponse,
  JobWorkflowStepResponse,
  StepTimelineItemResponse,
} from '../../../../../services/api';
import {
  jobWorkflowService,
  stepActivityService,
  UploadAttachmentTypeEnum,
} from '../../../../../services/api';
import { useSnackbar } from '../../../../../contexts/SnackbarContext';
import { useAuth } from '../../../../../contexts/AuthContext';
import { getUserIdFromToken } from '../../../../../utils/jwt';
import { Loader } from '../../../../../components/UI/Loader/Loader';
import { Button } from '../../../../../components/UI/Button';
import {
  useGlobalModalOuterContext,
  ModalSizes,
} from '../../../../../components/UI/GlobalModal';
import { rem } from '../../../../../components/UI/Typography/utility';

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

  const [selectedPostToStepId, setSelectedPostToStepId] = useState<number | null>(null);

  // ── Edit / delete state ──────────────────────────────────────────────────────
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // When viewFilter changes: if a specific step is selected, lock target step to viewFilter.
  // When 'all' is selected, use selectedPostToStepId (or default to first step).
  const postToStepId = useMemo(() => {
    if (viewFilter !== 'all') return viewFilter;
    if (selectedPostToStepId !== null) return selectedPostToStepId;
    return steps.length > 0 && steps[0].id ? steps[0].id : null;
  }, [viewFilter, selectedPostToStepId, steps]);

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
      const sorted = [...(res.data.steps || [])]
        .filter((step) => step.status?.toUpperCase() !== 'SKIPPED')
        .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
      setSteps(sorted);
      if (sorted.length && sorted[0].id) {
        setSelectedPostToStepId(sorted[0].id);
      }
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

  // ── Edit / delete handlers ──────────────────────────────────────────────────

  const startEdit = (item: CombinedTimelineItem) => {
    setEditingId(item.id ?? null);
    setEditingContent(item.content || '');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingContent('');
  };

  const saveEdit = async () => {
    if (!editingId || !editingContent.trim()) return;
    setSavingEdit(true);
    try {
      await stepActivityService.updateComment(editingId, {
        content: editingContent.trim(),
        type: postType as StepCommentCreateRequestTypeEnum,
      });
      showSuccess('Message updated');
      cancelEdit();
      fetchAllTimelines(steps);
    } catch {
      showError('Failed to update message');
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDelete = async (item: CombinedTimelineItem) => {
    if (!item.id) return;
    setDeletingId(item.id);
    try {
      await stepActivityService.deleteComment(item.id);
      showSuccess('Message deleted');
      fetchAllTimelines(steps);
    } catch {
      showError('Failed to delete message');
    } finally {
      setDeletingId(null);
    }
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
          <SS.EmptyFeedIcon />
          <Typography fontSize={rem(14)} color="text.secondary">
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
      const isComment = item.itemType === 'COMMENT' || !isAttachment;
      const isEditing = editingId === item.id;
      const isDeleting = deletingId === item.id;
      const fileName = extractFileName(item.fileUrl);
      const ts = getTypeStyle(item.discussionType as string);

      nodes.push(
        <SS.MessageRowWithActions key={`${item.stepId}-${item.id}-${idx}`} isMine={isMine}>
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

            {isEditing ? (
              /* ── Inline edit mode ─────────────────────────────────── */
              <SS.MessageEditInputRow>
                <SS.MessageEditTextField
                  size="small"
                  value={editingContent}
                  onChange={e => setEditingContent(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
                    if (e.key === 'Escape') cancelEdit();
                  }}
                  multiline
                  maxRows={4}
                  autoFocus
                  fullWidth
                />
                <SS.MessageEditActions>
                  <Tooltip title="Save (Enter)">
                    <SS.MessageEditIconBtn onClick={saveEdit} disabled={savingEdit}>
                      {savingEdit
                        ? <CircularProgress size={12} />
                        : <SS.CheckIconStyled />}
                    </SS.MessageEditIconBtn>
                  </Tooltip>
                  <Tooltip title="Cancel (Esc)">
                    <SS.MessageEditIconBtn onClick={cancelEdit} disabled={savingEdit}>
                      <SS.CloseIconStyled />
                    </SS.MessageEditIconBtn>
                  </Tooltip>
                </SS.MessageEditActions>
              </SS.MessageEditInputRow>
            ) : (
              /* ── Normal display mode ──────────────────────────────── */
              <SS.MessageBubble isMine={isMine}>
                {isAttachment ? (
                  <SS.AttachmentRow>
                    {getFileIcon(fileName)}
                    <SS.AttachmentFileName isMine={isMine}>{fileName}</SS.AttachmentFileName>
                    {item.fileUrl && (
                      <Tooltip title="Download">
                        <SS.DownloadIconButton
                          size="small"
                          onClick={() => window.open(item.fileUrl, '_blank')}
                          isMine={isMine}
                        >
                          <DownloadIcon fontSize="small" />
                        </SS.DownloadIconButton>
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
            )}
          </SS.MessageContentBox>

          {/* ── Edit / Delete action buttons (visible on row hover) ── */}
          {isComment && !isEditing && (
            <SS.MessageActionGroup className="msg-action-group">
              <Tooltip title="Edit message">
                <SS.MessageEditIconBtn onClick={() => startEdit(item)}>
                  <SS.MessageEditIcon />
                </SS.MessageEditIconBtn>
              </Tooltip>
              <Tooltip title="Delete message">
                <SS.MessageDeleteIconBtn
                  onClick={() => handleDelete(item)}
                  disabled={isDeleting}
                >
                  {isDeleting
                    ? <CircularProgress size={12} color="error" />
                    : <SS.MessageDeleteIcon />}
                </SS.MessageDeleteIconBtn>
              </Tooltip>
            </SS.MessageActionGroup>
          )}
        </SS.MessageRowWithActions>
      );
    });

    return nodes;
  };

  // ── Guards ──────────────────────────────────────────────────────────────────

  if (loadingWorkflow) return <Loader centered minHeight="300px" />;

  if (!steps.length) {
    return (
      <SS.ActivityEmptyFeedBox>
        <Typography color="text.secondary" fontSize={rem(14)}>
          No workflow steps found for this job.
        </Typography>
      </SS.ActivityEmptyFeedBox>
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
                <SS.SidebarEmptyIcon />
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
                  <SS.HeaderEmptyIcon />
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
                  <SS.AttachIconStyled />
                )}
                Attach
              </SS.ToolbarActionButton>

              <SS.ToolbarSelectGroup>
                {viewFilter === 'all' && (
                  <StandaloneDropdown
                    name="postToStep"
                    label="Post to Step"
                    preFetchedOptions={stepOptions}
                    defaultValue={
                      postToStepId
                        ? (stepOptions.find(o => o.value === postToStepId) as unknown as string)
                        : (stepOptions[0] as unknown as string)
                    }
                    onChange={v => setSelectedPostToStepId(v as number)}
                    disableClearable
                    size="medium"
                  />
                )}
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
              <SS.SendButton
                size="medium"
                onClick={handleSend}
                disabled={!message.trim() || sending || !postToStepId}
                endIcon={<SendIcon />}
              >
                {sending ? 'Sending…' : 'Send'}
              </SS.SendButton>
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
