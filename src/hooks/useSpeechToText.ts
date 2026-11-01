import { useCallback, useEffect, useRef, useState } from 'react';

// The Web Speech API isn't in TypeScript's DOM lib, so we type only the parts we use.
interface SpeechRecognitionResultLike {
  readonly isFinal: boolean;
  readonly [index: number]: { readonly transcript: string };
}

interface SpeechRecognitionEventLike {
  readonly resultIndex: number;
  readonly results: { readonly length: number; readonly [index: number]: SpeechRecognitionResultLike };
}

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: { readonly error: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

const getSpeechRecognition = (): SpeechRecognitionConstructor | undefined => {
  if (typeof window === 'undefined') return undefined;
  const w = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return w.SpeechRecognition ?? w.webkitSpeechRecognition;
};

const detach = (recognition: SpeechRecognitionLike) => {
  recognition.onresult = null;
  recognition.onerror = null;
  recognition.onend = null;
};

export type SpeechToTextError = 'not-allowed' | 'no-speech' | 'audio-capture' | 'network' | 'unknown';

const toSpeechToTextError = (error: string): SpeechToTextError | null => {
  switch (error) {
    case 'aborted':
      return null;
    case 'not-allowed':
    case 'service-not-allowed':
      return 'not-allowed';
    case 'no-speech':
    case 'audio-capture':
    case 'network':
      return error;
    default:
      return 'unknown';
  }
};

interface UseSpeechToTextOptions {
  /** Called with each chunk of speech once the recogniser has finalised it. */
  onFinalTranscript: (text: string) => void;
  /** BCP 47 language tag. Defaults to the browser language. */
  lang?: string;
}

export interface UseSpeechToTextResult {
  isSupported: boolean;
  isListening: boolean;
  /** Words heard so far that the recogniser may still revise. */
  interimTranscript: string;
  error: SpeechToTextError | null;
  start: () => void;
  /** Stops listening; speech already heard is still delivered through onFinalTranscript. */
  stop: () => void;
  /** Stops listening immediately and drops anything not yet finalised. */
  abort: () => void;
}

/**
 * Live dictation via the browser's Web Speech API (Chrome, Edge, Safari).
 *
 * const { isListening, interimTranscript, start, stop } = useSpeechToText({
 *   onFinalTranscript: (text) => setDraft((d) => `${d} ${text}`),
 * });
 */
export function useSpeechToText({ onFinalTranscript, lang }: UseSpeechToTextOptions): UseSpeechToTextResult {
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<SpeechToTextError | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const onFinalTranscriptRef = useRef(onFinalTranscript);

  useEffect(() => {
    onFinalTranscriptRef.current = onFinalTranscript;
  }, [onFinalTranscript]);

  const start = useCallback(() => {
    const SpeechRecognition = getSpeechRecognition();
    if (!SpeechRecognition || recognitionRef.current) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = lang ?? navigator.language;

    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          onFinalTranscriptRef.current(result[0].transcript);
        } else {
          interim += result[0].transcript;
        }
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      const mapped = toSpeechToTextError(event.error);
      if (mapped) setError(mapped);
    };

    recognition.onend = () => {
      detach(recognition);
      if (recognitionRef.current === recognition) recognitionRef.current = null;
      setIsListening(false);
      setInterimTranscript('');
    };

    setError(null);
    setInterimTranscript('');
    recognitionRef.current = recognition;
    try {
      recognition.start();
      setIsListening(true);
    } catch {
      detach(recognition);
      recognitionRef.current = null;
      setError('unknown');
    }
  }, [lang]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const abort = useCallback(() => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    recognitionRef.current = null;
    detach(recognition);
    recognition.abort();
    setIsListening(false);
    setInterimTranscript('');
  }, []);

  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      if (!recognition) return;
      recognitionRef.current = null;
      detach(recognition);
      recognition.abort();
    },
    []
  );

  return {
    isSupported: getSpeechRecognition() !== undefined,
    isListening,
    interimTranscript,
    error,
    start,
    stop,
    abort,
  };
}
