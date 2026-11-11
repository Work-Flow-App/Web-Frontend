import React, { useState } from 'react';
import * as S from './FileThumbnail.styles';

interface FileThumbnailProps {
  /** The server's preview image. Files uploaded before previews existed, and types it can't render, have none. */
  src?: string;
  /** Leave empty when the file name is shown next to the preview. */
  alt?: string;
  /** Shown when there is no preview or it fails to load, usually the file-type icon. */
  fallback: React.ReactNode;
  /** Square size in px. Without it the preview fills its container. */
  size?: number;
}

export const FileThumbnail: React.FC<FileThumbnailProps> = ({ src, alt = '', fallback, size }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  if (!src || failedSrc === src) return <>{fallback}</>;

  return <S.Thumbnail src={src} alt={alt} loading="lazy" size={size} onError={() => setFailedSrc(src)} />;
};
