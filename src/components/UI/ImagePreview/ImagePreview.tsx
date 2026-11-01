import React, { useState } from 'react';
import * as S from './ImagePreview.styles';

interface ImagePreviewProps {
  src: string;
  alt: string;
}

/** A thumbnail that opens the full image in a new tab. Renders nothing if the image fails to load. */
export const ImagePreview: React.FC<ImagePreviewProps> = ({ src, alt }) => {
  const [failed, setFailed] = useState(false);
  if (failed) return null;

  return (
    <S.PreviewLink href={src} target="_blank" rel="noopener noreferrer" aria-label={`Open ${alt}`}>
      <S.PreviewImage src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
    </S.PreviewLink>
  );
};
