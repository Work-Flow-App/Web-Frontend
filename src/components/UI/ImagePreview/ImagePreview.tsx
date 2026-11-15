import React, { useState } from 'react';
import { openOnPlainClick } from '../FileViewer';
import * as S from './ImagePreview.styles';

interface ImagePreviewProps {
  /** The full image or document the preview opens. */
  src: string;
  /** The server's smaller preview, used first. An image falls back to `src` if it's missing or fails. */
  thumbnailSrc?: string;
  /** False for documents, whose only possible preview is the thumbnail. */
  srcIsImage?: boolean;
  alt: string;
  /** Opens the in-app viewer. Without it, or on a modified click, the file opens in a new tab. */
  onOpen?: () => void;
}

/** A preview that opens the full file. Renders nothing if no image loads. */
export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, thumbnailSrc, srcIsImage = true, alt, onOpen }) => {
  const candidates = [thumbnailSrc, srcIsImage ? src : undefined].filter((url): url is string => Boolean(url));
  const [attempt, setAttempt] = useState(0);
  const shown = candidates[attempt];
  if (!shown) return null;

  return (
    <S.PreviewLink
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`Open ${alt}`}
      onClick={openOnPlainClick(onOpen)}
    >
      <S.PreviewImage src={shown} alt={alt} loading="lazy" onError={() => setAttempt((n) => n + 1)} />
    </S.PreviewLink>
  );
};
