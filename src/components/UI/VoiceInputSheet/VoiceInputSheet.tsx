import React, { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { CircularProgress, IconButton } from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CloseIcon from '@mui/icons-material/Close';
import MicIcon from '@mui/icons-material/Mic';
import KeyboardOutlinedIcon from '@mui/icons-material/KeyboardOutlined';
import UndoIcon from '@mui/icons-material/Undo';
import { Button } from '../Button';
import { useSpeechToText } from '../../../hooks/useSpeechToText';
import type { SpeechToTextError } from '../../../hooks/useSpeechToText';
import * as S from './VoiceInputSheet.styles';

export interface VoiceInputSheetProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  /** Placeholder shown in keyboard mode. */
  placeholder?: string;
  /** @default 'Post' */
  submitLabel?: string;
  /** Resolve true to clear the draft and close; false keeps the sheet open with the text intact. */
  onSubmit: (text: string) => Promise<boolean>;
  /**
   * Optional AI clean-up of the draft; shows a "Tidy up with AI" button when set.
   * Reject with an Error whose message can be shown to the user. `signal` aborts when the sheet closes.
   */
  onTidy?: (text: string, options: { signal: AbortSignal }) => Promise<string>;
}

type InputMode = 'voice' | 'keyboard';

const BAR_DELAYS = [0, 0.3, 0.15, 0.45, 0.05, 0.35, 0.2, 0.5, 0.1, 0.4, 0.25, 0.55];

const ERROR_MESSAGES: Record<SpeechToTextError, string> = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings, or use the keyboard.',
  'no-speech': "Didn't catch that. Tap the mic to try again.",
  'audio-capture': 'No microphone found. Use the keyboard instead.',
  network: 'Voice input needs an internet connection.',
  unknown: 'Voice input stopped. Tap the mic to try again.',
};

const appendText = (base: string, addition: string) => {
  let text = addition.trim();
  if (!text) return base;
  // Recognisers return lowercase phrases; capitalise when starting a new sentence.
  if (!base.trim() || /[.!?]\s*$/.test(base)) text = text.charAt(0).toUpperCase() + text.slice(1);
  if (!base || /\s$/.test(base)) return base + text;
  return `${base} ${text}`;
};

const formatElapsed = (seconds: number) =>
  `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

const focusAtEnd = (el: HTMLTextAreaElement | null) => {
  if (!el) return;
  el.focus();
  el.setSelectionRange(el.value.length, el.value.length);
};

/**
 * Bottom sheet for entering text by voice, with a keyboard fallback.
 * Opens listening straight away; browsers without speech recognition (e.g. Firefox) get keyboard only.
 * The draft survives closing the sheet and is cleared once onSubmit resolves true.
 */
export const VoiceInputSheet: React.FC<VoiceInputSheetProps> = ({
  open,
  onClose,
  title,
  subtitle,
  placeholder = 'Type here...',
  submitLabel = 'Post',
  onSubmit,
  onTidy,
}) => {
  const [draft, setDraft] = useState('');
  const [mode, setMode] = useState<InputMode>('voice');
  const [elapsed, setElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [tidying, setTidying] = useState(false);
  const [tidyError, setTidyError] = useState<string | null>(null);
  // The draft from before the last tidy-up, kept until the text changes again.
  const [undoDraft, setUndoDraft] = useState<string | null>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);
  const tidyAbortRef = useRef<AbortController | null>(null);
  const busy = submitting || tidying;

  const handleFinalTranscript = useCallback((text: string) => {
    setDraft((d) => appendText(d, text));
    setUndoDraft(null);
  }, []);
  const { isSupported, isListening, interimTranscript, error, start, stop, abort } = useSpeechToText({
    onFinalTranscript: handleFinalTranscript,
  });

  useEffect(() => {
    if (!isListening) return;
    const startedAt = Date.now();
    const id = window.setInterval(() => setElapsed(Math.floor((Date.now() - startedAt) / 1000)), 1000);
    return () => window.clearInterval(id);
  }, [isListening]);

  const startListening = () => {
    setElapsed(0);
    start();
  };

  // Keep words heard but not yet finalised, then stop so no late results land in the draft.
  const commitAndAbort = () => {
    if (interimTranscript) setDraft((d) => appendText(d, interimTranscript));
    abort();
  };

  const handleEnter = () => {
    const initialMode = isSupported ? 'voice' : 'keyboard';
    setMode(initialMode);
    if (initialMode === 'voice') startListening();
  };

  const handleEntered = () => {
    if (mode === 'keyboard') focusAtEnd(textAreaRef.current);
  };

  const handleClose = () => {
    if (submitting) return;
    tidyAbortRef.current?.abort();
    setTidyError(null);
    commitAndAbort();
    onClose();
  };

  const switchToKeyboard = () => {
    // Render the committed text before focusing, and focus inside the tap so mobile keyboards open.
    flushSync(() => {
      commitAndAbort();
      setMode('keyboard');
    });
    focusAtEnd(textAreaRef.current);
  };

  const switchToVoice = () => {
    setMode('voice');
    startListening();
  };

  const handleSubmit = async () => {
    const text = appendText(draft, interimTranscript).trim();
    if (!text || busy) return;
    abort();
    setDraft(text);
    setSubmitting(true);
    try {
      if (await onSubmit(text)) {
        setDraft('');
        setUndoDraft(null);
        setTidyError(null);
        onClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleTidy = async () => {
    const text = appendText(draft, interimTranscript).trim();
    if (!onTidy || !text || busy) return;
    abort();
    setDraft(text);
    setTidyError(null);
    setTidying(true);
    const controller = new AbortController();
    tidyAbortRef.current = controller;
    try {
      const tidied = await onTidy(text, { signal: controller.signal });
      if (controller.signal.aborted) return;
      setUndoDraft(text);
      setDraft(tidied);
    } catch (tidyFailure) {
      if (!controller.signal.aborted) {
        setTidyError(tidyFailure instanceof Error ? tidyFailure.message : 'AI tidy-up failed. Your text is unchanged.');
      }
    } finally {
      if (tidyAbortRef.current === controller) tidyAbortRef.current = null;
      setTidying(false);
    }
  };

  const handleUndoTidy = () => {
    if (undoDraft === null) return;
    setDraft(undoDraft);
    setUndoDraft(null);
  };

  const displayText = isListening ? appendText(draft, interimTranscript) : draft;

  return (
    <S.Sheet
      anchor="bottom"
      open={open}
      onClose={handleClose}
      slotProps={{ transition: { onEnter: handleEnter, onEntered: handleEntered } }}
    >
      <S.DragHandle />
      <S.Header>
        <div>
          <S.Title>{title}</S.Title>
          {subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}
        </div>
        <IconButton size="small" onClick={handleClose} disabled={submitting} aria-label="Close">
          <CloseIcon fontSize="small" />
        </IconButton>
      </S.Header>

      <S.Body>
        {mode === 'voice' && (
          <S.VoicePanel>
            <S.MicButton
              type="button"
              active={isListening}
              onClick={isListening ? stop : startListening}
              disabled={busy}
              aria-label={isListening ? 'Stop listening' : 'Start listening'}
            >
              <MicIcon />
            </S.MicButton>
            <S.Bars aria-hidden>
              {BAR_DELAYS.map((delay) => (
                <S.Bar key={delay} active={isListening} style={{ animationDelay: `${delay}s` }} />
              ))}
            </S.Bars>
            <S.Status isError={!isListening && !!error}>
              {isListening ? (
                <>
                  <S.RecordingDot />
                  <S.ListeningLabel>Listening...</S.ListeningLabel>
                  <S.Elapsed aria-hidden>{formatElapsed(elapsed)}</S.Elapsed>
                </>
              ) : error ? (
                ERROR_MESSAGES[error]
              ) : (
                'Tap the mic to speak'
              )}
            </S.Status>
          </S.VoicePanel>
        )}

        <S.DraftTextArea
          ref={textAreaRef}
          className={mode}
          value={displayText}
          onChange={(e) => {
            setDraft(e.target.value);
            setUndoDraft(null);
          }}
          readOnly={isListening || busy}
          placeholder={mode === 'voice' ? 'Your words will appear here...' : placeholder}
          aria-label={title}
        />

        {onTidy && (
          <S.AssistRow>
            <S.AssistButton type="button" onClick={handleTidy} disabled={!displayText.trim() || busy}>
              {tidying ? <CircularProgress size={14} color="inherit" /> : <AutoAwesomeIcon />}
              {tidying ? 'Tidying up...' : 'Tidy up with AI'}
            </S.AssistButton>
            {undoDraft !== null && !busy && (
              <S.AssistButton type="button" onClick={handleUndoTidy}>
                <UndoIcon />
                Undo
              </S.AssistButton>
            )}
          </S.AssistRow>
        )}
        {tidyError && <S.AssistError role="alert">{tidyError}</S.AssistError>}

        <Button fullWidth onClick={handleSubmit} disabled={!displayText.trim() || tidying} loading={submitting}>
          {submitLabel}
        </Button>

        {isSupported && (
          <S.ModeToggle type="button" onClick={mode === 'voice' ? switchToKeyboard : switchToVoice} disabled={busy}>
            {mode === 'voice' ? <KeyboardOutlinedIcon /> : <MicIcon />}
            {mode === 'voice' ? 'Use keyboard instead' : 'Switch to voice'}
          </S.ModeToggle>
        )}
      </S.Body>
    </S.Sheet>
  );
};
