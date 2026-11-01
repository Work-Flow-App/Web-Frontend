import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CircularProgress } from '@mui/material';
import AddAPhotoOutlinedIcon from '@mui/icons-material/AddAPhotoOutlined';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import { Button } from '../../../../components/UI/Button';
import { Loader } from '../../../../components/UI/Loader/Loader';
import { VoiceInputSheet } from '../../../../components/UI/VoiceInputSheet';
import { useSnackbar } from '../../../../contexts/SnackbarContext';
import type { StepAttachmentResponse, StepCommentResponse } from '../../../../services/api';
import { describeWork, isDescribeWorkAvailable } from '../../../../services/ai/describeWork';
import { tidyTextHandler } from '../../../../services/ai/tidyText';
import * as SPage from '../../JobDetailsPage.styles';
import {
  AFTER_PHOTO,
  BEFORE_PHOTO,
  buildWriteUpComment,
  findSavedWriteUp,
  formatDuration,
  formatPhotoTime,
  splitAttachments,
} from './BeforeAfterPhotos.utils';
import type { BeforeAfterPhotosApi } from './BeforeAfterPhotos.api';
import * as S from './BeforeAfterPhotos.styles';

type PhotoKind = 'before' | 'after';

const PHOTO_DESCRIPTIONS: Record<PhotoKind, string> = { before: BEFORE_PHOTO, after: AFTER_PHOTO };

interface PhotoSlotProps {
  label: string;
  timeLabel: string;
  photo?: StepAttachmentResponse;
  emptyHint: string;
  busy: boolean;
  disabled: boolean;
  onPick: () => void;
  onRemove?: () => void;
}

const PhotoSlot: React.FC<PhotoSlotProps> = ({ label, timeLabel, photo, emptyHint, busy, disabled, onPick, onRemove }) => (
  <S.Slot>
    <S.SlotHeader>
      <S.SlotLabel>{label}</S.SlotLabel>
      {photo && (
        <S.SlotActions>
          <SPage.EventNoteEditButton onClick={onPick} disabled={disabled}>
            Replace
          </SPage.EventNoteEditButton>
          {onRemove && (
            <SPage.EventNoteEditButton className="delete" onClick={onRemove} disabled={disabled}>
              Remove
            </SPage.EventNoteEditButton>
          )}
        </S.SlotActions>
      )}
    </S.SlotHeader>
    {photo ? (
      <>
        <S.PhotoFrame href={photo.fileUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${label.toLowerCase()} photo`}>
          <S.Photo src={photo.fileUrl} alt={`${label} photo`} />
          {busy && (
            <S.BusyOverlay>
              <CircularProgress size={22} />
            </S.BusyOverlay>
          )}
        </S.PhotoFrame>
        <S.PhotoTime>
          <strong>{timeLabel}:</strong> {formatPhotoTime(photo.createdAt)}
        </S.PhotoTime>
      </>
    ) : (
      <S.PhotoDropzone type="button" onClick={onPick} disabled={disabled}>
        {busy ? <CircularProgress size={22} /> : <AddAPhotoOutlinedIcon />}
        {busy ? 'Uploading...' : emptyHint}
      </S.PhotoDropzone>
    )}
  </S.Slot>
);

interface BeforeAfterPhotosProps {
  stepId: number;
  stepName?: string;
  api: BeforeAfterPhotosApi;
  /** The step's current before and after photos, from `splitAttachments`. */
  before?: StepAttachmentResponse;
  after?: StepAttachmentResponse;
  /** Reloads the step's attachments after a photo changes; resolves with the new list, or null if it failed. */
  reloadAttachments: () => Promise<StepAttachmentResponse[] | null>;
  /** Change it to reload the saved write-up, e.g. after the step's comments change elsewhere on the page. */
  refreshKey?: number;
  /** Called after a photo or the write-up is saved. */
  onUpdate?: () => void;
}

/**
 * Before and after photo slots for a step's attachments, with an AI write-up of the work the photos show that the
 * user reviews, edits and submits as a step comment. The photos' upload times log when the work started and finished.
 */
export const BeforeAfterPhotos: React.FC<BeforeAfterPhotosProps> = ({
  stepId,
  stepName,
  api,
  before,
  after,
  reloadAttachments,
  refreshKey,
  onUpdate,
}) => {
  const { showSuccess, showError } = useSnackbar();
  const [comments, setComments] = useState<StepCommentResponse[] | null>(null);
  const [busyPhoto, setBusyPhoto] = useState<PhotoKind | null>(null);
  // The write-up being reviewed, from the AI or typed by the user; null until there is one.
  const [draft, setDraft] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pickingRef = useRef<PhotoKind>('before');
  // Photos picked in this session, by attachment id, so the AI can read them without downloading them again.
  const localFilesRef = useRef(new Map<number, File>());
  const generateAbortRef = useRef<AbortController | null>(null);

  const loadComments = useCallback(async () => {
    try {
      setComments(await api.getComments(stepId));
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  }, [api, stepId]);

  useEffect(() => {
    loadComments();
  }, [loadComments, refreshKey]);

  useEffect(() => () => generateAbortRef.current?.abort(), []);

  const savedWriteUp = before && after && comments ? findSavedWriteUp(comments, before.createdAt, after.createdAt) : null;
  const duration = formatDuration(before?.createdAt, after?.createdAt);
  const busy = busyPhoto !== null || generating || submitting;

  const toWorkPhoto = (photo: StepAttachmentResponse) => ({
    file: photo.id ? localFilesRef.current.get(photo.id) : undefined,
    url: photo.fileUrl,
  });

  const generate = async (beforePhoto: StepAttachmentResponse, afterPhoto: StepAttachmentResponse) => {
    generateAbortRef.current?.abort();
    const controller = new AbortController();
    generateAbortRef.current = controller;
    setAiError(null);
    setGenerating(true);
    try {
      const text = await describeWork(toWorkPhoto(beforePhoto), toWorkPhoto(afterPhoto), {
        context: stepName,
        signal: controller.signal,
      });
      if (!controller.signal.aborted) setDraft(text);
    } catch (error) {
      if (!controller.signal.aborted) {
        setAiError(error instanceof Error ? error.message : "The AI couldn't summarise these photos.");
      }
    } finally {
      if (generateAbortRef.current === controller) {
        generateAbortRef.current = null;
        setGenerating(false);
      }
    }
  };

  // A changed photo makes any draft out of date.
  const resetDraft = () => {
    generateAbortRef.current?.abort();
    setDraft(null);
    setAiError(null);
  };

  const handlePick = (kind: PhotoKind) => {
    pickingRef.current = kind;
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;

    const kind = pickingRef.current;
    setBusyPhoto(kind);
    let nextAttachments: StepAttachmentResponse[] | null;
    try {
      const uploaded = await api.uploadPhoto(stepId, file, PHOTO_DESCRIPTIONS[kind]);
      if (uploaded.id) localFilesRef.current.set(uploaded.id, file);
      showSuccess(`${PHOTO_DESCRIPTIONS[kind]} added`);
      onUpdate?.();
      nextAttachments = await reloadAttachments();
    } catch (error) {
      console.error(`Error uploading ${kind} photo:`, error);
      showError(`Failed to upload the ${kind} photo`);
      return;
    } finally {
      setBusyPhoto(null);
    }

    resetDraft();
    const next = nextAttachments && splitAttachments(nextAttachments);
    // Write up the work as soon as both photos are in.
    if (next?.before && next.after && isDescribeWorkAvailable) generate(next.before, next.after);
  };

  const handleRemove = async (kind: PhotoKind, photo: StepAttachmentResponse) => {
    if (!api.deletePhoto || !photo.id) return;
    setBusyPhoto(kind);
    try {
      await api.deletePhoto(photo.id);
      showSuccess(`${PHOTO_DESCRIPTIONS[kind]} removed`);
      resetDraft();
      onUpdate?.();
      await reloadAttachments();
    } catch (error) {
      console.error(`Error removing ${kind} photo:`, error);
      showError(`Failed to remove the ${kind} photo`);
    } finally {
      setBusyPhoto(null);
    }
  };

  const handleEditorSubmit = async (text: string) => {
    setDraft(text);
    setAiError(null);
    return true;
  };

  const handleSubmit = async () => {
    if (!before || !after || !draft?.trim()) return;
    setSubmitting(true);
    try {
      await api.addComment(stepId, buildWriteUpComment(before.createdAt, after.createdAt, draft));
      await loadComments();
      setDraft(null);
      showSuccess('Work carried out saved');
      onUpdate?.();
    } catch (error) {
      console.error('Error saving the work carried out:', error);
      showError('Failed to save the work carried out');
    } finally {
      setSubmitting(false);
    }
  };

  const renderWriteUp = () => {
    if (!before || !after) return null;

    let body: React.ReactNode;
    if (comments === null) {
      body = <Loader size={18} centered minHeight="40px" />;
    } else if (savedWriteUp !== null) {
      body = (
        <>
          <S.WriteUpText>{savedWriteUp}</S.WriteUpText>
          <S.WriteUpNote>Saved to the step's comments.</S.WriteUpNote>
        </>
      );
    } else if (generating) {
      body = (
        <S.StatusRow role="status">
          <CircularProgress size={16} />
          Analysing photos... WorkFloow AI is writing up the work.
        </S.StatusRow>
      );
    } else if (draft !== null) {
      body = (
        <>
          <S.WriteUpNote>Check the write-up and edit it if needed, then submit it.</S.WriteUpNote>
          <S.WriteUpText>{draft}</S.WriteUpText>
          <S.ActionsRow>
            {isDescribeWorkAvailable && (
              <Button variant="text" size="small" onClick={() => generate(before, after)} disabled={busy}>
                Regenerate
              </Button>
            )}
            <Button variant="outlined" size="small" onClick={() => setEditorOpen(true)} disabled={busy}>
              Edit
            </Button>
            <Button size="small" onClick={handleSubmit} disabled={busy || !draft.trim()} loading={submitting}>
              Submit
            </Button>
          </S.ActionsRow>
        </>
      );
    } else {
      body = (
        <>
          {aiError ? (
            <S.ErrorText role="alert">{aiError}</S.ErrorText>
          ) : (
            <S.WriteUpNote>
              {isDescribeWorkAvailable
                ? 'Let WorkFloow AI describe the work from the photos, or write it yourself.'
                : 'Describe the work carried out.'}
            </S.WriteUpNote>
          )}
          <S.ActionsRow>
            <Button variant="outlined" size="small" onClick={() => setEditorOpen(true)} disabled={busy}>
              Write it yourself
            </Button>
            {isDescribeWorkAvailable && (
              <Button size="small" startIcon={<AutoAwesomeIcon />} onClick={() => generate(before, after)} disabled={busy}>
                {aiError ? 'Try again' : 'Write up with AI'}
              </Button>
            )}
          </S.ActionsRow>
        </>
      );
    }

    return (
      <S.WriteUpCard>
        <S.WriteUpHeader>
          <S.WriteUpTitle>
            <AutoAwesomeIcon />
            Work carried out
          </S.WriteUpTitle>
          {duration && <S.DurationChip>Total time: {duration}</S.DurationChip>}
        </S.WriteUpHeader>
        {body}
      </S.WriteUpCard>
    );
  };

  return (
    // Keep clicks, including ones in the edit sheet's portal, from reaching the step row around the section.
    <S.Root onClick={(e) => e.stopPropagation()}>
      <S.HiddenInput type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} />
      <S.PhotoGrid>
        <PhotoSlot
          label="Before"
          timeLabel="Started"
          photo={before}
          emptyHint="Add a photo before starting work"
          busy={busyPhoto === 'before'}
          disabled={busy}
          onPick={() => handlePick('before')}
          onRemove={api.deletePhoto && before ? () => handleRemove('before', before) : undefined}
        />
        <PhotoSlot
          label="After"
          timeLabel="Finished"
          photo={after}
          emptyHint={before ? 'Add a photo when the work is finished' : 'Add the before photo first'}
          busy={busyPhoto === 'after'}
          disabled={busy || (!before && !after)}
          onPick={() => handlePick('after')}
          onRemove={api.deletePhoto && after ? () => handleRemove('after', after) : undefined}
        />
      </S.PhotoGrid>
      {renderWriteUp()}

      <VoiceInputSheet
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        title="Work carried out"
        subtitle={stepName}
        placeholder="Describe the work carried out..."
        submitLabel="Save changes"
        initialText={draft ?? ''}
        onSubmit={handleEditorSubmit}
        onTidy={tidyTextHandler(stepName)}
      />
    </S.Root>
  );
};
